import qbittorrentapi

import os.path
from os import path
from shutil import copyfile
import json
# You can change your configuration here
data = {
"torrentDir":"./torrents/",
"dataDir": [],
"blacklist": [""],
"depth": 3
}


# Export qBittorrent torrents with readable title
# You need to install qbittorrent-api first, and configure host / webapi username & password
#
# pip install qbittorrent-api

# instantiate a Client using the appropriate WebUI configuration
qbt_client = qbittorrentapi.Client(host='10.17.67.209:15153', username='foo', password='bar')

# the Client will automatically acquire/maintain a logged in state in line with any request.
# therefore, this is not necessary; however, you many want to test the provided login credentials.
try:
  qbt_client.auth_log_in()
except qbittorrentapi.LoginFailed as e:
  print(e)

# source: BT_backup directory
# destination: export directory

source='C:\\Users\\username\\AppData\\Local\\qBittorrent\\BT_backup'
destination = data["torrentDir"]

print(f'qBittorrent: {qbt_client.app.version}')
print(f'qBittorrent Web API: {qbt_client.app.web_api_version}')
print(f'-----------------')

print("trying to create dir")
if path.exists(destination):
  print("target dir exists, skip")
else:
  print("target dir non-exists, creating")
  os.mkdir(destination, 0o666)
print(f'-----------------')
print(f'starting')

def copy(source,destination,torrent):
  src=os.path.join(source,torrent.hash+'.torrent')
  if path.exists(src):
    #copy and rename
    dst=os.path.join(destination,torrent.name+'.torrent')
    copyfile(src,dst)
  else:
  # if do not find the torrent. 
    print(f"⚠Can find{torrent.name}")
    print(f"file:{src}")
for torrent in qbt_client.torrents_info():
  if not torrent.save_path in data['dataDir']:
    data['dataDir'].append(torrent.save_path)
  copy(source,destination,torrent)
with open('config.json', 'w') as json_file:
  json.dump(data, json_file)
print("Export finished!")

