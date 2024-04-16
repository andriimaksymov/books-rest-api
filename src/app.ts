import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import authRoutesV1 from './v1/routes/auth.routes';

dotenv.config();

if (!process.env.PORT) {
  console.log('No port value specified...');
}

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

if (!process.env.MONGO_DB_URI) {
  throw new Error('No mongo database utl specified...');
}

app.use('/api/v1/auth', authRoutesV1);

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });