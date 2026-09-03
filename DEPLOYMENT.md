# 康护园网站部署说明

本项目是作品集用的康复师管理后台概念原型。所有人物与机构均为化名，不应录入真实患者信息，也不构成医疗建议。

## 方案一：腾讯云静态网站托管

使用交付目录中的 `康护园-腾讯云静态网站上传包.zip`。

1. 在腾讯云对象存储 COS 或支持静态网站的产品中创建存储桶/站点。
2. 解压压缩包，将压缩包内的全部文件上传到站点根目录；不要把外层文件夹一起上传。
3. 将默认首页设置为 `index.html`。
4. 将错误页面或 404 回退页面设置为 `404.html`；如果平台允许把错误文档直接指向 `index.html`，也可以使用 `index.html`。
5. 开启 HTTPS 后，通过腾讯云提供的临时域名或绑定的自定义域名访问。

上传包是已经构建完成的静态文件，不需要在腾讯云服务器上安装 Node.js。

## 方案二：GitHub Pages

使用 `康护园-GitHub完整源码包.zip`，解压后将里面的文件上传到一个新的 GitHub 仓库。

1. 在 GitHub 创建空仓库，建议仓库名使用英文，例如 `kanghuyuan-therapist-demo`。
2. 上传解压后的全部源码并提交到 `main` 或 `master` 分支。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 中将 Source 设为 **GitHub Actions**。
5. 打开仓库的 **Actions** 页面，等待 `Deploy GitHub Pages` 工作流完成。
6. 部署完成后，Pages 页面会显示公开网址。

项目已经自动处理仓库子目录、MSW 数据 Worker 和二级页面刷新问题。以后每次向 `main` 或 `master` 分支提交代码，网站都会自动重新部署。

## 本地运行源码

需要 Node.js 24 和 pnpm 11。

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
```

构建结果位于 `dist` 目录。
