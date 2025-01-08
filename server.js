const express = require("express")
const app = express()
const fs = require("fs")
const { json } = require("stream/consumers")

app.set("view engine", "ejs")
app.listen(3000)

app.use(express.json());

app.use(express.static("views/"))


app.get("/", (req,res)=>{
   res.render("index",{nomed:"Daniel"})
})

app.post("/save", (req,res)=>{
   fs.writeFileSync('data/database.txt',JSON.stringify(req.body))
   res.json(req.body)
})

app.get('/load',(req,res)=>{
   const file = fs.readFileSync('data/database.txt');
   const array = JSON.parse(file)
   res.json(array)
})