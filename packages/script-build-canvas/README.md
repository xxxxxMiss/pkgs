## script-build-canvas

> 初衷： `node-canvas`这个包，下载比较慢，编译更慢。但是运维那边现在每次都从新下载，重新编译。这个包的目的就是提前下载并编译好`node-canvas`，后面就不用每次重新下载编译。

## usage

> 可以作为项目依赖，也可以全局安装。这里只说全局安装，配置运维 jekins 打包

## install

```bash
$ yarn global add script-build-canvas
# or
$ npm i -g script-build-canvas
```

## 查看`build-canvas`帮助

```bash
$ build-canvas --help
```

### 支持的选项

- `-p, --clone-path`

  > 克隆`node-canvas`这个仓库到那个目录下，默认克隆到当前的用户目录下。

- `-v,--alinode-version`

  > 指定`alinode`版本号。当你使用`alinode`监控平台的时候，这个选项很有用。

- `-s, --skip-alinode`

  > 默认是使用`alinode`的，可以通过这个选项，来跳过安装`alinode`。

- `-o, --open`
  > 打开`alinode`和`nodejs`的版本匹配页面。
