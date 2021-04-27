import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import "dotenv/config";
class App {
  public application: express.Application;

  constructor() {
    this.application = express();
    this.router();
  }

  private router(): void {
    this.application.get('/', (req: express.Request, res: express.Response) => {
      res.send('hello! world!');
    })
  }
}

const app = new App().application;

const corsOption = {
  origin: true,
  method: ['post','get','delete','options'],
  credentials: true
}

mongoose.Promise = global.Promise;

mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

app.use(cors(corsOption));
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
export default app;