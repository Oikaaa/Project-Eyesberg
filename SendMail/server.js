const express = require('express');
const http = require('http')
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/send-email', (req, res) => {
  const { recipient, subject, message } = req.body;

  // Create a SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eyesberg.servicesnotification@gmail.com',
      pass: 'tfxq tcoj qwmp ytce'
    }
  });

  // Email content
  const mailOptions = {
    from: '"Eyesberg" <eyesberg.servicesnotification@gmail.com>',
    to: recipient,
    subject: 'Checkout successful',
    text: 'Thank you for shopping with us, you had completed checkout the following item:'
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
