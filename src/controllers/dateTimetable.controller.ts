import { Request, Response } from 'express';
import type { RequestBody, } from '../interfaces/request.interface'; 
import type { DayTimetable, Timeslot, WorkHour, Event, } from '../interfaces/time.interface';
import { identifierToDate, getDayOfWeek } from '../utils/date.util';
import workhours from '../datas/workhours.json';
import events from '../datas/events.json';

export default class DateTimetableController {
    async findAvailableTimeslots(req: Request, res: Response) {
        try {
            const body = req.body as RequestBody;
            const {
                start_day_identifier,
                timezone_identifier,
                service_duration,
                days,
                timeslot_interval = 30 * 60,
                is_ignore_schedule,
                is_ignore_workhour,
            } = body;

            console.log('step1 started');
            const dateTimeTables: DayTimetable[] = [];
            const utcDate = identifierToDate(start_day_identifier, timezone_identifier);
            const dayOfWeek = getDayOfWeek(start_day_identifier);
            console.log('dayOfWeek', dayOfWeek);

            //repeat as much as days
            for (let i = 0; i < days; i++) {
                //calculate the which day of the week, if value is bigger than 7, it will be diveded by 7 and return the remainder
                const currentDayOfWeek = dayOfWeek + i > 7 ? (dayOfWeek + i) % 7  : dayOfWeek + i;

                const startOfDay = utcDate.getTime() / 1000 + i * 86400;
                const endOfDay = startOfDay + 86400;

                let timeOfDay = startOfDay;
                let timeslots: Timeslot[] = [];

                const workHour = (workhours as WorkHour[]).find(
                    (workHour) => workHour.weekday === currentDayOfWeek + 1,
                );

                //repeat as much as the day
                while (timeOfDay < endOfDay) {
                    const begin_at = timeOfDay;
                    const end_at = timeOfDay + service_duration;   
                    timeslots.push({ begin_at, end_at });
                    timeOfDay = timeOfDay + timeslot_interval;
                }

                dateTimeTables.push({
                    start_of_day: startOfDay,
                    day_modifier: 0 + i,
                    is_day_off: workHour ? workHour.is_day_off : true,
                    timeslots,
                });
            }
            console.log( 'dateTimeTables after step1', dateTimeTables[0].timeslots.length, );

            if (!is_ignore_schedule) {
                //remove the timeslots that are in the events
                dateTimeTables.forEach((dayTimetable) => {
                    dayTimetable.timeslots = dayTimetable.timeslots.filter((timeslot) => {
                        return (events as Event[]).every((event) => {
                            if (timeslot.begin_at >= event.begin_at) {
                                return timeslot.begin_at >= event.end_at;
                            } else {
                                return timeslot.end_at <= event.begin_at;
                            }
                        });
                    });
                });
            }
            console.log('dateTimeTables after step2', dateTimeTables[0].timeslots.length, );

            if (!is_ignore_workhour) {
                //remove the timeslots that are not in the workhours
                dateTimeTables.forEach((dayTimetable, i) => {
                    const currentDayOfWeek = dayOfWeek + i > 7 ? (dayOfWeek + i) % 7 : dayOfWeek + i;
                    const workHour = (workhours as WorkHour[]).find(
                        (workHour) => workHour.weekday === currentDayOfWeek + 1,
                    );
                    dayTimetable.timeslots = dayTimetable.timeslots.filter((timeslot) => {
                        if (workHour) {
                            return (
                                timeslot.begin_at - dayTimetable.start_of_day >= workHour.open_interval &&
                                timeslot.end_at - dayTimetable.start_of_day < workHour.close_interval
                            );
                        } else {
                            return false;
                        }
                    });
                });
            }

            console.log( 'dateTimeTables after step3', dateTimeTables[0].timeslots.length, );
            res.json(dateTimeTables);
        } catch (err) {
            res.status(500).json({
                message: 'Internal Server Error!',
            });
        }
  }
}
