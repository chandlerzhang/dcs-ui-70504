# mocha 参数

```
--require babel-register
```
## 打包时报错 Error: Chunk.entry was removed. Use hasRuntime() , 执行如下命令
> npm uninstall extract-text-webpack-plugin 
> npm install extract-text-webpack-plugin@2.0.0-beta.4

如果还是不行，进入node_modules/webpack 目录执行如下命令
> npm install extract-text-webpack-plugin@2.0.0-beta.4 -save-dev
