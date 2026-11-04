import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

const ducks: DuckProps[] = [
  { name: "Ido", color: "White", age: 15 },
  { name: "Zib", color: "Idk What Color I Am", age: 15 },
  { name: "Adam Dar", color: "Yellow", age: 16 },
];

const allowedColors: string[] = [
  "AliceBlue",
  "AntiqueWhite",
  "Aqua",
  "Aquamarine",
  "Azure",
  "Beige",
  "Bisque",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "GoldenRod",
  "Gray",
  "Grey",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenRodYellow",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "White",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen",
];

app.listen(4590, () => {
  console.log("Server is running!");
});

app.use("/ducks", (req, res, next) => {
  console.log(req.method + " request made to " + req.originalUrl);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

interface DuckProps {
  name: string;
  color: string;
  age: number;
}

app.get("/ducks/:name", (req, res) => {
  const { name } = req.params;
  const duck = ducks.find((d) => {
    if (name === d.name) return d;
  });
  res.send(duck);
});

app.post(
  "/ducks",
  (req, res, next) => {
    if (req.header("duck-password") === "duckyDuck") next();
    else {
      res.status(401).json({ message: "Unauthorized" });
      next("route");
    }
  },
  (req, res, next) => {
    if (
      req.body.name !== undefined &&
      allowedColors.findIndex((color)=>req.body.color===color) !== -1 &&
      req.body.age > 0
    )
      next();
    else {
      res.status(400).json({ message: "Bad Request" });
      next("route");
    }
  },
  (req, res) => {
    ducks.push(req.body);
    res.send(req.body);
  },
);

app.delete(
  "/ducks/:name",
  (req, res, next) => {
    if (req.header("duck-password") === "duckyDuck") next();
    else {
      res.status(401).json({ message: "Unauthorized" });
    }
  },
  (req, res) => {
    const idx = ducks.findIndex((duck) => duck.name === req.params.name);

    if (idx === -1) {
      return res.status(404).json({ message: "Duck not found!" });
    }

    const [deletedDuck] = ducks.splice(idx, 1);
    return res.json({ name: deletedDuck.name });
  },
);

app.patch(
  "/ducks/:name",
  (req, res, next) => {
    if (req.header("duck-password") === "duckyDuck") next();
    else {
      res.status(401).json({ message: "Unauthorized" });
    }
  },
  (req, res) => {
    const duck = ducks.find((duck) => req.params.name === duck.name);
    if (!duck) res.status(404).json({ message: "Duck not found" });
    else {
      if (req.body.duck.age) duck.age = req.body.duck.age;
      if (req.body.duck.color) duck.color = req.body.duck.color;
      if (req.body.duck.name) duck.name = req.body.duck.name;
      res.json(duck);
    }
  },
);

app.get("/ducks", (req, res) => {
  const filteredDucks = [...ducks];
  for (let i = 0; i < filteredDucks.length; i++) {
    if (req.query.name)
      if (req.query.name !== filteredDucks[i].name) filteredDucks.splice(i, 1);
    if (req.query.age)
      if (Number(req.query.age) !== filteredDucks[i].age)
        filteredDucks.splice(i, 1);
    if (req.query.color)
      if (req.query.color !== filteredDucks[i].color)
        filteredDucks.splice(i, 1);
  }
  res.json({ filteredDucks: filteredDucks, ducks: ducks });
});
