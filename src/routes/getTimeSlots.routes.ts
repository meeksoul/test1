import express from 'express';
import { Request, Response, Router } from 'express';
import DateTimetableController from '../controllers/dateTimetable.controller';

class GetTimeslotsRoutes {
  router = Router();
  controller = new DateTimetableController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/', this.controller.findAvailableTimeslots);
  }
}

export default new GetTimeslotsRoutes().router;
