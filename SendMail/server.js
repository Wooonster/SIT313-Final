const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey('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')

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cors())
app.use(bodyParser.json())

app.post('/', (req, res) => {
    const email = req.body.email
    console.log(email)

    const msg = {
        to: email,
        from: "s222187008@deakin.edu.au",
        subject: "DEV@DEAKIN",
        html: "<h1>Thanks for subscribe our channel.</h1>"
    }
    console.log(msg)

//     sgMail.send(msg).then(() => {
//         console.log("Email sent successfully")
//         res.send("Email sent successfully")
//     }).catch((error) => {
//         console.log("Failed")
//         console.error(error.response.body)
//     })
})

app.listen(4000, function (err) {
    if (err) console.log('listen error', err)
    console.log('successfully connected')
})
