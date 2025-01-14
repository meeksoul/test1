import { App } from "./app";

try {
  const app = new App();
  const port = 3000;

  app.createExpressServer(port);
} catch (error) {
  console.error(error);
}
