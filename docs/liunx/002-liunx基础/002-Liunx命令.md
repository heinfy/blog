---
id: 002
title: Liunx 命令
description: Liunx 命令大全
keywords: [Liunx]
tags:
  - Liunx
hide_title: true
sidebar_position: 2
custom_edit_url: null
---

## 帮助信息

- `command --help` 或者 `man command`

```bash
# man 的操作键：
# 空格键 显示手册页的下一屏
# Enter 键 一次滚动手册页的一行
# b 回滚一屏
# f 前滚一屏
# q 退出
# /word 搜索 word 字符串
```

## 文件目录命令

`ls` 命令(list)说明:

```bash
ls -a # 显示所有文件
ls -d # 显示目录信息，而不是目录下的文件
ls -l # 长格式显示 【权限 引用计数 所有者 所有组 大小 文件修改时间 文件名】
ls -i # 显示文件的i节点号
ls -h # 人性化显示

# 通配符:
# * 代表任意个数个字符
# ? 代表任意一个字符，至少 1 个
# [] 表示可以匹配字符组中的任一一个
# [abc] 匹配 a、b、c 中的任意一个
# [a-f] 匹配从 a 到 f 范围内的的任意一个字符
```

- `cd` - change directory
- `touch` - 创建文件(不存在)或修改文件时间(已经存在)
- `mkdir` - 创建一个新的目录，例子： `mkdir -p a1/b1/c1`，`-p`可以递归创建目录
- `rm` - `rm -rf 文件位置/文件名`

```bash
# -f 强制删除，忽略不存在的文件，无需提示
# -r 递归地删除目录下的内容，删除文件夹 时必须加此参数
```

- `tree` - `tree -d [目录名]` 只显示目录
- `cp` - `cp 源文件 目标文件`

```bash
# cp [选项] 目标文件
# -a 相当于-dpr选项的集合
# -d 如果源文件为软连接（硬链接无效），则复制出的目标文件也是软连接
# -i 询问
# -p 复制后目标保留源文件的属性（包括所有者、所属组、权限和时间）
# -r 递归复制
```

- `mv` - `mv 源文件 目标文件`

```bash
# mv [选项] 源文件 目标文件
-f 强制覆盖
-i 交互移动
-v 显示详细信息
```

- `cat 文件名` - concatenate 查看文件内容、创建文件、文件合并、追加文件内容等功能

```bash
# -b 对非空输出行编号 $ cat -b ~/sql/123.txt
# -n 对输出的所有行编号 $ cat -n ~/sql/123.txt
—A 相当于-vET选项的整合，用于列出所有隐藏符号
-E 列出每行结尾的回车符$
-n 显示行号
-T 把Tab键用^T显示出来
-v 列出特殊字符
```

- `more 文件名` - more 分屏显示文件内容

```bash
# man 的操作键：
# 空格键 显示手册页的下一屏
# Enter 键 一次滚动手册页的一行
# b 回滚一屏
# f 前滚一屏
# q 退出
# /字符串：搜索指定字符串
```

- `stat` —— 查看文件详细的命令
- `less` —— 分行显示命令
- `head` —— 显示文件头
- `tail` —— 显示文件尾

```bash
# tail [选项] 文件名
-n 从文件结尾开始，显示指定行数
-f 监听文件的新增内容
```

- `grep 搜索文本 文件名` - grep 搜索文本文件内容

```bash
# -n 显示匹配行及行号 $ grep -n 文本 ~/sql/123.txt
# -v 显示不包含匹配文本的所有行（相当于求反） $ grep -v 文本 ~/sql/123.txt
# -i 忽略大小写 $ grep -i 文本 ~/sql/123.txt
# ^a 行首，搜寻以 a 开头的行
# ke$ 行尾，搜寻以 ke 结束的行
```

- `echo 和 重定向 > 和 >>`

```bash
# > 表示输出，如果文件不存在，则创建并写入新内容，如果文件存在，会覆盖文件原有的内容
# >> 表示追加，如果文件不存在，则创建并写入追加的新内容，如果文件存在,会将内容追加到已有文件的末尾
ls -alh >> text.txt
```

- `|` — 管道：将一个命令的输出可以通过管道做为 另一个命令的输入，

```bash
# 常用的管道命令有：`more`和`grep`
ls -lh | more
```

## 远程管理常用命令

### 关机/重启操作

```bash
shutdown [选项] 时间 [警告信息]

shutdown # 不指定选项和参数，默认表示 1 分钟之后 关闭电脑
shutdown -c # 取消已执行的 shutdown 命令
shutdown -h # 关机
shutdown -r # 重启

shutdown -r now # 重新启动操作系统，其中 now 表示现在
shutdown now # 立刻关机，其中 now 表示现在
shutdown 20:25 # 系统在今天的 20:25 会关机
shutdown +10 # 系统再过十分钟后自动关机

reboot # 关机
halt # 关机，不建议使用
poweroff
init
```

### 查看或配置网卡信息

```bash
ifconfig #  configure a network interface 查看/配置计算机当前的网卡配置信息
ifconfig | grep inet # 查看网卡对应的 IP 地址
ping ip地址 # ping 检测到目标 ip地址 的连接是否正常
```

### 远程登录和复制文件

