const express = require('express')
const app = express()
let port = 3000
const fs = require('fs')
const shell = require('shelljs');
const dotenv = require('dotenv');
dotenv.config();
const { queryMongo, connect } = require('./mongoconn.js')

app.use(express.static('serve'))

let client = null

app.get('/', async (req, res) => {
  const id = req.query.id
  let lang = req.query.lang

  if (!id || !lang) {
    res.send('Hello World!')
  } else {
    // does it exist? 
    if (fs.existsSync("./serve/" + id)) {
      // redirect 
      res.redirect(301, '/' + id)
    } else {
      // copy the file from mongo 
      const record = await queryMongo(client, 'snippets', { _id: id }, false)
      //console.log(record)
      if (record.length === 0) {
        res.send('Hello World!') // this means not found :) 
        return
      }
      lang = record[0].lang
      const contents = record[0].contents
      fs.writeFileSync("/tmp/" + id, contents)

      // build 
      let errors = null
      if (lang === 'ts') {
        if (contents.indexOf('function App(') > 0) {
          errors = shell.exec('./ts-build-src-clean ' + id, { silent: true }).stderr

        } else {
          errors = shell.exec('./ts-build-src ' + id, { silent: true }).stderr
        }
        //errors = shell.exec('ls -aiowejfaeiwfjwa', {silent:true}).stderr
      } else {
        if (contents.indexOf('function App(') > 0) {
          errors = shell.exec('./js-build-src-clean ' + id, { silent: true }).stderr
        } else {
          errors = shell.exec('./js-build-src ' + id, { silent: true }).stderr
        }
      }
      if (errors) {
        // make sure we don't have serve
        shell.exec('rm -rf serve/' + id)
        res.send('<html><body>Compile errors:<br>' + (errors.split('\n').map(s => s + '<br>').join('\n')) + '</body></html>')
      } else {
        res.redirect(301, '/' + id)
      }
    }
  }
})

port = process.env.REACT_SERVER_PORT || port
console.log(`Setting up on port ${port}`)
app.listen(port, async () => {
  client = await connect(process.env.MONGO_HOST, process.env.MONGO_LOGIN, process.env.MONGO_PASS, process.env.MONGO_DB)
  console.log(`Example app listening on port ${port}`)
})
