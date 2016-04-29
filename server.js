var express = require('express')
var http = require('http')
var bodyParser = require('body-parser')
var path = require('path')
var port = process.env.PORT || 8080
var getStores = require('./models/get-stores')
var getItems = require('./models/get-items')

var app = express()
var server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/stores', function(req,res) {
  getStores()
    .then(function(stores) {
      getItems()
        .then(function(items) {
          stores.forEach(function(store) {
            store.items = items.filter(function(item) {
              return item.storeID === store.storeID
            })
          })
          res.json(stores)
        })
    })
})

server.listen(port, function () {
  console.log('http server listening on port: ', port)
})
