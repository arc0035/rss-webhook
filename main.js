const express = require('express');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const LARK_URL = process.env.LARK_URL;
console.log(LARK_URL);


const app = express();
const port = 8549;



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/', upload.none(), async (req, res) => {
  console.log('收到请求\n');
  console.log(req.body);
  const title = req.body.title;
  const descr = req.body.desp;
  const link = req.body.link;

  console.log(`Title: ${title}`);
  // console.log(`Description: ${descr}`);
  console.log(`Link: ${link}`);

  const content = `${link}`;
  await sendLark(title, content);

  res.send('Post received!');
});

async function sendLark(title, content, retries = 0, maxRetries = 10) {
  if (retries >= maxRetries) {
    console.log('Lark发送失败');
    return;
  }

  const data = {
    msg_type: 'text',
    content: {
      text: title + "\n" + content
    }
  };

  try{
    const response = await axios.post(LARK_URL, data);
    console.log('Post request successful');
    console.log('Response:', response.data);
  }
  catch(e){
    sendLark(title, content, retries+1, maxRetries )
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});