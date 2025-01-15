const { DateTime } = require('luxon');

const getDate = (year: number, month: number, day: number, timezone_identifier: string): { utcDate: Date, localDate: Date } => {
  // Create a DateTime object in the local timezone
  console.log('year', year, 'month', month, 'day', day);
  const localDate = new Date(year, month - 1, day);
  console.log('localTime', localDate);
  const localTime = DateTime.fromObject({ year, month, day, hour: 0, minute: 0, second: 0 }, { zone: timezone_identifier });
  // Convert to UTC
  const utcTime = localTime.toUTC();
  console.log('utcTime', utcTime.toJSDate());

  return {utcDate: utcTime.toJSDate(), localDate};  
};

const identifierToYearMonthDay = (start_day_identifier: string): { year: number, month: number, day: number } => {
  const dateString = start_day_identifier.toString();
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10);
  const day = parseInt(dateString.substring(6, 8), 10);
  return { year, month, day };
}

const identifierToDate = (
  start_day_identifier: string,
  timezone_identifier: string,
): Date => {
  const { year, month, day } = identifierToYearMonthDay(start_day_identifier);
  // console.log('date', year, month, day, timezone_identifier);
  // console.log('getUTCDate', getUTCDate(year, month, day, timezone_identifier));
  const utcDate = getDate(year, month, day, timezone_identifier).utcDate;



  return utcDate;
};

const dateToSeconds = (date: Date): number => {
  //it should be floor to date, cut the times
  return date.getTime() / 1000;
}

const getDayOfWeek = (start_day_identifier: string ): number => {
  const { year, month, day } = identifierToYearMonthDay(start_day_identifier);
  const date = new Date(year, month - 1, day); // month is 0-indexed
  // const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return date.getDay()
}

export { identifierToDate, getDayOfWeek, dateToSeconds };
