# qb2ut
A tool to migrate torrents from qbittorrent to utorrent.

**[中文说明](README_zh.md)**
## About

*This tool is only tested on windows 11, qbittorrent 4.2.5, utorrent 2.2.1, node.js 17.0.1, python 3.9.7, yarn 1.22.15.*

Different from other similar tools, it use python with [qbittorrentapi](https://qbittorrent-api.readthedocs.io/en/latest/introduction.html) to export the qbittorrent torrents based on [qbittorrent webui api](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-v3.2.0-v4.0.4)). So you can make some custom rules to export. like
* export only public trackers and name include "vcb-s" or torrents in category 'rxxx':
   ```python
   torrent.name.lower().find('vcb-s') != -1 and qbt_client.torrents_trackers(torrent.hash)[0].msg != 'This torrent is private' or torrent.category == 'rxxx'
   ```

* You may find more useful examples [here](https://gist.github.com/search?q=qbittorrentapi).

And about utorrent, sadly its webui api is very poor, which is unable to meet this demand. So I use a [tool](https://github.com/zhyupe/utorrent-resume) based on nodejs, and add some features.

In fact, if you have torrent files and downloaded files, this tool can help you migrate from any bittorrent client to utorrent, because it does not depend on the resume file of other clients.

It can also be used to export torrents from qbittorrent with readable titles and custom rules.

## Usage

To use this tool, you must have [Node.js](https://nodejs.org/), [yarn](https://yarnpkg.com/) and [Python3](https://www.python.org/) installed.
You can easily get them from [Scoop](https://github.com/ScoopInstaller/Scoop) package manager. Just run `scoop install python nodejs yarn`. I haven't tested npm.

Before you use this tool, be sure that there is no torrent added in your utorrent. This tool will replace the `resume.dat`.

1. Clone this repository  
   ```bash
   git clone https://github.com/Nuevo009/qb2ut.git
   ```
   or [download a zip file](https://codeload.github.com/Nuevo009/qb2ut/zip/refs/heads/main), then open your terminal and run `yarn` to install node modules, and then run `pip install qbittorrent-api`.
2. Create a `config.json` from `config.json.sample`.

   * If you do not have many seeding directories, you can just write them in your config. And copy all torrents from your `BT_backup` which is usually in your `C:\Users\username\AppData\Local\qBittorrent` to someplace like `./torrents` and add it to config. In this case, you do not need to install Python and qbittorrent-api.

   * If you need Python to help you export torrents and write config.json, you need to configure your qbittorrent-webui and configure in `export.py`, and run `python ./export.py`.
   

3. Run `node index`, log and errors would be reported. Or if you have thousands of torrents and don't want to read the log from the terminal, you can run `node index > 1.log` and check the log file. Or if you don't care about log, you can run `node index >nul`, this would only report errors in your terminal.
4. The `resume.dat` and matched torrents are saved in `output`. 
   Copy these files to the utorrent's root directory. Then open your utorrent and check.

## Configuration

* `torrentDir`: torrent files directory.
* `dataDir`: seeding directories.
* `blacklist`: ignore irrelevant files.Any file or directory whose name is equal to any item in the array will be ignored. 
* `depth`: searching directory path depth

You can find other configuration guides in `export.py`

## Known issues

* If you customized the name of the highest folder of a torrent, the tool would not match it. 
* If you have incomplete downloaded files, the torrent will still be migrated and you have to check the content. 

To fix these, I need to read the fast resume file of qbittorrent, and write it to a pure python tool. But now it works fine for me. Maybe someday I will do that.
## Reference

<https://github.com/zhyupe/utorrent-resume>

<https://gist.github.com/shirohako/d0bd55d5b6f4408e2ea08a63dd52cb86#file-qb-py>

## License
This project is published under [GPL-3.0](LICENSE)
