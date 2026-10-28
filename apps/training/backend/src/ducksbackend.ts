import  express  from "express";
const app=express();
app.use(express);
interface ducks{
    name:string
    color:string
    age:number
}
const Ducks:ducks[]=[{name:"Yoni",color:"red",age:12
},{name:"donatt",color:"red",age:12
},{name:"ulalek",color:"white",age:12},{name:"raz<3",color:"yellow",age:15}]
app.get ("/",(req,res)=>{
    res.send("welcome!!")})
app.get("/ducks",(req,res)=>{
    res.json(Ducks)})
app.get("/ducks/:name",(req,res)=>{
    const duckName = req.params.name;
    const duck = Ducks.find((item) => item.name === duckName);
    if (!duck) {
        return res.status(404).send("Duck not found");
    }
    res.json(duck);
})
app.listen(3000, () => {
  console.log("Server is running!");
});
