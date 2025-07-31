const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();
app.use(express.json());
const todoitemeroutes=require("./routes/todo.routes")
const port=3400;
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/todolist")
.then(()=>console.log("database is connected"))
.catch(()=>console.log("not connected"))

app.use("/",todoitemeroutes);
app.listen(port,()=>{
    console.log("listening");

})