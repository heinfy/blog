---
id: 001
title: nginx
description: nginx
keywords: [Liunx]
tags:
  - Liunx
hide_title: true
sidebar_position: 901
custom_edit_url: null
---

## 基本概念

- Nginx 是什么，做什么事

Nginx (engine x) 是一个高性能的 HTTP 和反向代理 web 服务器，同时也提供了 IMAP/POP3/SMTP 服务。

Nginx 专门为性能优化而开发，性能是其最重要的考量，实际上非常注重效率，能经受高负载的考验，有报告表明
能支持高达 50000 个并发连接数。

- 反向代理

正向代理：在客户端配置代理服务器，通过代理服务器进行互联网访问。如果把局域网外的 Internet 想象成一个
巨大的资源库，则局域网中的客户端要访问 Internet，则需要通过代理服务器来访问，这种代理服务就称为正向
代理。

反向代理，其实客户端对代理是无感知的，因为因为客户端不需要任何配置就可以访问，我们只需要将请求发送到
反向代理服务器，由反向代理服务器去选择目标服务器，获取数据后再返回给客户端。此时反向代理服务器和目标
服务器对外就是一个服务器，暴露的是代理服务器地址，隐藏了真实的服务器 IP 地址。

- 负载均衡

单个服务器解决不了了，我们增加服务器的数量，然后将请求分发到各个服务器上，将原来请求集中到单个服务器
上的情况改为将请求分发到多个服务器上，将负载分发到不同的服务器，也就是我们所说的负载均衡

- 动静分离

为了加快网站的解析速度，可以把动态网页和静态页面由不同的服务器来解析，加快解析速度，降低原来单个服务
器的压力

## nginx 安装、常用命令和配置文件

### nginx 常用命令

- 启动 nginx

```bash
cd /usr/local/nginx/sbin # 切换目录到/usr/local/nginx/sbin下面
./nginx # 启动 nginx
ps -ef | grep nginx # 查看nginx服务是否启动成功
```

- 查看开放的端口

```bash
firewall-cmd --list-all
```

- 设置开放的端口

```bash
firewall-cmd --add-service=http -permanent
sudo firewall-cmd --add-port=80/tcp --permanent # 添加 80 端口
firewall-cmd --reload # 重启防火墙
```

```bash
# 使用 nginx 操作命令，必须先进入 nginx 目录中
# /usr/local/nginx/sbin

# 查看 nginx 版本号
./nginx -v

# 启动 nginx
./nginx

# 停止 nginx
./nginx -s stop

# 重新加载 nginx
./nginx -s reload
```

### nginx 配置文件

#### 配置文件路径

`/usr/local/nginx/nginx.conf`

#### nginx 配置文件组成

nginx 配置文件由 3 部分组成

- 第一部分 全局块： 从配置文件开始到 events 块之间的内容，主要会设置一些影响，NginX 服务器整体运行的
  配置指令，主要包括配置运行 NginX 服务器的用户(组)、允许生成的 worker process 数进程，PID 存放路径
  、日志存放路径和类型以及配置文件的引入等。

```bash
# 比如上面第一行配置的：
worker_processes  1; #  工作进程：数目。根据硬件调整，通常等于cpu数量或者2倍cpu数量。
# 这是 NginX 服务器并发处理服务的关键配置。worker_processes 值越大，可以支持的并发处理量也越多，但是会受到硬件、软件等设备的制约
```

- 第二部分 event 块：涉及的指令主要影响 NginX 服务器与用户的网络连接。常用的设置包括，是否开启对多
  worker process 下的网络连接进行序列化，是否允许同时接收多个网络连接，选取哪种事件驱动模型来处理连
  接请求，每个 word process 可以同时支持的最大连接数等。

```bash
events {
    worker_connections  1024; # 工作进程的最大连接数量
}
```

- 第三部分 http 块： 这部分是 nginx 服务器配置最频繁的部分，代理、缓存和日志定义等绝大多数功能和第三
  方模块的配置都在这里。

需要注意的是： http 块也可以包括 http 全局块、 server 块。

1. http 全局块: http 全局块配置的指令包括文件引入、MIME-TYPE 定义、日志自定义、连接超时时间、单链接
   请求数上限等。
2. 这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是
   为了节省互联网服务器硬件成本。每个 HTTP 块可以包括多个 server 块，而每个 server 块相当于一个虚拟
   主机. 而每个 server 块也分为全局 server 块，以及可以同时包含多个 location 块。

**全局 server 块：**

最常见的配置是本虚拟主机的监听配置和本虚拟主机的名称或 IP 配置。

**location 块:**

一个 server 块可以配置多个 location 块。

这块的主要作用是基于 NginX 服务器接收到的请求字符串（例如：server_name、/uri-string），对虚拟主机名
称（也可以是 IP 别名）之外的字符串（例如前面的：/uri-string）进行匹配，对特定的请求进行处理，地址定
向、数据缓存和应答控制等功能，还有许多第三方模块的配置也在这里进行。

```bash
http {
    include       mime.types; #指定mime类型，由mime.type来定义
    default_type  application/octet-stream;

    # 日志格式设置
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main; #用log_format指令设置日志格式后，需要用access_log来指定日志文件存放路径

    sendfile        on; #指定nginx是否调用sendfile函数来输出文件，对于普通应用，必须设置on。 如果用来进行下载等应用磁盘io重负载应用，可设着off，以平衡磁盘与网络io处理速度，降低系统uptime。
    #tcp_nopush     on; #此选项允许或禁止使用socket的TCP_CORK的选项，此选项仅在sendfile的时候使用

    #keepalive_timeout  0;  #keepalive超时时间
    keepalive_timeout  65;

    #gzip  on; #开启gzip压缩服务

    #虚拟主机
    server {
        listen       80;  #配置监听端口号
        server_name  localhost; #配置访问域名，域名可以有多个，用空格隔开

        #charset koi8-r; #字符集设置

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }
        #错误跳转页
        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ { #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
        #    root           html; #根目录
        #    fastcgi_pass   127.0.0.1:9000; #请求转向定义的服务器列表
        #    fastcgi_index  index.php; # 如果请求的Fastcgi_index URI是以 / 结束的, 该指令设置的文件会被附加到URI的后面并保存在变量$fastcig_script_name中
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;  #监听端口
    #    server_name  localhost; #域名

    #    ssl_certificate      cert.pem; #证书位置
    #    ssl_certificate_key  cert.key; #私钥位置

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5; #密码加密方式
    #    ssl_prefer_server_ciphers  on; # ssl_prefer_server_ciphers  on; #


    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

## nginx 配置实例 1-反向代理

### 配置实例 1

1. 实现效果： 在浏览器实现页面
2. 准备工作：在 liunx 系统启动 express 服务器
3. 反向代理

```bash
server {
    listen       80;  # 配置监听端口号
    server_name  www.123.com 192.168.17.129; # 配置访问域名，域名可以有多个，用空格隔开
    location / {
        root   html;
        proxy_pass: http://127.0.0.1:8080;
        index  index.html index.htm;
    }
}
```

### 配置实例 2

实现效果：使用 nginx 反向代理，根据访问的路径跳转到不通风的端口服务中 nginx 监听端口为 9001；

访问 `http://127.0.0.1:9001/edu` 直接跳转到 `http://127.0.0.1:8080` 访问 `http://127.0.0.1:9001/vod`
直接跳转到 `http://127.0.0.1:8081`

1. 准备工作： 准备 2 个服务器
2. 创建 edu 和 vod 文件夹和对应的页面
3. 反向代理
4. 开放端口

```bash
server {
    listen       9001;  # 配置监听端口号
    server_name  192.168.17.129; # 配置访问域名，域名可以有多个，用空格隔开
    location ~ /edu/ {
        proxy_pass: http://127.0.0.1:8080;
        index  index.html index.htm;
    }
    location ~ /vod/ {
        proxy_pass: http://127.0.0.1:8081;
        index  index.html index.htm;
    }
}
```

- `=`:用于不含正则表达式的 uri 前，要求请求字符串与 uri 严格匹配，如果匹配成功，就停止继续向下搜索并
  立即处理请求。
- `~`：用于表示 uri 包含正则表达式，并且区分大小写。
- `~*`：用于表示 uri 包含正则表达式，并且不区分大小写。
- `^~`：用于不含正则表达式的 uri 前，要求 nginx 服务器找到标识 uri 和请求字符串匹配度最高的 location
  后，立即使用此 location 处理请求，而不再使用 location 块中的正则 uri 和请求字符串做匹配。

注意：**如果 uri 包含正则表达式，则必须要有 `~` 或者 `~*` 表示**

## nginx 配置实例 2-负载均衡

## nginx 配置实例 3-动静分离

## nginx 配置高可用集群

## nginx 执行原理
