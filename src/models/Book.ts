import mongoose, { Document, Schema } from 'mongoose';

interface IBook extends Document {
    title: string;
    author: string;
    publishedDate: Date;
    isbn: string;
}

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    isbn: { type: String, required: true, unique: true },
});


const Book = mongoose.model<IBook>('Book', bookSchema);
export default Book;
