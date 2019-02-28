const express = require('express')
const http = require('http')
const app = express()
const config = { port: Number(process.env.PORT || 8000) }

const bodyParser = require('body-parser')

// const urlshortener = require('./urlshortener')
// console.log(urlshortener)

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
// const uri = 'mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/admin'
const uri =
  'mongodb+srv://BirMan:<Rei7quie>@mikutanodb-obhnq.mongodb.net/test?retryWrites=true'
const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect((err, client) => {
  assert.equal(null, err)
  const collection = client.db('ambershortner').collection('personnes')
  // perform actions on the collection object
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
/*****************************************        End Handle ROUTING    *****************************************/
