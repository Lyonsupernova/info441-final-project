"use strict";

const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (Product, Subscription) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();
  var Emails = getEmails(Product.ProductName, Subscription)

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 546587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "stockstation8@gmail.com", // generated ethereal user
      pass: "deuqfeeadudogxbx", // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Stock Station" <stockstation8@gmail.com>', // sender address
    to: Emails, // list of receivers format: abc@gmail.com,123@gmail.com
    subject: "Product Available!", // Subject line
    text: "Hello, your subscribed product" + Product.ProductName + "is avaialble at " + Product.ProductLink, // plain text body
    html: "<b>Hello, your subscribed product </b>" + Product.ProductName + "<b> is avaialble at <b>" + Product.ProductLink, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


// return a list of emails of the users whow subscribe provided product
// in the required format
function getEmails(productName, Subscription) {
    // Connect to mongodb to request user information

  var emails = Subscription.find({"productName": productName}, {"email": 1}, function(err, res) {
    if (err) {
      console.log("Something wrong retrieving url: %v", err);
    }
  });

  var Emails;
  if (emails.length >= 1) {
    Emails = emails[0].email;
    for (let i = 1; i < emails.length; i++) {
      Emails += "," + emails[i].email;
    };
  }
  return Emails;
}

module.exports = {
  sendEmail
}
