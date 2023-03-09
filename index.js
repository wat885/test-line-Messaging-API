const line = require('@line/bot-sdk')
const express = require('express')
const axios = require('axios').default
const dotenv = require('dotenv')

const env = dotenv.config().parsed
const app = express()

const lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN,
}


// 
const client = new line.Client(lineConfig);

app.get('/', async (req, res) => { res.send("OK") })

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events
        console.log('event=>>>>>>>>', events)
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    } catch (error) {
        res.status(500).end()
    }
})

const handleEvent = async (event) => {
    console.log(event)
    console.log(event.message.type )
    if (event.type !== 'message' || event.message.type !== 'text') {
        return null
    }
    else if (event.message.text == 'OK' || event.message.text == 'ok') {
        return client.replyMessage(event.replyToken,
            {
                type: "sticker",
                packageId: 8522,
                stickerId: 16581266
            })
    }
    else if (event.message.text == 'location' ) {
        return client.replyMessage(event.replyToken,
            {
                type: "location",
                title: "LINE Company (Thailand) Limited",
                address: "127 อาคารเกษรทาวเวอร์ ชั้น17 ถ.ราชดำริ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330",
                latitude: 13.7460089,
                longitude: 100.5386192
            })
    }
    else if (event.type === 'message') {
        return client.replyMessage(event.replyToken,
            { type: 'text', text: event.message.text })
    }
}

const POST = process.env.PORT || 4000

app.listen(POST, () => {
    console.log(`lestening on port`, POST)
});

