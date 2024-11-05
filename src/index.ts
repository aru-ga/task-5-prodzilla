// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import connectDB from './config/db';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use('/api', bookRoutes);
app.use('/api/auth', authRoutes); // Add auth routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
