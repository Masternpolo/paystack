const express = require('express');
const app = express();
const port = 3300;
const https = require('https')
const cors = require('cors')
const pool = require('./database/db.js')
require('dotenv').config({
    path: './config.env'
})
const crypto = require('crypto');

app.use(cors());


app.get('/paystack', (req, res) => {
    const https = require('https');
    const email = 'masternpolo@gmail.com';
    const amount = 500 * 100;
    const name = "Ogomegbunam Edeogu"

    const callback_url = 'https://paystack-ri87.onrender.com/callback';
   

    const params = JSON.stringify({
        email,
        amount,
        callback_url,
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "name",
                    value: name
                }
            ]
        }
    });

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    };

    const reqPaystack = https.request(options, resPaystack => {
        let data = '';

        resPaystack.on('data', chunk => data += chunk);
        resPaystack.on('end', () => {
            console.log(JSON.parse(data));
            res.send(data);
        });
    });

    reqPaystack.on('error', error => console.error(error));

    reqPaystack.write(params);
    reqPaystack.end();
});


const db = require('./db'); // adjust the path as needed

app.get('/callback', (req, res) => {
    const reference = req.query.reference;

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        }
    };

    const reqVerify = https.request(options, verifyRes => {
        let data = '';

        verifyRes.on('data', chunk => data += chunk);
        verifyRes.on('end', () => {
            const response = JSON.parse(data);

            if (response.status && response.data.status === 'success') {
                res.send(`<h2>Payment Successful</h2><p>Thank you</p>`);
            } else {
                res.send(<h2>Payment Failed or Incomplete</h2>);
            }
        });
    });

    reqVerify.on('error', error => {
        console.error(error);
        res.send('An error occurred');
    });

    reqVerify.end();
});

app.post('/paystack/webhook', express.json({ verify: (req, res, buf) => {
    req.rawBody = buf;
} }), async (req, res) => {
    const secret = process.env.PAYSTACK_SECRET_KEY; 

    const hash = crypto
        .createHmac('sha512', secret)
        .update(req.rawBody)
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    // Handle only successful payments
    if (event.event === 'charge.success') {
        const paymentData = event.data;

        const email = paymentData.customer.email;
        const name = paymentData.metadata?.custom_fields?.[0]?.value || 'Unknown';
        const amount = paymentData.amount;
        const status = paymentData.status;
        const reference = paymentData.reference;
        const paidAt = paymentData.paid_at;

        try {
            // await db.execute(
            //     `INSERT INTO payments (email, name, amount, reference, status, paid_at)
            //      VALUES (?, ?, ?, ?, ?, ?)`,
            //     [email, name, amount, reference, status, paidAt]
            // );
            // console.log('Payment saved from webhook');
            alert('payment saved')
        } catch (err) {
            console.error('DB error from webhook:', err);
        }
    }

    res.sendStatus(200); // Important! Always respond with 200
});

app.listen(port, () => {
    console.log('app is listening on port 3300');
})