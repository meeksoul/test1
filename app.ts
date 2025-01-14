
// ** Module Imports
import express from "express";
import bodyParser from 'body-parser';
import routes from "./routes/index";
import "reflect-metadata";


export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.setMiddlewares();
  }

  /**
   * set the middleware
   */
  private setMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/", routes);
  }

  /**
   * Express starts
   * @param port port
   */
  public async createExpressServer(port: number): Promise<void> {
    try {
      this.app.listen(port, "0.0.0.0", () => {
        console.log(`Server is running on PORT : ${port} on ENV`);
      });
    } catch (error) {
      console.error("Server start failed");
      console.error(error);
    }
  }
}