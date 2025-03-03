import express, { Request, Response } from 'express';
import mongoose, { Connection } from 'mongoose';
import router from "./src/routes/index";
import userRouter from "./src/routes/user";
import cors, { CorsOptions } from 'cors';
import dotenv from "dotenv";



dotenv.config();

const port: number = parseInt(process.env.PORT as string) || 8002;
const app = express();


const mongoDB: string = "mongodb://127.0.0.1:27017/testdb";

mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db: Connection = mongoose.connection;
db.on("error", console.error.bind(console, 'MongoDB connection error:'));

const corsOptions : CorsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}


app.use(cors(corsOptions));
app.use(express.json());

app.get('/test', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.use("/", router)
app.use("/user", userRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
