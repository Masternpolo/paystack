const { log } = require('console');
const express = require('express');
const app = express();
const port = 3300;
const https = require('https')
const cors = require('cors')
const pool = require('./database/db.js')

app.use(cors())

let reference;
let trxref;

const crypto = require('crypto');
const secret = 'sk_test_1376138953d227c699664afe2951392ff2f9bfd2';
// Using Express
app.post("/paystack/webhook", async function(req, res) {
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
    reference  = req.query.reference;
    trxref = req.query.trxref;
    console.log(reference);
    res.send(`callback url route activated , ${reference} : trxref : ${trxref}`)
   
})

app.get('/verify', (req, res, next) => {
    const https = require('https')

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: `/transaction/verify/:${reference}`,
  method: 'GET',
  headers: {
    Authorization: 'Bearer sk_test_1376138953d227c699664afe2951392ff2f9bfd2'
  }
}

https.request(options, res => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  });

  res.on('end', () => {
    console.log(JSON.parse(data))
    res.send(data.status)
  })
}).on('error', error => {
  console.error(error)
})
})


app.get('/paystack', (req, res) => {
    const https = require('https');
    const email = 'masternpolo@gmail.com'
    const amount = 50 * 100;
    const callback_url = 'https://paystack-ri87.onrender.com/callback'
    const failure_url = 'http://localhost:3300/failure'


    console.log(email, amount);
    

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
            Authorization: 'Bearer sk_test_1376138953d227c699664afe2951392ff2f9bfd2',
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