import express, { Express } from 'express'
import mongoose from 'mongoose'
import financialRecordRouter from './routes/financial-records';
import cors from 'cors'

const app: Express = express()
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cors())

const mongoURI: string = "mongodb+srv://jeckelequin:f0PKNHCDxjjc7tuI@cluster0.agxstsp.mongodb.net/"

mongoose
    .connect(mongoURI)
    .then(() => console.log('CONNECTED TO MONGODB!'))
    .catch((err) => console.error('Failed to connect to mongoDB', err))

app.use('/financial-records', financialRecordRouter)

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
})
