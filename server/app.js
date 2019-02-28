const express = require('express')
const http = require('http')
const app = express()
const config = { port: Number(process.env.PORT || 8000) }
const logger = require('morgan') // add log
const chalk = require('chalk') // add some cool color to your log

//Edit data format to insert in database
const mongoose = require('mongoose')
const Url = require('./models/url')

const bodyParser = require('body-parser')

const urlshortener = require('./urlshortener')
const googleCom = 'www.google.com'
var newURL = new Url({
  short: googleCom,
  enhanced: urlshortener.short(googleCom),
})

const MongoClient = require('mongodb').MongoClient
const configBDD = require('./config')
const assert = require('assert') //library to do unit test

/**************************************************************************************/
//uri to my database in reel projet this information is host in config an external file
const uri = configBDD.uri
/**************************************************************************************/

const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect((err, client) => {
  assert.equal(null, err)
  const collection = client.db('ambershortner').collection('personnes')
  //collection.drop()
  //perform actions on the collection object
  //Insert 5 last shortner url
  // collection.insertMany([
  //   {
  //     url: 'https://github.com/BirbaManuel/url-shortener',
  //     urlshortener: 'https://bit.ly/2TlNJto',
  //   },
  //   {
  //     url:
  //       'https://gist.github.com/BirbaManuel/ad443b0e5744b3e0015133234e12835c',
  //     urlshortener: 'https://bit.ly/2BTPPac',
  //   },
  //   {
  //     url: 'https://amber-url-shortner.herokuapp.com/wrongurl',
  //     urlshortener: 'https://bit.ly/2IPTtb4',
  //   },
  //   {
  //     url: 'https://amber-url-shortner.herokuapp.com/',
  //     urlshortener: 'https://bit.ly/2GO6yQ3',
  //   },
  //   {
  //     url:
  //       'https://5c7589b20ebb4b7b60ffbeb2--serene-aryabhata-8aefe1.netlify.com/',
  //     urlshortener: 'https://bit.ly/2IPTUCe',
  //   },
  // ])

  client.close()
})

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
    const task = await Promise.all([
      EtakeTime(10),
      EtakeTime(20),
      EtakeTime(30),
    ])
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

//get some info from me
function me(req, res) {
  res.status(200).json({
    success: "It's Manuel Birba API",
    date: '26/02/2019',
    goal: 'succed Amber Test',
  })
}

//show url store in database
function showcollection(req, res) {
  const client = new MongoClient(uri, { useNewUrlParser: true })
  client.connect((err, client) => {
    assert.equal(null, err)
    const collection = client.db('ambershortner').collection('personnes')

    collection.find({}).exec(function(err, data) {
      if (err) throw err
      res.json(data)
    })
    //doesn't work
    //collection.drop()

    //Insert 5 last shortner url
    // collection.insertMany([
    //   {
    //     url: 'https://github.com/BirbaManuel/url-shortener',
    //     urlshortener: 'https://bit.ly/2TlNJto',
    //   },
    //   {
    //     url:
    //       'https://gist.github.com/BirbaManuel/ad443b0e5744b3e0015133234e12835c',
    //     urlshortener: 'https://bit.ly/2BTPPac',
    //   },
    //   {
    //     url: 'https://amber-url-shortner.herokuapp.com/wrongurl',
    //     urlshortener: 'https://bit.ly/2IPTtb4',
    //   },
    //   {
    //     url: 'https://amber-url-shortner.herokuapp.com/',
    //     urlshortener: 'https://bit.ly/2GO6yQ3',
    //   },
    //   {
    //     url:
    //       'https://5c7589b20ebb4b7b60ffbeb2--serene-aryabhata-8aefe1.netlify.com/',
    //     urlshortener: 'https://bit.ly/2IPTUCe',
    //   },
    // ])

    // perform actions on the collection object
    client.close()
  })
  // res.status(200).json({
  //   success: '5 last shortner URL insered in Database !!!',
  // })
  console.log('try show db')
}
/*****************************************        End Handle ROUTING    *****************************************/
