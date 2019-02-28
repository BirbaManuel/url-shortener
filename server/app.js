const express = require('express')
const http = require('http')
const app = express()
const config = { port: Number(process.env.PORT || 8000) }

const bodyParser = require('body-parser')

const urlshortener = require('./urlshortener')
console.log(
  urlshortener.short('https://amber-url-shortner.herokuapp.com/wrongurl')
)
const MongoClient = require('mongodb').MongoClient
const configBDD = require('./config')
const assert = require('assert') //library

/**************************************************************************************/
//uri to my database in reel projet this information is host in config an external file
const uri = configBDD.uri
/**************************************************************************************/

const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect((err, client) => {
  assert.equal(null, err)
  const collection = client.db('ambershortner').collection('personnes')
  //perform actions on the collection object
  //Insert 5 last shortner url
  collection.insertMany([
    {
      url: 'https://github.com/BirbaManuel/url-shortener',
      urlshortener: 'https://bit.ly/2TlNJto',
    },
    {
      url:
        'https://gist.github.com/BirbaManuel/ad443b0e5744b3e0015133234e12835c',
      urlshortener: 'https://bit.ly/2BTPPac',
    },
    {
      url: 'https://amber-url-shortner.herokuapp.com/wrongurl',
      urlshortener: 'https://bit.ly/2IPTtb4',
    },
    {
      url: 'https://amber-url-shortner.herokuapp.com/',
      urlshortener: 'https://bit.ly/2GO6yQ3',
    },
    {
      url:
        'https://5c7589b20ebb4b7b60ffbeb2--serene-aryabhata-8aefe1.netlify.com/',
      urlshortener: 'https://bit.ly/2IPTUCe',
    },
  ])

  client.close()
})

/*****************************************        Begin Start listening    *****************************************/
http.Server(app).listen(config.port, function() {
  console.log(`API server started at port ${config.port} !!!`)
})
/*****************************************        End  Start listening    *****************************************/

/*****************************************        Begin ROUTING    *****************************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', handleHome)
app.get('/wrongurl', handleBadUrl)
app.get('/me', me)
app.post('/shorturl', shorturl)
app.get('/showcollection', showcollection)
/*****************************************        End ROUTING    *****************************************/

/*****************************************        Begin Handle ROUTING    *****************************************/
function handleHome(req, res) {
  res.status(200).json({ success: 'welcome to Amber-URL-Shortner !' })
}
function handleBadUrl(req, res) {
  res.status(400).json({ error: 'Is not a valid url' })
}
function shorturl(req, res) {
  if (!req.body) {
    console.log('!req.body')
    res.redirect('/wrongurl')
  }
  console.log('req.body')
  console.log(req.body)
  res.status(200).json({
    url: req.body,
    shortURL: 'URL shortener',
  })
}
function me(req, res) {
  res.status(200).json({
    success: "It's Manuel Birba API",
    date: '26/02/2019',
    goal: 'succed Amber Test',
  })
}
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
