const { log } = require('console');
const express = require('express');
const app = express();
const port = 3300;
const https = require('https')
const cors = require('cors')

app.use(cors())

const crypto = require('crypto');
const secret = 'sk_test_1376138953d227c699664afe2951392ff2f9bfd2';
// Using Express
app.post("/paystack/webhook", function(req, res) {
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event  
    console.log(event);
    }
    res.send(200);
});


app.get('/paystack', (req, res) => {
    const https = require('https');
    const email = 'masternpolo@gmail.com'
    const amount = 50 * 100;
    const success_url = 'http://localhost:3300/success'
    const failure_url = 'http://localhost:3300/failure'


    console.log(email, amount);
    

    const params = JSON.stringify({
        email,
        amount
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