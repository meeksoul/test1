import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import moment from 'moment-timezone';
import { require as requireFromRoot } from 'app-root-path';

import routes from './routes/index';


import { App } from "./app";

try {
  const app = new App();
  const port = 3000;

  app.createExpressServer(port);
} catch (error) {
  console.error(error);
}
