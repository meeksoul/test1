import express from 'express';
import { Request, Response } from 'express';
import DateTimetableController from '../controllers/dateTimetable.controller';

import { Router } from "express";

class IndexRoutes {
  router = Router();
  controller = new DateTimetableController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Tutorial
    this.router.post('/getTimeSlots', this.controller.findAll);
  }
}

export default new IndexRoutes().router;