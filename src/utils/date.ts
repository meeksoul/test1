import moment from 'moment-timezone';

export const identifierToDate = (start_day_identifier: string, timezone_identifier: string): Date => {
    const dateString = start_day_identifier.toString();
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // 월은 0부터 시작 (0 = 1월)
    const day = parseInt(dateString.substring(6, 8), 10);
    
    //create the date object with timezone
    const date = moment.tz({ year, month, day }, timezone_identifier).toDate();
    return date;
}