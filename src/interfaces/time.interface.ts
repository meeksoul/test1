export interface DayTimetable {
    start_of_day: number; // Unixstamp seconds
    day_modifier: number;
    is_day_off: boolean;
    timeslots: Timeslot[];
}

export interface Timeslot {
    begin_at: number; // Unixstamp seconds
    end_at: number; // Unixstamp seconds
}

export interface WorkHour {
    close_interval: number;
    is_day_off: boolean;
    key: string;
    open_interval: number;
    weekday: number;
}

export interface Event {
    begin_at: number;
    end_at: number;
    created_at: number;
    updated_at: number;
}