```bash
ssh -p port user@ip
scp -P port 源文件 目标路径

# scp -P port -r 本地文件 服务器地址 —— -r表示目录
# 将服务器上data下的测试文件.js 复制到本机桌面
scp root@ip:/data/测试文件.js /User/houfei/Desktop

# 把本地当前目录下的 01.py 文件 复制到 远程 家目录下的 Desktop
scp -P port 01.py user@remote:Desktop/01.py

# 把远程 家目录下的 Desktop/01.py 文件 复制到 本地当前目录下的 01.py
scp -P port user@remote:Desktop/01.py 01.py

# 把当前目录下的 demo 文件夹 复制到 远程 家目录下的 Desktop
scp -r demo user@remote:Desktop

# 把远程 家目录下的 Desktop 复制到 当前目录下的 demo 文件夹
scp -r user@remote:Desktop demo
```

### 免密码登录和配置别名

- 免密码登录

1. 配置公钥：mac 上执行 `ssh-keygen` 生成 SSH 钥匙，一路回车
2. 上传公钥到服务器： `ssh-copy-id -p port user@remote`

- 配置别名

mac 在 `~/.ssh/config` 里面追加以下内容：

```bash
Host 别名名称
  HostName ip地址
  User root
  Port 22

# 登录
ssh 别名名称
```

## 用户权限相关命令

## 系统信息相关命令

```bash
# 时间和日期
data
cal # cal -y

## 磁盘信息
df -h # disk free 显示磁盘剩余空间
du -h [目录名] # disk usage 显示目录下的文件大小

# 进程信息
ps aux # process status 查看进程的详细状况

# a 显示终端上的所有进程，包括其他用户的进程
# u 显示进程的详细状态
# x 显示没有控制终端的进程

top # 动态显示运行中的进程并且排序，要退出 top 可以直接输入 q

kill [-9] 进程代号 # 终止指定代号的进程，-9 表示强行终止
# 使用 kill 命令时，最好只终止由当前用户开启的进程，而不要终止 root 身份开启的进程，否则可能导致系统崩溃
```

## 其他命令

- `find` 命令

通常用来在特定的目录下搜索符合条件的文件

```bash
find [路径] -name "*.py" # 查找指定路径下扩展名是 .py 的文件，包括子目录
# 如果省略路径，表示在当前文件夹下查找
# 之前学习的通配符，在使用 find 命令时同时可用
```

- 软链接 - 类似于 Windows 下的快捷方式

`ln -s 被链接的源文件(绝对路径|位置路径) 链接文件(给快捷方式取个名字)`

- 硬链接 - 类似于 Windows 下的 copy

`ln 被链接的源文件(绝对路径|位置路径) 链接文件(给快捷方式取个名字)`

## 打包压缩

### zip 和 tar

```bash
# zip 和 unzip 命令
zip [选项] 压缩包.zip 源文件1 源文件2 源文件3
-r 压缩目录
unzip [选项] 压缩包名
-d 指定解压缩位置 # unzip -d /tmp/abc/ 压缩包名
```

`tar [选项] [-f 压缩包名.tar] 源文件或目录`，tar 只负责打包文件，但不压缩

```bash
# 打包文件：
tar -cvf 打包文件.tar 被打包文件1/路径 被打包文件2/路径 ...
tar -cvf newfile.tar oldfile

# 解包文件
tar -xvf 打包文件.tar
tar -xvf  newfile.tar

# -c 生成档案文件，创建打包文件
# -x 解开档案文件
# -v 列出归档解档的详细过程，显示进度
# -f 指定档案文件名称，f 后面一定是 .tar 文件，所以必须放选项最后
```

### tar 和 bzip2

**bzip2 命令不能压缩目录，**用 `bzip2` 压缩 `tar` 打包后的文件，其扩展名一般用 `.tar.bz2`

```bash
bzip2 [选项] 源文件
# -d 解压缩
# -k 解压缩或压缩时，保留源文件
# -v 显示压缩的详细信息

# 压缩文件
# tar -j 压缩和解压缩 '.tar.bz2'
tar -jcvf 打包文件.tar.bz2 被压缩的文件／路径...

# 解压缩文件
tar -jxvf 打包文件.tar.bz2
```

### tar 和 gzip

gzip 压缩 tar 打包后的文件，其扩展名一般用 `.tar.gz`

```bash
# -z 压缩和解压缩 '.tar.gz'
# -C 解压缩到指定目录，注意：要解压缩的目录必须存在

# 压缩文件
tar -zcvf 打包文件.tar.gz 被压缩的文件／路径...

# 解压缩文件
tar -zxvf 打包文件.tar.gz

# 解压缩到指定路径
tar -zxvf 打包文件.tar.gz -C 目标路径
```

## 包安装和卸载

### 二进制包 rpm 包

```bash
rpm -ivh 包全名 # 安装二进制包
rpm -Uvh 包全名 # 升级
rpm -e 包全名 # 卸载
rpm -q 包名 # 查询安装的包
rpm -qi 包名 # 查询安装的包信息
rpm -ql 包名 # 查询安装的包位置
rpm -V 包名 # 验证安装

yum -y install 包名 # -y => yes
yum -y update 包名 # -y => yes
yum remove 包名 # 卸载
yum grouplist # 查看可以安装的软件组
yum groupinfo # 查看软件组内包含的软件
yum groupinstall # 安装软件组
```

### apt 安装／卸载

```bash
# 1. 安装软件
sudo apt install 软件包

# 2. 卸载软件
sudo apt remove 软件名

# 3. 更新已安装的包
sudo apt upgrade

# 一个小火车提示
sudo apt install sl

# 一个比较漂亮的查看当前进程排名的软件
sudo apt install htop
```
