import express from "express";


const app = express();
app.use(express.json());

app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (_req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }

    next();
});

app.get("/hello", (req, res) => {
    res.send("Hello!");
});


app.listen(3001, () => {
    console.log("Server is wasdawsdasdawdsaddwasdwasdwasdasddaddasdw running!");
});

app.get("/student", (req, res) => {
    res.json({name:"abcda", grade: 95});
});

app.get("/school", (req, res) => {
    res.json({name:"gregory", city:"joevile", students:"abdaabdaaaabda"});
});

app.post("/students", (req, res) => {
    console.log(req.body);
    res.status(201).json({
        message: "Student received!",
        student: req.body,
    });
});





