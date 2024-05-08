import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import 'dotenv/config'

import authRoutesV1 from './v1/routes/auth.routes';
import booksRoutesV1 from './v1/routes/books.routes';
import cartRoutesV1 from './v1/routes/cart.routes';
import genresRoutesV1 from './v1/routes/genres.routes';
import checkoutRoutesV1 from './v1/routes/checkout.routes';

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
app.use('/api/v1/books', booksRoutesV1);
app.use('/api/v1/cart', cartRoutesV1);
app.use('/api/v1/genres', genresRoutesV1);
app.use('/api/v1/checkout', checkoutRoutesV1);

app.use('/images', express.static('./images'));

mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });