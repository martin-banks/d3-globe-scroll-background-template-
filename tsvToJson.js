/* eslint no-console: 0 */
const fs = require('fs')
const path = require('path')

const location = process.cwd()
const args = process.argv.slice(2)
console.log(location, args)

args.forEach(arg => {
  fs.readFile(path.join(location, arg), (err, buffer) => {
    if (err) return console.log(err)
    const file = buffer.toString('utf8')
    const output = file
      .split('\n')
      .map(x => x.split('\t'))
      .map((item, i, all) => ({
        [all[0][0]]: item[0],
        [all[0][1]]: item[1]
      }))
      .slice(1)
    console.log(output)
    const filename = `${args[0].split('.')[0]}.json`
    return fs.writeFile(path.join(location, filename), JSON.stringify(output), writeErr => console.log)
  })
})
