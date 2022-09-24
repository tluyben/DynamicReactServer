/* 
    dump a textfile into mongo
*/
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');

const { oneUpsert, ObjectId, oneQuery } = require('./mongoconn.js');

(async () => {

    const id = process.argv[2]
    const lang = process.argv[3]
    const path = process.argv[4]

    const contents = fs.readFileSync(path, 'utf8')

    await oneUpsert(process.env.MONGO_HOST, process.env.MONGO_LOGIN, process.env.MONGO_PASS, process.env.MONGO_DB, 'snippets', { _id: id }, { _id: id, lang: lang, contents: contents })

    //const result = await oneQuery(process.env.MONGO_HOST, process.env.MONGO_LOGIN, process.env.MONGO_PASS, process.env.MONGO_DB, 'snippets', { _id: id }, false)
    //console.log(result)
})()


