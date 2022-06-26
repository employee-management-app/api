import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';

import { mongoose } from './models';
import { getRoutes } from './routes';

mongoose.connect(process.env.MONGODB_URL!, (err) => {
  console.log(err || 'Successfully connected to MongoDB.');
});

const app = express();
const router = express.Router();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: 'employee-management-app',
    secret: process.env.COOKIE_SECRET,
    httpOnly: true,
  })
);
app.use(getRoutes(router));

app.listen(process.env.PORT || 3001, () => {
  console.log('Server is running');
});
