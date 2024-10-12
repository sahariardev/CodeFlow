import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;
app.use(cors())
app.use(express.json());

app.post('/run', (req, res) => {
    const code = req.body.code;

});

http.createServer(app).listen(PORT, () => {
    console.log(`Server started in port ${PORT}`);
});