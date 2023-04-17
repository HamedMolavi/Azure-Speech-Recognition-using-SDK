// env variables config
require('dotenv').config();
// importing
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
// make instance
const app = express();
// parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// view setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// middlewares
app.use(express.static(path.join(__dirname, 'public')));

// ====     E N D      P O I N T S     ====
// main page
app.get('/', (_req, res)=> res.render('index'));

// token get
app.get('/api/get-speech-token', async (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const speechKey = process.env.SPEECH_KEY;
    const speechRegion = process.env.SPEECH_REGION;
    if (speechKey === 'paste-your-speech-key-here' || speechRegion === 'paste-your-speech-region-here') {
        res.status(400).send('You forgot to add your speech key or region to the .env file.');
    } else {
        const headers = { 
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        try {
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            res.cookie('speech-token', speechRegion + ':' + tokenResponse.data, {maxAge: 540});
            res.send({ token: tokenResponse.data, region: speechRegion });
        } catch (err) {
            res.status(401).send('There was an error authorizing your speech key.');
            console.log(err);
        };
    }
});

// initial server
app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);