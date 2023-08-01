## Fuck API
使用 Node.JS 编写，`server.js` 是主要文件，使用 node 可直接运行，默认监听端口`9930`  

`bot.py` 可管理封禁列表，第一次使用请修改里面的 `BOT_TOKEN` 和 `ADMIN_USER_IDS`，另外管理员列表在 bot 文件里面写的是永久有效的，如果在 bot 运行时使用 `/promote` 添加的管理重启后会失效，封禁列表保存在 `ban.txt`，每行一个，可以为空，但不能没有

使用 Bot 前请先使用  
```Shell
pip install python-telegram-bot==13.7.0
```
安装依赖  

`max.txt` 和 `min.txt` 是祖安语录，每一行一个，目前暂时不支持自由增减  

`403.html` 可以自定义 API 在返回 403 时的内容，可以为空，但不能没有
