import express, { Request, Response } from 'express';
import moment from 'moment-timezone';

const app = express();
const PORT = 3000;

const workHours = [
    {
      "close_interval" : 72000,
      "is_day_off" : false,
      "key" : "fri",
      "open_interval" : 36000,
      "weekday" : 6
    },
     {
      "close_interval" : 36900,
      "is_day_off" : false,
      "key" : "mon",
      "open_interval" : 36900,
      "weekday" : 2
    },
     {
      "close_interval" : 72000,
      "is_day_off" : false,
      "key" : "sat",
      "open_interval" : 36000,
      "weekday" : 7
    },
     {
      "close_interval" : 72000,
      "is_day_off" : false,
      "key" : "sun",
      "open_interval" : 36000,
      "weekday" : 1
    },
     {
      "close_interval" : 72000,
      "is_day_off" : false,
      "key" : "thu",
      "open_interval" : 36000,
      "weekday" : 5
    },
     {
      "close_interval" : 72000,
      "is_day_off" : false,
      "key" : "tue",
      "open_interval" : 36000,
      "weekday" : 3
    },
     {
      "close_interval" : 72000,
      "is_day_off" : false,
      "key" : "wed",
      "open_interval" : 36000,
      "weekday" : 4
    }
];

const event = [
    {
      "begin_at" : 1620268200,
      "end_at" : 1620275400,
      "created_at" : 1620272253,
      "updated_at" : 1620272253
    },
    {
      "begin_at" : 1620275400,
      "end_at" : 1620275400,
      "created_at" : 1620272253,
      "updated_at" : 1620272253
    },
    {
      "begin_at" : 1620276300,
      "end_at" : 1620275400,
      "created_at" : 1620272253,
      "updated_at" : 1620272253
    },
    {
      "begin_at" : 1620354600,
      "end_at" : 1620354900,
      "created_at" : 1620272253,
      "updated_at" : 1620272253
    },
    {
      "begin_at" : 1620441000,
      "end_at" : 1620469800,
      "created_at" : 1620272253,
      "updated_at" : 1620272253
    },
    {
      "begin_at" : 1620477000,
      "end_at" : 1620534600,
      "created_at" : 1620272253,
      "updated_at" : 1620272253
    }
]
1736798400

interface RequestBody {
	start_day_identifier: string
	timezone_identifier: string
	service_duration: number
	days?: number
	timeslot_interval?: number
	is_ignore_schedule?: boolean
	is_ignore_workhour?: boolean
}

type ResponseBody = DayTimetable[]

interface DayTimetable {
  start_of_day: number // Unixstamp seconds
  day_modifier: number
  is_day_off: boolean
  timeslots: Timeslot[]
}

interface Timeslot {
  begin_at: number // Unixstamp seconds
  end_at: number // Unixstamp seconds
}


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.post('/getTimeSlots', (req: Request, res: Response) => {
    const body = req.body as RequestBody;

    const { start_day_identifier, timezone_identifier, service_duration, days, timeslot_interval, is_ignore_schedule, is_ignore_workhour } = body;

    const dateString = start_day_identifier.toString();
    //if timeslot_interval is not provided, set it to 30 minutes
    const slot_interval = timeslot_interval || 30;

    /*
    step1 - `start_day_identifier,` `timezone_identifier`, `service_duration`, `days`,`timeslot_interval`
    - 위에 파라미터에 따른 `DayTimetable` 반환 하는 API 구현
    */    
    const dateTimeTables: DayTimetable[] = [];
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // 월은 0부터 시작 (0 = 1월)
    const day = parseInt(dateString.substring(6, 8), 10);
    
    //create the date object with timezone
    const date = moment.tz({ year, month, day }, timezone_identifier).toDate();
    
    //repeat as much as days
    for (let i = 0; i < days; i++) {
        //calculate the which day of the week
        const dayOfWeek = date.getDay() + 1;

        
        const dayTimetables: DayTimetable[] = [];
        //start seconds of the day
        let startOfDay = date.getTime() / 1000;
        //end seconds of the day
        const endOfDay = startOfDay + 86400;
  
        let timeslots: Timeslot[] = [];
        //repeat as much as the day
        while (startOfDay < endOfDay) {
            const begin_at = startOfDay;
            const end_at = startOfDay + service_duration;
            timeslots.push({ begin_at, end_at });
            startOfDay = end_at;
        }
       
        dateTimeTables.push({
            start_of_day: date.getTime() / 1000,
            day_modifier: days,
            is_day_off: workHour.is_day_off,
            timeslots
        })
    }

    /* step2
    - `is_ignore_schedule:false`인 경우 주어진 `events.json` 파일을 참조하여 `Event`데이터와 겹치지 않는 `Timeslot`을 반환 합니다.
    - `is_ignore_schedule`가 `true`일 경우에는 events.json 파일의 Event 데이터를 고려하지 않고 slot을 반환해주세요.
    */
    if (!is_ignore_schedule) {
        //filter the events for the day
        //remove the timeslots that are in the events
        dateTimeTables.forEach(dayTimetable => {
            const events = event.filter(event => event.begin_at >= dayTimetable.start_of_day && event.end_at <= dayTimetable.start_of_day + 86400);
            dayTimetable.timeslots = dayTimetable.timeslots.filter(timeslot => {
                return !events.some(event => {
                    return timeslot.begin_at >= event.begin_at && timeslot.end_at <= event.end_at;
                });
            });
        });
    }

    /* step3
    - `is_ignore_workhour:false`인 경우 주어진 `workhours.json`파일을 참조하여 `Workhour`와 겹치지 않는  `Timeslot`을 반환합니다.
    - `is_ignore_workhour`가 `true`일 경우에는 workhours.json 파일의 Workhour 데이터를 고려하지 않고 하루 전체를 기간으로 설정하여 slot을 반환해주세요.
    */
    if (!is_ignore_workhour) {
        //remove the timeslots that are not in the workhours
        dateTimeTables.forEach(dayTimetable => {
            const workHour = workHours.find(workHour => workHour.weekday === date.getDay() + 1);
            dayTimetable.timeslots = dayTimetable.timeslots.filter(timeslot => {
                return timeslot.begin_at >= workHour.open_interval && timeslot.end_at <= workHour.close_interval;
            });
        });
    }
    
    // const timestamp = Math.floor(date.getTime() / 1000);
    res.json(dateTimeTables);


});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});