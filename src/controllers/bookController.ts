import { Request, Response } from 'express';
import Book from '../models/Book';

export const createBook = async (req: Request, res: Response) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error: any) {
        if (error.name === "MongoError" && error.code === 11000) {
            return res.status(409).json({ message: "Duplicate title or ISBN" });
        }
        res.status(400).json({ message: error.message });
    }
};



export const getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return; // Ensure no further execution
        }
        res.status(200).json(book);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            res.status(404).json({ message: 'Book not found' });
            return; 
        }
        res.status(200).json(updatedBook);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            res.status(404).json({ message: 'Book not found' });
            return; 
        }
        res.status(204).send(); 
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};
