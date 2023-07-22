import 'dotenv/config';

import cors from 'cors';
import express from 'express';

// import { mongoose } from './models';
import { getRoutes } from './routes';

// mongoose.connect(process.env.MONGODB_URL as string, (error) => {
//   console.log(error || 'Successfully connected to MongoDB.');
// });

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getRoutes(router));

app.listen(process.env.PORT || 3001, () => {
  console.log('Server is running');
});

export default app;
