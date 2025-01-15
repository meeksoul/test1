# **Example README File**

## **Project Title**

!!!! 실제 프로젝트에서 tsconfg.json의 baseUrl 조정을 통해 폴더들을 절대값 경로로 변경하려 하였으나 추가 조정이 필요해 테스트 시 작동 오류가 있을까 우려되어 제외하였습니다. 
!!!! dotenv 역시 같은 이유로 제외하였습니다. 

1. repo를 폴더에 내려받아주세요
2. 터미널에서 폴더로 이동
3. npm i -D typescript @types/express @types/node
4. npm i -D nodemon ts-node concurrently
5. npm install
6. npm run start
7. 포스트맨에서 http://localhost:3000/getTimeSlots 에 요청을 넣어 테스트해주세요
예시 body 데이터는 다음과 같습니다

#### Example Request
```json
{
  "start_day_identifier": "20210509",
  "timezone_identifier": "Asia/Seoul",
  "service_duration": 3600,
  "days": 3,
  "timeslot_interval": 30,
  "is_ignore_schedule": false,
  "is_ignore_workhour": false
}