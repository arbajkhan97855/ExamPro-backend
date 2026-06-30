require("dotenv").config();

const express=require("express");

const cors=require("cors");

const app=express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.get("/",(req,res)=>{

    res.json({

        success:true,

        message:"Online Examination API Running"

    });

});

const PORT=process.env.PORT;

app.listen(PORT,()=>{

    console.log(`Server Running ${PORT}`);

});