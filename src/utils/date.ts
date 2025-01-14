import moment from 'moment-timezone';

// export const identifierToDate = (start_day_identifier: string, timezone_identifier: string): Date => {
//     const dateString = start_day_identifier.toString();
//     const year = parseInt(dateString.substring(0, 4), 10);
//     const month = parseInt(dateString.substring(4, 6), 10) - 1; // 월은 0부터 시작 (0 = 1월)
//     const day = parseInt(dateString.substring(6, 8), 10);
    
//     //create the date object with timezone
//     const date = moment.tz({ year, month, day }, timezone_identifier).toDate();
//     console.log('date', date)
//     return date;
// }

export const identifierToDate = (start_day_identifier: string, timezone_identifier: string): Date => {
    const dateString = start_day_identifier.toString();
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // 월은 0부터 시작 (0 = 1월)
    const day = parseInt(dateString.substring(6, 8), 10);
    
    // Create the date object
    const date = new Date(Date.UTC(year, month, day));

    console.log('Given IST datetime: ', date);

    let intlDateObj = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone_identifier
    });

    let seoulTime = intlDateObj.format(date);
    console.log('Seoul date: ', seoulTime);
    console.log('seconds', date.getTime()/1000);
    //check if date is 0 clock
    if(date.getTime() % 86400000 === 0){
        console.log('date is 0 clock');
        return date;
    }
    return date;
}