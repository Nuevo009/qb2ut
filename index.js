const path = require('path')
const fs = require('fs')

const config = require('./config.json')

const parseTorrent = require('parse-torrent')
const readDir = require('./lib/readdir')

const ReadTorrent = require('./lib/readTorrent')
const readTorrent = new ReadTorrent()

const ResumeGenerator = require('./lib/resumeGenerator')
const resumeGenerator = new ResumeGenerator()

let logs = []
let dirMap
readDir(config.dataDir, config.blacklist, config.depth).then(_dirMap => {
  dirMap = _dirMap

  console.log('ReadDir finished, item: ' + Object.keys(dirMap).length)
  return readTorrent.load(config.torrentDir)
}).then(() => {
  console.log('ReadTorrent finished, item: ' + readTorrent.allCount)
  return readTorrent.handle((item, filename, next) => {
    let torrentData, info
    try {
      torrentData = fs.readFileSync(item)
      info = parseTorrent(torrentData)
    } catch (e) {
      logs.push({ file: item, text: 'Failed parseing torrent, skip.' })
      return next()
    }

    let files = info.files
    let key = files[0].path
    let multiFile = files.length !== 1
    if (multiFile) {
      key = key.substr(0, key.indexOf('\\'))
    }

    let paths = dirMap[key]
    if (!paths || !paths.length) {
      logs.push({ file: item, text: 'Not found' })
      return next()
    }

    let dir
    for (let aPath of paths) {
      try {
        dir = path.join(aPath, key)
        if (fs.statSync(dir)) {
          fs.writeFileSync(path.join('./output', filename), torrentData)
          resumeGenerator.push(filename, dir, info)
          return next()
        }
      } catch (e) { throw e }
    }

    logs.push({ file: item, text: 'Not found' })
    return next()
  })
}).then(() => {
  for (let log of logs) {
    console.log('File: ' + log.file)
    console.log(log.text)
  }

  return resumeGenerator.save('./output/resume.dat')
}).then(() => {
  console.log('Finished')
}).catch(e => {
  console.error(e.message)
  console.error(e.stack)
})