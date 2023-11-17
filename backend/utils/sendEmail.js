// const nodeMailer=require("nodemailer")

// const sendEmail=async(options)=>{
//     const transporter=nodeMailer.createTransport({
//         service:process.env.SMPT_SERVICE,
//         port:587,
//         secure:true,
//         auth:{
//             user:process.env.SMPT_MAIL,
//             pass:process.env.SMPT_PASSWORD
//         },
//         tls:{
//                      rejectUnauthorized:true
//             }
//     })


//     const mailOptions={
//         from:process.env.SMPT_MAIL,
//         to:options.email,
//         subject:options.subject,
//         text:options.message
//     }
//     await transporter.sendMail(mailOptions)
// }
//module.exports=sendEmail;

const nodemailer=require("nodemailer");

const sendEmail=options=>{
const transporter=nodemailer.createTransport({
    service:'gmail',
    port:587,
    secure:true,
    logger:true,
    debug:true,
    secureConnection:false,
    auth:{
        user:"nutemp24@gmail.com",
        pass:"lyha qdis ddbs tbsc"
    },
    tls:{
        rejectUnauthorized:true
    }    

    
    
})
const mailOptions={
        from:"nutemp24@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
     }
     console.log(mailOptions);
    transporter.sendMail(mailOptions,function(err,info){
        if(err)
        console.log(err);

        else
        console.log(info);
    })
    
    console.log(mailOptions);

}

module.exports=sendEmail;

//nutemp24@gmail.com
//90351@abc