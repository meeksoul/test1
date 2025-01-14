# **Example README File**

## **Project Title**

1. repo를 내려받으신 후 npm install을 실행해주세요
2. ts-node index 
3. http://localhost:3000/getTimeSlots 에 요청을 넣어 테스트해주세요
예시 body 데이터는 다음과 같습니다

#### Example Request
```json
{
  "start_day_identifier": "20230101",
  "timezone_identifier": "Asia/Seoul",
  "service_duration": 3600,
  "days": 3,
  "timeslot_interval": 30,
  "is_ignore_schedule": false,
  "is_ignore_workhour": false
}