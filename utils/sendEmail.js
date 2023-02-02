const nodemailer = require("nodemailer");
module.exports = async (email, subject, text) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transport.sendMail({
      from: "Kinetic Glass",
      to: email,
      subject: subject,
      text: "Please Verify your Email Click this Link Bellow",
      html: `<html>
              <head>
                <style>
                    .container{
                      background-color:rgb(0, 76, 121);
                      padding: 20px;
                      box-shadow: 0 0 10 10 rgba(0, 0, 0, 0.116);
                      border-radius: 5px;
                  }
  
                      .heading{
                          font-size:30px;
                          font-weight:bold;
                          text-align:center;
                          text-decoration: underline;
                          margin-bottom: 10px;
                          margin-top: 10px;
                      
                      }
                      
                      .pr{
                          font-size:16px;
                          text-align:left;
                          margin-bottom: 10px;
                          margin-top: 10px;
                      }
                      
                      .link{
                          font-size:35px;
                          font-weight: 900;
                          text-decoration: underline;
                      }
     
                  </style>
                </head>
                <body>
                  <div class="container">
                      <h1 class="heading"> 
                        Kinetic glass is a react component library with too much features you!
                        Now you can sell your prevoius work with just few click.
                      </h1>
                      <ul class="p">
                          <li>
                            No more details
                          </li>
                          <li>
                            No more Verifications
                          </li>
                          <li>
                            Simple and straingt forward
                          </li>
                      </ul>
                      <h1 class="heading">Grow With us!</h1>
                      <a class="link" href=${text}>Click Here </a>
                   </div>
                </body>
          </html>`,
    });
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
