// const express = require('express');
// const multer = require('multer');
// const nodemailer = require("nodemailer");

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' }); // Change 'uploads/' to your desired directory

// // Middleware
// app.use(express.static('public'));
// app.use(express.json());

// // Route to serve the contact form
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/contact.html');
// });

// // Post route for handling form submissions
// app.post('/', upload.array('upload_images'), (req, res) => {
//     console.log(req.body);
//     console.log(req.files); // Uploaded files will be available in req.files

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'navarro.cecilio16@gmail.com',
//             pass: 'ocva qiab czlj nhkl'
//         }
//     });

//     const formType = req.body.formType;
//     let mailOptions;

//     if (formType === 'contactForm1') {
//         mailOptions = {
//             from: req.body.email,
//             replyTo: req.body.email,
//             to: 'navarro.cecilio16@gmail.com',
//             subject: `New message from ${req.body.name} via Contact Form`,
//             html: `
//                 <h3>Contact Details</h3>
//                 <ul>
//                     <li><strong>Name:</strong> ${req.body.name}</li>
//                     <li><strong>Email:</strong> ${req.body.email}</li>
//                     ${req.body.address ? `<li><strong>Address:</strong> ${req.body.address}</li>` : ''}
//                 </ul>
//                 <h3>Message</h3>
//                 <p>${req.body.message}</p>
//             `
//         };
//     } else if (formType === 'contactForm2') {
//         let attachments = req.files.map(file => ({
//             filename: file.originalname,
//             path: file.path
//         }));

//         mailOptions = {
//             from: req.body.email,
//             replyTo: req.body.email,
//             to: 'navarro.cecilio16@gmail.com',
//             subject: `New message from ${req.body.name} via Estimate Request Form`,
//             html: `
//                 <h3>Contact Details</h3>
//                 <ul>
//                     <li><strong>Name:</strong> ${req.body.name}</li>
//                     <li><strong>Email:</strong> ${req.body.email}</li>
//                     ${req.body.address ? `<li><strong>Address:</strong> ${req.body.address}</li>` : ''}
//                     ${req.body.project_type ? `<li><strong>Project Type:</strong> ${req.body.project_type}</li>` : ''}
//                     ${req.body.date_available ? `<li><strong>Date Available:</strong> ${req.body.date_available}</li>` : ''}
//                     ${req.body.budget ? `<li><strong>Budget:</strong> ${req.body.budget}</li>` : ''}
//                 </ul>
//                 <h3>Message</h3>
//                 <p>${req.body.message}</p>
//             `,
//             attachments: attachments // Attach uploaded images
//         };
//     } else {
//         res.send('error');
//         return;
//     }

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//             res.send('error');
//         } else {
//             console.log('Email sent: ' + info.response);
//             res.send('success');
//         }
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const multer = require('multer');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3001;
const resend = new Resend('re_31uXjrfZ_6DAhrkcykugCpykPVGmqXupr');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // You can customize this dir

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Serve the contact form HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/contact.html'));
});

// Handle form submissions
app.post('/', upload.array('upload_images'), async (req, res) => {
  console.log('Form Submission:', req.body);
  console.log('Uploaded Files:', req.files);

  const formType = req.body.formType;
  let html = '';
  let subject = '';

  if (formType === 'contactForm1') {
    subject = `Brosigns.com - New Contact Message from ${req.body.name}`;
    html = `
      <h3>Contact Details</h3>
      <ul>
        <li><strong>Name:</strong> ${req.body.name}</li>
        <li><strong>Email:</strong> ${req.body.email}</li>
        ${req.body.address ? `<li><strong>Address:</strong> ${req.body.address}</li>` : ''}
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  } else if (formType === 'contactForm2') {
    subject = `Brosigns.com - New Estimate Request from ${req.body.name}`;
    html = `
      <h3>Estimate Request</h3>
      <ul>
        <li><strong>Name:</strong> ${req.body.name}</li>
        <li><strong>Email:</strong> ${req.body.email}</li>
        ${req.body.address ? `<li><strong>Address:</strong> ${req.body.address}</li>` : ''}
        ${req.body.project_type ? `<li><strong>Project Type:</strong> ${req.body.project_type}</li>` : ''}
        ${req.body.date_available ? `<li><strong>Date Available:</strong> ${req.body.date_available}</li>` : ''}
        ${req.body.budget ? `<li><strong>Budget:</strong> ${req.body.budget}</li>` : ''}
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
      ${req.files?.length ? `<h3>Uploaded Files</h3><ul>${req.files.map(f => `<li>${f.originalname}</li>`).join('')}</ul>` : ''}
    `;
  } else {
    return res.send('error');
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'navarro.cecilio16@gmail.com',
      replyTo: req.body.email,
      subject: subject,
      html: html
    });

    res.send('success');
  } catch (error) {
    console.error('Resend Error:', error);
    res.send('error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
