const fs = require('fs')
const bencode = require('bencode')

class ResumeGenerator {
  constructor () {
    this.list = {}
  }

  generateHave (length) {
    let bufferLength = Math.ceil(length / 8)
    let buffer = Buffer.alloc(bufferLength, 0xff)

    let lastByte = length % 8
    if (lastByte && bufferLength > 0) {
      buffer[bufferLength - 1] = 0xff >> (8 - length % 8)
    }

    return buffer
  }

  push (filename, dir, info) {
    let time = Math.floor(Date.now() / 1000)
    let emptyBuf = Buffer.alloc(0)
    this.list[filename] = {
      added_on: time,
      blocks: [],
      blocksize: 16384,
      cached: 0,
      caption: Buffer.from(info.name),
      codec: 0,
      completed_on: time,
      corrupt: 0,
      dht: 14,
      download_url: emptyBuf,
      downloaded: 0,
      downspeed: 0,
      episode: 0,
      episode_to: 0,
      feed_url: emptyBuf,
      hashfails: 0,
      have: this.generateHave(info.pieces.length),
      info: info.infoHashBuffer,
      'last seen complete': time,
      last_active: 0,
      lsd: 8,
      moved: 1,
      order: -1,
      override_seedsettings: 0,
      path: Buffer.from(dir),
      peers6: emptyBuf,
      prio: Buffer.alloc(info.files.length, 8),
      prio2: 1,
      quality: 0,
      rss_name: emptyBuf,
      runtime: 2,
      scrambled: 0,
      season: 0,
      seedtime: 2,
      started: 0,
      superseed: 0,
      superseed_cur_piece: 0,
      time: time,
      trackermode: 3,
      trackers: info.announce.map(item => Buffer.from(item)),
      ulslots: 0,
      uploaded: 0,
      upspeed: 0,
      use_utp: 1,
      valid: 1,
      visible: 1,
      wanted_ratio: 1500,
      wanted_seedtime: 0,
      waste: 0,
      webseeds: []
    }
  }

  save (dir) {
    return new Promise((resolve, reject) => {
      fs.writeFile(dir, bencode.encode(this.list), err => {
        if (err) return reject(err)

        resolve()
      })
    })
  }
}

module.exports = ResumeGenerator
