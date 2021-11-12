# qb2ut
A tool to migrate torrents from qbittorrent to utorrent.

## About

Different from other similar tools, it use python with [qbittorrentapi](https://qbittorrent-api.readthedocs.io/en/latest/introduction.html) to export the qbittorrent torrents based on [qbittorrent webui api](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-v3.2.0-v4.0.4)). So you can make some custom rules to export. You may find some useful examples [here](https://gist.github.com/search?q=qbittorrentapi).

And about utorrent, sadly its webui features are poor, which is unable to meet this demand. So use a [tool](https://github.com/zhyupe/utorrent-resume) based on nodejs, and add some features to adapt.

## Usage

To use this tool, you must have [Node.js](https://nodejs.org/), [yarn](https://yarnpkg.com/) and [Python3](https://www.python.org/) installed.
You can easily get them from [Scoop](https://github.com/ScoopInstaller/Scoop) package manager. Just run `scoop install python nodejs yarn`. I do not test it with npm.

1. Clone this repository or download a zip file, then open your terminal and run `yarn` to install node modules, and then run `pip install qbittorrent-api`.
2. Create a `config.json` from `config.json.sample`.

   * If you do not have manys seeding directories, you can just write them in your config. And copy all torrents from your `BT_backup` which is usually in your `C:\Users\username\AppData\Local\qBittorrent` to some place like `./torrents` and add it to config. In this case you do not need to install Python and qbittorrent-api.

   * If you need the Python to help you export torrents and write config.json, you need to configure your qbittorrent webui and Configure your information in export.py, and  run `python ./export.py`.
   * Configuration
      * `torrentDir`: torrent files directory.
      * `dataDir`: seeding directories.
      * `blacklist`: ignore irrelevant files.Any file or directory whose name equal to any item in the array will be ignored. 

3. Run `node index`, errors would be reported.
4. The `resume.dat` and matched torrents are saved in `output`. 
   Copy these files to the utorrent's root directory.

## Reference

<https://github.com/zhyupe/utorrent-resume>


## License
This project is published under [GPL-3.0](LICENSE)
