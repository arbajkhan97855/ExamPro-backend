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

const sendOTPEmail = require("./utils/mail");

app.get("/test-mail", async (req, res) => {
    try {

        await sendOTPEmail(
            "pathanarbaj03328@gmail.com",
            "123456"
        );

        res.send("Mail Sent");

    } catch (err) {

        console.log(err);

        res.status(500).send(err.message);

    }
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{

    console.log(`Server Running ${PORT}`);

});