const path = require('path')
const fs = require('fs')
const readline = require('readline')

class Readdir {
  constructor (dir, blacklist, depth) {
    this.allCount = 0
    this.nowCount = 0
    this.depth = depth
    this.depth_ = 0

    this.baseDir = dir
    this.blacklist = blacklist
    this.map = {}
    this.queue = []

    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
    for (let d of dir) {
      this.queue.push(d)
      this.depth_ = 0
      ++this.allCount
      this.scan(this.queue.pop())
    }
  }

  log (text) {
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(`(${this.nowCount}/${this.allCount}) ${text}`)
    readline.clearLine(process.stdout, 1)
  }

  scan (dir) {

    ++this.nowCount
    this.log('Reading ' + dir)

    fs.readdir(dir, (err, files) => {
      if (err) return this._reject(err)

      files.reverse().forEach(item => {
        if (this.blacklist.includes(item)) return

        let itemPath = path.join(dir, item)
        let stat
        try {
          stat = fs.statSync(itemPath)
        } catch (e) {
          console.warn(e.message)
          return
        }

        if (this.map[item]) {
          this.map[item].push(dir)
        } else {
          this.map[item] = [dir]
        }

        if (stat.isDirectory()) {
          this.queue.push(itemPath)
          ++this.allCount
        }
      })

      if (this.allCount > this.nowCount && this.depth_< this.depth) {
        ++this.depth_
        this.scan(this.queue.pop())
      } else {
        process.stdout.write('\n')
        this._resolve(this.map)
      }
    })
  }
}

module.exports = (dir, blacklist) => {
  let readdir = new Readdir(dir, blacklist)
  return readdir.promise
}
