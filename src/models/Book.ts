import mongoose from 'mongoose';
import swaggerDocument from '../swagger/swagger.json';

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    isbn: { type: String, required: true, unique: true }
});

export default mongoose.model('Book', bookSchema);
