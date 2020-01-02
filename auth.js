// console.log(require('dotenv').config({debug: true}))

let express = require('express')
let request = require('request')
let path = require('path')
let querystring = require('querystring')

let app = express()

let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback'

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-follow-read user-follow-modify user-top-read user-read-recently-played user-library-modify user-library-read',
      redirect_uri,
      show_dialog: true
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
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
  }
  request.post(authOptions, function(error, response, body) {
    console.log(response)
    const accessToken = body.access_token
    const refreshToken = body.refresh_token
    // process.env.access_token = accessToken
    // process.env.refresh_token = refreshToken
    let uri = process.env.FRONTEND_URI || 'http://localhost:4200'
    res.redirect(uri + '?access_token=' + accessToken + '&refresh_token=' + refreshToken)
  })
})

app.get('/refresh', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
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
  }
  request.post(authOptions, function(error, response, body) {
    console.log(response)
    const accessToken = body.access_token;
    const refreshToken = body.refresh_token
    // process.env.access_token = accessToken
    // process.env.refresh_token = refreshToken
    let uri = process.env.FRONTEND_URI || 'http://localhost:4200'
    res.redirect(uri + '?access_token=' + accessToken + '&refresh_token=' + refreshToken)
  })
})

// Run the app by serving the static files
// in the dist directory

// app.use(express.static(__dirname + '/dist/spotify-analytics'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used

// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname + '/dist/spotify-analytics/index.html'));
// });

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)
