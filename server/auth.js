require('dotenv')
const express = require('express');
const request = require('request');
const path = require('path');
const querystring = require('querystring');
const serverless = require('serverless-http')

const app = express();
const router = express.Router()
const port = process.env.PORT || 8000;

const redirect_uri =
  process.env.REDIRECT_URI ||
  `http://localhost:${port}/callback`;

router.get('/auth', function(req, res) {
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-follow-read user-follow-modify user-top-read user-read-recently-played user-library-modify user-library-read user-read-playback-state streaming',
      redirect_uri,
      show_dialog: true
    })}`);
});

router.get('/callback', function(req, res) {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    console.log(response);
    const accessToken = body.access_token;
    const refreshToken = body.refresh_token;
    // process.env.access_token = accessToken
    // process.env.refresh_token = refreshToken
    let uri = process.env.FRONTEND_URI || 'http://localhost:4200';
    res.redirect(uri + '?access_token=' + accessToken + '&refresh_token=' + refreshToken)
  })
});

router.get('/refresh', function(req, res) {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'refresh_token',
      refresh_token: process.env.refresh_token
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    console.log(response);
    const accessToken = body.access_token;
    const refreshToken = body.refresh_token;
    // process.env.access_token = accessToken
    // process.env.refresh_token = refreshToken
    let uri = process.env.FRONTEND_URI || 'http://localhost:4200/profile'
    res.redirect(uri + '?access_token=' + accessToken + '&refresh_token=' + refreshToken)
  })
});

// Run the router by serving the static files
// in the dist directory

router.use(express.static(__dirname + '/dist/spotify-analytics'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used

router.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/spotify-analytics/index.html'));
});

console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`);
app.use('/', router)
app.listen(port);
module.exports.handler = serverless(app)
