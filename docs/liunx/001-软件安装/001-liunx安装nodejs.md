---
id: nodejs
title: 安装 nodejs
description: 安装 nodejs
keywords: [Liunx]
tags:
  - Liunx
hide_title: true
sidebar_position: 1
custom_edit_url: null
---

```bash
yum install -y wget # 下载wget

cd /usr/local/

wget https://nodejs.org/dist/v18.16.1/node-v18.16.1-linux-x64.tar.xz # 下载压缩包

xz -d node-v18.16.1-linux-x64.tar.xz # 解压

tar -xf node-v18.16.1-linux-x64.tar # 解压

# 改文件名
mv node-v18.16.1-linux-x64 nodejs

# 部署bin文件 注意路径
ln -s /usr/local/node/bin/node /usr/local/bin/node
ln -sf /usr/local/node/bin/npm /usr/local/bin/npm
ln -sf /usr/local/node/bin/npm /usr/local/bin/npx

# 查看 node 是否安装成功
node -v
```
