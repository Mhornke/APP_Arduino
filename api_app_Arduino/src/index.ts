import express from 'express'
import cors from 'cors'
const app = express()
const port = 3000

import statusRoutes from './routes/arduino'

app.use(cors())
app.use(express.json())
app.use("/portao", statusRoutes)
app.get('/', (req, res) => {

    res.send('Api do Trabalho Internet das coisas')
})

app.listen(port, () => {

    console.log(`Servidor rodando na porta ${port}`);

})