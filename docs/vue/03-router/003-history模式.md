---
id: history
title: history
keywords: [Vue]
tags:
  - Vue
hide_title: true
sidebar_position: 3
description: history
custom_edit_url: null
---

Vue Router 默认的路由模式是 hash 模式，在这种模式下，路由的改变不会导致向后端发送请求。但是如果你使用的是 history 模式，即使用 `mode: 'history'` 配置，那么在浏览器不支持 HTML5 History API 的情况下，Vue Router 会向后端发送请求。

这是因为 history 模式使用了 HTML5 History API 中的 `history.pushState()` 和 `history.replaceState()` 方法来管理路由，它允许我们使用像 `/user/id` 这样的 URL 路径，而不需要像 hash 模式那样带有 `#` 符号。但是在不支持 HTML5 History API 的浏览器中，页面跳转会触发向后端发送请求，而后端并没有相应的路由处理，这样就会导致 404 错误或者其他问题。

要解决这个问题，有以下几种方法：

1. **配置后端路由：** 最简单的方法是在后端配置一个通配符路由，将所有页面请求都重定向到你的前端页面。这样可以确保所有页面请求都会返回前端页面，并且不会出现 404 错误。
2. **使用服务端渲染 (SSR)：** 使用服务端渲染可以解决这个问题，因为在服务端渲染的情况下，所有的路由都会在服务端进行处理，前端只负责显示已经渲染好的页面。这样就不会出现向后端发送请求的问题。
3. **配置 Nginx 服务器：** 如果你使用 Nginx 作为你的前端服务器，你可以通过配置 Nginx 服务器来解决这个问题。具体的方法是配置 Nginx 服务器将所有页面请求都重定向到你的前端页面。
4. **使用 `window.onerror` 处理错误：** 在客户端代码中可以通过 `window.onerror` 来捕获到所有的 JavaScript 错误，你可以在这里处理路由不存在的情况，例如跳转到 404 页面或者其他处理方式。

### 配置 Nginx 服务器

要在 Nginx 中配置路由重定向，以解决使用 Vue Router history 模式导致的页面请求问题，你可以按照以下步骤进行配置：

1. **安装 Nginx：** 如果你还没有安装 Nginx，首先需要安装 Nginx。具体的安装方法取决于你所使用的操作系统。你可以参考官方文档或者网上的教程来完成安装。
2. **编辑 Nginx 配置文件：** 打开 Nginx 的配置文件，在 Ubuntu 中一般是 `/etc/nginx/nginx.conf` 或者 `/etc/nginx/sites-available/default`，在 CentOS 中一般是 `/etc/nginx/nginx.conf`。编辑这个文件，找到 `server` 配置块。
3. **配置路由重定向：** 在 `server` 配置块中，添加一个 `location` 配置块，用于处理所有页面请求的重定向。示例如下：

```bash
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

```

在上面的配置中，`location /` 表示匹配所有的页面请求。`try_files` 指令会尝试根据 URI 请求文件，如果文件不存在，则将请求重定向到 `/index.html`，这样就能够确保所有的页面请求都会返回前端页面。

1. **重新加载 Nginx：** 修改完 Nginx 配置文件后，保存并关闭文件，然后重新加载 Nginx 配置，使修改生效。在 Ubuntu 中，可以使用以下命令重新加载 Nginx：

```bash
sudo systemctl reload nginx
```

在 CentOS 中，可以使用以下命令重新加载 Nginx：

```bash
sudo systemctl restart nginx
```

完成以上步骤后，Nginx 就会按照你的配置将所有页面请求重定向到前端页面，从而解决了使用 Vue Router history 模式导致的页面请求问题。
