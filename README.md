# Electron-React-template

#### How to use

``` bash
npm install or yarn install

npm run dev or yarn dev

# 启动之后，会在9080端口监听
# 需要重新运行一次此命令
npm run dev

# build命令在不同系统环境中，需要的的不一样，需要自己根据自身环境进行配置
npm run build

# 如若实在不行无法安装electron依赖，请使用
npm config edit
# 该命令会打开npm的配置文件，请在registry=https://registry.npm.taobao.org/这行代码后的下一行添加
# electron_mirror=https://cdn.npm.taobao.org/dist/electron/  和  ELECTRON_BUILDER_BINARIES_MIRROR=http://npm.taobao.org/mirrors/electron-builder-binaries/
# 然后关闭该窗口，重启命令行，删除node_modules文件夹，并重新安装依赖即可

```
---
