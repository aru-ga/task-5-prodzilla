import {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
} from "../../src/controllers/bookController";
import Book from "../../src/models/Book";
import { Request, Response } from "express";

jest.mock("../../src/models/Book");

describe("Book Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createBook", () => {
        it("should create a new book successfully", async () => {
            const req = {
                body: {
                    title: "Book Title",
                    author: "Author",
                    publishedDate: "2023-01-01",
                    isbn: "1234567890",
                },
            } as Partial<Request>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const createdBook = {
                _id: "uniqueId123",
                title: "Book Title",
                author: "Author",
                publishedDate: "2023-01-01",
                isbn: "1234567890",
            };

            (Book.prototype.save as jest.Mock).mockResolvedValue(createdBook);

            await createBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdBook);
        });

        it("should return 409 for duplicate title or ISBN", async () => {
            const req = {
                body: {
                    title: "Duplicate Book Title",
                    author: "Another Author",
                    publishedDate: "2023-01-01",
                    isbn: "1234567890",
                },
            } as Partial<Request>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const duplicateError = {
                name: 'MongoError',
                code: 11000,
                message: 'E11000 duplicate key error collection: test.books index: title_1 dup key: { title: "Duplicate Book Title" }',
            };

            (Book.prototype.save as jest.Mock).mockRejectedValue(duplicateError);

            await createBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: "Duplicate title or ISBN",
            });
        });

        it("should return 400 for other validation errors", async () => {
            const req = {
                body: {
                    title: "",
                    author: "Author",
                    publishedDate: "2023-01-01",
                    isbn: "1234567890",
                },
            } as Partial<Request>;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const error = new Error("Validation failed");

            (Book.prototype.save as jest.Mock).mockRejectedValue(error);

            await createBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Validation failed" });
        });
    });

    describe("getBooks", () => {
        it("should retrieve all books successfully", async () => {
            const req = {} as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;
            const books = [{ title: "Book 1" }, { title: "Book 2" }];

            (Book.find as jest.Mock).mockResolvedValue(books);

            await getBooks(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(books);
        });

        it("should handle errors during retrieval", async () => {
            const req = {} as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (Book.find as jest.Mock).mockRejectedValue(new Error("Test Error"));

            await getBooks(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Test Error" });
        });
    });

    describe("getBookById", () => {
        it("should retrieve a book by ID successfully", async () => {
            const req = { params: { id: "123" } } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;
            const book = { title: "Book Title" };

            (Book.findById as jest.Mock).mockResolvedValue(book);

            await getBookById(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(book);
        });

        it("should return 404 if book is not found", async () => {
            const req = { params: { id: "123" } } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (Book.findById as jest.Mock).mockResolvedValue(null);

            await getBookById(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
        });
    });

    describe("updateBook", () => {
        it("should update a book successfully", async () => {
            const req = {
                params: { id: "123" },
                body: { title: "Updated Title" },
            } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;
            const updatedBook = { _id: "123", title: "Updated Title" };

            (Book.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedBook);

            await updateBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedBook);
        });

        it("should return 404 if book is not found", async () => {
            const req = {
                params: { id: "123" },
                body: { title: "Updated Title" },
            } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (Book.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await updateBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
        });

        it("should handle other errors during update", async () => {
            const req = {
                params: { id: "123" },
                body: { title: "Updated Title" },
            } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (Book.findByIdAndUpdate as jest.Mock).mockRejectedValue(
                new Error("Test Error")
            );

            await updateBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Test Error" });
        });
    });

    describe("deleteBook", () => {
        it("should delete a book successfully", async () => {
            const req = { params: { id: "123" } } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;
            const deletedBook = { _id: "123", title: "Book Title" };

            (Book.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedBook);

            await deleteBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it("should return 404 if book is not found for deletion", async () => {
            const req = { params: { id: "123" } } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (Book.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await deleteBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Book not found" });
        });

        it("should handle errors during deletion", async () => {
            const req = { params: { id: "123" } } as Partial<Request>;
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            (Book.findByIdAndDelete as jest.Mock).mockRejectedValue(
                new Error("Test Error")
            );

            await deleteBook(req as Request, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Test Error" });
        });
    });
});
