const fs = require('fs')

const dirs = ['js-base', 'ts-base']

for(const x of dirs) {
 let f = JSON.parse(fs.readFileSync(x+'/package.json'))
 f.homepage = './'
 fs.writeFileSync(x+'/package.json', JSON.stringify(f, null, 2))
}
