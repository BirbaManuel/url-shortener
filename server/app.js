const express = require('express')
const http = require('http')
const app = express()
const config = { port: Number(process.env.PORT || 8000) }
const logger = require('morgan') // add log
const chalk = require('chalk') // add some cool color to your log

const mongoose = require('mongoose') //Edit data format to insert in database

const bodyParser = require('body-parser')
const assert = require('assert') //library to do unit test

const MongoClient = require('mongodb').MongoClient
const configBDD = require('./config')
const Url = require('./models/url') //format url data before insert to bdd

/**************************************************************************************/
//uri to my database in reel projet this information is host in config an external file
const uri = configBDD.uri
/**************************************************************************************/

const urlshortener = require('./urlshortener') //my custom hash object

const originalUrl = [
  'https://github.com/BirbaManuel/url-shortener',
  'https://amber-url-shortner.herokuapp.com/',
  'https://gist.github.com/BirbaManuel/ad443b0e5744b3e0015133234e12835c',
  'https://amber-url-shortner.herokuapp.com/wrongurl',
  'https://5c7589b20ebb4b7b60ffbeb2--serene-aryabhata-8aefe1.netlify.com/',
  'https://mongoosejs.com/docs/connections.html',
]
function saveUrlRequest(paramsUrl) {
  const newURL = new Url({
    short: paramsUrl,
    enhanced: urlshortener.short(paramsUrl),
  })

  newURL.save(function(err) {
    if (err) throw err
    console.log('new short URL save in database!')
  })
}
saveUrlRequest(originalUrl[5])
// const newURL = new Url({
//   short: originalUrl[4],
//   enhanced: urlshortener.short(originalUrl[4]),
// })
const options = {
  useNewUrlParser: false,
  useCreateIndex: true,
  //... Please see https://mongoosejs.com/docs/connections.html
}

//try to connect to database
mongoose.connect(uri, options).then(
  () => {
    console.log('connected')
  },
  err => {
    console.log(err)
  }
)
/*****************************************        Begin Start listening    *****************************************/
http.Server(app).listen(config.port, function() {
  console.log(
    chalk`{green ✔ Server listening on port} {cyan ${config.port}} !!!`
  )
})
/*****************************************        End  Start listening    *****************************************/

/*****************************************        Begin ROUTING    *****************************************/

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', handleHome)
app.get('/wrongurl', handleBadUrl)
app.get('/me', me)
app.post('/shorturl', shorturl)
// app.get('/:', reverseShorturl)
app.get('/showcollection', showcollection)
app.post('/login', handleLogin)
/*****************************************        End ROUTING    *****************************************/

/*****************************************        Begin Handle ROUTING    *****************************************/
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: true })

//to do : stuff with bdd to enable member functionnalities
function handleLogin(req, res) {
  if (!req.body) return res.sendStatus(400)

  res.status(200).json({ welcome: req.body }) //http code 200 => succes !!!
}
//home respons
function handleHome(req, res) {
  console.log(req.query, 'query_string')
  res.status(200).json({ success: 'welcome to Amber-URL-Shortner API!' })
}
//handle bad parameter => wrong url format
function handleBadUrl(req, res) {
  res.status(400).json({ error: 'Is not a valid url' }) //http code 400 => bad parameter
}

//simule timer
function takeTime(sec) {
  const secondes = 1000 * sec
  const time = setTimeout(function() {
    console.log(secondes + ' secondes attendues')
  }, secondes)
  return time
}

//handle perform short url functionnaly
async function shorturl(req, res) {
  if (!req.query) {
    res.redirect('/wrongurl')
  }
  try {
    console.log(req.query)
    const task = await Promise.all([takeTime(10), takeTime(20), takeTime(30)])
    //handle 'url' property
    const resulat = `http://localhost:8000/${urlshortener.short(req.body.url)}`
    console.log(resulat)
    res.status(200).json({
      url: req.body.url,
      shortURL: resulat,
    })
    //res.status(200).json({ succes: 'try to read url short link in db' })
  } catch (err) {
    req.flash('error', `Impossible d’afficher l' url demandée : ${err.message}`)
    res.redirect('/')
  }
}

//show url store in database
function showcollection(req, res) {
  // const client = new MongoClient(uri, { useNewUrlParser: true })
  // client.connect((err, client) => {
  //   assert.equal(null, err)
  //   const collection = client.db('ambershortner').collection('encodeurl')
  //   collection.find({}).exec(function(err, data) {
  //     if (err) throw err
  //     res.json(data)
  //   })
  //   client.close()
  // })
  Url.find({}, function(err, users) {
    if (err) throw err

    // object of all the users
    console.log(users)
    res.status(200).json(users)
  })
  console.log('try show db')
}

//get some info from me 😃
function me(req, res) {
  res.status(200).json({
    success: "It's Manuel Birba API",
    date: '26/02/2019',
    goal: 'succed Amber Test',
  })
}
/*****************************************        End Handle ROUTING    *****************************************/
