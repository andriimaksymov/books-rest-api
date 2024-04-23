import { model, Schema } from 'mongoose';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  year: {
    type: String,
  },
  genres: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Genre',
      required: true,
    },
  ],
  images: [{
    filename: String,
    path: String,
  }],
  status: {
    type: String,
    enum: ['in_stock', 'limited', 'not_available'],
    default: 'in_stock',
  },
});

export default model('Book', bookSchema);