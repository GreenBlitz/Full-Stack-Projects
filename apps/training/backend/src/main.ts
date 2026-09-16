import express from "express";

const app = express();

app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    next();
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




