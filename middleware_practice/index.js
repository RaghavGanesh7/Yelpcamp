const express = require("express")
const app = express()
const morgan = require("morgan")
const apperror = require("./apperror")  // custom error class using Error class

app.use(morgan('common'))

//app.use((req,res,next)=>{
//    console.log("First Middleware")
//    next()
//})

//app.use((req,res,next)=>{
//    console.log("Second Middleware")
//    next()
//})

app.use((req,res,next)=>{
  req.requestTime = Date.now()
  console.log(req.method.toLocaleUpperCase(), req.path)  
  next()
})

const somefunction = (req,res,next)=>{
    console.log("Specific to only /dogs")
    next()
}

app.get("/",(req,res)=>{
    console.log(req.requestTime)
    res.send("wroking")
})

app.get("/dogs",somefunction,(req,res)=>{
    throw new apperror(401,"asdasdalkj")
    res.send("Working")
})

//404 error page. No other request is send then...

app.use((req,res)=>{
    res.status(404).send("Not found")
})
//my error handling route
app.use((err,req,res,next)=>{
    console.log(err.status) // give default value if it not a app error and it is a JS related error
    //res.status().send()  --- send a status and messages
    console.log("ERORROROROROROROROROROROOROR")
    next(err)
})


app.listen(2000,()=>{
    console.log("Server running")
})