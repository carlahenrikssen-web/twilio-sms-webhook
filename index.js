const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;

  console.log(`📨 SMS from ${from}: ${body}`);

  const twiml = new MessagingResponse();
  twiml.message(`Thanks! Received: "${body}"`);

  res.type('text/xml');
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
