---
id: 001
title: Liunx 基础
description: Liunx 基础
keywords: [Liunx]
tags:
  - Liunx
hide_title: true
sidebar_position: 1
custom_edit_url: null
---

## 基本格式

```bash
[root@VM-0-10-centos /]#
# `[]`——提示符的分隔符号，没有特殊含义
# `root`——显示的是当前的登录用户
# `@`——分隔符，没有特殊含义
# `VM-0-10-centos`——当前系统的简写主机名
# `~`——代表用户当前所在的目录，此例中用户当前所在的目录是家目录
# `#`——命令提示符，超级用户是#，普通用户是$
```

## 目录结构

```bash
/bin/ # 系统命令目录，是 /usr/bin 目录的软链接，普通用户和超级用户都可以执行
/boot/ # 系统启动目录，保存于系统相关联的文件
/dev/ # 配置文件保存位置
/home/ # 普通用户的家目录
/lib/ /lib64/    # 函数库保存的位置
/misc/ /mnt/ /media/    # 挂载目录
/opt/    # 第三方安装的软件保存目录
/proc/    # 虚拟文件系统
/root/    # 宿主目录
/srv/    # 服务数据目录
/tmo/    # 临时目录
/usr/    # 系统软件资源目录 UNIX Software Resource
/usr/local/ # 源码软件包目录
/var/ # 动态数据保存目录。主要保存缓存、日志以及软件运行所产生的文件
```

## 权限命令

```bash
# ls -l
# drwxr-xr-x.  2 root root 4096 10月 21 15:09 bin
第一位d: 文件类型 -表示普通文件 d表示文件夹 l表示软连接
2-4位rwx：所有者权限，表示 read write execute
5-7位r-x：所有组权限，表示 read write execute
8-10位r-x：other权限，表示 read write execute
11位.: 表示美国一个机构认证
```
