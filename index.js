import express from "express";
// import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(cors());
app.use('/public', express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index2", (req, res) => {
    res.sendFile(path.join(__dirname, "index2.html"));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});