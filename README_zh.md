## 关于

*此工具仅在 windows 11、qbittorrent 4.2.5、utorrent 2.2.1、node.js 17.0.1、python 3.9.7、yarn 1.22.15 上测试过。*

与其他类似工具不同，它使用 python 和基于[qbittorrent webui api](https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-v3.2.0-v4.0.4)) 的[qbittorrentapi](https://qbittorrent-api.readthedocs.io/en/latest/introduction.html)来进行种子的导出。所以你可以制定一些自定义规则来导出。比如
* 仅导出 BT 种子中名称包括"vcb-s"的种子 或 "rxxx" 分类中的种子：

   ```python
   torrent.name.lower().find('vcb-s') != -1 and qbt_client.torrents_trackers(torrent.hash)[0].msg != '这是私有 torrent' or torrent.category == 'rxxx'
   ```

* 你可以在[这里](https://gist.github.com/search?q=qbittorrentapi)找到更多有用的例子。

而关于 utorrent，遗憾的是它的 webui api 功能很少，无法满足这种需求。所以我使用了一个基于 nodejs 的[工具](https://github.com/zhyupe/utorrent-resume)，并添加了一些功能。

事实上，如果你有 torrent 文件和下载完成的文件，这个工具可以帮助你从任何 bittorrent 客户端迁移到 utorrent，因为它不依赖于其他客户端的 resume 文件。

它也可以被用作自定义规则导出 qb 的种子，并重命名成可读的名字。

## 使用方法
要使用这个工具，你首先要安装 [Node.js](https://nodejs.org/)、[yarn](https://yarnpkg.com/) 和 [Python3](https://www.python.org/) 。
你可以从 [Scoop](https://github.com/ScoopInstaller/Scoop) 包管理器来获取它们。只需运行`scoop install python nodejs yarn`。我没有测试过 npm，大概也行。

在使用此工具之前，请确保你的 utorrent 中没有添加 torrent。此工具将替换 `resume.dat`。

1. 克隆这个仓库
    ```bash
    git clone https://github.com/Nuevo009/qb2ut.git
    ```

    或[通过 zip 方式下载](https://codeload.github.com/Nuevo009/qb2ut/zip/refs/heads/main)，然后打开 cmd/powershell 等终端，运行`yarn`来安装 node_modules，然后运行`pip install qbittorrent-api`。
2. 根据`config.json.sample` 创建一个`config.json`。

   * 如果你的做种目录没有很多，你可以把它们写在你的`config.json`中。并将你的`BT_backup`(一般来说是在`c:\Users\username\AppData\Local\qBittorrent`) 中的所有种子文件复制到`"./torrents"`或者其他地方，并将其添加到 config.json 里面。在这种情况下，你不需要安装 Python 和 qbittorrent-api。

   * 如果你需要 Python 帮助你导出 torrents 并编写 config.json，你需要配置你的 qbittorrent-webui 并在`export.py`中配置相关信息，并运行`python ./export.py`。
   

3. 运行`node index`，日志和错误会直接输出到你的终端里面。如果你有数千个种子并且不想从终端读取日志，你可以运行 `node index > 1.log` 并检查日志文件。如果你不关心日志，你可以运行`node index >nul`，这只会在你的终端中报告错误。
4. `resume.dat` 和匹配的种子文件会输出到 `./output` 中。
   将这些文件复制到 utorrent 的根目录。然后打开你的 utorrent 并检查。

## 配置

* `torrentDir`：torrent 文件目录。
* `dataDir`：做种目录。
* `blacklist`：忽略不相关的文件。任何名称等于数组中任何项的文件或目录都将被忽略。
* `depth`：搜索目录路径深度

你可以在 `export.py` 中找到其他配置指南

## 已知的问题

* 如果你自定义了某个 torrent 的最高文件夹的名称，那么这个工具会匹配不到这个种子。
* 如果你下载的文件不完整，torrent 仍会被迁移，你必须检查内容。

为了解决这些问题，我需要读取 qbittorrent 的 fastresume 文件，并把这个工具写成纯 python 工具。但现在它对我来说很好用。也许有一天我会这样做。
## 参考

<https://github.com/zhyupe/utorrent-resume>

<https://gist.github.com/shirohako/d0bd55d5b6f4408e2ea08a63dd52cb86#file-qb-py>