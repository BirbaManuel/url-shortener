const express = require('express')
const http = require('http')
const app = express()
const config = { port: Number(process.env.PORT || 8000) }
const logger = require('morgan') // add log
const chalk = require('chalk') // add some cool color to your log

const mongoose = require('mongoose') //Edit data format to insert in database

const bodyParser = require('body-parser') //to do : add multer for more fct in parsing data from request
const assert = require('assert') //library to do unit test
const flash = require('connect-flash') //middleware connect-flash : messages temporaires

const MongoClient = require('mongodb').MongoClient
const configBDD = require('./config')
const Url = require('./models/url') //format url data before insert to bdd

/**************************************************************************************/
//uri to my database in reel projet this information is host in config an external file
const uri = configBDD.uri
/**************************************************************************************/

const urlshortener = require('./urlshortener') //my custom object to hash string

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
// exemple test to save a original URL => saveUrlRequest(originalUrl[5])

const options = {
  useNewUrlParser: false,
  useCreateIndex: true,
  //... Please see https://mongoosejs.com/docs/connections.html to give more specific option
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
app.get('/showallcollection', showAllcollection)
app.post('/findoriginalurl', findOriginalUrl)
app.get('/redirecttooriginalurl', redirectToOriginalUrl)
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

//simule timing when try to find if given URL has already been perform
function takeTime(sec) {
  const secondes = 1000 * sec
  const time = setTimeout(function() {
    console.log(secondes + ' secondes attendues')
  }, secondes)
  return time
}

//handle perform short url functionnaly
async function shorturl(req, res, next) {
  if (!req.body) {
    res.redirect('/wrongurl')
  }
  try {
    //const task = await Promise.all([takeTime(10), takeTime(20), takeTime(30)])

    //handle 'url' application server property, should keep hostname
    const reqUri =
      `${req.protocol}://${req.get('host')}${req.originalUrl}` ||
      'http://localhost:8000/'
    const resulat = `${reqUri}${urlshortener.short(req.body.url)}`
    const isOk = await verifyIfOriginalURLAlreadyShorted(req.body.url)
    // console.log(isOk)
    const time = 'time'
    console.log(time)
    // if (isOk) {
    //   saveUrlRequest(req.body.url)
    // }

    res.status(200).json({
      url: req.body.url,
      shortURL: resulat,
    })
    //res.status(200).json({ succes: 'try to read url short link in db' })
  } catch (err) {
    //req.flash('error', `Impossible d’afficher l' url demandée : ${err.message}`)
    console.log('before redirect to home')
    res.redirect('/')
  }
}

//show all url store in database
function showAllcollection(req, res) {
  Url.find({}, function(err, url) {
    if (err) throw err
    // object of all the url
    console.log(url)
    res.status(200).json(url)
  })
  console.log('try show db')
}

/***BEGIN To do in the part below => one unique fonction to verify existence of original and short url***/
//verify is original url is store in database
async function verifyIfOriginalURLAlreadyShorted(pUrl) {
  //set shorted format (URL to URN)
  //console.log(pUrl, 'purl original!!!')
  const isOk = await Url.find({ url: pUrl }, function(err, success) {
    if (err) throw err
    else {
      if (success.length === 0) {
        //url non en base => save it !
        saveUrlRequest(pUrl)
      }
      console.log(success, 'original url in already in bdd!!!')
      return success
    }
  })

  console.log(isOK)
  const time = 'time'
  console.log(time)
  return isOk
}

//verify all urlshort store in database
async function verifyIfURLAlreadyShorted(pUrl) {
  //set shorted format (URL to URN)
  const urn = pUrl
  console.log(purl, 'purl !!!')
  await Url.find({ enhanced: urn }, function(err, url) {
    if (err) throw err
    console.log(url, 'verified url in fct!!!')
    return url
  })
}
/***END To do in the part below => one unique fonction to verify existence of original and short url***/

async function findOriginalUrl(req, res, next) {
  // await verifyIfURLAlreadyShorted('46aaab2081983c4553980869b98d6dd0')
  console.log(req.body, 'url shorted')
  const isok = await verifyIfURLAlreadyShorted(req.body.urlshorted)
  console.log(isok)
  const time = 'time'
  console.log(time)
  // req.flash('info', 'given short url match!')
  res.redirect('/redirecttooriginalurl')
}

function redirectToOriginalUrl(req, res, next) {
  const reqFlash = req.flash('info')
  console.log(reqFlash, 'redirection done')
  res.status(200).json({ message: reqFlash })
}
//get some info from me 😃
function me(req, res) {
  res.status(200).json({
    success: "It's Manuel Birba API",
    date: '26/02/2019',
    goal: 'passing the Amber Test',
  })
}
/*****************************************        End Handle ROUTING    *****************************************/
