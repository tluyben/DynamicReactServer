const express = require('express')
const app = express()
const port = 3000
const fs = require('fs')
const shell = require('shelljs');

app.use(express.static('serve'))

app.get('/', (req, res) => {
 const id = req.query.id   
 const lang = req.query.lang 
 
 if (!id||!lang) { 
  res.send('Hello World!')
 } else { 
  // does it exist? 
  if (fs.existsSync("./serve/"+id)) {
   // redirect 
   res.redirect(301, '/'+id)
  } else { 
   // build 
   let errors = null
   if (lang === 'ts') { 
    errors = shell.exec('./ts-build-src '+id, {silent:true}).stderr
    //errors = shell.exec('ls -aiowejfaeiwfjwa', {silent:true}).stderr
   } else {
    errors = shell.exec('./js-build-src '+id, {silent:true}).stderr
   }
   if (errors) {
    res.send('<html><body>Compile errors:<br>'+(errors.split('\n').map(s=>s+'<br>').join('\n'))+'</body></html>')
   } else {
    res.redirect(301, '/'+id)
   }
  }
 }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
