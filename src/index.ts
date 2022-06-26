import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { mongoose } from './models';
import { getRoutes } from './routes';

mongoose.connect(process.env.MONGODB_URL!, (err) => {
  console.log(err || 'Successfully connected to MongoDB.');
});

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getRoutes(router));

app.listen(process.env.PORT || 3001, () => {
  console.log('Server is running');
});
