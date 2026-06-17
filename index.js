const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Store last 10 messages (in memory)
let messages = [];

app.post('/sms', (req, res) => {
  const from = req.body.From;
  const body = req.body.Body;
  const to = req.body.To;

  const sms = {
    from: from,
    to: to,
    body: body,
    time: new Date().toLocaleString()
  };

  messages.unshift(sms);           // Add to top
  if (messages.length > 10) messages.pop(); // Keep only 10

  console.log(`📨 New SMS from ${from}: ${body}`);

  // Auto-reply
  const twiml = new MessagingResponse();
  twiml.message(`✅ Received: "${body}"`);

  res.type('text/xml');
  res.send(twiml.toString());
});

// View all recent messages in browser
app.get('/messages', (req, res) => {
  let html = `
    <h1>📥 Twilio Incoming SMS</h1>
    <p><a href="/messages">Refresh</a></p>
    <ul>`;
  
  if (messages.length === 0) {
    html += `<li>No messages yet. Send an SMS to your Twilio number.</li>`;
  } else {
    messages.forEach(m => {
      html += `<li><strong>${m.time}</strong><br>From: ${m.from}<br>Message: ${m.body}</li><hr>`;
    });
  }
  
  html += `</ul>`;
  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`👀 View messages at: http://localhost:${PORT}/messages`);
});
