import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import recipeRoutes from './routes/recipeRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import favoriteRoutes from './routes/favoriteRoutes';
import reviewRoutes from './routes/reviewRoutes';
import mealPlanRoutes from './routes/mealPlanRoutes';

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/profile', userRoutes)
app.use('/recipes', recipeRoutes)
app.use('/favorites', authMiddleware, favoriteRoutes)
app.use('/recipes', reviewRoutes)
app.use('/meal-plan', mealPlanRoutes)

app.get('/health', (req, res) => {res.json({ status: 'ok' })})

const PORT = process.env.PORT || 3000
app.listen(Number(PORT), '0.0.0.0', () => { 
    console.log(`Servidor está rodando!`)
})