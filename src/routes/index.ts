import express from 'express';
import { Request, Response, Router } from 'express';
import getTimeSlotsRoutes from './getTimeSlots.routes';

class IndexRoutes {
  router = Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.use('/getTimeSlots', getTimeSlotsRoutes);
  }
}

export default new IndexRoutes().router;
