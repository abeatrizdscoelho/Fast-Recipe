import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

app.get('/health', (req, res) => {res.json({ status: 'ok' })})

const PORT = process.env.PORT || 3000
app.listen(Number(PORT), '0.0.0.0', () => { 
    console.log(`Servidor está rodando!`)
})