## babel-plugin-style-bind

> 自动导入使用`css module`时一些模板代码。

## 插件配置选项

### options.varName: string

> 配置在页面中使用的变量名称，默认为`cx`

### options.includes: Array<string>

> 在哪些文件中自动导入模板代码，支持通配符模式。默认为`$CWD/src/pages/**/*.{jsx,tsx}`。 `$CWD`，代表当前的工作目录。但是我们的项目都是使用 umi 进行开发的，umi 通过`APP_ROOT`来指定编译时的工作目录，为了和 umi 解绑，一般需要手动修改你的`includes`选项。

### options.extensions

> 使用的 css 预处理器扩展名，默认为`[.less]`。目前只支持 less 预处理器。

Note:

> 目前的约定，只会配置`includes`选项中同名的样式文件，也是为了遵循统一约定处理。 egg 项目中的代码组织方式就是**约定大于配置**

### 一般在 umi 中配置如下：

```js
//config.js
import path from 'path'

export default {
  extraBabelPlugins: [
    [
      path.join(webRoot, 'plugins', 'babel-plugin-style-bind'),
      {
        includes: [
          path.join(webRoot, 'pages', '**', '*.{jsx,tsx}'),
          path.join(webRoot, 'components', '**', '*.{jsx,tsx}'),
        ],
      },
    ],
  ],
}
```
