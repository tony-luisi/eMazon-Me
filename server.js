var express = require('express')
var http = require('http')
var bodyParser = require('body-parser')
var path = require('path')
var port = process.env.PORT || 8080

var app = express()
var server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req,res) {
	res.send('index.html')
})

server.listen(port, function () {
  console.log('http server listening on port: ', port)
})
