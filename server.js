
require("dotenv").config();

const express=require("express");


const cors=require("cors");

const app=express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://exampro-web.netlify.app"
    ]
}));


app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);

app.get("/",(req,res)=>{

    res.json({

        success:true,

        message:"Online Examination API Running"

    });

});



const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{

    console.log(`Server Running ${PORT}`);

});