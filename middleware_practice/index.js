const express = require("express")
const app = express()
const morgan = require("morgan")

app.use(morgan('common'))

//app.use((req,res,next)=>{
//    console.log("First Middleware")
//    next()
//})

//app.use((req,res,next)=>{
//    console.log("Second Middleware")
//    next()
//})

//app.use((req,res,next)=>{
//   req.requestTime = Date.now()
//  console.log(req.method.toLocaleUpperCase(), req.path)  
//  next()
//})

const somefunction = (req,res,next)=>{
    console.log("Specific to only /dogs")
    next()
}

app.get("/",(req,res)=>{
    console.log(req.requestTime)
    res.send("wroking")
})

app.get("/dogs",somefunction,(req,res)=>{
    res.send("Working")
})

//404 error page. No other request is send then...

app.use((req,res)=>{
    res.status(404).send("Not found")
})


app.listen(2000,()=>{
    console.log("Server running")
})