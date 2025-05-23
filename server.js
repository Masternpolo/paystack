const { log } = require('console');
const express = require('express');
const app = express();
const port = 3300;
const https = require('https')
const cors = require('cors')
const pool = require('./database/db.js')
require('dotenv').config({
    path: './config.env'
})

app.use(cors())

let reference;
let trxref;

const crypto = require('crypto');
const path = require('path');
const secret = '';
// Using Express
app.post("/paystack/webhook", async function (req, res) {
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        // Retrieve the request's body
        const event = req.body;
        // Do something with event  
        const sql = 'INSERT INTO data (data) VALUES ($1)';
        const values = [JSON.stringify(event)];
        const result = await pool.query(sql, values)
    }
    res.send(200);
});

app.get('/callback', (req, res, next) => {
    reference = req.query.reference;
    trxref = req.query.trxref;
    console.log(reference);
    res.send(`callback url route activated , ${reference} : trxref : ${trxref}`)

})

app.get('/verify', (req, res, next) => {

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/:${reference}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    }

    https.request(options, res => {
        let data = ''

        res.on('data', (chunk) => {
            data += chunk
        });

        res.on('end', () => {
            console.log(JSON.parse(data))
        })
    }).on('error', error => {
        console.error(error)
    })
    res.send(data.status)

})


app.get('/paystack', (req, res) => {

    const email = 'masternpolo@gmail.com'
    const amount = 5000 * 100;
    const callback_url = 'https://paystack-ri87.onrender.com/callback'

    const params = JSON.stringify({
        email,
        amount,
        callback_url,
    })

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    }

    const reqPastack = https.request(options, resPaystack => {
        let data = ''

        resPaystack.on('data', (chunk) => {
            data += chunk
        });

        resPaystack.on('end', () => {
            console.log(JSON.parse(data))
            res.send(data)
        })
    }).on('error', error => {
        console.error(error)
    })

    reqPastack.write(params)
    reqPastack.end()
})

app.listen(port, () => {
    console.log('app is listening on port 3300');
})