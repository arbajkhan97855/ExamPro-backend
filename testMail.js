const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");

(async () => {
    try {

        console.log(await dns.promises.lookup("smtp.gmail.com", { all: true }));

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.verify();

        console.log("SMTP Connected");

    } catch (err) {
        console.log(err);
    }
})();