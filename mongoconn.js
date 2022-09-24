
const { MongoClient, ObjectId } = require('mongodb');

async function connect(host, login, pass, db) {
    const client = await (new MongoClient(`mongodb://${login}:${pass}@${host}/${db}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true
        //useFindAndModify: false,
        //useCreateIndex: true
    }).connect())
    return client
}

async function queryMongo(client, collection, query, lazy = true) {
    const coll = client.db().collection(collection)
    let result = null
    if (lazy) {
        result = (await coll.find(query))
    } else {
        result = await coll.find(query).toArray()
    }
    return result
}

async function deleteMongo(client, collection, query) {
    const coll = client.db().collection(collection)
    const result = await coll.deleteMany(query)
    return result
}

async function upsertMongo(client, collection, query, update) {
    const coll = client.db().collection(collection)
    const result = await coll.updateMany(query, { $set: update }, { upsert: true })
    return result
}

async function oneQuery(host, login, pass, db, collection, query) {
    const client = await connect(host, login, pass, db)
    const result = await queryMongo(client, collection, query, false) // force immediate execution 
    await client.close()
    return result
}

async function oneUpsert(host, login, pass, db, collection, query, update) {
    const client = await connect(host, login, pass, db)
    const result = await upsertMongo(client, collection, query, update)
    await client.close()
    return result
}

async function oneDelete(host, login, pass, db, collection, query) {
    const client = await connect(host, login, pass, db)
    const result = await deleteMongo(client, collection, query)
    await client.close()
    return result
}

module.exports = { connect, queryMongo, deleteMongo, upsertMongo, oneQuery, oneUpsert, oneDelete, ObjectId }

if (process.argv[process.argv.length - 1].indexOf('mongoconn.js') > -1) {
    (async () => {
        let result = await oneQuery('localhost:27017', 'admin', 'admin', 'test', 'test', {})
        console.log(result)

        result = await oneUpsert('localhost:27017', 'admin', 'admin', 'test', 'test', {}, { firstName: 'john', lastName: 'doe' })
        console.log(result)

        result = await oneQuery('localhost:27017', 'admin', 'admin', 'test', 'test', {})
        console.log(result)

        const id = result[0]._id

        result = await oneUpsert('localhost:27017', 'admin', 'admin', 'test', 'test', { _id: id }, { firstName: 'john', lastName: 'flow' })
        console.log(result)

        result = await oneQuery('localhost:27017', 'admin', 'admin', 'test', 'test', {})
        console.log(result)

        result = await oneDelete('localhost:27017', 'admin', 'admin', 'test', 'test', {})
        console.log(result)

        result = await oneQuery('localhost:27017', 'admin', 'admin', 'test', 'test', {})
        console.log(result)

    })()
}

