import { Request, Response } from "express";

import type { RequestBody, DayTimetable, Timeslot, WorkHour, Event } from '../interfaces';
import { identifierToDate } from '../utils/date';

import workhours from './workhours.json';
import events from './events.json';

export default class DateTimetableController {

    async findAll(req: Request, res: Response) {
        try {
            type ResponseBody = DayTimetable[]
            const body = req.body as RequestBody;
            const { 
                start_day_identifier, 
                timezone_identifier, 
                service_duration, 
                days, timeslot_interval, 
                is_ignore_schedule, 
                is_ignore_workhour 
            } = body;
        
            //if timeslot_interval is not provided, set it to 30 minutes
            const slot_interval = timeslot_interval || 30 * 60;
        
            /*
            step1 - `start_day_identifier,` `timezone_identifier`, `service_duration`, `days`,`timeslot_interval`
            - 위에 파라미터에 따른 `DayTimetable` 반환 하는 API 구현
            */    
            console.log('step1 started')
        
            const dateTimeTables: DayTimetable[] = [];
            const date = identifierToDate(start_day_identifier, timezone_identifier);

            //repeat as much as days
            for (let i = 0; i < days; i++) {
                //calculate the which day of the week, if value is bigger than 7, it will be diveded by 7 and return the remainder
                const dayOfWeek = (date.getDay() + i) % 7 + 1;                
                const dayTimetables: DayTimetable[] = [];
                const workHour = (workhours as WorkHour[]).find(workHour => workHour.weekday === dayOfWeek);
                
                //start seconds of the day
                const startOfDay = (date.getTime()/1000 + i * 86400) - (date.getTime() / 1000 + i * 86400) % 86400
                
                //end seconds of the day
                const endOfDay = startOfDay + 86400;
                
                let timeOfDay = startOfDay;
                
                let timeslots: Timeslot[] = [];
                //repeat as much as the day
                while (timeOfDay < endOfDay) {
                    const begin_at = timeOfDay;
                    const end_at = timeOfDay + slot_interval;
                    timeslots.push({ begin_at, end_at });
                    timeOfDay = end_at;
                }
            
                dateTimeTables.push({
                    start_of_day: startOfDay,
                    day_modifier: 0 + i,
                    is_day_off: workHour? workHour.is_day_off : true,
                    timeslots
                })
            }
            console.log('dateTimeTables after step1', dateTimeTables[0].timeslots.length);
        
            /* step2
            - `is_ignore_schedule:false`인 경우 주어진 `events.json` 파일을 참조하여 `Event`데이터와 겹치지 않는 `Timeslot`을 반환 합니다.
            - `is_ignore_schedule`가 `true`일 경우에는 events.json 파일의 Event 데이터를 고려하지 않고 slot을 반환해주세요.
            */

            if (!is_ignore_schedule) {

                //remove the timeslots that are in the events
                dateTimeTables.forEach(dayTimetable => {
                    dayTimetable.timeslots = dayTimetable.timeslots.filter(timeslot => {
                        return (events as Event[]).every(event => {
                            if(timeslot.begin_at >= event.begin_at){
                                return (timeslot.begin_at >= event.end_at);
                            } else {
                                return (timeslot.end_at <= event.begin_at);
                            }
                        });
                    });
                });
            }
            console.log('dateTimeTables after step2', dateTimeTables[0].timeslots.length);
        
            /* step3
            - `is_ignore_workhour:false`인 경우 주어진 `workhours.json`파일을 참조하여 `Workhour`와 겹치지 않는  `Timeslot`을 반환합니다.
            - `is_ignore_workhour`가 `true`일 경우에는 workhours.json 파일의 Workhour 데이터를 고려하지 않고 하루 전체를 기간으로 설정하여 slot을 반환해주세요.
            */
            if (!is_ignore_workhour) {
                //remove the timeslots that are not in the workhours
                dateTimeTables.forEach(dayTimetable => {
                    const workHour = (workhours as WorkHour[]).find(workHour => workHour.weekday === date.getDay() + 1);
                    dayTimetable.timeslots = dayTimetable.timeslots.filter(timeslot => {
                        //calculate the timeslot begin_at and end_at as seconds of the day
                        const timeslotBeginAt = timeslot.begin_at % 86400;
                        const timeslotEndAt = timeslot.end_at % 86400;
        
                        if(workHour){
                            return timeslotBeginAt >= workHour.open_interval && timeslotEndAt <= workHour.close_interval;
                        } else {
                            return false;
                        }
                    });
                });
            }
        
            console.log('dateTimeTables after step3', dateTimeTables[0].timeslots.length);
            
            // const timestamp = Math.floor(date.getTime() / 1000);
            res.json(dateTimeTables);

        } catch (err) {
        res.status(500).json({
            message: "Internal Server Error!"
        });
        }
  }
}