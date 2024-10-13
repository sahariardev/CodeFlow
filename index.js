import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors'
import executeCode from "./code.executor.service.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
app.use(cors())
app.use(express.json());

app.post('/run', (req, res) => {
    const code = req.body.code;
    const result = executeCode(code, 'JAVA');

    return res.json({message: result});
});

http.createServer(app).listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
});