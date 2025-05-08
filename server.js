const express = require('express');
const app = express();
const port = 3300;
const https = require('https')


app.get('/paystack', (req, res) => {
    const https = require('https')

    const params = JSON.stringify({
        "email": "customer@email.com",
        "amount": "500000"
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