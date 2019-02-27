const express = require('express')
const http = require('http')

const app = express()
// const adress = 'http://localhost:'
const config = { port: Number(process.env.PORT || 8000) }

/*****************************************        Begin Start listening    *****************************************/
http.Server(app).listen(config.port, function() {
  console.log(`API server started at port ${config.port}`)
})
/*****************************************        End  Start listening    *****************************************/

/*****************************************        Begin ROUTING    *****************************************/
app.get('/', handleHome)
app.get('/wrongurl', handleBadUrl)
/*****************************************        End ROUTING    *****************************************/

/*****************************************        Begin Handle ROUTING    *****************************************/
function handleHome(req, res) {
  // res.sendFile(__dirname + '/index.html')
  res.status(200).json({ success: 'welcome to Amber-URL-Shortner !' })
}

function handleBadUrl(req, res) {
  res.status(400).json({ error: 'Is not a valid url' })
}
/*****************************************        End Handle ROUTING    *****************************************/
