好的，在 Mac 上配置 Git 非常简单，只需几个步骤即可完成。这里为您提供一份从安装到基础配置的完整指南。

### 安装 Git

macOS 通常预装了 Git，但版本可能较旧。首先检查是否已安装以及版本号：

1.  打开 **终端**（Terminal）应用程序（你可以在“应用程序” -> “实用工具”中找到它）。
2.  输入以下命令并按回车：
    ```bash
    git --version
    ```
    *   **如果显示了版本号**（如 `git version 2.39.2 (Apple Git-143)`），说明已安装，你可以直接跳到 **[配置 Git](#配置-git)** 部分。
    *   **如果提示 `command not found`**，说明你需要安装 Git。

#### 推荐安装方法：使用 Homebrew

[Homebrew](https://brew.sh/) 是 macOS 上最流行的包管理器，可以非常方便地安装和管理软件。

1.  **安装 Homebrew**（如果你还没有安装）：
    在终端中粘贴并运行以下命令：
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
    按照屏幕上的提示完成安装。

2.  **使用 Homebrew 安装 Git**：
    安装好 Homebrew 后，在终端运行：
    ```bash
    brew install git
    ```

#### 其他安装方法

*   **官方安装程序**：从 Git 官网下载 macOS 安装程序并直接安装。
    *   访问：[https://git-scm.com/download/mac](https://git-scm.com/download/mac)
*   **Xcode Command Line Tools**：安装 Xcode 或单独安装其命令行工具也会包含 Git。
    *   在终端中运行 `xcode-select --install`，然后点击“安装”即可。

安装完成后，再次运行 `git --version` 确认安装成功且版本较新。

---

### 配置 Git

安装好 Git 后，最重要的一步是配置你的用户信息，这样你每次提交代码时，Git 才知道是谁提交的。

1.  在终端中，设置你的**用户名**（通常使用你的英文名或 GitHub 用户名）：
    ```bash
    git config --global user.name "Your Name"
    ```
    （将 `"Your Name"` 替换为你的名字，例如 `"Zhang San"`）

2.  设置你的**邮箱地址**（**必须**使用你在 GitHub/GitLab 等代码托管平台上注册的邮箱）：
    ```bash
    git config --global user.email "your.email@example.com"
    ```
    （将 `"your.email@example.com"` 替换为你的邮箱）

3.  （可选，但推荐）设置默认的文本编辑器。
    *   如果你喜欢用 VS Code：
        ```bash
        git config --global core.editor "code --wait"
        ```
    *   如果你喜欢用 macOS 自带的 Nano：
        ```bash
        git config --global core.editor "nano"
        ```

4.  （可选，但推荐）让 Git 输出带颜色，方便阅读：
    ```bash
    git config --global color.ui auto
    ```

#### 检查你的配置

要查看你所有的 Git 配置项，可以使用命令：
```bash
git config --list
```

你应该能看到刚才设置的 `user.name` 和 `user.email`。

---

### 生成 SSH 密钥

为了安全地与远程仓库（如 GitHub）通信，你需要配置 SSH 密钥，避免每次推送代码都输入密码。

1.  **生成新的 SSH 密钥**：
    在终端中运行以下命令（替换为你的邮箱）：
    ```bash
    ssh-keygen -t ed25519 -C "your.email@example.com"
    ```
    *   提示你“Enter file in which to save the key”时，直接按回车使用默认路径（`~/.ssh/id_ed25519`）。
    *   提示你“Enter passphrase”时，可以设置一个密码来增加安全性，也可以直接按回车留空。

2.  **将 SSH 密钥添加到 ssh-agent**：
    ```bash
    # 启动 ssh-agent
    eval "$(ssh-agent -s)"
    # 将你的 SSH 私钥添加到 ssh-agent
    ssh-add ~/.ssh/id_ed25519
    ```

3.  **将公钥添加到你的 GitHub/GitLab 账户**：
    *   **复制公钥内容**：
        ```bash
        cat ~/.ssh/id_ed25519.pub
        ```
        终端会显示一长串以 `ssh-ed25519` 开头、你的邮箱结尾的内容，全部选中并复制。
    *   **添加到 GitHub**：
        1.  登录 GitHub，点击右上角头像 -> **Settings**。
        2.  在左侧边栏中点击 **SSH and GPG keys**。
        3.  点击 **New SSH key**。
        4.  在 "Title" 中起个名字（如 `My MacBook Air`），然后将刚才复制的内容粘贴到 "Key" 框中。
        5.  点击 **Add SSH key**。

4.  **测试连接**：
    在终端运行：
    ```bash
    ssh -T git@github.com
    ```
    如果看到类似 `Hi username! You've successfully authenticated...` 的欢迎信息，说明配置成功！

---

## 代码提交规范

- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 代码重构（既不是修复bug也不是添加新功能的代码更改）
- perf: 性能优化
- test: 添加测试或更新测试
- build: 构建系统或外部依赖项的更改（如webpack，npm）
- ci: 持续集成相关的变动
- chore: 其他不修改 src 或测试文件的更改
- revert: 回滚某次提交

## Git 命令

1. 基础命令

```bash
git add . // 将文件添加到缓存区
git status  // 查看状态
git commit -m "注释内容"  //  将暂存区文件提交至版本库
git log // 查看近期提交状态
git branch // 查看分支
git branch dev // 新建 dev 分支
git checkout dev // 切换到 dev 分支
git push -u origin 分支名称 // 第一次提交分支（推送到云端origin仓库中） 注意：必须切换到此子分支下才能提交！！！-u就表示第一次， 
git merge 分支名称 // 必须先切换到主分支，然后在合并分支

# 如果不下心在master分支上写了代码
# 直接git checkout -b test 就能将修改的文件分配到 test 分支上，然后在 git add 等操作
```

2. Git 日志

```bash
git log // 查看历史记录
git log -p // 查看详细历史
git log --stat // 查看简要统计

git show // 查看当前的 commit 的改动内容
git show comiitID // 查看某个具体的 commit 的改动内容
git show comiitID a\b.txt // 看指定 commit 中的指定文件

git diff // 比对工作目录和暂存区
git diff --staged // 比对暂存区和上一条提交
git diff HEAD // 比对工作目录和上一条提交
git reflog // 查看记录的每一条指令
```

3. Git 克隆分支

```bash
# 切换到 dev 分支
git checkout dev

# 创建并立即切换到dev子分支
git checkout -b dev

# 查看所有本地仓库分支和远程分支
git branch -al 

# 检出远程的demo分支到本地
git checkout -b 本地demo分支 origin/远端demo分支

# clone 远端某分支
git clone -b yourBranch https:.../branch
```

4. Git 推送分支

```bash
# 提交本地分支到远程分支
git push origin 本地分支:远程分支 

# 推送本地的空分支(冒号前面的分支)到远程origin的demo(冒号后面的分支)(没有会自动创建)
git push origin demo:demo
```

5. Git 删除分支

```bash
# 删除本地的bug分支
git branch -d bug

# 删除远程分支demo
git push origin --delete demo
```

6. 同步本地和远端的分支

```bash
# 查看本地分支和追踪情况
git remote show origin

# 同步删除分支
git remote prune origin
```

7. Git 强制覆盖

```bash
git fetch --all
git reset --hard origin/master
git pull
```

8. 变基

rebase——把你指定的 commit 以及它所在的 commit 串，以指定的目标 commit 为基础，依次重新提交一次。

```bash
git checkout branch1
git rebase master
```

另外，在 rebase 之后，记得切回 master 再 merge 一下，把 master 移到最新的 commit :

```bash
git checkout master
git merge branch1
git rebase --help // 查看帮助
```

9. 多次 commit 未 push

```bash
git add a.txt // 更新一个文件内容
git commit // commit 到暂存区，没有push
// 重新编辑 a.txt
git add a.txt // 更新一个文件内容
git commit --amend // 该命令并不会再生成一个commit，而是在之前的commit修改
```

amend 就是重新修改 commit

### 删除提交错误的push

错误提交到了版本库，此时无论工作区、暂存区，还是版本库，这三者的内容都是一样的，这个时候，我们必须撤销版本库的修改才能解决问题！

git reset有三个选项: `--hard、--mixed、--soft`

```bash
// 仅仅只是撤销已提交的版本库，不会修改暂存区和工作区
git reset --soft 版本库ID
//仅仅只是撤销已提交的版本库和暂存区，不会修改工作区
git reset --mixed 版本库ID
//彻底将工作区、暂存区和版本库记录恢复到指定的版本库
git reset --hard 版本库ID

// 具体步骤
git log // 查看log日志，复制撤销的commitID
git reset --hard commitID // 强制撤销， soft hard mixed 视情况而定
git push origin HEAD --force // 推送到远端
```

10. 撤销错误添加到暂存区里的文件

```bash
# 撤销错误添加到暂存区里的文件 命令行 : 
git rm --cache 文件名

# 上面代码仅仅删除暂存区的文件而已，不会影响工作区的文件 

# 删除暂存区和工作区的文件 命令行：
git rm -f 文件名
```

出错的内容在你自己的 branch，修改已经push了的commit信息注释

+ step1：使用【git commit --amend】命令，会进入到vim编辑器。
+ step2：输入【i】，即进入编辑模式，此时编辑提交信息。
+ step3：编辑好之后，按键【Esc】，输入【:wq】，即保存和退出。
+ step4：输入【git push -f】强制提交。
+ 操作完之后，再看提交记录，即可看到修改的注释信息。

出错的内容已经合并到 master，恢复一个版本 `git revert HEAD^`

上面这行代码就会增加一条新的 commit ，它的内容和倒数第二个 commit 是相反的，从而和倒数第二个 commit 相互抵消，达到撤销的效果。

```bash
git revert HEAD //撤销最近一次提交
git revert HEAD~1 //撤销上上次的提交，注意：数字从0开始
git revert 0ffaacc //撤销0ffaacc这次提交
```

11. git追踪文件夹/文件名称更新

```bash
git mv -f oldfolder newfolder
git add -u newfolder # (-u选项会更新已经追踪的文件和文件夹)
git commit -m "changed the foldername whaddup"
git push origin yourBranch
```
