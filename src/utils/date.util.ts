const { DateTime } = require('luxon');

const getDate = (year: number, month: number, day: number, timezone_identifier: string): { utcDate: Date, localDate: Date } => {
  // Create a DateTime object in the local timezone
  // const localDate = new Date(year, month - 1, day);
  console.log(timezone_identifier)  
  
  const time = DateTime.fromObject({ year, month, day, hour: 0, minute: 0, second: 0 }, { zone: timezone_identifier });
  // Convert to UTC
  const utcTime = time.toUTC();

  return {utcDate: utcTime.toJSDate(), localDate: new Date()};  
};

// const getLocalDate = (year: number, month: number, day: number, timezone_identifier: string): Date => {
//   // gives '2/28/2013, GMT-05:00'

//   const utcDate = DateTime.fromObject({ year, month, day, hour: 0, minute: 0, second: 0 }).toJSDate();
//   const longOffsetFormatter = new Intl.DateTimeFormat("en-US", {timeZone: timezone_identifier, timeZoneName: "longOffset"});
//   const longOffsetString = longOffsetFormatter.format(utcDate); // '2/28/2013, GMT-05:00'

//   console.log('utcDate', utcDate);

//   // longOffsetString.split('GMT')[1] will give us '-05:00'
//   const gmtOffset = longOffsetString.split('GMT')[1];

//   // Feb 28 2013 7:00 PM EST
//   const localDate = new Date(utcDate.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS") + gmtOffset);
//   console.log('localDate', localDate);
//   return localDate;
// }

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
  const utcDate = getDate(year, month, day, timezone_identifier).utcDate;
  return utcDate;
};

const dateToSeconds = (date: Date): number => {
  return date.getTime() / 1000;
}

const getDayOfWeek = (start_day_identifier: string ): number => {
  const { year, month, day } = identifierToYearMonthDay(start_day_identifier);
  const date = new Date(year, month - 1, day); 
  return date.getDay()
}

const getDaysFromNow = (dateSeconds: number): number => {
  const now = new Date();
  const diff = dateSeconds - Math.floor(now.getTime() / 1000);
  return Math.floor(diff / (3600 * 24)) + 1;
}


export { identifierToDate, getDayOfWeek, dateToSeconds, getDaysFromNow };
