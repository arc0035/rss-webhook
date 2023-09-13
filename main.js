const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const port = 8549;

const SMTP_SERVER = 'smtp.qq.com';
const SMTP_USERNAME = '772952985@qq.com';
const SMTP_PASSWORD = 'cnptxduwayskbbia';
const RECEIVERS = ['772952985@qq.com', 'aaron.chu@niubi.im'];

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER,
  secureConnection: true,
  port: 465,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD
  }
});

app.post('/', upload.none(), (req, res) => {
  console.log('收到请求\n');
  console.log(req.body);
  const title = req.body.title;
  const descr = req.body.desp;
  const link = req.body.link;

  console.log(`Title: ${title}`);
  console.log(`Description: ${descr}`);
  console.log(`Link: ${link}`);

  const content = `${descr}\n${link}`;
  sendEmail(RECEIVERS, title, content);

  res.send('Post received!');
});

function sendEmail(receivers, subject, content, retries = 0, maxRetries = 10) {
  if (retries >= maxRetries) {
    console.log('邮件发送失败');
    return;
  }

  const mailOptions = {
    from: SMTP_USERNAME,
    to: receivers.join(','),
    subject: subject,
    text: content
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('邮件发送报错，重试:', retries);
      transporter.login({
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      });
      sendEmail(receivers, subject, content, retries + 1, maxRetries);
    } else {
      console.log('邮件发送成功');
    }
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});