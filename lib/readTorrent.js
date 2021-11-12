const path = require('path')
const fs = require('fs')
const readline = require('readline')

class ReadTorrent {
  constructor () {
    this.allCount = 0
    this.nowCount = 0
    this.baseDir = ''

    this.list = []
  }

  log (text) {
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(`(${this.nowCount}/${this.allCount}) ${text}`)
    readline.clearLine(process.stdout, 1)
  }

  load (dir) {
    this.baseDir = dir
    return new Promise((resolve, reject) => {
      console.log('Reading Torrents from ' + dir)

      fs.readdir(dir, (err, files) => {
        if (err) return reject(err)

        this.list = files
        this.allCount = files.length

        resolve()
      })
    })
  }

  handle (handler) {
    return new Promise((resolve, reject) => {
      let next = err => {
        if (err) return reject(err)

        // if (this.nowCount === 2) return resolve()

        if (this.nowCount === this.allCount) {
          process.stdout.write('\n')
          resolve()
        } else {
          ++this.nowCount
          let item = this.list[this.nowCount - 1]

          this.log(`Processing ${item}`)
          handler(path.join(this.baseDir, this.list[this.nowCount - 1]), this.list[this.nowCount - 1], next)
        }
      }

      next()
    })
  }
}

module.exports = ReadTorrent
