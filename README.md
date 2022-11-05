## 基于 Vue3打造前台+中台通用提效解决方案

[项目预览](http://121.5.230.70:8080/front)

### 1、项目架构

本项目使用`vite` + `vue3`来实现前中台解决方案

### 2、为什么使用`vite` ？

因为，之前的项目一直都是使用`webpack`作为构建工具；`vite`出来这么久了，也没有用过；所以想在当前项目下进行使用；

#### 2.1、为什么vite比webpack块？

**webpack**

```
假设我们的项目中有A、B两个页面。
其中A页面是项目首页，里面的代码一切正常。
B页面是一个需要经这跳转才会进入的页面，里面存在一些错误。比如︰我导入一个不存在的文件a.js 然后打印a
当我们去构建这个项目时，明明我们从来都没有进入过B页面，但是此时
webpack依然会给我们抛出一个对应的错误 `Can't resolve './a.js' in xxX`
```

> `webpack`在开发时构建时，默认会去抓取并构建你的整个应用，然后才能提供服务，这就导致你的项目中，存在的任何一个错误（哪怕这个错误是在用户从来都没有进入过的页面中出现的)，它依然会影响到你的整个项目构建。
> 也正是因为这个原因，当你的项目越大时，构建的时间就会越长，你的项目启动速度也就会越慢。

**vite**

```
同样的`Can't resolve './a.js' in xx` 错误，在我们没有进入到B页面的时候，它是不会出现的，只有当我们进入了B页面，才会突然出现这样的一个错误;
```

> 而之所以会这样的原因就是因为: vite 不会在一开始就构建你的整个项目，而是会将应用中的模块区分为依赖和源码（项目代码)两部分，对于源码部分，它会根据路由来拆分代码模块，只会去构建一开始就必须要构建的内容。
> 同时 vite以原生 ESM 的方式为浏览器提供源码，让浏览器接管了打包的部分工作。
> 因为这样的一个机制，无论你的项目有多大，它只会构建一开始必须要构建的内容，这就让 vite在构建时的速度大大提升了。
> 这也是vite为什么会快的一个核心原因。



#### 2.2、`vite`这么快会有什么问题吗？

如果大家对`ESM`的构建机制有了解的话，那么应该可以发现一个问题。
那就是**`vite`既然以原生`ESM`的方式为浏览器提供源码，让浏览器接管了打包的部分工作**，那么假如我们的项目中存在 `cormmonJS`的内容怎么办?是不是就意味着无法解析呢?
是的!
在 `vite` 的早期版本中，确实存在这个问题，这个问题导致的最核心的麻烦就是很多的依赖无法使用。
比如`axios` 因为 `axios` 中使用了很多的 `commonJS`规范，这就让 `vite` 无法解析对应的内容(对应的 `ieeue`),从而会抛出一个错误，关于这个问题曾经也在`vite`的`issues`中进行过激烈的讨论。

#### 2.3、上面这个问题，官方是如何解决的呢？

因为这个问题非常的严重，所以针对于这个问题, `vite`在后期提供了依赖预构建的功能，其中一个非常重要的目的就是为了解决
`CommonJS`和`UMD`兼容性问题。目前 `vite` 会先将`CommonJS`或 `UMD`发布的依赖项转换为`ESM`之后，再重新进行编译。这也可以理解为速度对业务的一个妥协。

### 3、初始化项目

* 1、全局安装`vite` 版本2.8.5

  ```powershell
  $ npm install -g vite@2.8.5
  ```

* 2、使用`vite`创建项目

  ```powershell
  $ npm init vite@latest
  # npx: installed 6 in 2.285s
  # √ Project name: ... front
  # √ Select a framework: » vue
  # √ Select a variant: » vue
  ```

* 3、运行项目

  ```powershell
  $ npm run dev

![image-20220816094012941](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816094012941.png)

可以看到，项目已经启动，但是没有 `network`地址；我们需要手动配置下

package.json

```json
 "scripts": {
    "dev": "vite --host", // dev后面 加上 --host
    "build": "vite build",
    "preview": "vite preview"
  },
```

### 4、tailwindcss工具

在正式的项目开发之前,我们还需要了解另外一个工具 `tailwindcss` .
大家只看它的名字可能会想，这不就是一个处理`css`的库吗?值得我们专门拿出来一章的内容去学习?
那么我的回答可能是:“**是的,这是有价值的。**“
`tailwindcss`是一个非常富有争议的库，喜欢它的人和讨厌它的人都非常多。
但是我们去查看`taliwindcss`下载量可以发现，它的月下载量已经达到了惊人的`977`万!要知道 `vite`也只有200多万而已。

#### 4.1、传统的企业级开发`css`痛点

**在前端技术巨变的现在，一直流传着一句话:每隔六个月，你要学习的前端技术就增加了一倍。**
	或许这句话本身只是个戏言，但是也在一定程度中反映了前端技术是变化非常快的。就像我们在上一章中提到的 vite ,在不到两年的时间里经历了三个大版本的变化。
但是大家仔细的想一下，这样的一个变化好像只适用于js 端, html、css 好像已经有很多年没有发生过大的变化

难道是因为html、css 已经足够成熟，不需要再进行改变了吗?应该也不是的，比如针对于css而言，我们在进行企业开发时，就会遇到很多问题,比如:

* 1.有时我们需要统一设计方案，比如项目中的红色我们需要使用同样的色值，标题的文字大小我们期望在整个项目中进行统一的划分。这样的一套变量如果通过 css 来实现，那么就不得不维护一个庞大的变量组，这其实是一个非常大的心智负担。

* 2.html结构是一个非常复杂的结构化内容，为了给这些结构指定对应的样式，那么通常我们都是通过cLssName
  来去指定。这就必
  须要求我们为这套复杂的结构指定各种各样包含语义化的 `className`。比如: `container` 、 `container-box`
  `container-box-title` 、 `container-box-5ub-title` , `container-box-sub-title-left-imag` 大量的"无意义“命名本身就会增加很多额外的负担。

* 3.因为 html和 css 是分离的，所以我们通常情况下在开发时，不得不在整个代码文件中，来回的上下翻滚，或者进行分屏操作。无
  论是哪一种其实都不能给我们带来一个很好地开发体验。
  4.针对于一些”复杂”的功能，比如响应式（媒体查询)、主题定制。如果我们想要通过传统的 html + css 的形式来进行实现，无
  疑是非常复杂的。

  除了上面提到的这些之外，还有很多其他的问题，感兴趣的同学可以看一下这篇文章的介绍CSS Utility Classes and "Separation of Concerns"
  总而言之，传统的 html + css 的模式存在着很多的问题，那么有什么好的方案可以解决呢?

  tailwindcss就是一个很好地方向。

#### 4.2、安装tailwindcss

1、安装依赖

```powershell
$ npm install -D tailwindcss@3.0.23 postcss@8.4.8 autoprefixer@10.4.2
```

2、创建配置文件

```powershell
$ npx tailwindcss init -p
# 执行当前命令生配置文件
```



```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  	"./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ], // 表示tailwindcss的作用范围 [src下所有目录下的所有vue/js文件， 当前index.html文件]
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3、导入`tailwindcss`的基础指令组件

创建`src/styles/index,scss`文件

```scss
// 导入`tailwindcss`的基础指令组件
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4、在项目的入口文件、`main.js`中引入`src/styles/index,scss`

```js
import { createApp } from 'vue'
import './style.css'
+ import './styles/index.scss'
```

保存之后，运行后，会报没有`sass`依赖包的错误，所以我们需要手动安装一下

![image-20220816105339932](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816105339932.png)

```powershell
$ yarn add sass
```

重启即可

> 如果postcss报错的话，可以将package.json中 "type": "module"删除掉

### 5、安装vscode插件

工欲善其事必先利其器，想要有一个比较爽快的开发体验，那么一些好的开发辅助插件是必不可少的。
我们今天就以`VSCode`为例，来介绍一些咱们这次项目中需要使用到的一些辅助插件来帮助大家进行项目的开发。

#### 5.1、Prettier 和 Code formatter 格式代码

相信对于很多同学而言代码格式问题，是一个一直让大家头疼的问题，混乱的代码格式非常不利于我们的日常开发工作，如果你的项目被`ESLint`管理，那么还会得到很多的错误，导致项目无法运行。那么我们有没有什么办法来让我们的代码格式变得更加漂亮呢?

答案是有的,它就是 `prettier`。

`prettier`是一个让代码变得更加漂亮的工具，我们可以利用它来处理我们代码的格式化问题。
想要使用prettier,那么我们可以按照以下步骤进行:

* 1、在vscode中插件库中安装 prettier

![image-20220816145837118](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816145837118.png)

* 2、在项目的根目录下创建`.prettierrc`文件

  ```yaml
  {
  	"semi": false,
  	"singleQuote": true,
      "trailingComma": "none"
  }
  ```

* 3、在`.vue`和`.js`结尾的文件中，**点击右键**，选择“使用...格式化文档”，选择“配置默认格式化程序”，选择“Prettier”

![image-20220816150512904](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816150512904.png)

![image-20220816150527541](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816150527541.png)

![image-20220816150548579](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816150548579.png)

* 4、在vsode的设置页面，搜索“save”,找到“Format On Save” 勾选上；等到保存时会自动格式化代码

  ![image-20220816150824725](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816150824725.png)

#### 5.2、配置`tailwindcss`插件

这个插件可以帮助我们在写代码时，进行`tailwindcss`的`css`类名提示

![image-20220816151044955](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816151044955.png)

#### 5.3、安装**Volar**插件

这个插件代替了`Vuter`功能，比`Vuter`更加贴合Vue3

![image-20220816151507317](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816151507317.png)

### 6、项目结构分析

咱们的项目分为**移动端**和**PC端**两种显示结果，但是这两种显示结果通过同一套代码进行实现，也就是所谓的响应式构建方案。那么我们在分析的时候就需要分别分析(PS:此处我们只分析大的路由方案，目的是让大家对基本的项目结构有一个初步的认识,以方便我们的项目结构处理，后续具体的细节构建方案不在这次分析行为之内):

* 1．移动端结构

* 2.PC端结构

  

然后把这两种的分析方案，合并到一起，组成一个最终的架构方案。

#### 6.1、移动端结构分析
移动端的结构相对比较简单，当我们去进行路由跳转时，它是以整个页面进行的整体路由切换。
那么由此可知，移动端不存在嵌套路由的概念，只需要在 APP.vue 中保留一个路由出口即可。

![image-20220816154619643](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816154619643.png)

#### 6.2、PC端接否分析

pc端相对于移动端、多了一个固定头部的部分，所以处理起来更加复杂一点

![image-20220816154910365](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816154910365.png)

我们需要通过两个路由出口进行表示:
1. `App.vue` :一级路由出口,用作整页路由切换

2. `Main.vue` :二级路由出口,用作局部路由切换

  那么由此我们可知，移动端和PC端两者的路由结构是不同的，所以这就**要求我们需要根据当前用户所在设备的不同，构建不同的路由表**

### 7、项目结构

项目的整体结构如下图所示

![image-20220816160615099](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220816160615099.png)

首先，我们项目中使用了`vuex`和`vue-router`;那么接下来我们先来安装他们吧

```powershell
$ yarn add vuex@4.0.2 vue-router@4.0.14
```

### 8、企业级vite配置方案-让vite得心应手

#### 8.1、前言

在前面的章节中我们通过 vite构建了项目，但是初始的vite配置还比较粗糙，不足以支撑企业级的项目开发。
所以说在本章中，我们就需要来配置vite 。
但是配置vite 不能想当然的进行处理,而是需要依据业务来进行配置。
所以在本章中,我们会:

* 1．先明确项目的业务处理方赛 

* 2.依据业务需要,来配置对应的vite内容

那么明确好了本章的内容之后，就让我们一起进入业务与vite结合的世界中去吧!

#### 8.2、明确移动瑞和PC端的构建顺序

  在上一章中（项目架构基本结构处理分析)中，我们明确了项目包含移动端路由表和PC端路由表两部分，所以我们在开发的时候就需要分别来去处理移动端和pc端对应的内容。

由于`tailwindcss`是遵循移动端优先的，所以我们在构建项目时，遵循它的规则，**移动端优先**

#### 8.3、**首先我们封装`isMoboleTerminal`判断是否是移动端方法**

我们规定、屏幕宽度大于或等于1280像素的为pc端，小于1280像素的为移动端

```js
import { computed } from 'vue'
import { PC_DEVICE_WIDTH } from '../constants'

/**
 * 是否是移动端设备； 判断依据： 屏幕宽度小于 PC_DEVICE_WIDTH
 * @returns
 */
export const isMoboleTerminal = computed(() => {
  console.log(document.documentElement.clientWidth, PC_DEVICE_WIDTH)
  return document.documentElement.clientWidth < PC_DEVICE_WIDTH
})
```

上面封装的方法有缺陷，就是：当页面尺寸发生变化时，`isMoboleTerminal`的值并不会发生响应式改变;这是因为`computed`重新执行的条件是，内部的响应式数据发生变化`computed`才会执行；而此时内部没有响应式数据，所以并不会重新执行；所以我们可以监听屏幕的尺寸变化，并设置响应式宽度

这里我们不使用上面的方法，而是使用第三方插件：[VueUse](https://vueuse.org/guide/) 这个插件就像`react hook`一样，提供响应式数据

* 1、首先安装`vueuse`

  ```powershell
  $ npm i @vueuse/core
  ```

* 2、重构`isMoboleTerminal`

  ```js
  import { computed } from 'vue'
  import { PC_DEVICE_WIDTH } from '../constants'
  import { useWindowSize } from '@vueuse/core'
  const { width } = useWindowSize()
  /**
   * 是否是移动端设备； 判断依据： 屏幕宽度小于 PC_DEVICE_WIDTH
   * @returns
   */
  export const isMoboleTerminal = computed(() => {
    return width.value < PC_DEVICE_WIDTH
  })
  ```

  

#### 8.4、配置路由、判断当前是移动端还是pc端加载对应的路由

  ```js
  import { createRouter, createWebHistory } from 'vue-router'
  import { isMoboleTerminal } from '../utils/flexible'
  import mobileRoutes from './modules/mobile-routes'
  import pcRoutes from './modules/pc-routes'
  
  const router = createRouter({
    history: createWebHistory(),
    routes: isMoboleTerminal.value ? mobileRoutes : pcRoutes
  })
  
  export default router
  ```

  

### 9、vite中的一些配置

#### 9.1、使用@符号代理src路径
 vite官方给出来了，解决方案：[resolve.alias](https://vitejs.cn/config/#resolve-alias)

  vite.config.js

  ```js
  export default defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@@': path.resolve(__dirname, './src/components')
      }
    }
  })
  ```

#### 9.2、配置开发环境下跨域代理
 vite官方给出来了，解决方案：[server.proxy](https://vitejs.cn/config/#server-proxy)

  vite.config.js

  ```js
  export default defineConfig({
    server: {
        proxy: {
          '/prod-api': {
            target: ' http://localhost:3000',
            changeOrigin: true
          }
        }
      }
  })
  ```

### 10、动态设置rem并修修改tailmindcss默认配置

因为我们做的页面需要在不同设备下使用、要想在不同设备下适用；这里移动端我们采用的是**flex+rem**布局的方式：

首先我们先实现下rem布局

```js
/**
 * 首次加载成功时设置html跟标签的fontSize属性值；最大基准值为40px
 */
export const useREM = () => {
  const MAX_FONT_SIZE = 40
  // 当文档被解析成功时调用
  window.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    // 设置屏幕基准值的标准为 屏幕的宽度 / 10
    const fontSize = window.innerWidth / 10
    html.style.fontSize = Math.min(fontSize, MAX_FONT_SIZE) + 'px'
  })
}
```

在mian.js中引入并调用`useREM`

```js
import { useREM } from '@/utils/flexible'

useREM()
```



测试发现：**字体非常大，不符合我们的预期；如下图所示**

![image-20220820094254567](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220820094254567.png)

解决办法： **tailwindcss提供了配置文件，我们可以在配置文件中自定义一些样式**

我们在`tailwind.config.js`中进行`theme.extend`配置

```js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.25rem', { lineHeight: '0.35rem' }],
        sm: ['0.35rem', { lineHeight: '0.45rem' }],
        base: ['0.45rem', { lineHeight: '0.55rem' }],
        lg: ['0.55rem', { lineHeight: '0.65rem' }],
        xl: ['0.65rem', { lineHeight: '0.75rem' }]
      },
      boxShadow: {
        'l-white': '-10px 0 10px white' // 自定义类名样式 使用时 shadow-l-white
      }
    }
  },
  plugins: []
}
```

![image-20220820095829409](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220820095829409.png)

配置完成生效

### 11、在vite中封装通用的svg

我们之前在webpack中封装了通用的svg图标、但是在vite中没有进行分装；所以在本项目中我们对svg图标进行通用封装

![image-20220820110904744](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220820110904744.png)

我们先看一下文件目录

* 1、封装`svg-icon`通用组件`libs/svg-icon/index.vue`

  ```vue
  <template>
    <svg aria-hidden="true">
      <use :xlink:href="symbolId" :fill="color" :class="fillClass" />
    </svg>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    // 图标名称
    name: {
      type: String,
      required: true
    },
    // 颜色
    color: {
      type: String
    },
    // 类名
    fillClass: {
      type: String
    }
  })
  
  // 生成图标唯一id #icon-xxx
  const symbolId = computed(() => `#icon-${props.name}`)
  </script>
  ```

  

* 2、导出注册组件对象 `libs/index.js`

  ```js
  import SvgIcon from './svg-icon/index.vue'
  
  // 导出对象、这个对象有install方法，这样既可以通过app.use(options)来使用
  export default {
    install(app) {
      app.component('svg-icon', SvgIcon)
    }
  }
  ```

* 3、在`mian.js`中注册组件对象

  ```js
  import libs from '@/libs'
  createApp(App).use(router).use(libs).mount('#app')
  ```

* 4、安装`vite-plugin-svg-icons`插件，并配置vite

  ```powershell
  $ yarn add vite-plugin-svg-icons -D
  ```

  vite.config.js

  ```js
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import path from 'path'
  import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
  
  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [
      vue(),
      // svg配置
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[name]'
      })
    ],
  })
  ```

* 5、在`main.js`中注册 `import 'virtual:svg-icons-register'`

  ```js
  
  import libs from '@/libs'
  import 'virtual:svg-icons-register' // 为固定格式
  
  createApp(App).use(router).use(libs).mount('#app')
  ```

* 6、在组件中使用svg

  ```vue
  <svg-icon
      name="hamburger"
      class="px-1 w-4 h-4 fixed top-0 right-[-2px] z-20 shadow-l-white bg-white"
    />
  ```

  

![image-20220820111656263](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220820111656263.png)

### 12、实现移动端navigation头部效果

需要实现的效果如下：

![20220820_144232](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220820_144232.gif)

**实现思路：**

* 1、滑块绝对定位动态改变滑块的 `left` 和 `width`值, 来改变滑块的位置
* 2、left值计算公式： 滚动x距离 + 点击元素距离屏幕左边的距离
* 3、width值计算公式： 点击元素的宽度

**实现细节：**

* 对于获取`v-for`生成的子元素的实例，需要使用回调函数获取

  ```vue
  <ul ref="ulEle">
      <li v-for="item in data" :ref="getEleFn"></li>
  </ul>
  
  <script setup>
      import { ref } from 'vue'
      // 获取普通元素的实例，可以使用ref(null）获取
      const ulEle = ref(null)
      //对于获取`v-for`生成的子元素的实例，需要使用回调函数获取
  	const getEleFn = (el) => {
          console.log(el)
      }
  </script>
  ```

* 在初始化时，我们需要在li元素渲染完成之后触发一下重新设置一下滑块绝对定位动态改变滑块的 `left` 和 `width`值；我们可以监听渲染list的响应式数据是否改变，并且在改变后通过`nextTick`触发设置选中第一个元素

  ```js
  // 监听data初次数据渲染之后，将slider条设置到第一项
  watch(
    () => props.data,
    () => {
      nextTick(() => {
        curretIndex.value = 0
      })
    }
  )
  ```

**完整实例**

```vue
<template>
  <ul
    class="relative z-10 text-xs bg-white flex overflow-auto p-1 text-zinc-600"
    ref="ulEle"
  >
    <li
      class="absolute top-1 h-[22.5px] bg-zinc-900 rounded-lg duration-200 z-10"
      :style="sliderStyle"
    ></li>
    <li
      v-for="(category, index) in data"
      :key="category.id"
      class="shrink-0 px-1.5 py-0.5 last:mr-6 z-10"
      :class="{ 'text-zinc-50': index === curretIndex }"
      @click="handleSelectCategory(index)"
      :ref="storeLiEle"
    >
      {{ category.name }}
    </li>
  </ul>
  <svg-icon
    name="hamburger"
    class="px-1 w-4 h-4 fixed top-0 right-[-2px] z-20 shadow-l-white bg-white"
  />
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useScroll } from '@vueuse/core'
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

// 默认选中索引
const curretIndex = ref(-1)
const sliderStyle = ref({
  left: '10px',
  width: '0px'
})
//  ul dom元素
const ulEle = ref(null)
// li dom元素容器
const liEles = ref(new Set())

// ulScrollLeft 向左滚动的距离
const { x: ulScrollLeft } = useScroll(ulEle)

// 选中索引
const handleSelectCategory = (index) => {
  curretIndex.value = index
}
// 获取v-for遍历的子元素dom节点时，需要使用回调函数获取; 注意: 每次页面更新之后storeLiEle，都会重新执行一遍，这样会导致liEles中存储的都是重复的元素
// 所以可以使用Set来存储数据，避免存入重复的数据， 也可以在obBeforeUpdate前设置liEles.value的值为初始化值
const storeLiEle = (el) => {
  liEles.value.add(el)
}

watch(curretIndex, (newIndex, oldIndex) => {
  // 获取点击元素的距离左边屏幕的距离和元素的宽度
  const liEle = Array.from(liEles.value)[newIndex]
  if (!liEle) return false
  const { left, width } = liEle.getBoundingClientRect()
  sliderStyle.value = {
    left: `${left + ulScrollLeft.value}px`,
    width: `${width}px`
  }
})

// 监听data初次数据渲染之后，将slider条设置到第一项
watch(
  () => props.data,
  () => {
    nextTick(() => {
      curretIndex.value = 0
    })
  }
)
</script>

```

#### 12.1、现在增加一个新功能：点击之后将点击项展示在屏幕的正中央，并且加上过渡**

**实现思路**

* 1、在list菜单列表的数据发生改变后，获取每一项如果想要展示在中间需要滚动的距离

  ```
  菜单展示中间需要向左滚动的距离l = 每一项距离屏幕左边的距离 - 1/2屏幕的宽度 + 1/2自身的宽度 
  ```

* 2、在点击时获取【被点击项向左滚动的距离l】，使得ul平滑滚动到指定位置（本案例使用自定义封装的平滑滚动函数）

  ```js
  export const scrollTransition = () => {
    let timer = null
    return function exec ({el = document.body, position = 0, direction = 'v',  time = 150} = options) {
      clearInterval(timer)
      // 每步的时间 ms
      const TIME_EVERY_STEP = 5 
      // 最大滚动距离
      const maxScrollSize = el.scrollWidth - el.offsetWidth
      // 限定position的有效滚动范围
      position = Math.max(Math.min(position, maxScrollSize), 0)
      // 可以分为多少步
      let steps = Math.ceil(time / TIME_EVERY_STEP)
      const stepSize = (position - el.scrollLeft) / steps // 每步的长度
      
      timer = setInterval(() => {
        // console.log(el.scrollLeft , position)
        if (el.scrollLeft !== Number.parseInt(position) && position >= 0) {
          if (stepSize >= 0) {
            let scrollX = el.scrollLeft + stepSize >= position ? position :  el.scrollLeft + stepSize
            el.scrollLeft = scrollX
          } else {
            let scrollX = el.scrollLeft + stepSize <= position ? position :  el.scrollLeft + stepSize
            el.scrollLeft = scrollX
          }
          
        } else {
          clearInterval(timer)
        }
      }, TIME_EVERY_STEP)
    }
  }
  
  ```

* 3、我们来处理下滑块的位置，因为滑块的位置是根据被选中项的`getBoundingClientRect`的属性值决定的；所以我们只要保证，在滑块获取`getBoundingClientRect`属性是在页面渲染之后即可；所以我们可以使用nextTick保证在页面dom元素发生变化后改变滑块的值

  ```js
  watch(curretIndex, (newIndex, oldIndex) => {
    // 保证渲染之后再进行计算元素的位置, 在这里加上nextTick
    nextTick(() => {
      // 获取点击元素的距离左边屏幕的距离和元素的宽度
      const liEle = Array.from(liEles.value)[newIndex]
      if (!liEle) return false
      const { left, width } = liEle.getBoundingClientRect()
      sliderStyle.value = {
        left: `${left + ulScrollLeft.value}px`,
        width: `${width}px`
      }
    })
  })
  ```

**实现代码**

```js
<template>
  <ul
    class="relative z-10 text-sm bg-white flex overflow-auto p-1 text-zinc-600"
    ref="ulEle"
  >
    <li
      class="absolute top-1 h-[22.5px] bg-zinc-900 rounded-lg duration-200 z-10"
      :style="sliderStyle"
    ></li>
    <li
      v-for="(category, index) in data"
      :key="category.id"
      class="shrink-0 px-1.5 py-0.5 last:mr-6 z-10"
      :class="{ 'text-zinc-50': index === curretIndex }"
      @click="handleSelectCategory(index)"
      :ref="storeLiEle"
    >
      {{ category.name }}
    </li>
  </ul>
  <svg-icon
    name="hamburger"
    class="px-1 w-4 h-4 fixed top-0 right-[-2px] z-20 shadow-l-white bg-white"
    @click="visible = true"
  />
  <popup v-model="visible" class="aaa" style="color: red">
    <Menu :categorys="data" @handleSelectCategory="handleSelectCategory" />
  </popup>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useScroll } from '@vueuse/core'
import Menu from '@/views/main/components/menu/index.vue'
import { scrollTransition } from '@/utils'
const run = scrollTransition()
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

// 默认选中索引
const curretIndex = ref(-1)
const sliderStyle = ref({
  left: '10px',
  width: '0px',
  bottom: 0,
})
//  ul dom元素
const ulEle = ref(null)
// li dom元素容器
const liEles = ref(new Set())
// 每一项在屏幕中央时，需要向左滚动的距离
const scrollRaces = ref([])

// ulScrollLeft 向左滚动的距离
const { x: ulScrollLeft } = useScroll(ulEle)

const visible = ref(false)

// 选中索引
const handleSelectCategory = (index) => {
  curretIndex.value = index
  visible.value = false
  // ulEle.value.scrollTo(scrollRaces.value[index], 0)
  run({ el: ulEle.value, position: scrollRaces.value[index], direction: 'l', time: 200 })
}
// 获取v-for遍历的子元素dom节点时，需要使用回调函数获取; 注意: 每次页面更新之后storeLiEle，都会重新执行一遍，这样会导致liEles中存储的都是重复的元素
// 所以可以使用Set来存储数据，避免存入重复的数据， 也可以在obBeforeUpdate前设置liEles.value的值为初始化值
const storeLiEle = (el) => {
  liEles.value.add(el)
}

watch(curretIndex, (newIndex, oldIndex) => {
  // 保证渲染之后再进行计算元素的位置
  nextTick(() => {
    // 获取点击元素的距离左边屏幕的距离和元素的宽度
    const liEle = Array.from(liEles.value)[newIndex]
    if (!liEle) return false
    const { left, width, height } = liEle.getBoundingClientRect()
    sliderStyle.value = {
      left: `${left + ulScrollLeft.value}px`,
      width: `${width}px`,
      height: `${height}px`
    }
  })
}, {
  immediate: true
})

// 监听data初次数据渲染之后，将slider条设置到第一项
watch(
  () => props.data,
  () => {
    nextTick(() => {
      if (props.data.length <= 0) return
      curretIndex.value = 0
      // 获取1/2屏幕的宽度
      const halfScreenWidth = window.innerWidth / 2
      // 每一项向左滚动的距离 = 每一项距离屏幕左边的距离 - 1/2屏幕的宽度 + 1/2自身的宽度 
      scrollRaces.value = Array.from(liEles.value).map(el => el.getBoundingClientRect().left - halfScreenWidth + el.offsetWidth / 2)
    })
  }, {
    immediate: true
  }
)
</script>

<style scoped>
/* ul {
  scroll-behavior: smooth;
} */
</style>
```



![20220822_104005](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220822_104005.gif)

### 13、封装通用组件 - popup

当我们点击面包屑按钮时，会有一个弹出窗口 popup自低而上弹出，那么这样的一个功能,我们一样可以把它处理为项目的通用组件
那么想要处理popup的话，首先就需要先搞清楚 popup的能力。

* 1.当 popup展开时，内容视图应该不属于任何一个组件内部，而应该直接被插入到 body下面

* 2、popup应该包含两部分内容，一部分为背景蒙版，一部分为内容的包裹容器

* 3、popup应该通过一个双向绑定进行控制展示和隐藏

* 4、popup展示时，滚动应该被锁定

* 5、内容区域应该接收所有的attrs，并且应该通过插槽让调用方指定其内容

  

那么明确好了这些能力之后，接下来大家可以先根据这些能力进行下通用组件 popup 的构建尝试，尝试之后再继续来看咱们的后续内容。

`libs/popup/index.vue`

```vue
<template>
  <Teleport to="body">
    <Transition name="popup-mask" mode="out-in">
      <!-- 遮罩层 -->
      <div
        class="fixed left-0 top-0 right-0 bottom-0 bg-black/80 z-30"
        @click="onMask"
        v-if="modelValue"
      ></div>
    </Transition>

    <Transition name="popup-slide" mode="out-in">
      <!-- 内容区域 -->
      <div
        class="bg-white overflow-y-auto z-30 fixed left-0 bottom-0 right-0"
        :style="style"
        v-bind="$attrs"
        v-if="modelValue"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'
const props = defineProps({
  modelValue: Boolean,
  style: String | Object
})
const emits = defineEmits(['update:modelValue'])

const onMask = () => {
  emits('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (v) => {
    const body = document.querySelector('body')
    let initStyle = ''
    if (v) {
      initStyle = body.style.overflow
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = initStyle
    }
  }
)
</script>

<style scoped lang="scss">
.popup-mask-enter-from,
.popup-mask-leave-to {
  opacity: 0;
}
.popup-mask-enter-active,
.popup-mask-leave-active {
  transition: all 0.3s;
}

.popup-slide-enter-from,
.popup-slide-leave-to {
  transform: translateY(100%);
}
.popup-slide-enter-active,
.popup-slide-leave-active {
  transition: all 0.3s;
}
</style>

```

**通用组件注册**

```js
import SvgIcon from './svg-icon/index.vue'
import Popup from './popup/index.vue'

// 导出对象、这个对象有install方法，这样既可以通过app.use(options)来使用
export default {
  install(app) {
    app.component('svg-icon', SvgIcon)
    app.component('Popup', Popup)
  }
}
```

**在使用通用组件**

```vue
  <Popup v-model="visible" class="aaa" style="color: red" />
 const visible = ref(false)
```

![20220820_172315](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220820_172315.gif)

### 14、Vite通用组件自动化注册

目前我们在项目中已经完成了两个通用组件，将来我们还会完成更多的通用组件开发。那么如果每次开发完成一个通用组件之后，都去手动进行注册，未免有些过于麻烦了，所以我们期望通过 vite 提供的功能，进行通用组件的自动化注册
那么,如果想要完成这个功能的话，就需要使用到两个关键的知识点:

* 1、[vite的Glob](https://vitejs.cn/guide/features.html#glob-import) 导入功能:该功能可以帮助我们在文件系统中导入多个模块

  ```js
  const modules = import.meta.glob('./dir/*.js')
  // 以上将会被转译为下面的样子：
  const modules = {
    './dir/foo.js': () => import('./dir/foo.js'),
    './dir/bar.js': () => import('./dir/bar.js')
  }
  ```

  

* 2、vue的 [defineAsyncComponent](https://cn.vuejs.org/guide/components/async.html)方法:该方法可以创建一个按需加载的异步组件
  基于以上两个方法,实现组件自动注册

**我们先来看下现在的代码**：

```js
import SvgIcon from './svg-icon/index.vue'
import Popup from './popup/index.vue'

// 导出对象、这个对象有install方法，这样既可以通过app.use(options)来使用
export default {
  install(app) {
    app.component('svg-icon', SvgIcon)
    app.component('Popup', Popup)
  }
}
```

**改成动态导入的形式**：

```js
import { defineAsyncComponent } from 'vue'

// 导出对象、这个对象有install方法，这样既可以通过app.use(options)来使用
export default {
  install(app) {
    // 1、获取当前文件下所有以index.vue结尾的文件
    const components = import.meta.glob('./*/index.vue')
    for (const [path, fn] of Object.entries(components)) {
      // 2、根据path生成组件名称, defineAsyncComponent生成动态组件
      const componentName = path.replace(/(\.\/)|(\/index\.vue)/g, '')
      const Com = defineAsyncComponent(fn)
      // 3、将组件注册到app上
      app.component(componentName, Com)
    }
  }
}
```

### 15、封装通用的组件 - button

需要实现的组件如下

![image-20220823102101628](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220823102101628.png)

实现代码

```vue
<template>
  <button
    class="duration-300 inline-flex items-center justify-center active:scale-105"
    :class="[
      sizeClass,
      typeClass,
      plainClass,
      block ? 'block' : '',
      { 'opacity-50 active:scale-100': isDisbaled }
    ]"
    :disabled="isDisbaled"
    @mouseover="mouseIsOver = true"
    @mouseleave="mouseIsOver = false"
  >
    <svg-icon
      v-if="loading"
      name="loading"
      class="w-[1em] h-[1em] duration-300 animate-spin"
      :class="{ 'mr-0.5': !!$slots.default || icon }"
      :color="svgColorClass"
    />
    <svg-icon
      v-if="icon"
      :name="icon"
      class="w-[1em] h-[1em] duration-300"
      :class="{ 'mr-0.5': !!$slots.default && icon }"
      :color="svgColorClass"
    />
    <slot />
  </button>
</template>

<script>
const defineType = {
  primary:
    'bg-blue-400 hover:bg-blue-500 duration-300 text-white rounded-sm border border-blue-400',
  warning:
    'bg-amber-400 hover:bg-amber-500 duration-300 text-white rounded-sm border border-amber-400',
  danger:
    'bg-red-400 hover:bg-red-500 duration-300 text-white rounded-sm border border-red-400',
  success:
    'bg-emerald-400 hover:bg-emerald-500 duration-300 text-white rounded-sm border border-emerald-400',
  default:
    'bg-white hover:bg-zinc-200 duration-300 text-zinc-600 rounded-sm border border-white-400'
}

const defineSize = {
  small: 'py-0.5 px-0.5 text-xs',
  middle: 'py-[6px] px-1 text-sm',
  default: 'py-[8px] px-1.5 text-sm',
  large: 'py-1 px-2 text-sm'
}
</script>

<script setup>
import { computed, ref, useSlots } from 'vue'
// const slot = useSlots()
// console.log(slot.default)
const mouseIsOver = ref(false)
const props = defineProps({
  type: {
    type: String,
    default: 'primary', // 'primary', 'warning', 'danger', 'success', 'default'
    validator(key) {
      const isContant = Object.keys(defineType).includes(key)
      if (!isContant) {
        throw new Error(
          `type must be 【${Object.keys(defineType).join('、')}】`
        )
      }
      return true
    }
  },
  size: {
    type: String,
    default: 'middle', // large , default, middle, small
    validator(key) {
      const isContant = Object.keys(defineSize).includes(key)
      if (!isContant) {
        throw new Error(
          `size must be 【${Object.keys(defineSize).join('、')}】`
        )
      }
      return true
    }
  },
  icon: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  plain: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const typeClass = computed(() =>
  defineType[props.type] ? defineType[props.type] : defineType.primary
)

const sizeClass = computed(() =>
  defineSize[props.size] ? defineSize[props.size] : defineType.middle
)

const plainClass = computed(() =>
  props.plain
    ? `bg-transparent ${
        props.type === 'primary'
          ? 'text-blue-400 hover:text-white'
          : props.type === 'warning'
          ? 'text-amber-400 hover:text-white'
          : props.type === 'danger'
          ? 'text-red-400 hover:text-white'
          : props.type === 'success'
          ? 'text-emerald-400 hover:text-white'
          : props.type === 'default'
          ? 'text-zinc-700 hover:text-white'
          : ''
      }`
    : ''
)
const svgColorClass = computed(() =>
  props.plain && !mouseIsOver.value
    ? `${
        props.type === 'primary'
          ? 'rgb(96, 165, 250)'
          : props.type === 'default'
          ? 'rgb(63, 63, 70)'
          : props.type === 'danger'
          ? 'rgb(248, 113, 113)'
          : props.type === 'success'
          ? 'rgb(52, 211, 153)'
          : props.type === 'warning'
          ? 'rgb(251, 191, 36)'
          : '#ffffff'
      }`
    : '#ffffff'
)
const isDisbaled = computed(() => props.disabled || props.loading)
</script>

<style></style>
```

### 16、封装通用组件 - popover

通用组件popover应具备以下功能：

* 1、指定两个插槽、分别插入触发内容和弹出内容
* 2、触发弹出内容的方式分为多种，`click`、`hover`、`focus`、`manual`
* 3、可以设定弹出层相对于触发元素的位置 `bottom`,`bottom-start`, `bottom-end`, `top`, `top-start`, `top-end`
* 4、将弹出层指定挂载到body元素上、并且当页面滚动和页面尺寸发生变化时、弹出层也应虽则触发元素的位置改变而改变
* 5、弹出层展示和隐藏时要有过渡效果

**实现思路**

* 1、对用户指定的属性值进行校验
* 2、当页面挂载之后获取父元素的 **宽度**、**高度**、**距离屏幕左边left**、**距离屏幕顶边top**
* 3、当触发弹出元素显示后，立即获取显示元素的**宽度**、**高度**， 结合触发元素的属性与显示的位置，计算出弹出元素应该显示到的位置 left, top
* 4、当页面滚动/尺寸发生改变、重新计算生成新的显示到的位置 left, top
* 5、根据触发方式对应的显示和隐藏弹出元素；（注意： 在hover触发下、鼠标触发元素触发弹出元素显示后、然后再移动到显示元素上时，我们需要处理一下，避免弹出层先隐藏再展示的bug; 处理方法可以使用`setTimeout`延时修改元素的隐藏、在定时器触发之前、如果触发元素的显示、则先清理定时器）

**实现代码**
```vue
<template>
  <div ref="popoverRoot" class="select-none inline-flex" @click.stop>
    <slot name="reference" />
  </div>
  <Teleport to="body">
    <transition name="popover-tip">
      <div
        v-if="tipVisible"
        ref="tipRoot"
        class="fixed shadow-lg p-1 rounded-sm border border-zinc-100 z-20 bg-white"
        :style="tipStyle"
        @click.stop
      >
        <slot />
      </div>
    </transition>
  </Teleport>
</template>

<script>
const PLACEMENTS = [
  'bottom',
  'bottom-start',
  'bottom-end',
  'top',
  'top-start',
  'top-end'
]
const TRIGGERS = ['click', 'focus', 'hover', 'manual']
</script>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import useRootPosition from './useRootPosition'
import useTrigger from './useTrigger'
const props = defineProps({
  placement: {
    // 弹框显示位置
    type: String,
    default: 'bottom', // 'bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end',
    validator(key) {
      const isContant = PLACEMENTS.includes(key)
      if (!isContant) {
        throw new Error(`placement must be 【${PLACEMENTS.join('、')}】`)
      }
      return true
    }
  },
  trigger: {
    // 触发方式
    type: String,
    default: 'click', // click/focus/hover/manual
    validator(key) {
      const isContant = TRIGGERS.includes(key)
      if (!isContant) {
        throw new Error(`trigger must be 【${TRIGGERS.join('、')}】`)
      }
      return true
    }
  }
})
const tipRoot = ref(null)
const tipPosition = ref({})
const { rootPosition, popoverRoot } = useRootPosition()
const tipVisible = useTrigger(popoverRoot, tipRoot, props.trigger)

const tipStyle = computed(() => {
  const {
    left: rootLeft,
    top: rootTop,
    width: rootWidth,
    height: rootHeight
  } = rootPosition.value
  const { width, height } = tipPosition.value
  switch (props.placement) {
    case 'bottom': {
      const rootCenterX = (rootLeft + rootLeft + rootWidth) / 2
      return {
        left: `${rootCenterX - width / 2}px`,
        top: `${rootTop + rootHeight}px`
      }
    }
    case 'bottom-start': {
      return {
        left: `${rootLeft}px`,
        top: `${rootTop + rootHeight}px`
      }
    }
    case 'bottom-end': {
      return {
        left: `${rootLeft - (width - rootWidth)}px`,
        top: `${rootTop + rootHeight}px`
      }
    }

    case 'top': {
      const rootCenterX = (rootLeft + rootLeft + rootWidth) / 2
      return {
        left: `${rootCenterX - width / 2}px`,
        top: `${rootTop - height}px`
      }
    }
    case 'top-start': {
      return {
        left: `${rootLeft}px`,
        top: `${rootTop - rootHeight}px`
      }
    }
    case 'top-end': {
      return {
        left: `${rootLeft - (width - rootWidth)}px`,
        top: `${rootTop - rootHeight}px`
      }
    }
  }
})

watch(
  () => tipVisible.value,
  (v) => {
    if (v) {
      nextTick(() => {
        const { width, height } = tipRoot.value.getBoundingClientRect()
        tipPosition.value = { width, height }
      })
    }
  }
)
</script>

<style scoped lang="scss">
.popover-tip-enter-from,
.popover-tip-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
.popover-tip-enter-active,
.popover-tip-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
</style>

```

useRootPosition.js

```js
import { ref, onMounted, onBeforeUnmount } from 'vue'

function useRootPosition() {
  const rootPosition = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })
  const popoverRoot = ref(null)
  function scrollFn() {
    rootPosition.value = getRect(popoverRoot)
  }
  onMounted(() => {
    rootPosition.value = getRect(popoverRoot)
    window.addEventListener('scroll', scrollFn)
    window.addEventListener('resize', scrollFn)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollFn)
    window.removeEventListener('resize', scrollFn)
  })
  return {
    rootPosition,
    popoverRoot
  }
}

function getRect(popoverRoot) {
  const { left, top, width, height } = popoverRoot.value.getBoundingClientRect()
  return { left, top, width, height }
}

export default useRootPosition

```



useTrigger.js

```js
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue-demi'

function useTrigger(popoverRoot, tipRoot, trigger) {
  const visible = ref(false)
  let timer = null
  function globalFn() {
    if (trigger === 'click') {
      visible.value = false
    }
  }
  onMounted(() => {
    popoverRoot.value.addEventListener('click', () => {
      if (trigger !== 'click' && trigger !== 'manual') return false
      visible.value = !visible.value
    })
    popoverRoot.value.addEventListener('mouseover', () => {
      if (trigger !== 'hover') return false
      clearInterval(timer)
      visible.value = true
    })
    popoverRoot.value.addEventListener('mouseleave', () => {
      if (trigger !== 'hover') return false
      timer = setTimeout(() => {
        visible.value = false
      }, 200)
    })
    popoverRoot.value.addEventListener('mousedown', () => {
      if (trigger !== 'focus') return false
      visible.value = true
    })
    popoverRoot.value.addEventListener('mouseup', () => {
      if (trigger !== 'focus') return false
      visible.value = false
    })
    document.addEventListener('click', globalFn, false)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', globalFn, false)
  })

  watch(
    () => visible.value,
    (v) => {
      if (!v) return false
      nextTick(() => {
        tipRoot.value.addEventListener('mouseover', () => {
          if (trigger !== 'hover') return false
          clearInterval(timer)
          visible.value = true
        })
        tipRoot.value.addEventListener('mouseleave', () => {
          if (trigger !== 'hover') return false
          timer = setTimeout(() => {
            visible.value = false
          }, 200)
        })
      })
    }
  )
  return visible
}

export default useTrigger

```

### 17、封装通用组件 - search

### 18、持久化vuex中数据

#### 18.1、使用`vuex-persistedstate`第三方插件

[vuex-persistedstate](https://github.com/robinvdvleuten/vuex-persistedstate)

```powershell
$ npm install --save vuex-persistedstate
```

```js
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  // ...
  plugins: [createPersistedState({
      key : '__presisted__', // 缓存的key,
      paths: [moduleName], // 用于部分持久化状态的任何路径的数组。如果没有给出路径，完整的状态会被持久化。如果给定一个空数组，则不会保留任何状态。必须使用点表示法指定路径。如果使用模块，请包含模块名称。例如：“auth.user” 默认为undefined.
  })],
});
```

##### 18.2、我们仿照上面的插件、自己写一个缓存插件

vuex-presisted.js

```js
const vuexPresisted =
  ({ key = '__presisted__', paths = [] } = options) =>
  (store) => {
    // 1、初始化时从缓存中获取缓存的数据
    const map = getPresisted(key)
    // 2、将数据挂载到state中
    for (const [module, data] of Object.entries(map)) {
      store.state[module] = data
    }
    // 当 store 初始化后调用
    store.subscribe((mutation, state) => {
      // 每次 mutation 之后调用
      // mutation 的格式为 { type, payload }
      // 每次触发mutation提交之后，都判断提交的module是不是缓存的数据，如果是，则将数据缓存起来
      const { type, payload } = mutation
      // 获取模块名
      const moduleName = type.split('/')[0]
      // 判断模块名是否在配置项中
      if (paths.includes(moduleName)) {
        // 获取state中的数据
        const value = store.state[moduleName]
        // 获取缓存中的map对象
        const map = getPresisted(key)
        // 将state中的数据设置到map对象中
        map[moduleName] = value
        // 将map对象缓存到本地
        localStorage.setItem(key, JSON.stringify(map))
      }
    })
  }

export default vuexPresisted

function getPresisted(key) {
  let map = {}
  try {
    map = JSON.parse(localStorage.getItem(key)) || {}
  } catch (error) {
    map = {}
  }
  return map
}

```

**使用**

```js
import { ALL_CATEGOARY_ITEM, DEFAULT_CATEGOARS } from '@/constants'
import { getCategories } from '@/api/categories'

// 处理 navigation中头部数据部分
export default {
  namespaced: true,
  state() {
    return {
      categorys: [ALL_CATEGOARY_ITEM, ...DEFAULT_CATEGOARS]
    }
  },
  mutations: {
    setCategorys(state, categorys) {
      state.categorys = [ALL_CATEGOARY_ITEM, ...categorys]
    }
  },
  actions: {
    async getCategorysData({ commit }) {
      const { categorys } = await getCategories()
      commit('setCategorys', categorys)
    }
  }
}
```



### 19、主题切换实现

原理： **通过类名的切换使得html元素在不同类名下展示不同的样式**

**实现思路**：（此方案基于tailwindcss插件）

* 1、将当前主题类型存储在vuex中

* 2、当切换主题时修改vuex中的主题类型

* 3、监听主题类型的变化： theme-light 、 theme-dark - theme-system、给html标签动态设置class的属性值

* 4、html的class属性值变化后会匹配到对应主题的class、从而展示出来对应的主题的颜色

* 5、给标签设置两套的类名：白色一套、暗色一套

  ```html
  <div class="bg-zinc-300 dark:bg-zinc-900" ></div>
  ```

  

#### 19.1、首先实现极简白theme-light 、 极夜黑theme-dark

**constants.js**

```js

// 极简白
export const THEME_LIGHT = 'THEME_LIGHT'
// 极夜黑
export const THEME_DARK = 'THEME_DARK'
// 跟随系统
export const THEME_SYSTEM = 'THEME_SYSTEM'
```



vuex中配置

**theme.js**

```js
import { THEME_LIGHT } from '@/constants'
export default {
  namespaced: true,
  state() {
    return {
      themeType: THEME_LIGHT
    }
  },
  mutations: {
    changeTheme(state, themeType) {
      state.themeType = themeType
    }
  }
}

```

**header-theme.vue**

```vue
<template>
  <div class="ml-2">
    <popover trigger="hover" placement="bottom-end">
      <template #reference>
        <div
          class="w-4 h-4 hover:bg-zinc-100 rounded-sm flex items-center justify-center duration-300 cursor-pointer dark:hover:bg-zinc-900"
        >
          <svg-icon
            :name="selectIconc"
            class="w-2.5 h-2.5 dark:fill-zinc-400"
          />
        </div>
      </template>

      <!-- 菜单 -->
      <div
        class="text-sm cursor-pointer w-[140px] overflow-hidden text-zinc-600 dark:bg-zinc-800"
      >
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="flex items-center p-1 hover:bg-zinc-100/60 duration-300 dark:hover:bg-zinc-700 dark:text-zinc-300"
          @click="handleSelect(theme)"
        >
          <svg-icon
            :name="theme.icon"
            class="w-1.5 h-1.5 mr-1 fill-zinc-600 dark:fill-zinc-300"
          />
          <div>{{ theme.name }}</div>
        </div>
      </div>
    </popover>
  </div>
</template>

<script setup>
import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/constants'
import { computed } from 'vue-demi'
import { useStore } from 'vuex'
const store = useStore()
const themes = [
  {
    id: 0,
    type: THEME_LIGHT,
    name: '极简白',
    icon: 'theme-light'
  },
  {
    id: 1,
    type: THEME_DARK,
    name: '极夜黑',
    icon: 'theme-dark'
  },
  {
    id: 2,
    type: THEME_SYSTEM,
    name: '跟随系统',
    icon: 'theme-system'
  }
]

// 选中主题
const handleSelect = (theme) => {
  // 修改vuex中的主题
  store.commit('theme/changeTheme', theme.type)
}

// 当前选中的模式的icon图标
const selectIconc = computed(() => {
  // 当前选中的主题类型
  const themeType = store.getters.themeType
  // 对应的themes中的项
  const item = themes.find((theme) => theme.type === themeType)
  // 返回选中项的图标
  return item?.icon
})
</script>

<style></style>

```

**utils/theme.js**

```js
import { watch } from 'vue'
import store from '@/store'
import { THEME_LIGHT, THEME_DARK } from '@/constants'

/**
 * 监听vuex中的themeType的改变，动态设置html的class的类名
 */
export const useTheme = () => {
  watch(
    () => store.getters.themeType,
    (themeType) => {
      // 根据themeType获取到对应的class类名
      let classStr = ''
      switch (themeType) {
        case THEME_LIGHT:
          classStr = 'light'
          break
        case THEME_DARK:
          classStr = 'dark'
          break
      }
      const html = document.documentElement
      // 先清除html的light、dark类名、再设置类名
      html.classList.remove('light', 'dark')
      if (classStr) {
        html.classList.add(classStr)
      }
    },
    {
      immediate: true
    }
  )
}
```

#### 19.2、完成跟随系统变更主题

[Window.matchMedia()](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia)

[`Window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window) 的**`matchMedia()`** 方法返回一个新的[`MediaQueryList`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaQueryList) 对象，表示指定的[媒体查询 (en-US)](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)字符串解析后的结果。返回的`MediaQueryList` 可被用于判定[`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document)是否匹配媒体查询，或者监控一个`document` 来判定它匹配了或者停止匹配了此媒体查询。

您可以使用返回的媒体查询来执行即时检查和事件驱动检查，以查看文档是否与媒体查询匹配。

要执行一次瞬时检查以查看文档是否与媒体查询匹配，请查看[`matches`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaQueryList/matches)属性的值，当 document 满足媒体查询条件的时候将会返回`true`。

```js
const mam = window.matchMedia('(prefers-color-scheme: dark)')
mam.onchange = () => {
    const theme = mam.matches ? 'dark' : 'light'
}
```



实现方式:

```js
import { watch, ref } from 'vue'
import store from '@/store'
import { THEME_LIGHT, THEME_DARK, THEME_SYSTEM } from '@/constants'

const watchSystemThemeChange = () => {
  // 系统主题色
  const systemTheme = ref('light')
  const mam = window.matchMedia('(prefers-color-scheme: dark)')
  systemTheme.value = mam.matches ? 'dark' : 'light'
  // 监听系统主题色的变化
  mam.onchange = () => {
    systemTheme.value = mam.matches ? 'dark' : 'light'
  }
  return systemTheme
}

/**
 * 监听vuex中的themeType的改变，动态设置html的class的类名
 */
export const useTheme = () => {
  // 监听系统主题色的改变
  const systemTheme = watchSystemThemeChange()
  watch(
    [() => store.getters.themeType, systemTheme],
    ([themeType, st]) => {
      console.log(themeType, st)
      // 根据themeType获取到对应的class类名
      let classStr = ''
      switch (themeType) {
        case THEME_LIGHT:
          classStr = 'light'
          break
        case THEME_DARK:
          classStr = 'dark'
          break
        case THEME_SYSTEM:
          classStr = st
          break
      }
      const html = document.documentElement
      // 先清除html的light、dark类名、再设置类名
      html.classList.remove('light', 'dark')
      if (classStr) {
        html.classList.add(classStr)
      }
    },
    {
      immediate: true
    }
  )
}
```

![20220824_182441 (1)](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220824_182441%20(1).gif)

### 20、实现瀑布流布局

#### 20.1、实现瀑布流布局的方案

**常见的方案分为以下几种**：

* 1、css布局 - [`column-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/column-count)

  通过给父元素设置`column-count`属性，那么父元素的子元素，就会以设置的列数呈现

  ```css
  column-count: 3;
  ```

  缺点： 

  1、需要父元素的高度必须固定

  2、子元素排序优先级是 自左侧从上往下依次布局、不支持横向布局

  

* 2、css布局 - flex

  通过给父元素设置flex布局、并改变主轴为垂直方向、然后设置超出换行

  ```css
  .box {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
  }
  ```

  缺点：

  1、需要父元素的高度必须固定

  2、子元素排序优先级是 自左侧从上往下依次布局、不支持横向布局

  

* 3、js计算位置 - 子元素绝对定位

  通过计算，计算出子元素的位置，然后动态设置子元素的 `top`、`left`、`width`值，让其显示到正确位置

	缺点:

		1、计算过程较复杂

	优点：

		1、父元素的高度不需要固定
		
		2、可以实现上啦加载更多
		
		3、布局可以是横向布局

> 综合上面方案：本项目中实现的瀑布流布局是采用**方案3**中的实现方法

#### 20.2、瀑布流布局 - 实现思路

比如： 我们要实现一个 **列数 column** 为 n 列的布局；

	  每一列的 横向和纵向间距为 gaps (比如：gaps = [10, 10])

**实现思路**： 分为3步

**初始化部分**

* 1、获取父元素的宽度width (不包括 padding、border、scroll)

  ```js
  // width  = 父元素的clientWidth - 左padding - 右padding
  ```

  

* 2、计算出每一列的列宽`columnWidth`、每一列的横向坐标`columnLefts`

 ```js
 // 每列的宽度 =（容器总宽度（不包含padding、 border、 scroll） - (列数column - 1) * 横向列间距）/ 列数column
 
 // 获取每列的left坐标 = [0, 260, 520, 780, 1040]
 //每列的left坐标 计算方法：  第一项为0， 剩下的每一项都是left的最后一项 + 每一列宽度 + 横向间距
 ```

* 3、初始化每列的高度`columnHeights`

  ```js
  // columnHeights = [0, 0, 0, 0, 0]
  // 默认初始化时，每列高度都是0
  ```



* 4、计算出根元素高度`rootHeight`，并设置到根元素的height中

  ```js
  // const rootHeight = computed(() => Math.max(...columnHeights.value) || 0)
  // 最大的那一列就是rootHeight的值
  ```

* 5、初始化时、将计算出来的列宽`columnWidth`设置到 每一个子项上； 如果不设置子项上的话，图片就会显示默认的宽高、这会导致后面计算每一项的高度不准确

**等待所有图片加载完成**

> 这一步骤就是在所有图片加载完成后获取 所有的数据对应的渲染item的高度，收集到`itemHeights`中

所有的图片数据在 响应式数据 `props.data` 中； 当`props.data`中的数据渲染到页面之后、我们可以获取每一项的`dom`、然后进行后续操作; 详细说明如下：

* 1、监听`props.data`改变，当**数据渲染成功后**，获取渲染后的每一项的dom 收集到 `itemElements`，（此时由于没有设置每一项的left、top值，所以它是固定到左上角）
* 2、遍历`itemElements`,获取每一项的图片、监听图片是否加载完成？当所有图片都加载完成时；
* 3、此时每个图片都会撑开对应的自己的子项；计算得出每一个item子项的渲染高度 `itemHeights`
* **执行子元素固定操作**

**子元素固定操作**

走到这一步、所有的图片都已加载完成、并且所有初始化数据都已准备完毕，我们只需要让对应的子元素展示到对应位置即可！

* 1、监听渲染子项`itemHeights`，当`itemHeights`有值时，说明所有数据都已准备完毕、只需要计算出对应的`item`位置即可；（下面步骤是在监听函数中执行）

* 2、遍历`props.data`数据，获取到最小高度的那一列的 left值

* 3、计算item元素的top值

  计算公式： 1、`minColumnHeight` 等于0时 top = 0  2、`minColumnHeight` 不等于0时 top = `minColumnHeight` + 纵向间距

* 4、将新添加的哪一项的高度追加到 `columnLefts` 中

* 5、更新对应props的值

  ```js
  item._style = {
      left,
      top,
      width: columnWidth.value
  }
  ```

  

#### 20.3、封装通用的瀑布流组件

##### 20.3.1、先看下通用组件如何使用？

```vue
<div class="w-full">
    <!-- <list-item v-for="pexel in pexels" :key="pexel.id" :pexel="pexel" /> -->
    <water-fall
      :data="pexels" <!-- 数据源 -->
      :column="isMoboleTerminal ? 2 : 5"  <!-- 移动端下显示2列、pc端下显示5列 -->
      :gaps="20" <!-- 行/列间距为20px -->
      :isPicturePreReading="true" <!-- 是否使用图片预加载的模式 -->
    >
      <template v-slot="{ item, width }">
        <list-item :pexel="item" :width="width" />
      </template>
    </water-fall>
  </div>
```

**关于`isPicturePreReading`属性的说明：**

* 情况一：当后台返回的数据**不包含**图片的宽高时； 设置`isPicturePreReading` 为 `true`

  > 因为在解析时不知道图片占据多大位置、所以也不清楚每一个渲染项的高度、所以要使等到图片加载完成再进行得到元素的高度

* 情况二：当后台数据**包含**图片宽高时；设置`isPicturePreReading`为`false`

  > 有了图片的宽高、那么我们就不需要等到图片加载完成再进行得到元素的高度

 注意：包含的数据需要有以下两个字段`photoHeight`、`photoWidth`

```js
{
    author: "Uğurcan Özmen",
    authorLike: "https://www.pexels.com/zh-cn/@ugurcan-ozmen-61083217",
    avatar: "https://images.pexels.com/users/avatars/61083217/ugurcan-ozmen-235.jpeg?auto=compress&fit=crop&h=60&w=60",
    id: "8051987",
    photo: "https://images.pexels.com/photos/8051987/pexels-photo-8051987.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    photoHeight: 625, // 图片高度
    photoWidth: 500, //  图片宽度
}
```

##### 20.3.2、封装通用hook函数 - `useInit`

```js
import { ref, computed } from 'vue'

// 格式化间距
const useFmtGaps = (props) => {
  // 格式化间隔
  const fmtGaps = computed(() => {
    if (Array.isArray(props.gaps)) {
      return props.gaps.map((gap) => {
        if (typeof gap === 'number') {
          return gap
        }
        return Number(gap)
      })
    } else {
      return Array(2).fill(props.gaps)
    }
  })
  return fmtGaps
}

// 核心函数，导出初始化响应式对象
export const useInit = (props) => {
  // 每一列的left坐标
  const columnLefts = ref([])
  // 每一列的宽度
  const columnWidth = ref(0)
  // 每一列的高度
  const columnHeights = ref(Array(props.column).fill(0))
  // root根元素的实例 columnHeights 每一列高度的最大值

  const waterFallRoot = ref(null)
  // root根元素的高度 为 columnHeights 的最大值
  const rootHeight = useRootHeight(columnHeights)
  // 格式化间距
  const fmtGaps = useFmtGaps(props)

  // 初始化响应式数据
  const init = () => {
    // 初始化时重置columnHeights的值
    columnHeights.value = Array(props.column).fill(0)
    // 容器总宽度： （不包含 padding、 border、 滚动条）
    const width = getRootContainerWidth(waterFallRoot)
    // 每列宽度
    columnWidth.value = getColumnWidth(props, waterFallRoot, fmtGaps)
    // 每列left坐标
    columnLefts.value = getColumnLefts(props, columnWidth, fmtGaps)
  }
  return {
    columnLefts,
    columnWidth,
    waterFallRoot,
    fmtGaps,
    columnHeights,
    rootHeight,
    init
  }
}

/**
 * 获取每列的宽度 计算公式： 每列的宽度 =（容器总宽度（不包含padding、 border、 scroll） - (列数column - 1) * 横向列宽）/ 列数column
 * @param {*} props
 * @param {*} waterFallRoot
 * @param {*} fmtGaps
 * @returns
 */
function getColumnWidth(props, waterFallRoot, fmtGaps) {
  const width = waterFallRoot.value.clientWidth
  return (width - (props.column - 1) * fmtGaps.value[0]) / props.column
}

// 获取每列的left坐标
function getColumnLefts(props, columnWidth, fmtGaps) {
  // 获取每一列的left的坐标
  // 第一项为0， 剩下的每一项都是left的最后一项 + 每一列宽度 + 横向间距
  let count = props.column
  const lefts = []
  while (count > 0) {
    if (lefts.length <= 0) {
      lefts.push(0)
    } else {
      lefts.push(lefts[lefts.length - 1] + columnWidth.value + fmtGaps.value[0])
    }
    count--
  }
  return lefts
}

// 获取父容器总宽度： （不包含 padding、 border、 滚动条）

function getRootContainerWidth(waterFallRoot) {
  const styles = window.getComputedStyle(waterFallRoot.value)
  // clientWidth包含content + padding，所以需要把左右内边距减掉
  const width =
    waterFallRoot.value.clientWidth -
    Number.parseFloat(styles.paddingLeft) -
    Number.parseFloat(styles.paddingRight)
  return width
}

// 获取根元素的高度
function useRootHeight(columnHeights) {
  return computed(() => {
    console.log([...columnHeights.value])
    return Math.max(...columnHeights.value) || 0
  })
}

```



20.3.2、封装通用hook函数 - `usePicture`

usePicture.js

```js
// 在这里我们需要处理图片预加载
// 此时在处理之前、默认所有的图片所在的item都固定在容器的左上角
// 我们需要进行以下操作

import { ref } from 'vue-demi'

/**
 * 1、获取到所有的图片dom对象
 * 2、监听dom对象的onload是否成功执行？将其包装成promise对象
 * 3、执行所有的promise对象、当所有图片都成功加载时，返回所有图片的高度
 */

// 需要预加载 等待所有的元素加载完成
export function waitAllImgCompile() {
  // 每一项的高度
  let itemHeights = ref([])
  const itemElements = Array.from(
    document.querySelectorAll('.__water-fall-item__')
  )

  const promises = itemElements.map((itemElement, index) => {
    return new Promise((resolve, reject) => {
      // 创建图片实例
      const imgInstance = new Image()
      // 监听图片是否加载完成
      imgInstance.onload = () => {
        resolve({ itemElement, index })
      }
      imgInstance.src = itemElement.querySelector('img').src
    })
  })
  Promise.all(promises).then((res) => {
    itemHeights.value = res.map(({ itemElement }) => itemElement.offsetHeight)
  })
  return itemHeights
}

// 不需要预加载
export function useImageHeights() {
  let itemHeights = ref([])
  const itemElements = Array.from(
    document.querySelectorAll('.__water-fall-item__')
  )
  itemHeights.value = itemElements.map((itemElement) => {
    return itemElement.offsetHeight
  })
  return itemHeights
}

```

##### 20.3.3、封装通用hook函数 - `useLocation`

```js
import { watch } from 'vue'

/**
 * 动态给data设置_style 属性
 * _style = {
 *  left: 'xxx px',
 *  top: 'xxx px',
 *  width: 'xxx px'
 * }
 */
export default function useLocation({
  columnLefts,
  itemHeights,
  columnWidth,
  columnHeights,
  fmtGaps,
  props
}) {
  watch(
    itemHeights,
    (v) => {
      // 当每一项的高度不存在时，不往下走
      if (v.length <= 0) return
      for (const [key, item] of Object.entries(props.data)) {
        const index = Number(key)

        if (item._style) continue
        const minColumnHeight = getMinValue(columnHeights.value)
        // 找到最小高度的索引
        const minColumnIndex = getIndex(columnHeights.value, minColumnHeight)
        // 通过索引找到对应的left值 --- 设置为left
        const left = columnLefts.value[minColumnIndex]
        // 计算得出top的值 top计算公式
        // 1、minColumnHeight 等于0时 top = 0
        // 2、minColumnHeight 不等于0时 top = minColumnHeight + 纵向间距
        const top =
          minColumnHeight === 0 ? 0 : minColumnHeight + fmtGaps.value[1]
        // _style设置成功之后 columnLefts最小的那一列 + 新添加元素的高度 + 纵向间距
        columnHeights.value[minColumnIndex] =
          minColumnHeight + itemHeights.value[index] + fmtGaps.value[1]
        // // 找到
        item._style = {
          left,
          top,
          width: columnWidth.value
        }
      }
    },
    {
      immediate: true
    }
  )
}

/**
 * 获取最小高度
 * @param {*} heights
 * @returns
 */
function getMinValue(heights) {
  return Math.min(...heights)
}

/**
 * 获取索引
 * @param {*} heights  target
 * @returns
 */
function getIndex(heights, target) {
  return heights.findIndex((height) => height === target)
}
```

20.3.4、封装通用瀑布流组件 - `water-fall`

```vue
<template>
  <div
    ref="waterFallRoot"
    :style="{ height: `${rootHeight}px` }"
    class="relative"
  >
    <!-- 只有列宽计算出来、并且data所有数据才展示数据 -->
    <template v-if="columnWidth && data.length > 0">
      <div
        class="__water-fall-item__ absolute duration-300"
        v-for="(item, index) in data"
        :key="nodeKey ? item[nodeKey] : index"
        :style="{
          top: item._style?.top + 'px',
          left: item._style?.left + 'px',
          width: item._style?.width + 'px'
        }"
      >
        <slot :item="item" :width="columnWidth" />
      </div>
    </template>
  </div>
</template>

<script setup>
// 瀑布流通用組件

import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useInit } from './useInit'
import { waitAllImgCompile, useImageHeights } from './usePicture'
import useLocation from './useLocation'

/**
 * 1、通过父组件的宽度、列数、间距计算出 每一列的left的值 columLefts
 * 2、创建一个数组记录每一列的高度 columHeights
 * 3、拿到传过来的数据进行依次渲染到 columHeights 高度最小的那一列，并且将新添加的元素添的高度添加到指定列的高度上
 */
const props = defineProps({
  data: {
    // 默认数据源
    type: Array,
    required: true,
    default: () => []
  },
  column: {
    // 渲染几列
    type: Number,
    default: 1
  },
  nodeKey: {
    // 唯一key
    type: String
  },
  gaps: {
    // [横向间距、纵向间距]
    type: [Number, Array],
    default: () => [10, 10]
  },
  isPicturePreReading: {
    // 是否需要等待图片预加载 （ false时， 每一项要有photoHeight、photoWidth）
    type: Boolean,
    default: true
  }
})

const {
  columnLefts,
  columnWidth,
  waterFallRoot,
  fmtGaps,
  columnHeights,
  rootHeight,
  init
} = useInit(props)

watch(
  () => props.data,
  async (newData) => {
    await nextTick()
    // 执行初始化数据，执行之后useInit的返回值为最新的数据
    if (props.isPicturePreReading) {
      // 等待与所有图片渲染完毕
      const itemHeights = waitAllImgCompile()
      // 动态设置每个元素的位置
      useLocation({
        columnLefts,
        itemHeights,
        columnWidth,
        columnHeights,
        rootHeight,
        fmtGaps,
        props
      })
    } else {
      const itemHeights = useImageHeights()

      useLocation({
        columnLefts,
        itemHeights,
        columnWidth,
        columnHeights,
        rootHeight,
        fmtGaps,
        props
      })
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 监听props.column的改变，重新初始化数据
watch(
  () => props.column,
  async (v) => {
    // 此时子组件还没有挂载到页面上、所以在init的dom操作并不能执行、所以需要在渲染之后执行init才做
    await nextTick()
    // 当检测到列变化后，将data中的_style删除掉，会触发重新渲染，进而触发重新布局
    props.data.forEach((item) => {
      delete item._style
    })
    init()
  },
  {
    immediate: true
  }
)
</script>
```

##### 20.3.4、封装通用瀑布流组件-water-fall

```vue
<template>
  <div
    ref="waterFallRoot"
    :style="{ height: `${rootHeight}px` }"
    class="relative overflow-hidden"
  >
    <!-- 只有列宽计算出来、并且data所有数据才展示数据 -->
    <template v-if="columnWidth && data.length > 0">
      <div
        class="__water-fall-item__ absolute duration-300 left-[-99999px]"
        v-for="(item, index) in data"
        :key="nodeKey ? item[nodeKey] : index"
        :style="{
          top: item._style?.top + 'px',
          left: item._style?.left + 'px',
          width: item._style?.width + 'px'
        }"
      >
        <div>{{ data._style }}</div>
        <slot :item="item" :width="columnWidth" />
      </div>
    </template>
  </div>
</template>

<script setup>
// 瀑布流通用組件

import { nextTick, watch } from 'vue'
import { useInit } from './useInit'
import { waitAllImgCompile, useImageHeights } from './usePicture'
import useLocation from './useLocation'
let timer = null

/**
 * 1、通过父组件的宽度、列数、间距计算出 每一列的left的值 columLefts
 * 2、创建一个数组记录每一列的高度 columHeights
 * 3、拿到传过来的数据进行依次渲染到 columHeights 高度最小的那一列，并且将新添加的元素添的高度添加到指定列的高度上
 */
const props = defineProps({
  data: {
    // 默认数据源
    type: Array,
    required: true,
    default: () => []
  },
  column: {
    // 渲染几列
    type: Number,
    default: 1
  },
  nodeKey: {
    // 唯一key
    type: String
  },
  gaps: {
    // [横向间距、纵向间距]
    type: [Number, Array],
    default: () => [10, 10]
  },
  isPicturePreReading: {
    // 是否需要等待图片预加载 （ false时， 每一项要有photoHeight、photoWidth）
    type: Boolean,
    default: true
  }
})

const {
  columnLefts,
  columnWidth,
  waterFallRoot,
  fmtGaps,
  columnHeights,
  rootHeight,
  init
} = useInit(props)

watch(
  () => props.data,
  async (newData) => {
    await nextTick()
    // 执行初始化数据，执行之后useInit的返回值为最新的数据
    if (props.isPicturePreReading) {
      // 等待与所有图片渲染完毕
      const itemHeights = waitAllImgCompile()
      // 有可能图片还没加载完成就有更新数据，可能会导致计算高度出错的情况，所以我们加上延时操作2
      timer = setTimeout(() => {
        if (itemHeights.value.length === newData.length) {
          clearTimeout(timer)
          useLocation({
            columnLefts,
            itemHeights,
            columnWidth,
            columnHeights,
            rootHeight,
            fmtGaps,
            props
          })
        }
      }, 50)
    } else {
      // 不需要预渲染
      const itemHeights = useImageHeights()
      // 动态设置每个元素的位置
      useLocation({
        columnLefts,
        itemHeights,
        columnWidth,
        columnHeights,
        rootHeight,
        fmtGaps,
        props
      })
      // }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// 监听props.column的改变，重新初始化数据
watch(
  () => props.column,
  async (v) => {
    // 此时子组件还没有挂载到页面上、所以在init的dom操作并不能执行、所以需要在渲染之后执行init才做
    await nextTick()
    // 当检测到列变化后，将data中的_style删除掉，会触发重新渲染，进而触发重新布局
    props.data.forEach((item) => {
      delete item._style
    })
    init()
  },
  {
    immediate: true
  }
)
</script>

<style></style>

```



#### 20.4、使用封装的瀑布流进行测试

先实现每一项的`list-item`组件

```vue
<template>
  <div
    class="bg-white dark:bg-zinc-900 dark:xl:bg-zinc-800 rounded overflow-hidden"
    :style="{ width: width + 'px' }"
  >
    <div class="rounded w-full cursor-zoom-in relative group">
      <img :src="pexel.photo" alt="" class="w-full rounded" :style="imgStyle" />
      <div
        class="absolute left-0 top-0 right-0 bottom-0 opacity-0 group-hover:bg-zinc-800/60 group-hover:opacity-100 duration-300"
      >
        <!-- 分享 -->
        <Button
          type="danger"
          class="absolute left-1.5 top-1.5 dark:bg-zinc-900 dark:text-zinc-300 border-none"
          >分享</Button
        >
        <!-- 收藏 -->
        <Button
          type="default"
          class="absolute right-1.5 top-1.5 bg-white dark:bg-zinc-900/60 border-none"
        >
          <svg-icon
            name="heart"
            class="fill-zinc-800 w-2 h-2 dark:fill-zinc-200"
          />
        </Button>
        <!-- 下载 -->
        <Button
          type="default"
          size="small"
          class="absolute left-1.5 bottom-1.5 bg-zinc-200/50 border-none dark:bg-zinc-900/60"
        >
          <svg-icon
            name="download"
            class="fill-zinc-600 w-2 h-2 dark:fill-zinc-200"
          />
        </Button>
        <!-- 全屏 -->
        <Button
          type="default"
          size="small"
          class="absolute right-1.5 bottom-1.5 bg-zinc-200/50 border-none dark:bg-zinc-900/60"
        >
          <svg-icon
            name="full"
            class="fill-zinc-600 w-2 h-2 dark:fill-zinc-200"
          />
        </Button>
      </div>
    </div>

    <h3 class="font-bold text-zinc-800 mt-1 text-sm dark:text-zinc-300 px-1">
      {{ pexel.title }}
    </h3>
    <div class="flex items-center mt-1 px-1 pb-1">
      <img
        :src="pexel.avatar"
        alt=""
        class="w-2 h-2 rounded-full overflow-hidden mr-1"
      />
      <span class="text-zinc-400 text-sm">{{ pexel.author }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pexel: {
    type: Object,
    required: true,
    default: () => ({})
  },
  width: {
    // 每一列的宽
    type: Number
  }
})

// 图片预加载时的宽高
const imgStyle = computed(() => {
  const { photoHeight, photoWidth } = props.pexel
  const height = (props.width / photoWidth) * photoHeight
  if (isNaN(height)) return {}
  return {
    height: height + 'px'
  }
})
</script>

<style></style>

```

在组件中使用瀑布流组件

```vue
<template>
  <div class="w-full">
    <!-- <list-item v-for="pexel in pexels" :key="pexel.id" :pexel="pexel" /> -->
    <water-fall
      :data="pexels"
      :column="isMoboleTerminal ? 2 : 5"
      :gaps="20"
      :isPicturePreReading="true"
    >
      <template v-slot="{ item, width }">
        <list-item :pexel="item" :width="width" />
      </template>
    </water-fall>
  </div>
</template>

<script setup>
import ListItem from './item/index.vue'
import { getPexels } from '@/api/pexels'
import { isMoboleTerminal } from '@/utils/flexible'
import { ref, watch } from 'vue'
const pexels = ref([])
const params = {
  page: 1,
  size: 20
}
const getPexelsData = async (params) => {
  const { list } = await getPexels(params)
  pexels.value = list
}
// 获取数据
getPexelsData(params)

// 监听数据
// watch(
//   () => isMoboleTerminal.value,
//   (va) => {
//     pexels.value = pexels.value.map((pexel) => {
//       const { _style, ...item } = pexel
//       return { ...item }
//     })
//   }
// )
</script>

```

![20220826_141617 (1)](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220826_141617%20(1).gif)

#### 20.5、总结

瀑布流是一个比较复杂的通用组件，因为我们要尽量做到普适，所以就需要考虑到各种场景下的处理方案,

尽量可以满足

日常开发的场景。所以这就在原本就复杂的前提下，让这个功能变得更加复杂了。

**下面我们就再来梳理一下整个瀑布流的构建过程**:

* 1.瀑布流的核心就是:通过relative 和absolute定位的方式，来控制每个 item 的位置
* 2．影响瀑布流高度的主要元素,通常都是img标签
* 3.有些服务端会返回关键img的高度，有些不会，所以我们需要分别处理;
	* 1.当服务端不返回高度时:我们需要等待 img 加载完成之后，再来计算高度，然后通过得到的高度
  	计算定位。否则则会出现高度计算不准确导致定位计算不准确的问题。
  	
  * 2.当服务端返回高度时:开发者则必须利用此高度为 item 进行高度设定。一旦 item具备指定高度,那么我们
  就不需要等待 img加载的过程，这样效率更高，并且可以业务的逻辑会变得更加简单。
* 4.当进行响应式切换时,同样需要区分对应场景:
  * 1.当服务端不返回高度时:我们需要重新执行整个渲染流程，虽然会耗费一些性能，但是这样可以最大可能的避
    免出现逻辑错误。让组件拥有更强的普适性。
  * 2当服务端返回高度时:我们同样需要重新计算列宽和定位，但是因为 item具备明确的高度，所以我们可以
    直接拿到具体的高度，而无需重复整个渲染流程，从而可以实现更多的交互逻辑。比如:位移动画、将来的图片懒加载占位...

### 21、:通用组件:长列表 `infinite`构建分析

处理好瀑布流之后,接下来我们就需要来处理对应的长列表功能。
我们知道对于对于首页中的瀑布流而言，是需要进行长列表展示的，也就说它是一个分页的数据。
那么对于这种分页功能而言,我们又应该如何进行实现呢?

想要搞明白这个问题，那么同样我们需要分成两个方面来去看:

**1.长列表的实现原理是什么?**
**2.我们使用长列表时,希望如何进行使用?**

**长列表的实现原理**

所谓长列表分页加载，其实指的就是:**当滚动到列表底部时，加载数据**
那么我们想要实现咱们的长列表组件,围绕着的依然是这句话。

那么想要实现这个功能，我们需要做的核心的一点就是**能够监听到列表滚动到底部**

那么想要监听到列表滚动到底部的话，可以利用`IntersectionObserver`，该接口可以判断:目标元素与其祖先元素或顶级文档视窗(`viewport`)的交叉状态(是否可见)
那么我们就可以利用这个特性，把一个元素置于列表底部，当这个元素可见时则表示列表滚动到了底部。
那么原生的`IntersectionObserver`使用起来比较复杂，所以`vueuse`提供了`useIntersectionObserver`方法。



**那么分析好了，我们使用的时候应该如何去使用呢？**

```vue
<infinite-list
	v-model="" // 当前是否处于加载状态
    :isFinished="" // 数据是否全部加载完成
    @onLoad="" // 加载下一次数据的回调
>
	list
</infinite-list>
```

#### 21.1、封装hook - useIntersectionObserver

useIntersectionObserver.js

```js
import { watch, onUnmounted, isRef } from 'vue'
const useIntersectionObserver = (target, cb) => {
  let element = null
  let ios = null

  // 执行监听函数
  const handleEval = (element) => {
    ios = new window.IntersectionObserver((entries) => {
      cb && cb(entries[0])
    })
    ios.observe(element)
  }
  // 是否是ref对象？ 当时ref对象时执行watch函数，当不是ref对象时，直接执行监听函数
  if (isRef(target)) {
    watch(
      target,
      (t) => {
        if (!t) return
        element = t
        handleEval(element)
      },
      {
        immediate: true
      }
    )
  } else {
    element = target
    handleEval(element)
  }

  const stop = () => {
    ios && ios.unobserve(element)
  }
  const start = (ele) => {
    ios && ios.unobserve(ele || element)
    ios && ios.observe(ele || element)
  }
  // 卸载钱结束监听任何元素
  onUnmounted(() => {
    stop()
  })

  return {
    stop,
    start
  }
}
export default useIntersectionObserver

```

这个hook目的就是利用`IntersectionObserver`监视`dom`元素是否在可视范围内

#### 21.2、封装同用组件 - infinite-list

```vue
<template>
  <div class="w-full h-full overflow-auto">
    <!-- 展示列表内容插槽 -->
    <slot />
    <!-- 底部 ---加载中插槽 -->
    <div ref="infiniteLoadEle" class="py-0.5">
      <slot name="loading" v-if="!isFinished">
        <div class="py-1">
          <svg-icon
            name="infinite-load"
            class="w-3 h-3 block mx-auto animate-spin fill-zinc-500"
          />
        </div>
      </slot>
    </div>

    <!-- 底部 ---数据已全部加载完毕 -->
    <slot name="finished" v-if="isFinished">
      <div class="py-3">
        <div class="text-sm text-zinc-700 mx-auto text-center">
          暂无更多数据
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { nextTick, ref, watch, getCurrentInstance } from 'vue'
import useIntersectionObserver from './useIntersectionObserver'

const props = defineProps({
  modelValue: {
    // 当前是否处于加载状态
    type: Boolean,
    required: true
  },
  isFinished: {
    // 数据是否全部加载完成
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['update:modelValue', 'onLoad'])
// loading元素
const infiniteLoadEle = ref(null)
const isIntersectingRef = ref(false)
// 判断元素在 可视区域内或区域外相互切换时会触发回调
const { stop, start } = useIntersectionObserver(
  infiniteLoadEle,
  ({ isIntersecting }) => {
    // isIntersecting 表示元素是在可视范围内
    // 触发onLoad条件 isIntersecting 为true; modelValue为false; isFinished为false
    isIntersectingRef.value = isIntersecting
    judgeAndEmit()
  }
)

//判断条件并且触发onLoad
function judgeAndEmit() {
  if (isIntersectingRef.value && !props.modelValue && !props.isFinished) {
    // 修改状态为正在加载中
    emits('update:modelValue', true)
    emits('onLoad') // 触发加载
  }
}
    
// init的作用？ 当我们在上一个分类加载完毕后、切换至下个分类页，这个时候useIntersectionObserver一直都在可视范围内，所以切换后并不会重新请求；为了解决这个问题，在父组件中当用户切换分类后手动执行初始化函数init; init作用就是将监听的元素，取消监听、再开始监听；这样就会在开始监听时触发一次回调执行
const init = () => {
  start()
}

watch(
  () => props.modelValue,
  async (v) => {
    if (v) return false
    await nextTick()
    judgeAndEmit()
  }
)

// 向父组件暴露出的属性
defineExpose({
  ...getCurrentInstance(),
  init
})
</script>

<style></style>

```



#### 21.3、结合瀑布流组件的使用

```vue
<template>
  <div class="w-full">
    <infinite-list
      v-model="loading"
      :isFinished="isFinished"
      @onLoad="getPexelsData"
    >
      <water-fall
        :data="pexels"
        :column="isMoboleTerminal ? 2 : 5"
        :gaps="20"
        :isPicturePreReading="false"
      >
        <template v-slot="{ item, width }">
          <list-item :pexel="item" :width="width" />
        </template>
      </water-fall>
    </infinite-list>
  </div>
</template>

<script setup>
import ListItem from './item/index.vue'
import { getPexels } from '@/api/pexels'
import { isMoboleTerminal } from '@/utils/flexible'
import { ref } from 'vue'
const pexels = ref([])
// 是否正在加载中
const loading = ref(false)
// 数据是否已全部加载完毕
const isFinished = ref(false)

const params = {
  page: 1,
  size: 20
}
const getPexelsData = async () => {
  // 判断数据pexels是否为空？ 为空 page = 1; 不为空 page++
  if (pexels.value.length === 0) {
    params.page = 1
  } else {
    params.page++
  }
  const { list } = await getPexels(params)
  // 判断数据pexels是否为空？ pexels.value = list 否则 pexels.value.push(list)
  if (pexels.value.length === 0) {
    pexels.value = list
  } else {
    pexels.value.push(...list)
  }

  // 判断是否还有数据
  if (list.length !== params.size) {
    isFinished.value = true
  }
  // 将加载状态设置为false
  loading.value = false
}

// 监听数据
// watch(
//   () => isMoboleTerminal.value,
//   (va) => {
//     pexels.value = pexels.value.map((pexel) => {
//       const { _style, ...item } = pexel
//       return { ...item }
//     })
//   }
// )
</script>

<style></style>

```

当loading图标显示时，加载更多的瀑布流数据

### 22、实现图片懒加载指令 v-lazy

**为什么要使用图片懒加载**？

![image-20220827101927965](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220827101927965.png)

这个是在项目中截取的图片、可以看到在初始化时，我们加载了76张图片、而实际首屏在可视范围内也就只展示了10多张图片；

剩余的60来张图片完全没有必要在可视范围外加载，我们需要当图片在可视范围内再加载对应的图片

**图片懒加载的优点**：

* 1、减少服务器带宽、资源
* 2、提升用户首屏加载速度、用户体验更好

**图片懒加载实现原理**

那么图片懒加载如何进行实现呢?

想要搞明白这个，我们就需要先明白图片懒加载的原理是什么。

所谓图片懒加载指的是:**当图片不可见时，不加载图片。当图片可见时，才去加载图片。**
大家看见这个**“不可见&&可见**"是不是觉得很眼熟。是啊，这不就是实现长列表时用过的套路吗?
所以据此,咱们的实现方案是不是就呼之欲出了。
**我们可以监听所有图片是否被可见，如果图片处于不可见状态，那么就不加载图片，如果图片处于可见状态，那么开始加载图片。**
而这个功能的实现关键就是 **IntersectionObserver**,

#### 22.1、实现图片懒加载v-lazy指令

![image-20220827110753001](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220827110753001.png)

src/directives/modules/lazy/index.js

```js
import useIntersectionObserver from '@/libs/infinite-list/useIntersectionObserver'
// 处理图片懒加载
// 1、在元素挂载到页面中的钩子函数中、保存img的src
// 2、将img的src属性置为 空 或者置位默认图片
// 3、监听图片是否在可视范围内？ 在可视范围内将img保存在src重新复制到img上 并 取消监听
export default {
  mounted(el, { value = null }) {
    // 1、在元素挂载到页面中的钩子函数中、保存img的src
    const catchSrc = el.src
    // 2、将img的src属性置为 空 或者置位默认图片
    el.src = value
    //  3、监听图片是否在可视范围内？
    const { stop } = useIntersectionObserver(el, ({ isIntersecting }) => {
      if (isIntersecting) {
        // 4、在可视范围内将img保存在src重新复制到img上 并 取消监听
        el.src = catchSrc
        stop()
      }
    })
  }
}
```

useIntersectionObserver.js

```js
import { watch, onUnmounted, isRef } from 'vue'
const useIntersectionObserver = (target, cb) => {
  let element = null
  let ios = null

  // 执行监听函数
  const handleEval = (element) => {
    ios = new window.IntersectionObserver((entries) => {
      cb && cb(entries[0])
    })
    ios.observe(element)
  }
  // 是否是ref对象？ 当时ref对象时执行watch函数，当不是ref对象时，直接执行监听函数
  if (isRef(target)) {
    watch(
      target,
      (t) => {
        if (!t) return
        element = t
        handleEval(element)
      },
      {
        immediate: true
      }
    )
  } else {
    element = target
    handleEval(element)
  }

  const stop = () => {
    ios && ios.unobserve(element)
  }
  // 卸载钱结束监听任何元素
  onUnmounted(() => {
    stop()
  })

  return {
    stop
  }
}
export default useIntersectionObserver

```

#### 22.3、将指令注册到app中

src/directives/index.js

```js
import lazy from './modules/lazy'
export default {
  install(app) {
    console.log(app)
    app.directive('lazy', lazy)
  }
}
```

在main.js中

```js
import { createApp } from 'vue'
import '@/styles/index.css'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { useREM } from '@/utils/flexible'
import { useTheme } from '@/utils/theme'
import libs from '@/libs'
import directives from '@/directives' // + 引入注册指令模块
import 'virtual:svg-icons-register'

useREM()
useTheme()

createApp(App).use(router).use(store).use(libs)
    .use(directives) // + 注册指令
    .mount('#app')
```



#### 22.2、测试v-lazy指令

在瀑布流中使用v-lzay指令，效果如下

![image-20220827110148142](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220827110148142.png)

可以看到首屏加载值请求了27个图片数据，当我们进行屏幕滚动时，也会发现请求会随着滚动而增加

![20220827_110352](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220827_110352.gif)

### 23、图片白屏分析

如下图所示、当图片加载比较慢的时候，会出现以下图片区域显示空白的情况；

![image-20220827111533122](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220827111533122.png)

面对这种情况，我们可以使用在懒加载v-lazy添加默认图片的方式

```vue
<img
     alt=""
     class="w-full rounded"
     v-lazy="'http://121.5.230.70/images/article_default.jpg'"
/>
```

![image-20220827112039879](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220827112039879.png)

但这种每个都显示这种图片看着就有点审美疲劳了，所以我们可以给每个图片设置个随机颜色来作为图片加载完成前的填充

我们可以实现一个自定义指令`v-bg-color`设置背景色

### 24、实现图片懒加载指令 `v-bg-color`

**实现思路**：

* 1、在元素插入浏览器之前、设置背景色

```	js
export default {
  beforeMount(el, { value }) {
    console.log(el, value)
    el.style.backgroundColor = value
  }
}
```

**注册指令：**

```js
import lazy from './modules/lazy'
import bgColor from './modules/bg-color'
export default {
  install(app) {
    console.log(app)
    app.directive('lazy', lazy)
    app.directive('bg-color', bgColor)
  }
}
```

#### 24.1、测试自定义`v-bg-color`指令

```vue
<img
     alt=""
     class="w-full rounded"
     v-bg-color="createRandomColor()"
     v-lazy="'http://121.5.230.70/images/article_default.jpg'"
/>
```

创建随机颜色函数

```js
/**
 * 创建随机颜色
 * @returns
 */
export const createRandomColor = () => {
  const randomNum = () => Math.floor(Math.random() * 256)
  return `rgba(${randomNum()}, ${randomNum()}, ${randomNum()})`
}
```

![20220827_113758 (1)](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220827_113758%20(1).gif)

可以看出我们的自定义颜色指令已经能够使用了

### 25、实现自动注册自定义指令

在**14章节，我们实现了自动注册组件**，那么可以直接将14章节的内容搬过来吗？

答案： 不可以

因为**在14章节、实现的自动注册组件是异步的**，而我们自定义指令不需要异步注册、所以不能通用



再笨章节我们需要使用到的技术就是[import.meta.globEager](https://vitejs.cn/guide/features.html#glob-import)

![image-20220827115319317](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220827115319317.png)

```js
export default {
  install(app) {
    const directives = import.meta.globEager('./modules/*/*.js')
    for (const [key, value] of Object.entries(directives)) {
      console.log(key, value)
        // ./modules/bg-color/index.js  { default: { ... } }
        // ./modules/lazy/index.js   { default: { ... } }
    }
  }
}
```

完整案例

src/directives/index.js

```js
export default {
  install(app) {
    // 加载指令对象
    const directives = import.meta.globEager('./modules/*/*.js')
    for (const [key, value] of Object.entries(directives)) {
      // 转化name
      const name = key
        .replace(/\.\/\w+\/(.+)?\/index\.js/, '$1')
        .replace(/-(\w)/g, (match, $1) => {
          return $1.toUpperCase()
        })
      // 绑定指令
      app.directive(name, value.default)
    }
  }
}

```

### 26、解决弹框在移动端出现点击穿透的问题

首先我们先看一个图片

![757c3e6e2572809a0182970ba908df2e (2)](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/757c3e6e2572809a0182970ba908df2e%20(2).gif)

当我点击`popup`弹出层弹出的对应菜单时、弹出层隐藏后会触发下面的元素的点击事件； 这就是典型的点击穿透：

**什么是点击穿透**？

所谓的点击穿透就是在移动端的`click`事件有`300ms`延时执行（因为移动端有双击事件、滑动事件、所以需要等待300ms看是否还有其他操作）

在`300ms`内点击的元素隐藏了，那么就会穿透到底层元素，会触发到底层元素的点击事件；

**如何解决点击穿透**？

* 1、移动端的点击事件都换成`touch`事件或者`click`事件 
* 2、`click`事件延迟`350ms`执行
* 3、使用第三方库封装好的点击事件

在本项目中采用方案1中的解决办法、把click事件换成`touch`事件

注意：在菜单列表中，我们还有滑动的功能、所以不能简单的使用`touchstart`或者`touchend`来替换`click`事件、我们需要做兼容处理：

兼容方法：

**当有滑动时，不触发事件；当没有滑动时、触发事件**



**旧代码**

```vue
	<li
        class="p-1 text-zinc-700 text-base"
        v-for="(category, index) in categorys"
        :key="category.id"
        @click="$emit('handleSelectCategory', index)"
      >
        {{ category.name }}
      </li>
```



**修改后**

```vue
      <li
        class="p-1 text-zinc-700 text-base"
        v-for="(category, index) in categorys"
        :key="category.id"
        @touchstart="onTouchStart(index)"
        @touchmove="onTouchmove(index)"
        @touchend="onTouchEnd(index)"
      >
        {{ category.name }}
      </li>

<script setup>
const emits = defineEmits(['handleSelectCategory'])
let isMoved = false
// 解决点击穿透的问题
const onTouchStart = (index) => {
  isMoved = false
}
const onTouchmove = (index) => {
  isMoved = true
}
const onTouchEnd = (index) => {
  if (!isMoved) {
    emits('handleSelectCategory', index)
  }
</script>
```



### 27、解决infinite-list bug- 切换分类页后不能重新请求的问题

![20220829_114732 (3)](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220829_114732%20(3).gif)





我们先看一下这个bug、如上图所示： **在某一个分类中滚动到最后，然后切换至其他的分类不能发起去请求的问题**



这个问题的本质就是：

	首先我们的`infinite-list`组件内是通过**`IntersectionObserver`来监听`loading`元素是否在可视范围内**
	
	**如果在可视范围内则不发送请求、反之发送请求**



明确了发送请求的逻辑则不难得知、上面的bug不发送请求的原因是因为：

* 当加载到底部时`loading`元素在**可视范围内**
* 当切换分类标签后、`loading`元素依然在**可视范围内**、所以没有发送请求



**解决思路：**

`IntersectionObserver`创建的实例对象中有两个`api`: `observe` 和 `unobserve`分别是监听元素和移除监听的两个api

我们可以在`infinite-list`创建一个`init函数`

**init函数的作用**

* 先通过`unobserve`移除监听的`loading`元素； 再通过`observe`监听`loading`元素

这样监听时会触发一次元素在可视范围内的回调

```js
const start = (ele) => { // start === init;
    ios && ios.unobserve(ele || element)
    ios && ios.observe(ele || element)
  }
```



### 28、父组件获取子组件的实例 - 调用属性获取方法

在`vue2`中父组件可以通过`ref`属性直接获取到子组件的实例；从而可以调取子组件内部的属性和方法

但是在`vue3`是不同的，通过`ref`获取组件实例要通过**回调函数**获取，并且还要通过在子组件中[`defineExpose`](https://cn.vuejs.org/api/sfc-script-setup.html#defineexpose)向外暴露竖向和方法；

另一个api是`getCurrentInstance`

**getCurrentInstance**获取当前组件的实例，注意只能获取options Api中的数据





Child.vue

```vue

<script setup>
import { nextTick, ref, watch, getCurrentInstance } from 'vue'
    
const init = () => {
  console.log('child init')
}
// 向外界暴露属性和方法
defineExpose({
  ...getCurrentInstance(),
  init: 
})
</script>
```

Father.vue

```vue
<template>
	<Child :ref="getChildInstance"></Child>
</template>
<script setup>
import { nextTick, ref, watch, getCurrentInstance } from 'vue'
const childInstance = ref(null)
// 获取子组件实例
const getChildInstance = (el) => {
    childInstance.value = el
    childInstance.value.init() // 'child init'
}
</script>
```



> 注意子组件如果想要通过`getCurrentInstance().ctx.$parent`获取父组件实例也只能获取到options Api 如果要获取到setup函数中的数据，父组件也需要`defineExpose`向外界导出可以访问的属性或者方法





### 29、设置不同主题下的滚动条的样式

在不同主题下滚动条样式如下：

**极简白**

![image-20220830100938727](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220830100938727.png)

**极夜黑**

![image-20220830100959365](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220830100959365.png)

**实现思路：**

* 1、在vuex中获取当前正在使用的主题色
* 2、在constants中取出定义的不同主题下的滚动条的颜色样式、结合主题色生成当前主题的滚动条颜色
* 3、在`APP.vue`中利用vue3中新添加的属性 [**CSS 中的 `v-bind()`**](https://cn.vuejs.org/api/sfc-css-features.html#v-bind-in-css)给滚动条动态绑定颜色

**开始实现**：

constants/index.js

```js
// 定义默认滚动主题
export const DEFAULT_SCROLL_THEME = {
  dark: {
    track: {
      // 轨道颜色
      bgc: '#333',
      boxShadow: `inset 0 0 6px rgba(255,255,255,0.2)`
    },
    thumb: {
      // 滑块颜色
      bgc: '#333',
      boxShadow: `inset 0 0 6px rgba(255,255,255,.6)`
    }
  },
  light: {
    track: {
      // 轨道颜色
      bgc: '#fefefe',
      boxShadow: `inset 0 0 6px rgba(0,0,0,0.2)`
    },
    thumb: {
      // 滑块颜色
      bgc: '#fefefe',
      boxShadow: `inset 0 0 6px rgba(0,0,0,0.3)`
    }
  }
}

```

APP.vue

```vue
<script setup>
import HelloWorld from '@/components/HelloWorld.vue'
import { isMoboleTerminal } from '@/utils/flexible'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
// 获取当前主题下对应的滚动条样式
const scrollTheme = computed(() => store.getters.scrollTheme)
</script>

<template>
  <div class="w-screen h-screen fixed top-0 left-0">
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style lang="scss">
/*定义滚动条高宽及背景

 高宽分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 8px;
  height: 16px;
}

/*定义滚动条轨道
 
  内阴影+圆角*/

::-webkit-scrollbar-track {
  -webkit-box-shadow: v-bind('scrollTheme.track.boxShadow'); // 使用v-bind动态绑定样式
  border-radius: 10px;
  background-color: v-bind('scrollTheme.track.bgc');
}

/*定义滑块
 
  内阴影+圆角*/

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: v-bind('scrollTheme.thumb.boxShadow');
  background-color: v-bind('scrollTheme.thumb.bgc');
}
</style>

```

### 30、封装通用组件 - confirm 全局弹框 （vnode+ h函数+render函数明确）

**confirm构建思路**

那么想要搞明白这一点，我们就需要了解一些比较冷僻的知识点，那就是渲染函数，在渲染函数中，我们需要了解如下概念:

* **虚拟dom**: 通过js来描述dom

* **vnode虚拟节点**: 告诉vue页面上需要渲染什么样子的节点

* **h函数:** 用来创建`vnode`的函数，接受三个参数(要渲染的 `dom`，`attrs对象`，子元素)

* **render**函数:可以根据`vnode`来渲染`dom`

  

根据以上所说我们知道:通过`h函数`可以生成一个`vnode`，该 `vnode` 可以通过 `render`函数被渲染

所**以据此我们就可以得出 `confirm` 组件的实现思路:**
  1．创建一个`confirm `组件
  2．创建一个`index.js`模块，在该模块中返回一个 `promise`

  3.同时利用h函数生成`confirm`  `vue`的`vnode`
  4．最后利用`render`函数，渲染`vnode`到 `body`中

**首先看一下封装`confirm`的结构**

![image-20220830160243841](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220830160243841.png)

说明： 

`confirm/index.vue`：是confirm组件

`confirm/index.js`：是confirm导出的函数，通过调用函数可以触发confirm显示



#### 30.1、封装`confirm`组件

> 在封装之前，我们需要明确、当前要封装的组件，和我们Vue主程序的组件是不一样的；我们可以把它和主程序看做是两个不同的程序、所以它不能直接从主程序注册的组件中拿过来使用、也不能获取到主程序的app

那么我们开始封装：

**封装细节：**

* 1、由于`confirm`是有动画的、并且将来我们要将confirm对应的`vnode`通过`render`函数挂载到真实`dom`上；所以**我们要先等组件挂载到页面上之后再控制confirm显示**; 同样，**我们要等到关闭动画执行完之后再将真实dom从页面上移除**

```vue
<template>
  <!-- 遮罩层 -->
  <transition name="fade">
    <div
      class="bg-zinc-900/80 fixed w-full h-screen left-0 top-0 z-50"
      v-if="visible"
      @click="onClose"
    ></div>
  </transition>
  <!-- 内容 -->
  <transition name="up">
    <div
      class="w-[80%] bg-white rounded p-1.5 dark:bg-slate-800 z-50 xl:w-1/3 fixed left-1/2 top-1/3 translate-x-[-50%]"
      v-if="visible"
    >
      <!-- title标题 -->
      <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
        {{ title }}
      </div>
      <!-- content内容 -->
      <div class="text-sm text-zinc-700 dark:text-zinc-300">
        {{ content }}
      </div>
      <!-- 底部按钮 -->
      <div class="flex justify-end items-center">
        <Button type="default" class="mr-1" @click="onCancel">{{
          cancelText
        }}</Button>
        <Button type="primary" @click="onOk">{{ okText }}</Button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Button from '../Button/index.vue'
import { onMounted, ref } from 'vue'
const DURATION = '0.5s' // 定义过渡时间
const props = defineProps({
  title: {
    // 标题
    type: String
  },
  content: {
    // 内容
    type: String,
    required: true
  },
  cancelText: {
    // 删除按钮文字
    type: String,
    default: '取消'
  },
  okText: {
    // 确认按钮文字
    type: String,
    default: '确认'
  },
  onCancel: {
    // 取消按钮事件
    type: Function
  },
  onOk: {
    // 确认按钮事件
    type: Function
  },
  close: {
    // 关闭按钮事件
    type: Function
  }
})
// confirm是否可见
const visible = ref(false)
// 这里onMounted的作用是，等待组件挂载到页面之后再执行就会有动画效果
onMounted(() => {
  visible.value = true
})
// 关闭事件
const onClose = () => {
  visible.value = false
  // 等动画执行完之后再再调用close事件 
  setTimeout(() => {
    props.close?.()
  }, Number.parseFloat(DURATION) * 1000)
}
// 取消事件
const onCancel = () => {
  props.onCancel?.()
  onClose()
}

// 取消确认
const onOk = () => {
  props.onOk?.()
  onClose()
}
</script>

<style lang="scss" scoped>
/* 遮罩层过渡 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}

/* 弹框过渡 */
.up-enter-from,
.up-leave-to {
  transform: translate3d(-50%, 100px, 0);
  opacity: 0;
}
.up-enter-active,
.up-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}
</style>

```

#### 30.2、封装`confirm`组件api调用函数

confirm/index.js

**函数的作用**：

* 1、当函数被调用时`confirm`组件展示
* 2、函数的返回值为`promise`对象、
  * 2.1、当用户点击取消按钮时、promise状态为`拒绝`状态
  * 2.2、当用户点击确认按钮时、promise状态为`成功`状态
* 3、title和content至少有一个、当title有时content没有时，把title的值赋值给content，title的值置为空

**实现的一些api说明：**

**h函数**：[官网](https://cn.vuejs.org/api/render-function.html#h) 根据传入的参数生成对应的`vnode` 虚拟`dom`

	我们常见的h函数的第一个参数一般都是标签名， 但是在`vue3`提供的**h函数** **第一个参数不但可以接收字符串变签名，还可以支持组件**

**render函数**： 在vue3中有两种render： 第一种就是组件中的render，它返回一个vnode树； 第二种就是本次使用的render,它的作用就是将虚拟dom渲染到真实dom中

```js
import { h, render } from 'vue'
import ConfirmComponent from './index.vue'

export default (options) => {
  return new Promise((resolve, reject) => {
    let {
      title,
      content,
      cancelText,
      okText,
      onCancel: onCancelFn,
      onOk: onOkFn,
      close: closeFn
    } = options
    if (!title && !content)
      return console.error(`【confirm】 title or content must be have value!`)
    if (title && !content) {
      content = title
      title = ''
    }
	// 处理取消回调
    const onCancel = () => {
      onCancelFn?.()
      reject('cancel')
    }
    // 处理确认回调
    const onOk = () => {
      onOkFn?.()
      resolve('confirm')
    }
	// 在用户点击关闭弹框后，会延时500ms执行close，目的是让动画走完
    const close = () => {
      closeFn?.()
       // 此时动画已经走完、所以将组件从页面中移除
      render(null, document.body)
    }

    // 通过h函数将Confirm组件创建成对应的虚拟dom ， 第二项传入组件的属性值
    const vnode = h(ConfirmComponent, {
      title,
      content,
      cancelText,
      okText,
      onCancel,
      onOk,
      close
    })

    // 通过render函数创虚拟dom挂载到真实dom上
    render(vnode, document.body)
  })
}

```

#### 30.3、测试

```js
import confirm from '@/libs/confirm/index'
const onClickDelectAll = () => {
  confirm({
    title: '提示',
    content: '确认删除全部历史记录吗？',
    cancelText: '不删了',
    okText: '全部删掉'
  })
    .then((res) => {
      store.commit('search/removeAllHistory')
      console.log(res)
    })
    .catch((e) => {
      console.log(e)
    })
}
```



![image-20220830172046623](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220830172046623.png)



### 31:通用组件:方法触发的message构建分析

在之前的时候，我们构建过一个 confirm 的通用组件，该组件我们可以直接通过方法进行调用展示
那么对于咱们接下来打算构建的message组件，同样如此，我们依然希望可以通过方法的调用直接展示对应的组件。
那么根据我们之前的经验，我们知道:
1.首先我们需要先构建出一个对应的`message/index.vue`

2．然后构建出对应的message/index.js模块
3.在模块中,通过:

	`h`函数构建`vnode`
	
	`render`函数,进行渲染
进行处理。
那么以上方式，就是是咱们message的构建过程。

**我们要实现的`message`的功能**

* 1、要有四种状态：`success`、`warning`、`error`、`info`
* 2、屏幕支持同时创建多个`message`，多个`message`自上而下排列
* 3、显示和隐藏时要有自上而下的过渡动画
* 4、当有新的`message`展示时，其他的`message`要暂停隐藏、直到空闲500ms后再隐藏



**主要说明**：

> 如果需要同屏显示多个message实例的话，我们需要对每一个message实例创建一个div、并将div挂载到页面上

#### 31.1、实现message

```vue
<template>
  <transition name="down">
    <div
      class="message-box text-base rounded-sm shadow-md cursor-pointer border overflow-hidden p-1 min-w-[380px] fixed z-50 left-1/2 top-4 translate-x-[-50%]"
      :style="typeStyle.divStyle"
      v-if="visible"
    >
      <span :style="typeStyle.spanStyle" class="leading-3">{{ message }}</span>
    </div>
  </transition>
</template>
<script>
const TYPES_SUCCESS = 'success'
const TYPES_ERROR = 'error'
const TYPES_WARNING = 'warning'
const TYPES_INFO = 'info'

const TYPES_STYLE = {
  [TYPES_SUCCESS]: {
    divStyle: 'background-color:#f0f9eb; border-color:#e1f3d8;',
    spanStyle: 'color:#67C23A'
  },
  [TYPES_ERROR]: {
    divStyle: 'background-color:#fef0f0;border-color:#fde2e2;',
    spanStyle: 'color:#F56C6C'
  },
  [TYPES_WARNING]: {
    divStyle: 'background-color:#fdf6ec;border-color:#faecd8;',
    spanStyle: 'color:#E6A23C'
  },
  [TYPES_INFO]: {
    divStyle: 'background-color:#edf2fc;border-color:#EBEEF5;',
    spanStyle: 'color:#909399'
  }
}
const DURATION = '0.5s' // 定义过渡时间
</script>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { idMapTime, canClose } from './index'
import { contralTimeout } from '@/utils'
const props = defineProps({
  type: {
    type: String,
    default: TYPES_INFO,
    validator(key) {
      const types = [TYPES_SUCCESS, TYPES_ERROR, TYPES_WARNING, TYPES_INFO]
      if (!types.includes(key)) {
        console.error('type must be ' + types.join('、'))
      }
      return true
    }
  },
  message: {
    type: String,
    required: true
  },
  close: {
    type: Function
  },
  duration: {
    // 多久关闭 ms
    type: Number,
    default: 3000
  },
  id: {
    type: Number
  }
})
const visible = ref(false)
const typeStyle = computed(() => {
  const styles = TYPES_STYLE[props.type]
  const top = `top: ${62 * (props.id - 1) + 16}px;`
  styles.divStyle += top
  return styles
})
const showTime = computed(() => Math.max(props.duration, 0)) // 展示时间 ms
const { start, stop } = contralTimeout(
  showTime.value + idMapTime.value[props.id],
  () => {
    visible.value = false
  }
)
// 挂载之后再显示
onMounted(() => {
  visible.value = true
  // showTime ms后关闭显示，此时开始执行关闭动画 DURATION 时间后动画执行完毕、开始调用close函数
  // setTimeout(() => {
  //   visible.value = false
  // }, showTime.value + idMapTime.value[props.id])
})

watch(visible, (v) => {
  if (!v) {
    // 此时开始执行关闭动画 DURATION 时间后动画执行完毕、开始调用close函数
    // props.close?.(props.id)
    setTimeout(() => {
      delete idMapTime.value[props.id]
      props.close?.()
    }, Number.parseFloat(DURATION) * 1000)
  }
})

// 当可以关闭之后再进行开始定时器、当不可关闭后关闭定时器
watch(canClose, (v) => {
  if (v) {
    start()
  } else {
    stop()
  }
})
</script>

<style lang="scss" scoped>
.down-enter-from,
.down-leave-to {
  transform: translate3d(-50%, -2.5rem, 0);
  opacity: 0;
}
.down-enter-active,
.down-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}
</style>
```



message/index.js

```js
import { h, render, ref } from 'vue'
import messageComponent from './index.vue'
let count = 0
let timer = null
export const canClose = ref(false)
export const idMapTime = ref({})
export default class Message {
  static init(props) {
    clearTimeout(timer)
    canClose.value = false
    timer = setTimeout(() => {
      canClose.value = true
    }, 500)
    ++count
    idMapTime.value[count] = count * 150
    const el = document.createElement('div')
    document.body.appendChild(el)
    // 当关闭动画执行完成之后调用此函数，此函数卸载dom
    const onClose = (id) => {
      props.onClose?.()
      render(null, el)
      document.body.removeChild(el)
      --count
    }
    // 将messageComponent转化成虚拟dom数
    const vnode = h(messageComponent, { ...props, close: onClose, id: count })
    // 利用render函数，将虚拟dom树挂载到body上
    render(vnode, el)
  }
  /**
   * message:
   *
   */
  static success(message, onClose) {
    Message.init({ message, onClose, type: 'success' })
  }
  static warning(message, onClose) {
    Message.init({ message, onClose, type: 'warning' })
  }
  static error(message, onClose) {
    Message.init({ message, onClose, type: 'error' })
  }
  static info(message, onClose) {
    Message.init({ message, onClose, type: 'info' })
  }
}

```



utils/index/js

```js
/**
 * 可控定时器
 * @param {*} time
 * @param {*} cb
 * @returns
 */
export const contralTimeout = (time, cb) => {
  // 是否正在启动
  const isStart = ref(false)
  const isFinish = ref(false)
  let relTime = 0
  let timer = setInterval(() => {
    if (isStart.value) {
      relTime += 5
    }
    if (relTime >= time) {
      clearInterval(timer)
      isFinish.value = true
      cb && cb()
    }
  }, 5)
  const stop = () => {
    isStart.value = false
  }
  const start = () => {
    isStart.value = true
  }

  return {
    stop,
    start,
    isStart,
    isFinish
  }
}

```

#### 31.2、测试效果

```js
import Message from '@/libs/message/index'
const show = () => {
  Message.success('下载成功')
}
```

![20220831_142332](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220831_142332.gif)



### 32、使用`file-saver`实现文件下载

当我们点击item中的下载按钮时，我们期望可以下载当前的图片。
那么想要实现该功能,则需要使用到专门的下载包。
目前常用的支持下载功能包有两个:
1．小文件下载:[file-saver](https://github.com/eligrey/FileSaver.js)
2.大文件下载: [streamsaver](https://github.com/jimmywarting/StreamSaver.js)

咱们的图片下载属于小文件的下载，所以我们可以直接使用file-saver

* 1．安装file-saver :

  ```powershell
  $ npm i --save file-saver@2.0.5
  ```

* 2.在 src/views/main/components/list/item.vue中，增加下载功能:

  ```js
  import { saveAs } from 'file-saver'
  import Message from '@/libs/message/index'
  
  const handleDownload = (pexel) => {
    Message.success('下载成功')
    setTimeout(() => {
      saveAs(pexel.photoDownLink)
    }, 100)
  }
  ```
  
  
  
  

### 33、实现全屏展示功能

我们知道在原生`dom`上，提供了一些方法来供我们开启或关闭全屏：

* [`Element.requestFullscreen()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/requestFullScreen)
* [`Document.exitFullscreen()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/exitFullscreen)
* [`Document.fullscreen`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/fullscreen)
* [`Document.fullscreenElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/fullscreenElement)

#### 一般浏览器

使用`requestFullscreen()`和`exitFullscreen()`来实现

#### 早期版本Chrome浏览器

基于WebKit内核的浏览器需要添加`webkit`前缀，使用`webkitRequestFullScreen()`和`webkitCancelFullScreen()`来实现。

#### 早期版本IE浏览器

基于Trident内核的浏览器需要添加`ms`前缀，使用`msRequestFullscreen()`和`msExitFullscreen()`来实现，注意方法里的screen的s为小写形式。

#### 早期版本火狐浏览器

基于Gecko内核的浏览器需要添加`moz`前缀，使用`mozRequestFullScreen()`和`mozCancelFullScreen()`来实现。

#### 早期版本Opera浏览器

Opera浏览器需要添加`o`前缀，使用`oRequestFullScreen()`和`oCancelFullScreen()`来实现。



```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>萌狼蓝天 伴姬一生</title>
</head>

<body>
    <div>
        <img src="./source/img/dog.jpg" height="300" alt="">
        <button id="full">全屏显示</button>
        <button id="cancelFull">取消全屏</button>
        <button id="isFull">是否全屏</button>
        <p id="tip" style="color:blue"></p>
    </div>
    <script>
        //全屏显示
        var div = document.querySelector('div');
        document.querySelector('#full').onclick = function () {
            if (div.requestFullscreen) {
                div.requestFullscreen(); // 正常浏览器 
            } else if (div.webkitRequestFullScreen) {
                div.webkitRequestFullScreen(); // webkit 
            } else if (div.mozRequestFullScreen) {
                div.mozRequestFullScreen(); //早期火狐浏览器
            } else if (div.oRequestFullScreen) {
                div.oRequestFullScreen(); //早期Opera浏览器
            } else if (div.msRequestFullscreen) {
                div.msRequestFullscreen(); //早期IE浏览器
            } else {
                alert('暂不支持在您的浏览器中全屏');
            }
        };
        //取消全屏显示
        document.querySelector('#cancelFull').onclick = function () {
            if (document.exitFullscreen) {
                document.exitFullscreen(); // 正常浏览器 
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen(); // webkit 
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen(); //早期火狐浏览器
            } else if (document.oCancelFullScreen) {
                document.oCancelFullScreen(); //早期Opera浏览器
            } else if (document.msCancelFullscreen) {
                document.msCancelFullscreen(); //早期IE浏览器
            } else {
                alert('暂不支持在您的浏览器中全屏');
            }
            //可以用document，也可以用上方设置的变量 div
        };
        //检测当前是否处于全屏状态
        document.querySelector('#isFull').onclick = function () {
            // alert(document.webkitIsFullScreen); // webkit
            // 使用上面的弹窗方式。如果是处于全屏状态，会自动退出
            document.getElementById('tip').innerHTML=document.webkitIsFullScreen;
        };
    
    </script>
</body>

</html>
```





但是这些方法：在一些低版本浏览器中存在兼容性的问题，需要我们手动封装；如果不想封装的话也可以使用第三方封装好的库来处理：

**常见的第三方全屏库：**

* 1、`vueUse`

```js
import { useFullscreen } from '@vueuse/core'

const imgEle = ref(null)
const { isFullscreen, enter, exit, toggle } = useFullscreen(imgEle)
const handleFullScreen = () => {
  imgEle.value.style.backgroundColor = 'transparent'
  enter()
}
```

### 34、从首页跳转到详情页解决方案

#### 34.1、需求分析

首先我们看一下首页的图片

![image-20220902162832479](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220902162832479.png)

**分析：**

* 当点击某一个图片时、跳转到对应图片的详情页
* 并且在跳转的过程中有从小到放大的动画的效果（类似于全屏效果的动画）

#### 34.2、分析现阶段路由跳转动画

在[vue-router](https://router.vuejs.org/zh/guide/advanced/transitions.html)页面跳转如果要实现跳转到动画，需要借助于[transition](https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component)组件来进行实现动画

```vue
<router-view v-slot="{ Component, route }">
  <transition name="fade">
    <component :is="Component" />
  </transition>
</router-view>
```

![image-20220902164012102](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220902164012102.png)



这是在vue官网截的图，从图中我们可以得知transition组件一般适用于 组件 或 元素的显示和隐藏、并不适合我们的需求、

#### 34.3、提出解决方案

那么根据咱们上一小节的分析，我们知道通过 `vue-router` 的过渡动效是无法实现咱们期望的路由切换效果的。

**那么我们应该如何去做呢?**

想要搞明白咱们的可行性方案，**那么首先我们得先来搞清楚什么是路由的跳转?**

所谓路由的跳转无非指的是两个部分:

* 1．浏览器的url 发生了变化

* 2．浏览器中展示的页面组件发生了变化

  

那么只要满足这两点,我们就认为路径进行了跳转

**所以说，我们是不是可以换个思路，我们不去进行真实的路由跳转，而是先修改浏览器的URL，再切换展示的页面(以组件的形式覆盖整个浏览器可视区域)。这样对于用户而言，是不是就完成了整个的路由跳转工作。**



所以说我们的具体问题就变成了:

* 1.如何让浏览器的url发生变化,但是不跳转页面
* 2.如何让一个新的组件以包含动画的形式进行展示
  * 那么想要完成第一个功能我们可以使用:`History.pushState()`方法
  * 而第二个功能我们可以使用 `GSAP`这个动画库来进行实现。



#### 34.4、关于GSAP介绍

[GSAP](https://github.com/greensock/GSAP), 它是一个非常强大的js动画库, 他支持`Flip`、滚动动画等；在其内部给我们提供了非常多的方法供我们来使用；

本次我们使用到的`api`，只有`set`和`to`两个：

* `set`: 给元素设置初始化（动画执行之前）的属性

* `to`: 给元素设置结束时（动画之后结束）的属性

  * to方法的返回值为`tween`对象、我们通过调用对应的api来控制元素动画的开启、暂停、翻转、重新开始...

    ```js
    tween.play()
    tween.pause()
    tween.resume()
    tween.reverse()
    tween.restart()
    ```

    

    



**测试1** - 自动执行动画

```vue
<template>
    <div  class="w-screen h-[400px] flex items-center justify-center">
      <div ref="testGsap" class="border border-zinc-300 rounded-sm p-4">test GSAP</div>
    </div>
</template>

<script setup>
import gsap from "gsap"
import { onMounted, ref } from 'vue'
const testGsap = ref(null)
onMounted(() => {
  gsap.set(testGsap.value, { transform: 'translateX(-100px)', color: 'blue' })
  gsap.to(testGsap.value, { transform: 'translateX(100px)', color: 'pink', duration: 1, delay: 0 })
})
</script>
```

![20220902_180847](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220902_180847.gif)

**测试2** - 手动控制执行动画

```vue
<template>
    <div  class="w-screen h-[400px] flex items-center justify-center">
      <div ref="testGsap" class="border border-zinc-300 rounded-sm p-4">test GSAP</div>
    </div>
    <Button @click="handleStart">执行动画</Button>
    <Button @click="handleReverse">翻转动画</Button>
</template>

<script setup>
import gsap from "gsap"
import { onMounted, ref } from 'vue'
const testGsap = ref(null)
let tween
onMounted(() => {
  gsap.set(testGsap.value, { transform: 'translateX(-100px)', color: 'blue' })
  tween = gsap.to(testGsap.value, { transform: 'translateX(100px)', color: 'pink', duration: 1, delay: 0 })
  tween.pause();
})
const handleStart = () => {
   tween.play()
}
const handleReverse = () => {
   tween.reverse()
}
</script>
```

> 也就是当我们不主动暂停的话， `gsap.to`函数调用之后就会开始执行动画



#### 34.5、实现从首页调到详情页

* 1、创建pins/components/pins.vue组件

  ![image-20220903100744179](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220903100744179.png)

* 2、在首页中使用`Pins`组件，并使用`translation`包裹、并设置执行动画

  ```vue
  <transition
      :css="false"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <Pins :id="currentItem.id" v-if="pinsVisible"/>
    </transition>
  
  ```

* 3、点击每一项时，计算当前项距离屏幕左边和边的距离、并利用h5的`pushState`改变地址栏路径

* 4、展示`Pins组件`， 在展示过程中在过渡钩子函数中设置对应的动画样式

* 5、当需要关闭Pins组件时； 我们需要监听页面的回退事件`popState`，当时间被调用时关闭Pins组件

**先看下我们要实现的效果**

![20220903_102106](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220903_102106.gif)

**开始实现**

list/index.js

```vue
<template>
  <div class="w-full">
    ...
  <!-- 图片详情 -->
  <transition
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <Pins :id="currentItem.id" v-if="pinsVisible"/>
  </transition>
</template>

<script setup>
import ListItem from './item/index.vue'
import { getPexels } from '@/api/pexels'
import { isMoboleTerminal } from '@/utils/flexible'
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import Pins from '@/views/pins/components/pins.vue'
import gsap from 'gsap'
import { useEventListener } from '@vueuse/core'

const store = useStore()

// 选中item
const selectItem = (item) => {
  currentItem.value = item
  // 修改页面地址
  window.history.pushState(null, '', '/pins/' + item.id)
}
// 监听页面回退
useEventListener('popstate', () => {
  delete currentItem.value.id
})
const pinsVisible = computed(() => currentItem.value.id !== void 0)
// pins动画钩子 -- 动画执行之前
const onBeforeEnter = (el) => {
  gsap.set(el, {
    scaleX: 0.2,
    scaleY: 0.2,
    transformOrigin: '0 0',
    translateX: currentItem.value.translateX,
    translateY: currentItem.value.translateY,
    opacity: 0
  })
}

// pins动画钩子 -- 动画执行过程
const onEnter = (el, done) => {
  el.__gsap__ = gsap.to(el, {
    duration: 0.4,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: '0 0',
    translateX: 0,
    translateY: 0,
    opacity: 1,
    onComplete: done
  })
}

// pins动画钩子 -- 动画离开过程
const onLeave = (el, done) => {
  el.__gsap__.reverse()
  setTimeout(() => {
    done()
  }, el.__gsap__._dur * 1500)
}

const onAfterLeave = (el) => {
  currentItem.value = {}
}
</script>
```

item.vue

```js
const handleSelectItem = () => {
  // 获取图片中间路基浏览器左边和顶部的距离
  const { left, top, width, height }  = imgEle.value?.getBoundingClientRect()
  const translateX = left + width / 2
  const translateY = top + height / 2
  emits('selectItem', {
    ...props.pexel,
    translateX,
    translateY
  })
}
```

#### 34.5、解决刷新丢失的问题 - 路由props传参

所谓的刷新丢失，就是刷新之后、会直接访问我们设置的路径、而路径没有没有匹配到对应的路由组件、所以就会显示空白页面；

**所以，我们的思路是：**

**方案1：**

* 1、在路由表中配置对应连接的路由对象
* 2、路由对象中的组件中使用到我们上面定义的pins.vue组件
* 3、这样刷新时就会通过路由匹配到对应的路由组件，在路由初始化时获取`id`参数传递给组件

**方案2：路由props传参**

[vue-router 中 props传参给组件](https://router.vuejs.org/zh/guide/essentials/passing-props.html)、

在你的组件中使用 `$route` 会与路由紧密耦合，这限制了组件的灵活性，因为它只能用于特定的 URL。虽然这不一定是件坏事，但我们可以通过 `props` 配置来解除这种行为：

我们可以将下面的代码

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [{ path: '/user/:id', component: User }]
```

替换成

```js
const User = {
  // 请确保添加一个与路由参数完全相同的 prop 名
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]
```

这允许你在任何地方使用该组件，使得该组件更容易重用和测试。



本案例中我们使用**路由props传参**

```js
export default [
  {
    path: '/',
    name: 'pc首页',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('@/views/main/index.vue')
      },
       // 这里使用路由props传参
      {
        path: '/pins/:id',
        name: 'pins-id',
        props: true, // props设置为true
        component: () => import('@/views/pins/components/pins.vue') 
      }
    ]
  }
]

```

### 35、登录/注册表单校验

在以往我们开发项目是，都是借助于第三方组件库俩实现登录注册的表单；

当然校验也是他们提供的



而在当前项目中，由于我们的风格与第三方库的风格互斥、没有采用第三方库；

如果我们想要进行表单校验的话，那就需要下面两种方案中选择了：

* 自己手动封装表单校验
* 使用第三方表单校验库

由于、时间比较紧、并且自己封装的表单校验可能复用性不是那么好，所以、我们采用**使用第三方表单校验库**

**使用第三方表单校验库优点：**

* 包比较小、一般这种包只做一种功能
* 适用性比较强

本项目中采用的第三方表单校验库： [vee-validate](https://vee-validate.logaretm.com/v4/tutorials/dynamic-form-generator/)

#### 35.1、使用vee-validate进行表单校验

首先安装`vee-validate`依赖包

```powershell
$ yarn add vee-validate
```

然后对我们写的项目进行改造

```vue
 	<form class="w-full mt-4">
        <input
          placeholder="用户名"
          type="text"
          class="border-b block w-full bg-transparent dark:border-zinc-500 dark:text-zinc-300 border-zinc-300 font-bold duration-500 text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 mb-3 focus:border-red-600"
        />
        <input
          placeholder="密码"
          type="password"
          class="border-b block w-full bg-transparent dark:border-zinc-500 dark:text-zinc-300 border-zinc-300 font-bold text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 mb-3 focus:border-red-600"
        />
        <Button
          class="bg-red-600 mt-4 border-red-600 w-full hover:bg-red-600 focus:bg-red-600 hover:border-red-700 focus:border-red-700 active:border-red-700 duration-300 dark:bg-zinc-900 dark:border-zinc-900 xl:dark:bg-zinc-800 xl:dark:border-zinc-800 py-1"
          >登录</Button
        >
      </form>
```

改造为

```vue
    <vee-form class="w-full mt-4 text-[0px]"  @submit="onSubmit">
        <vee-filed
          name="name"
          :rules="validateName"
          placeholder="用户名"
          type="text"
          class="border-b block w-full bg-transparent dark:border-zinc-500 dark:text-zinc-300 border-zinc-300 font-bold duration-500 text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 focus:border-red-600"
        />
        <vee-error-message
          name="name"
          class="text-sm text-red-600 mt-0.5 block"
        />
        <vee-filed
          name="password"
          :rules="validatePassword"
          placeholder="密码"
          type="password"
          class="border-b block w-full bg-transparent dark:border-zinc-500 mt-3 dark:text-zinc-300 border-zinc-300 font-bold text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 focus:border-red-600"
        />
        <vee-error-message
          name="password"
          class="text-sm text-red-600 mt-0.5 block"
        />
        <Button
          class="bg-red-600 mt-4 border-red-600 w-full hover:bg-red-600 focus:bg-red-600 hover:border-red-700 focus:border-red-700 active:border-red-700 duration-300 dark:bg-zinc-900 dark:border-zinc-900 xl:dark:bg-zinc-800 xl:dark:border-zinc-800 py-1"
          >登录</Button
        >
      </vee-form>

<script setup>
import {
  Form as VeeForm,
  Field as VeeFiled,
  ErrorMessage as VeeErrorMessage
} from 'vee-validate'
import { validateName, validatePassword } from '../validate'

const onSubmit = (v) => {
  console.log('v', v)
}
</script>
```



validate.js 校验函数

```js
/**
 * 校验姓名, 校验成功返回true, 校验失败返回字符串、vee-validate会将字符串显示出来
 * @param {*} value
 */
export const validateName = (value) => {
  if (value === void 0 || value.length <= 0) return '用户名不能为空'
  if (value.length < 3 || value.length > 12) return '用户名只能为3-12位'
  return true
}

/**
 * 校验密码
 * @param {*} value
 * @returns
 */
export const validatePassword = (value) => {
  if (value === void 0 || value.length <= 0) return '密码不能为空'
  if (value.length < 6 || value.length > 12) return '密码只能为6-12位'
  return true
}
```

![image-20220905092900887](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220905092900887.png)

如果输入的内容校验不通过会有错误的提示

### 36、人类行为认证

#### 36.1、什么是人类行为认证？

在我们日常开发过程中人类行为认真已经无处不在了，它只要的作用就是过滤出非人类的一些操作的

![image-20220905095446717](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220905095446717.png)

![image-20220905095457426](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220905095457426.png)



![image-20220905095545633](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220905095545633.png)

![image-20220905095603731](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220905095603731.png)

#### 36.2、目的是什么？

那么为什么需要有这样的一个东西呢?这样的一个东西对用户而言是非常讨厌的一个操作。
想要搞明白这个问题，那么大家就需要先搞清楚现在的应用面临的一个问题。

假如在一个博客系统中，它会根据博客的访问量进行首页排名，那么假设有一个人，写了一段脚本代码，构建出巨量的`IP`来不断地访问一个指定的博客，那么这个博客就会被顶到非常靠前的访问位置中。

又比如:在某些投票，或者砍价的应用中，如果也有人利用一段脚本代码，伪造出巨量的用户来去进行投票或者砍价的行为，那么这样的投票或者砍价是不是也就失去了原本的意义

那么以上这种场景我们应该如何进行防止呢?如何能够判断出，当前进行”投票“的操作是人进行的，而不是机器进行的呢?
那么想要解决这个问题,就需要使用到人类行为验证了。

**简单来说，人类行为验证的目的就是:明确当前的操作是人完成的，而非机器。**



#### 36.3、原理是什么？

人机验证通过对用户的行为数据、设备特征与网络数据构建多维度数据分析，采用完整的可信前端安全方案保证数据采集的真实性、有效性。比如以下方面(但不仅仅限于)︰

(1〉浏览器特征检查︰所有浏览器都有差异，可以通过各种前端相关手段检查浏览器环境的真实性。
(2)鼠标事件(click、move、hover、leave... . . .)
(3)页面窗口(size、scroll、坐标......)
(4) cookie，等等。



**滑动验证码实现原理是什么？** 

滑动验证码是服务端随机生成滑块和带有滑块阴影的背景图片，然后将其随机的滑块位置坐标保存。前端实现互动的交互，将滑块把图拼上，获取用户的相关行为值。然后服务端进行相应值的校验。其背后的逻辑是使用机器学习中的深度学习，根据鼠标滑动轨迹，坐标位置，计算拖动速度，重试次数等多维度来判断是否人为操作。 

滑动验证码对机器的判断，不只是完成拼图，前端用户看不见的是——验证码后台针对用户产生的行为轨迹数据进行机器学习建模，结合访问频率、地理位置、历史记录等多个维度信息，快速、准确的返回人机判定结果，故而机器识别+模拟不易通过。滑动验证码也不是万无一失，但对滑动行为的模拟需要比较强的破解能力，毕竟还是大幅提升了攻击成本，而且技术也会在攻防转换中不断进步。  

#### 36.4、目前实现的方案有哪些？

分为两种： 一种是收费的、另一种是开源的

**收费的代表有**：

* 1、[网易网盾](https://dun.163.com/)
* 2、[数美](https://www.ishumei.com/new/product/tw/code?utm_medium=%E6%97%B6%E4%BB%A31-%E9%AA%8C%E8%AF%81%E7%A0%81&utm_campaign=%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AF%8D&utm_content=%E4%BA%BA%E6%9C%BA%E9%AA%8C%E8%AF%81&utm_term=%7Bpa_mt_id%7D&utm_source=bdss1&e_matchtype=2&e_creative=53625341357&e_adposition=cl1&e_pagenum=1&e_keywordid=394337781220&e_keywordid2=376336362893&sdclkid=AL2N15F_15qR15Az&bd_vid=7116999343080641981)
* 3、[极验](http://www.geetest.com/)
* ...



**开源的有**：

* [slideCaptcha](https://gitee.com/LongbowEnterprise/SliderCaptcha?_from=gitee_search)

在项目中我们使用开源的`slideCaptcha`作为人类行为校验



#### 36.5、开始实现

首先在项目中引入两个文件（这两个文件是根据业务多级经过修改的、如果您使用当前插件的话、建议您使用官方包）

![image-20220905115118323](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220905115118323.png)

**封装人类行为认证组件**

```vue
<template>
  <div
    class="w-[360px] border text-sm border-zinc-300 rounded-sm bg-white p-1 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 duration-300 fixed z-50 left-1/2 top-1/3 translate-x-[-50%] translate-y-[-50%]"
  >
    <div class="h-4 flex items-center text-sm">
      <span class="flex-grow">请完成安全验证</span>
      <div @click="onRefresh">
        <svg-icon
          name="refresh"
          class="w-2 h-2 rounded-sm fill-zinc-600 dark:fill-zinc-300 duration-300 cursor-pointer"
        ></svg-icon>
      </div>

      <div class="ml-2" @click="onClose">
        <svg-icon
          name="close"
          class="w-2 h-2 rounded-sm fill-zinc-600 dark:fill-zinc-300 duration-300 cursor-pointer"
        ></svg-icon>
      </div>
    </div>
    <div id="captcha" class="h-[195px]"></div>
  </div>
</template>

<script>
const EMITS_SUCCESS = 'success'
const EMITS_CLOSE = 'close'
</script>

<script setup>
import '@/vendor/SliderCaptcha/longbow.slidercaptcha.min.js'
import '@/vendor/SliderCaptcha/slidercaptcha.min.css'
import { onMounted } from 'vue'
const emits = defineEmits([EMITS_SUCCESS, EMITS_CLOSE])
let sc = null
onMounted(() => {
  sc = sliderCaptcha({
    id: 'captcha',
    loadingText: '正在加载中...',
    failedText: '再试一次',
    barText: '向右滑动填充拼图',
    repeatIcon: 'fa fa-redo',
    onSuccess: function (arr) {
      console.log('成功')
      emits(EMITS_SUCCESS, arr)
    },
    onFail: function () {
      console.log('失敗')
    },
    verify: function () {
      return true
    }
  })
})

// 点击刷新按钮
const onRefresh = () => {
  console.log('刷新')
  sc?.reset()
}
// 点击关闭按钮
const onClose = () => {
  console.log('关闭')
  emits(EMITS_CLOSE)
}
</script>

<style></style>

```

**使用组件**

```vue
<template>
  <div
    class="w-screen h-screen xl:bg-zinc-200 dark:bg-zinc-800 duration-500 bg-white"
  >
    <!-- pc端头部 -->
    <div class="py-4 justify-center hidden xl:flex">
      <img src="https://res.lgdsunday.club/signlogo.png" alt="" />
    </div>
    <!-- 移动端头部 -->
    <div class="flex justify-center h-[111px] relative xl:hidden">
      <!-- 背景图 -->
      <img
        src="https://res.lgdsunday.club/login-bg.png"
        class="w-full h-full object-fill dark:hidden"
        alt=""
      />
      <!-- 前景图 -->
      <img
        class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-4 h-4"
        src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
        alt=""
      />
    </div>

    <!-- login 核心区域 -->

    <div
      class="xl:w-[380px] w-full bg-white dark:bg-zinc-800 xl:dark:bg-zinc-900 duration-500 mt-4 xl:shadow-sm px-3 py-3 xl:rounded-sm mx-auto"
    >
      <!-- 账号登录 -->
      <div
        class="text-red-600 font-semibold text-center dark:text-zinc-500 hidden xl:block text-sm"
      >
        账号登录
      </div>
      <!-- 登录表单 -->
      <vee-form class="w-full mt-4 text-[0px]" @submit="onSubmit">
        <vee-filed
          v-model="inputValues.name"
          name="name"
          :rules="validateName"
          placeholder="用户名"
          type="text"
          class="border-b block w-full bg-transparent dark:border-zinc-500 dark:text-zinc-300 border-zinc-300 font-bold duration-500 text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 focus:border-red-600"
        />
        <vee-error-message
          name="name"
          class="text-sm text-red-600 mt-0.5 block"
        />
        <vee-filed
          v-model="inputValues.password"
          name="password"
          :rules="validatePassword"
          placeholder="密码"
          type="password"
          class="border-b block w-full bg-transparent dark:border-zinc-500 mt-3 dark:text-zinc-300 border-zinc-300 font-bold text-zinc-600 placeholder:text-zinc-400 outline-0 text-sm px-1 pb-1 focus:border-red-600"
        />
        <vee-error-message
          name="password"
          class="text-sm text-red-600 mt-0.5 block"
        />
        <Button
          class="bg-red-600 mt-4 border-red-600 w-full hover:bg-red-600 focus:bg-red-600 hover:border-red-700 focus:border-red-700 active:border-red-700 duration-300 dark:bg-zinc-900 dark:border-zinc-900 xl:dark:bg-zinc-800 xl:dark:border-zinc-800 py-1"
          >登录</Button
        >
      </vee-form>

      <div class="mt-10">
        <div class="flex justify-around">
          <svg-icon
            class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
            name="qq"
          ></svg-icon>

          <svg-icon
            class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
            name="wexin"
          ></svg-icon>
        </div>
      </div>
    </div>
  </div>

  <!-- 引入人类行为认证组件 -->
  <transition name="up">
    <slider-captcha-vue
      v-if="sliderCaptchaVisible"
      @success="onSuccess"
      @close="onClose"
    />
  </transition>
</template>

<script setup>
import {
  Form as VeeForm,
  Field as VeeFiled,
  ErrorMessage as VeeErrorMessage
} from 'vee-validate'
import { validateName, validatePassword } from '../validate'
import SliderCaptchaVue from '../components/slider-captcha/index.vue'
import { ref } from 'vue'
import { getCaptcha } from '@/api/sys'
const inputValues = ref({})
// 人类行为认证组件是否展示
const sliderCaptchaVisible = ref(false)

const onSubmit = (v) => {
  sliderCaptchaVisible.value = true
}

const onSuccess = (arr) => {
  // 向后台发送请求验证人类行为认证
  const flag = await getCaptcha({
    behavior: arr
  })

  if (!flag) return false
  // 在这里发送登录请求
  console.log(arr, inputValues.value, flag)
}
const onClose = () => {
  sliderCaptchaVisible.value = false
}
</script>

<style lang="scss" scoped>
.up-enter-from,
.up-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
.up-enter-active,
.up-leave-active {
  transition: all 0.3s ease-in-out;
}
</style>

```

![image-20220905142847856](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220905142847856.png)

完成之后的效果如上

### 37、通用组件 v-input组件

#### 37.1、需求分析

随着项目中表单使用越来越多、而每次都要写表单都会比较麻烦，所以我决定封装一个表单组件`v-input`

**封装的组件具有以下功能**

* 1、通过`v-model`绑定数据
* 2、通过设置`inputType`属性值来展示不同的组件
  * 2.1、属性值为`input`时： 展示`input`组件 (默认)
  * 2.2、属性值为`textarea`时，展示`textarea`组件
* 3、支持设置`max`属性值，来限定输出内容的最大长度
* 4、支持原生的属性直接透传到`input`或`textarea`组件上

![image-20220906141919521](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220906141919521.png)

上面时我们实现的组件

#### 37.2、开始实现

**核心知识点**：

* `const attrs = useAttrs()` 获取到组件上的属性、然后对属性进行过滤生成新的属性、将属性通过 `v-bind`绑定到组件上

```vue
<template>
  <div class="relative inline-flex" v-if="isInput">
    <input
      v-bind="fmtAttrs"
      :value="modelValue"
      @input="handleInput"
      type="text"
      class="appearance-none border outline-none border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 rounded-sm text-sm text-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:border-red-500 dark:focus:border-zinc-300 px-1 py-1 duration-300"
    />
    <div
      v-if="isHasMax"
      class="absolute right-1 top-1/2 translate-y-[-50%] text-xs text-zinc-400 dark:text-zinc-600"
    >
      <span :class="{ 'text-red-500': vLength === Number(max) }">
        {{ vLength }}/{{ max }}
      </span>
    </div>
  </div>

  <!-- textarea -->
  <div class="relative inline-flex" v-else>
    <textarea
      rows="5"
      v-bind="fmtAttrs"
      :value="modelValue"
      @input="handleInput"
      type="text"
      class="appearance-none border outline-none border-zinc-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 rounded-sm text-sm text-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 focus:border-red-500 dark:focus:border-zinc-300 px-1 py-1 duration-300"
    />
    <div
      v-if="isHasMax"
      class="absolute right-1 bottom-0 translate-y-[-20%] text-xs text-zinc-400 dark:text-zinc-600"
    >
      <span :class="{ 'text-red-500': vLength === Number(max) }">
        {{ vLength }}/{{ max }}
      </span>
    </div>
  </div>
</template>
<script>
const INPUT_TYPE_INPUT = 'input'
const INPUT_TYPE_TEXTAREA = 'textarea'
</script>

<script setup>
import { computed, useAttrs, watch } from 'vue'
const attrs = useAttrs()
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  inputType: {
    // 输入框的内容
    type: String,
    default: INPUT_TYPE_INPUT,
    validator(v) {
      const arr = [INPUT_TYPE_INPUT, INPUT_TYPE_TEXTAREA]
      if (!arr.includes(v)) {
        throw new TypeError(
          `Input component inputType must be ${arr.join('、')}`
        )
      }
      return true
    }
  },
  max: {
    // 最大输入的字数
    type: [String, Number]
  }
})
const emits = defineEmits(['update:modelValue'])
// 将props的竖向过滤掉
const fmtAttrs = computed(() => {
  const { inputType, max, ...attrMap } = attrs
  return attrMap
})
// 是否显示input
const isInput = computed(() => props.inputType === INPUT_TYPE_INPUT)

const vLength = computed(() => (props.modelValue ? props.modelValue.length : 0))
// 是否存在最大值
const isHasMax = computed(() => {
  const v = Number.parseInt(props.max)
  return !Number.isNaN(v)
})
const handleInput = ($event) => {
  emits('update:modelValue', $event.target.value)
}

watch(
  () => props.modelValue,
  (v) => {
    console.log('v', v)
    if (isHasMax.value && v !== void 0) {
      if (v.length > props.max) {
        emits('update:modelValue', v.substr(0, props.max))
      }
    }
  },
  {
    immediate: true
  }
)
</script>

<style></style>

```

#### 37.3、测试封装的组件

```vue
			<v-input
              v-model="inputValues.username"
              placeholder="用户名"
              max="20"
              class="flex-grow"
            />
```

![image-20220906141919521](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220906141919521.png)

```vue
			<v-input
              v-model="inputValues.username"
              placeholder="个人介绍"
              class="flex-grow"
              inputType="textarea"
            />
```

![image-20220906142546414](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220906142546414.png)



### 38、通用组件 - Dialog

#### 38.1、分析Dialog


对于`Dialog` 通用组件而言，我们可以参考`confirm` 的组件的构建过程。|
它们两个构建方案非常类似,唯二不同的地方是:

1. `Dialog`无需通过方法调用的形式展示
2. `Dialog` 的内容区可以渲染任意的内容
2. `Dialog`的确定按钮支持loading提示、并且当`onOk`返回的值为`promise`时，且`promise`的状态变为`成功状态时`才会关闭`Dialog`

排除这两点之后,其余与confirm完全相同。

#### 38.2、实现Dialog

```vue
<template>
  <!-- 遮罩层 -->
  <transition name="fade">
    <div
      class="bg-zinc-900/80 fixed w-full h-screen left-0 top-0 z-50"
      v-if="modelValue"
      @click="onClose"
    ></div>
  </transition>
  <!-- 内容 -->
  <transition name="up">
    <div
      class="max-w-[80%] min-w-[256px] bg-white rounded p-1.5 dark:bg-zinc-800 z-50 fixed left-1/2 top-1/3 translate-x-[-50%]"
      v-if="modelValue"
    >
      <!-- title标题 -->
      <div class="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">
        {{ title }}
      </div>
      <!-- content内容 -->
      <div class="text-sm text-zinc-700 dark:text-zinc-300">
        <slot />
      </div>
      <!-- 底部按钮 -->
      <div class="flex justify-end items-center">
        <Button type="default" class="mr-1" @click="onCancel">{{
          cancelText
        }}</Button>
        <Button type="primary" @click="onOk" :loading="loading">{{
          okText
        }}</Button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Button from '../Button/index.vue'
import { onMounted, ref } from 'vue'

const DURATION = '0.5s' // 定义过渡时间
const props = defineProps({
  modelValue: {
    // 控制开关
    type: Boolean,
    required: true
  },
  title: {
    // 标题
    type: String
  },
  cancelText: {
    // 删除按钮文字
    type: String,
    default: '取消'
  },
  okText: {
    // 确认按钮文字
    type: String,
    default: '确认'
  },
  onCancel: {
    // 取消按钮事件
    type: Function
  },
  onOk: {
    // 确认按钮事件
    type: Function
  },
  close: {
    // 关闭按钮事件
    type: Function
  }
})
const emits = defineEmits(['update:modelValue'])
// 关闭事件
const onClose = () => {
  emits('update:modelValue', false)
}
const loading = ref(false)
// 取消事件
const onCancel = () => {
  props.onCancel?.()
  onClose()
}

// 取消确认
const onOk = () => {
  if (!props.onOk) {
    onClose()
    return false
  }
  const result = props.onOk()
  // 判断 result 是不是promise对象？ 如果是则`promise`的状态变为`成功状态时`才会关闭`Dialog`，如果不是则直接关闭
  if (result && result.then && typeof result.then === 'function') {
    loading.value = true
    result
      .then(() => {
        onClose()
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    onClose()
  }
}
</script>

<style lang="scss" scoped>
/* 遮罩层过渡 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}

/* 弹框过渡 */
.up-enter-from,
.up-leave-to {
  transform: translate3d(-50%, 100px, 0);
  opacity: 0;
}
.up-enter-active,
.up-leave-active {
  transition: all v-bind('DURATION') ease-in-out;
}
</style>

```



#### 38.3、测试Dialog

```vue
<Dialog v-model="dialogVisible" :onOk="onOk">
    <div>123</div>
  </Dialog>
<script setup>
import { ref } from 'vue'
const dialogVisible = ref(true)

const onOk = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 2000)
  })
}
</script>
```

![20220906_160011](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220906_160011.gif)



```vue
<Dialog v-model="dialogVisible" :onOk="onOk">
    <div>123</div>
  </Dialog>
<script setup>
import { ref } from 'vue'
const dialogVisible = ref(true)

const onOk = () => {
  return new Promise((resolve, reject) => {
    setTimeout(reject, 2000)
  })
}
</script>
```

![20220906_155904](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220906_155904.gif)



```vue
<Dialog v-model="dialogVisible" :onOk="onOk">
    <div>123</div>
  </Dialog>
<script setup>
import { ref } from 'vue'
const dialogVisible = ref(true)

const onOk = () => {

}
</script>
```

![20220906_160104](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220906_160104-16624525367382.gif)



### 39、裁剪头像图片

#### 39.1、技术分析

#### 39.2、URL.createObjectURL() 和 new FileReader()在读取预览文件时区别

`URL.createObjectURL()` [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL) 静态方法会创建一个 `DOMString`，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 `document` 绑定。这个新的`URL` 对象表示指定的 `File` 对象或 `Blob` 对象。

`URL.createObjectURL(blob)`和`FileReader.readAsDataURL(file)`很相似

##### 39.2.1、主要区别

* 通过`FileReader.readAsDataURL(file)`可以获取一段`data:base64`的字符串
* 通过`URL.createObjectURL(blob)`可以获取当前文件的一个内存URL 如：`blob:http://localhost:5173/8c36c7ff-7be3-4dbb-a8c4-e87317d21c4b`

##### 39.2.2、执行时机：

* `createObjectURL`**是同步执行（立即的）**

* `FileReader.readAsDataURL**是异步执行（过一段时间）**

##### 39.2.3、内存使用：

 `createObjectURL`返回一段带`hash`的`url`，并且一直存储在内存中，直到`document`触发了`unload`事件（例如：`document close`）或者执行`revokeObjectURL`来释放。
  `FileReader.readAsDataURL`则返回包含很多字符的`base64`，并会比`blob url`消耗更多内存，但是在不用的时候会自动从内存中清除（通过垃圾回收机制）
  **兼容性方面两个属性都兼容ie10以上的浏览器。**

##### 39.2.3、优劣对比：

使用`createObjectURL`可以节省性能并更快速，只不过需要在不使用的情况下手动释放内存
如果不太在意设备性能问题，并想获取图片的`base64`，则推荐使用`FileReader.readAsDataURL`



##### 39.2.4、使用方式：

```js
objectURL = URL.createObjectURL(blob);
```

**示例**

html 文件

```html
<input type="file" id="btn" accept="image/*" value="点击上传" />
<img id="img"/>
```

js文件

```js
btn.addEventListener('change',function(){
	let file = this.files[0];
	// 进一步防止文件类型错误
	if(!/image\/\w+/.test(file.type)){  
        alert("看清楚，这个需要图片！");  
        return false;  
    }  
	img.src = URL.createObjectURL(file)
})
```

#### 39.3、使用cropperjs依赖包来裁剪图片

[cropperjs](https://github.com/fengyuanchen/cropperjs)是一个非常强大的图片裁剪工具，它可以适用于：

* 原生js
* vue
* react
* 等 ...

而且操作也非常简单、只需要简单几步即可完成图片的裁剪工作：

在我们项目中，首先

**安装依赖**

```powershell
$ npm install cropperjs
```

**初始化实例**

```js
const cropper = new Cropper(element[, options])
```

**获取裁剪的图片数据**

```js
cropper.getCroppedCanvas().toBlob(blob => {
    console.log(blob)
    // Blob { size: 8975, type: 'image/png' }
    console.log(URL.createObjectURL(blob))
    // blob:http://localhost:5173/fd101aff-90ec-4e56-a5a0-846e69b67577
})
```

#### 39.4、完整代码

**注意：**

因为我们的项目在移动端和pc端的裁剪是不同的，所以我们需要分别对移动端和pc端的裁剪进行配置

**移动端配置：**

```js
const pcConfig = {
  aspectRatio: 1 // 保持纵横比为1:1
}
```

**pc端配置**

```js
const mobileConfig = {
  aspectRatio: 1, // 保持纵横比为1:1
  viewMode: 1, // 将裁剪框限定在画布大小
  dragMode: 'move', // 移动画布、裁剪框不动
  cropBoxMovable: false, // 裁剪框不可移动
  cropBoxResizable: false // 不可调整裁剪框大小
}
```



**完整代码**

```vue
<template>
  <div
    class="w-screen h-screen xl:w-auto xl:h-auto overflow-auto relative dark:bg-zinc-800 duration-300"
  >
    <div class="p-1 absolute right-0 top-0 xl:hidden">
      <svg-icon
        name="close"
        class="w-2 h-2 fill-zinc-600 dark:fill-zinc-400"
        @click="handleClose"
      ></svg-icon>
    </div>
    <div
      class="xl:w-[500px] xl:h-[300px] w-[80%] aspect-auto mx-auto mt-4 xl:mt-auto flex items-center justify-center"
    >
      <img :src="imgUrl" ref="image" alt="" class="w-full h-full" />
    </div>
    <div class="flex justify-center">
      <Button class="w-2/3 mt-2" @click="handleClick">确定</Button>
    </div>
  </div>
</template>

<script>
const pcConfig = {
  aspectRatio: 1 // 保持纵横比为1:1
}
const mobileConfig = {
  aspectRatio: 1, // 保持纵横比为1:1
  viewMode: 1, // 将裁剪框限定在画布大小
  dragMode: 'move', // 移动画布、裁剪框不动
  cropBoxMovable: false, // 裁剪框不可移动
  cropBoxResizable: false // 不可调整裁剪框大小
}
</script>
<script setup>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { onMounted, ref } from 'vue'
import { isMoboleTerminal } from '@/utils/flexible'
let cropper = null
defineProps({
  imgUrl: {
    // 图片地址
    type: String,
    required: true
  }
})
const emits = defineEmits(['onConfirm', 'close'])
const image = ref(null)

onMounted(() => {
  cropper = new Cropper(
    image.value,
    isMoboleTerminal.value ? mobileConfig : pcConfig
  )
})

const handleClick = () => {
  emits('onConfirm')
  cropper.getCroppedCanvas().toBlob((blob) => {
    console.log(blob)
    // Blob { size: 8975, type: 'image/png' }
    console.log(URL.createObjectURL(blob))
    // blob:http://localhost:5173/fd101aff-90ec-4e56-a5a0-846e69b67577
  })
}
const handleClose = () => {
  emits('close')
}
</script>

<style></style>

```

移动端效果如下：

![image-20220907092525211](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220907092525211.png)

pc端效果如下：

![image-20220907092615713](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220907092615713.png)

### 40、数据存储方案 - 腾讯cos和阿里oss

#### 40.1、腾讯云cos存储对象

前端想要上传、修改cos存储桶中的对象、常见的有两种方式：

* 1、以后台实现对存储桶的操作、前台传输给后台、后台再进行操作

* 2、前端从后台获取到操作存储桶的加密信息之后、直接操作存储桶

  注意：由于签名计算放在前端会暴露 `SecretId` 和 `SecretKey`，我们把签名计算过程放在后端实现，前端通过 `ajax` 向后端获取签名结果，正式部署时请在后端加一层自己网站本身的权限检验。

方案二方式：

1、安装[`cos-js-sdk-v5`](https://github.com/tencentyun/cos-js-sdk-v5)依赖 [腾讯云sdk官网](https://cloud.tencent.com/document/product/436/11459)

```powershell
npm i cos-js-sdk-v5 --save
```

2、使用

> 不推荐 （秘钥是写死的，不安全）

```js
var COS = require('cos-js-sdk-v5');

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
    SecretId: 'SECRETID',
    SecretKey: 'SECRETKEY',
});
```



> 推荐 （秘钥是动态获取的，相对比较安全）

```js
var COS = require('cos-js-sdk-v5');
var cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: function (options, callback) {
        // 异步获取临时密钥
        // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
        // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
        // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048

        var url = 'http://example.com/server/sts.php'; // url替换成您自己的后端服务
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function (e) {
            try {
                var data = JSON.parse(e.target.responseText);
                var credentials = data.credentials;
            } catch (e) {
            }
            if (!data || !credentials) {
              return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
            };
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              SecurityToken: credentials.sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
              ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
          });
        };
        xhr.send();
    }
});
```

3、上传、删除、查询、下载资源

> 上传

```js
cos.putObject({
    Bucket: 'examplebucket-1250000000', /* 必须 */
    Region: 'COS_REGION',     /* 存储桶所在地域，必须字段 */
    Key: 'exampleobject',              /* 必须 */
    StorageClass: 'STANDARD',
    Body: fileObject, // 上传文件对象
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
    }
}, function(err, data) {
    console.log(err || data);
});
```

> 查询对象列表

```js
cos.getBucket({
    Bucket: 'examplebucket-1250000000', /* 必须 */
    Region: 'COS_REGION',     /* 存储桶所在地域，必须字段 */
    Prefix: 'a/',           /* 非必须 */
}, function(err, data) {
    console.log(err || data.Contents);
});
```

> 下载

```js
cos.getObject({
    Bucket: 'examplebucket-1250000000', /* 必须 */
    Region: 'COS_REGION',     /* 存储桶所在地域，必须字段 */
    Key: 'exampleobject',              /* 必须 */
}, function(err, data) {
    console.log(err || data.Body);
});
```

> 删除

```js
cos.deleteObject({
    Bucket: 'examplebucket-1250000000', /* 必须 */
    Region: 'COS_REGION',     /* 存储桶所在地域，必须字段 */
    Key: 'exampleobject'        /* 必须 */
}, function(err, data) {
    console.log(err || data);
});
```

#### 40.2、阿里云oss存储

用法和上面的腾讯云的COS存储类似，

本次方案、采用的是在客户端安装、提供的sdk、调用对应的api来操作存储对象

1、[`安装sdk`](https://help.aliyun.com/document_detail/64041.htm?spm=a2c4g.11186623.0.0.235d24cbqRW0xl#concept-64041-zh) 

```powershell
npm install ali-oss
```

2、创建oss实例

```js
const OSS = require('ali-oss');

const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: 'yourRegion',
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: 'yourAccessKeyId',
    accessKeySecret: 'yourAccessKeySecret',
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: 'yourSecurityToken',
    refreshSTSToken: async () => {
    // 向您搭建的STS服务获取临时访问凭证。
      const info = await fetch('your_sts_server');
      return {
        accessKeyId: info.accessKeyId,
        accessKeySecret: info.accessKeySecret,
        stsToken: info.stsToken
      }
    },
    // 刷新临时访问凭证的时间间隔，单位为毫秒。
    refreshSTSTokenInterval: 300000,
    // 填写Bucket名称。
    bucket: 'examplebucket'
});
```

3、操作对象

> 上传

```js
client.put(
    "exampledir/exampleobject.txt",
    data
    //{headers}
);
```

> 下载

```js
// 填写Object完整路径。Object完整路径中不能包含Bucket名称。
const url = client.signatureUrl('exampleobject.txt', { response });
console.log(url);
```

> 删除

```js
let result = await client.delete('exampledir/exampleobject.txt');
      console.log(result);
```

#### 40.3、在项目中利用工具上传至阿里云oss

```js
const handleClick = () => {
  emits('onConfirm')
  cropper.getCroppedCanvas().toBlob((blob) => {
    console.log(blob)
    const typeArr = blob.type.split('/')
    const filename = `${store.getters.userInfo.username}/${Date.now()}.${
      typeArr[typeArr.length - 1]
    }`
    // 上传
    handleUpload(filename, blob)
  })
}
// 获取实例
const getOSSClient = async () => {
  const { Credentials } = await getSts()
  return new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: REGION,
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: Credentials.AccessKeyId,
    accessKeySecret: Credentials.AccessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: Credentials.SecurityToken,
    // 填写Bucket名称。
    bucket: BUCKET,
    // 刷新token
    refreshSTSToken: async () => {
      const { Credentials } = await getSts()
      return {
        accessKeyId: Credentials.AccessKeyId,
        accessKeySecret: Credentials.AccessKeySecret,
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: Credentials.SecurityToken
      }
    },
    // 刷新Token间隔时间
    refreshSTSTokenInterval: 5 * 1000
  })
}
// 上传图片到阿里oss
const handleUpload = async (filename, file) => {
  try {
    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    // 您可以通过自定义文件名（例如exampleobject.txt）或文件完整路径（例如exampledir/exampleobject.txt）的形式实现将数据上传到当前Bucket或Bucket中的指定目录。
    // data对象可以自定义为file对象、Blob数据或者OSS Buffer。
    const oss = await getOSSClient()
    const result = await oss.put(`images/${filename}`, file)
    console.log(result.url)
    handleChangeAvatar(result.url)
  } catch (e) {
    console.log(e)
    Message.error('异常错误')
  }
}
// 更新地址到本地和数据库中
const handleChangeAvatar = async (avatar) => {
  try {
    // 更新到bending
    store.commit('user/setUserInfo', {
      ...store.getters.userInfo,
      avatar
    })
    // 更新到远程数据库中
    await putUser(store.getters.userInfo)
    Message.success('头像修改成功')
  } catch (error) {
    Message.error(error.message)
  }
}
```

### 41、登录鉴权 - beforeEach钩子函数

完成了这么多功能、但是我们还没有把登录鉴权给实现、这小结我们要把登录鉴权给完成

在`vue2.x`版本、`vue-router`使用的版本为`3.x`

但是

在在`vue3.x`版本、`vue-router`使用的版本为`4.x`

在`vue-router` `4.x`中一些钩子和api发生了改变、包括这一小节我们需要使用到的：**全局前置守卫beforeEach**

> 在vue-router `4.x`中`beforeEach`所接收的回调函数中 第三个参数`next`不是必须的；而使用 **函数返回 不同的值 来代替next的作用**

**返回值及作用：**

* `false`: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址。
* `undefined` / `true` : **则导航是有效的**，并调用下一个导航守卫
* `{ name: 'Login' }` : 表示重定向到`Login`页面
* `'/login'`: 表示重定向到`/login`



#### 41.1、登录鉴权 - 实现权限认证

**实现方案**：

* 1、我们在路由表中找到需要授权认证之后才能访问的路由、在其路由的meta属性中定义`user`属性为`true`

* 2、使用路由全局守卫在跳转之前进行判断

  * 2.1、跳转的路由`user`属性是否为`true`

    * `true`:

      判断用户是否已登录？ 允许跳转 ： 重定向到 '/'

    * `false` 

      允许跳转





**路由表中数据**：

```js
[
    ...
    {
        path: '/pins/:id',
        name: 'pins-id',
        props: true,
        component: () => import('@/views/pins/components/pins.vue')
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          user: true // + 代表需要用户先登录之后才能访问
        }
      }
]
```

**在premission.js中进行认证**

```js
// 用户权限控制
import router from '@/router'
import store from '@/store'

router.beforeEach((to, from) => {
  // 访问的路由不需要用户登录时直接跳转到指定路由
  if (!to.meta.user) {
    return true // 允许跳转
  }

  // 用户是否已登录
  if (Object.keys(store.getters.userInfo).length > 0) {
    return true // 允许跳转
  }

  return '/' // 重定向到首页
})

```

在`main.js`引入认证

```js
import { createApp } from 'vue'
import '@/styles/index.scss'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { useREM } from '@/utils/flexible'
import { useTheme } from '@/utils/theme'
import libs from '@/libs'
import directives from '@/directives'
import 'virtual:svg-icons-register'
import './premission' // + 引入认证文件
```

### 42、通用组件 - `trigger-menu`

它被分成了两个组件: trigger-menu和 trigger-menu-item
其中 `trigger-menu`表示整个的功能区域, `trigger-menu-item`表示其中的每一项。
所以我们的分析需要针对于这两个组件分别进行分析:

1. `trigger-menu`:对于它而言，只起到一个包裹容器的作用，所以我们只需要提供一个对应的插槽即可

2. `trigger-menu-item`:起到了对应的展示作用，展示包括了`icon`和文字。所以内部应该存在`svg-icon`用来展示图片，存在一个插槽用来展示文字。

  

  那么到这里我们就基本分析完成了这两个组件的基本构建方案，整体还是比较简单的。

**trigger-menu组件**

```vue
<template>
  <div
    class="flex items-center justify-between py-1 px-3 rounded-full bg-white dark:bg-zinc-800 duration-300"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup></script>

<style></style>
```

**trigger-menu-item组件**

```vue
<template>
  <div class="flex flex-col justify-center items-center" @click="handleClick">
    <svg-icon
      :name="icon"
      v-if="icon"
      class="fill-zinc-700 dark:text-zinc-600 duration-300 w-2 h-2 mb-0.5"
      :class="iconClass"
    ></svg-icon>
    <p
      class="text-center text-sm text-zinc-800 dark:text-zinc-500 duration-300"
      :class="textClass"
    >
      <slot />
    </p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  icon: {
    type: String
  },
  iconClass: {
    type: String
  },
  textClass: {
    type: String
  },
  to: {
    type: [String, Object]
  }
})
const router = useRouter()
const handleClick = () => {
  if (!props.to) return
  router.push(props.to)
}
</script>
```

### 43、前台业务下H5的应用场景

通常情况下我们说起移动端项目,指的一般是两种:

* 1．原生APP

* 2.H5网页

那么此时我们所做的这个移动端,指的其实就是H5 网页

该内容依然是以网页为主,但是被运行到手机端之中。

而H5网页应用到手机端的时候,通常也是有两种运行的形式;

 * 1.直接在手机端浏览器中运行:这种使用情况相对较少。在这种情况下，用户明显的知道这就是一个网页。

 * 2.在原生组件WebView 中运行（混合开发):通常会被嵌入到 APP 之中，这种使用情况比较多。所以以下内容，主要针对这种情况进行说明。

**那么这种情况下，用户会认为该内容是 APP的一部分，不会把它当成网页，而是会把它当做原生APP。那么一旦用户把它作为 APP来进行衡量,那么就会对这块应用有更高的要求。**

**比如，在移动app下具有以下功能：**

* 1、页面跳转过渡特效
* 2、页面回退不会重新请求、会保存数据
* 3、页面回退会保存滚动位置

...

### 44、过渡动画 - 组件跳转

在vue-router官网已经给出了路由跳转的动画

```vue
<router-view v-slot="{ Component }">
    <!-- 过渡组件 -->
  <transition name="fade">
      <component :is="Component" /> 
  </transition>
</router-view>
```

> 注意：在路由组件进行动画时，只能对有单个根节点的组件有过渡动画、对有多个根节点的组件无法执行过渡动画

**警告信息如下**：

![image-20220919095816842](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220919095816842.png)

我们只需要把

```vue
template>
  <div class="h-full overflow-auto">
    <!-- <div>这是移动端mian页面</div> -->
    <div class="sticky left-0 top-0 right-0 z-10 duration-300">
      <navigation />
    </div>
    <!-- 瀑布流部分 -->
    <div class="max-w-screen-xl mx-auto px-1 xl:px-0">
      <list />
    </div>
  </div>

  <trigger-menu
    class="fixed w-[280px] left-[50%] bottom-[30px] translate-x-[-50%]"
    v-if="isMoboleTerminal"
  >
    <trigger-menu-item icon="home" to="/"> 首页 </trigger-menu-item>
    <trigger-menu-item icon="vip" v-if="isLogin"> VIP </trigger-menu-item>
    <trigger-menu-item icon="profile" @click="handleProfile">
      {{ isLogin ? '我的' : '去登陆' }}
    </trigger-menu-item>
  </trigger-menu>
</template>

```

改为

```vue
<template>
  <div class="h-full overflow-auto">
    <!-- <div>这是移动端mian页面</div> -->
    <div class="sticky left-0 top-0 right-0 z-10 duration-300">
      <navigation />
    </div>
    <!-- 瀑布流部分 -->
    <div class="max-w-screen-xl mx-auto px-1 xl:px-0">
      <list />
    </div>
	
     <!-- 挪到里面 -->
    <trigger-menu
      class="fixed w-[280px] left-[50%] bottom-[30px] translate-x-[-50%]"
      v-if="isMoboleTerminal"
    >
      <trigger-menu-item icon="home" to="/"> 首页 </trigger-menu-item>
      <trigger-menu-item icon="vip" v-if="isLogin"> VIP </trigger-menu-item>
      <trigger-menu-item icon="profile" @click="handleProfile">
        {{ isLogin ? '我的' : '去登陆' }}
      </trigger-menu-item>
    </trigger-menu>
  </div>
</template>
```



#### 44.1、首先我们先看一下实现的效果



![20220919_173609](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220919_173609.gif)

#### 44.2、实现动画的思路

1、 我们通过上述动画可以分析出动画分为两种：

* 第一种：**进场动画**（push）
  * 出场组件：从右向左
  * 进场组件：从右向左
  * 执行时间：出场组件和进场组件是同时进行的
* 第二种：**出场动画**（back）
  * 出场组件：从左向右
  * 进场组件：从左向右
  * 执行时间：出场组件和进场组件是同时进行的
* 第三种： **不加动画**（在pc端跳转时，是不加动画的）

通过分析、我们可以写通过下列`css`代码实现基本的过渡特效

```css
/* push 进场动画 */
.push-enter-from {
  transform: translateX(100%);  
}
.push-leave-to {
  transform: translateX(-50%);
}
.push-enter-active,
.push-leave-active {
  transition: all 0.4s ease-in-out;
}
/* back 出场动画 */
.back-enter-from {
  transform: translateX(-100%);
}
.back-leave-to {
  transform: translateX(50%);
}

.back-enter-active,
.back-leave-active {
  transition: all 0.4s ease-in-out;
}
```



2、 我们重写`router`的`push`、`back`和其他方法；目的是当跳转之前记录当前操作是**入栈**还是**出栈**

比如：

```js
const originPush = router.push
const originBack = router.back
// 前进操作
router.push = function (...argu) {
  store.commit('app/changeRouterType', 'push')
  originPush.apply(this, argu)
}
// 后退操作
router.back = function (...argu) {
  store.commit('app/changeRouterType', 'back')
  originBack.apply(this, argu)
}
```

3、在`vuex`中拿到保存的当前跳转是**入栈**还是**出栈**，然后修改对应的`transition`组件的`name`属性来执行对应的动画

```vue
<template>
  <router-view v-slot="{ Component }">
    <transition
      :name="transitionName"
      @before-enter="onBeforeEnter"
      @after-enter="onAfterEnter"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>
```

> 注意细节： 我们在组件切换时执行的动画是两个路由组件同时存在页面中的、所以就要处理 **两个组件同时存在时 上下排布的问题**
>
> 我们可以对即将进入页面的组件加上 **固定定位、让其固定在视口的位置**，然后在动画执行完成后、将**固定定位给移除**

```js
// 组件进入之前的回调， 设置组件为固定定位
const onBeforeEnter = (el) => {
  el.style = 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;'
}
// 进入之后的回调，移除固定定位
const onAfterEnter = (el) => {
  el.removeAttribute('style')
}
```

#### 44.3、组件跳转动画实现总流程

* 1、在`constants`中定义常量

  ```js
  // 路由跳转动画类型
  // 不执行
  export const ROUTER_TYPE_NONE = 'none'
  // 前进类型
  export const ROUTER_TYPE_PUSH = 'push'
  // 回退类型
  export const ROUTER_TYPE_BACK = 'back'
  ```

  

* 2、在`vuex`中存储`routerType`(当前跳转类型、none、push、back)

  ```js
  import { ALL_CATEGOARY_ITEM, ROUTER_TYPE_NONE } from '@/constants'
  export default {
    namespaced: true,
    state() {
      return {
        routerType: ROUTER_TYPE_NONE // 跳转类型
      }
    },
    mutations: {
      changeRouterType(state, routerType) {
        state.routerType = routerType
      }
    }
  }
  ```

* 3、重写router中的跳转方法，在路由跳转之前先缓存跳转动画类型

  ```js
  const router = createRouter({
    history: createWebHistory(),
    routes: isMoboleTerminal.value ? mobileRoutes : pcRoutes
  })
  // 重写router跳转方法 
  const originPush = router.push
  const originBack = router.back
  // 前进操作
  router.push = function (...argu) {
    store.commit('app/changeRouterType', ROUTER_TYPE_PUSH)
    originPush.apply(this, argu)
  }
  // 后退操作
  router.back = function (...argu) {
    store.commit('app/changeRouterType', ROUTER_TYPE_BACK)
    originBack.apply(this, argu)
  }
  export default router
  ```

* 4、封装`transition-router-view`组件

  ```vue
  <template>
    <router-view v-slot="{ Component }">
      <transition
        :name="transitionName"
        @before-enter="onBeforeEnter"
        @after-enter="onAfterEnter"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from 'vue-router'
  
  import {
    ROUTER_TYPE_NONE,
    ROUTER_TYPE_PUSH,
    ROUTER_TYPE_BACK
  } from '@/constants'
  import { computed } from 'vue-demi'
  const props = defineProps({
    routerType: {
      type: String,
      validator(v) {
        const routerTypes = [ROUTER_TYPE_NONE, ROUTER_TYPE_PUSH, ROUTER_TYPE_BACK]
        if (!routerTypes.includes(v)) {
          throw new TypeError(`routerTypes must be ${routerTypes.join(',')}`)
        }
        return true
      }
    },
    mainComponentName: {
      type: String,
      required: true
    }
  })
  const route = useRoute()
  
  const transitionName = computed(() => `${props.routerType}`)
  
  // 组件进入之前的回调， 设置组件为固定定位
  const onBeforeEnter = (el) => {
    el.style = 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;'
  }
  // 进入之后的回调，移除固定定位
  const onAfterEnter = (el) => {
    el.removeAttribute('style')
  }
  </script>
  
  <style lang="scss" scoped>
  .push-enter-from {
    transform: translateX(100%);
  }
  .push-leave-to {
    transform: translateX(-50%);
  }
  .push-enter-active,
  .push-leave-active {
    transition: all 0.4s ease-in-out;
  }
  
  .back-enter-from {
    transform: translateX(-100%);
  }
  .back-leave-to {
    transform: translateX(50%);
  }
  
  .back-enter-active,
  .back-leave-active {
    transition: all 0.4s ease-in-out;
  }
  </style>
  
  ```

* 5、使用组件

  ```vue
  <transition-router-view
        :routerType="$store.getters.routerType"
        mainComponentName="main"
      />
  ```

  

### 45、缓存组件 - 任务栈

在`vue`中提供了一个内置组件来缓存组件： [`keep-alive`](https://cn.vuejs.org/api/built-in-components.html#keepalive)

```vue
<router-view v-slot="{ Component }">
    <!-- 过渡组件 -->
  <transition name="fade">
      <!-- 缓存组件 -->
    <keep-alive>
      <component :is="Component" /> 
     </keep-alive>
  </transition>
</router-view>
```



但是同样有一点，大家需要注意:**不是所有的组件都需要缓存。**
我们把: **组件的进入和退出流程,比作一个栈。**
**那么只有进入到栈中的组件才需要被缓存**，这就像 Android 中的任务栈概念一样，如下图所示:

![image-20220917173253252](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220917173253252.png)

在当前咱们移动端的组件处理中，我们同样期望有一个这样的栈来维护我们的组件进入和退出流程，所以我们把这样的一套流程，称作**:虚拟任务栈**

那么对于这样的一**个虚拟任务栈**而言，

我们可以通过数组来进行维护，因为数组与栈的概念相同都是(先进后出的流程）。

然后我们可以通过`keep-alive` 中的 `include` 概念，把**虚拟任务栈–数组**进行绑定，从而实现**任务栈的缓存概念**。

#### 45.1、实现思路

我们先看一下实现效果

![20220920_105324](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220920_105324.gif)

* 1、在**路由表**和**组件**中都添加对应的**name**属性；且要设置name属性值是相同的

  >注意： 路由表中的name属性和组件的name属性的作用是不同的：
  >
  >* 路由表中的name： 是做路由跳转的，可以在push（{name: 'home'}）进行跳转
  >* 组件name属性：一般是在`devtools`中更容易的区分某个组件、和**keep-alive中也是通过组件name来进行缓存的**

路由name配置
  ```js
  {
    path: '/',
    name: 'main', // + 添加name属性
    component: () => import('@/views/main/index.vue')
  },
  ```
组件name配置
```js
<script>
export default {
  name: 'main'
}
</script>
```

* 2、监听路由跳转、在跳转之前保存跳转路由表的name属性值

  ```js
  const virtualTaskList = ref([mainComponentName])
  router.beforeEach((to, from) => {
      // 获取当前跳转类型 push / back
      const routerType = store.getters.routerType
      // 当跳转到首页时，清空任务栈、只保留首页的任务栈
      if (to.name === mainComponentName) {
        cleanVirtualTaskList()
      } else if (routerType === ROUTER_TYPE_PUSH) {
        // 入栈操作
        virtualTaskList.value.push(to.name)
      } else if (routerType === ROUTER_TYPE_BACK) {
        // 出栈操作
        virtualTaskList.value.pop()
      }
    })
  ```

  

* 3、使用`keep-alive`组件配合`include`属性实现动态缓存组件

  ```vue
  <router-view v-slot="{ Component }">
      <transition
        :name="transitionName"
        @before-enter="onBeforeEnter"
        @after-enter="onAfterEnter"
      >
        <!-- 在页面跳转之前、将缓存的组件name属性值放到virtualTaskList中；当模板解析到此处时，会判断virtualTaskList数组中是否包含当前模板的name属性值？ 包含则缓存、不包含则不缓存 -->
        <!-- 动态组件，加key的作用是处理/user/1 和 /user/2这样的情况 -->
        <keep-alive :include="virtualTaskList"> <!-- + 缓存组件 virtualTaskList 当前组件的name如果匹配到 数组内的name就会被缓存 -->
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  ```
  
  

#### 45.2、缓存组件 - 实现完成代码

* 步骤1：配置**路由表**和**组件**中都添加对应的**name**属性；且要设置name属性值是相同的

* 步骤2：监听路由跳转、在跳转之前保存跳转路由表的name属性值

我们可以封装处理 **虚拟任务栈hook**

useVirtualTask.js

```js
/**
 * 处理虚拟任务栈
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {
  ROUTER_TYPE_NONE,
  ROUTER_TYPE_PUSH,
  ROUTER_TYPE_BACK
} from '@/constants'
export default (mainComponentName) => {
  // 虚拟任务栈数据， 里面存放的是组件的name属性值
  const virtualTaskList = ref([mainComponentName])
  const router = useRouter()
  const store = useStore()

  // 监听页面跳转 注意： to.name 是路由对象name属性,一般是用来做跳转的、而keep-alive的include属性判断的是组件name属性，两者是不同的
  // 这里缓存的是路由对象name属性，所以就要求我们在定义组件和路由时，name保持一致
  router.beforeEach((to, from) => {
    // 获取当前跳转类型 push / back
    const routerType = store.getters.routerType
    // 当跳转到首页时，清空任务栈、只保留首页的任务栈
    if (to.name === mainComponentName) {
      cleanVirtualTaskList()
    } else if (routerType === ROUTER_TYPE_PUSH) {
      // 入栈操作
      virtualTaskList.value.push(to.name)
    } else if (routerType === ROUTER_TYPE_BACK) {
      // 出栈操作
      virtualTaskList.value.pop()
    }
  })

  // 清空虚拟任务栈
  const cleanVirtualTaskList = () => {
    virtualTaskList.value = [mainComponentName]
  }
  return virtualTaskList
}

```

* 步骤3：使用`keep-alive`组件配合`include`属性实现动态缓存组件

```vue
<template>
  <router-view v-slot="{ Component }">
    <transition
      :name="transitionName"
      @before-enter="onBeforeEnter"
      @after-enter="onAfterEnter"
    >
      <!-- 在页面跳转之前、将缓存的组件name属性值放到virtualTaskList中；当模板解析到此处时，会判断virtualTaskList数组中是否包含当前模板的name属性值？ 包含则缓存、不包含则不缓存 -->
      <!-- 动态组件，加key的作用是处理/user/1 和 /user/2这样的情况 -->
      <keep-alive :include="virtualTaskList">
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

import {
  ROUTER_TYPE_NONE,
  ROUTER_TYPE_PUSH,
  ROUTER_TYPE_BACK
} from '@/constants'
import { computed } from 'vue'
import useVirtualTask from './useVirtualTask'
const props = defineProps({
  routerType: {
    type: String,
    validator(v) {
      const routerTypes = [ROUTER_TYPE_NONE, ROUTER_TYPE_PUSH, ROUTER_TYPE_BACK]
      if (!routerTypes.includes(v)) {
        throw new TypeError(`routerTypes must be ${routerTypes.join(',')}`)
      }
      return true
    }
  },
  mainComponentName: {
    // 首页组件名称；当跳转到首页时，清空任务栈
    type: String,
    required: true
  }
})
const route = useRoute()

const transitionName = computed(() => `${props.routerType}`)

// 组件进入之前的回调， 设置组件为固定定位
const onBeforeEnter = (el) => {
  el.style = 'position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;'
}
// 进入之后的回调，移除固定定位
const onAfterEnter = (el) => {
  el.removeAttribute('style')
}
const virtualTaskList = useVirtualTask(props.mainComponentName)
</script>

<style lang="scss" scoped>
.push-enter-from {
  transform: translateX(100%);
}
.push-leave-to {
  transform: translateX(-50%);
}
.push-enter-active,
.push-leave-active {
  transition: all 0.4s ease-in-out;
}

.back-enter-from {
  transform: translateX(-100%);
}
.back-leave-to {
  transform: translateX(50%);
}

.back-enter-active,
.back-leave-active {
  transition: all 0.4s ease-in-out;
}
</style>

```

### 46、缓存滚动位置 - 组件跳转

什么是缓存滚动位置？

	比如我们在首页长列表中、滚动某个位置、跳转到其他页面；再会退回来还能保持到上一次滚动的位置 ；

我们先看一下效果：

![20220920_1420](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/20220920_1420.gif)

#### 46.1、实现思路

**方案1：** 利用`vue-router`提供的**滚动行为**[`scrollBehavior`](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)

> **这个功能只在支持 history.pushState 的浏览器中可用**

使用也很简单，就是在配置项中，添加`scrollBehavior` 方法

```js
const router = createRouter({
  history: createWebHistory(),
  routes: isMoboleTerminal.value ? mobileRoutes : pcRoutes,
  scrollBehavior(to, from, savedPosition) {
    console.log(to, from, savedPosition)
    return savedPosition // 保存上次滚动的位置对象 { left: xx, top: xx }
    // 也可以手动指定滚动的位置
    // return { top: xx }
  }
})
```

> 缺点：
>
> 1、目前暂时不能再`<transition></transition>`包裹的组件下使用，在`transition`组件下滚动到执行位置会失效 [官方issues](https://github.com/vuejs/vue-router/issues/675)也说明叻这一点
>
> 2、**组件的根节点必须作为滚动子元素才能保存组件滚动位置；**根节点不能作为滚动父节点

**方案2：**使用`compionition Api` 分装自定义hook

vue3也推荐我们使用此方法来复用多个组件的公共逻辑；

此方案思路：

* 1、在组件中监听滚动的位置
* 2、在组件**被重新激活时（onActivated）**取到上次存储的位置、把这个值设置到根元素的`scrollTop`上

> 缺点：由于我们的路由组件比较多，每写一个组组件都要手动引入一下；有点繁琐

**方案3：**使用`mixin`全局混入

此方案实现思路和方案二类似，只是实现过程与之有所差别

需要注意的是：我们在全局混入，这时`vue`实例中所有的组件都具有`mixin`所混入的内容；我们需要手动剔除一些不符合条件的组件（不是路由组件的组件）；

优点：一次引入、新创建的组件也不需要额外的引入



#### 46.2、缓存组件 - 完整实现

本次采用方案3 - mixin

* 1、创建 `asstes/js/saveScroll.js`

  ```js
  export default {
    data() {
      return {
        __scrollTop: 0, // 当前组件Y轴滚动的距离
        __isRouterComponent: false // 是否是路由组件
      }
    },
    mounted() {
      // 判断组件的根组件是不是路由组件
      this.__isRouterComponent = this.$el.parentNode.parentNode.isEqualNode(
        document.querySelector('#app')
      )
      if (!this.__isRouterComponent) return false
        // 注册滚动事件
      this.$el && this.$el.addEventListener('scroll', this.__handleScroll)
    },
    activated() {
      if (!this.__isRouterComponent) return false
        // 组件被重新激活时，重新将缓存的Y轴距离设置到根标签上
      this.$el.scrollTop = this.__scrollTop
    },
    beforeUnmount() {
      if (!this.__isRouterComponent) return false
        // 卸载之前，解绑事件
      this.$el && this.$el.removeEventListener('scroll', this.__handleScroll)
    },
    methods: {
      __handleScroll() {
        this.__scrollTop = this.$el.scrollTop
      }
    }
  }
  
  ```

  

在mian.js中使用

```js
import saveScroll from '@/assets/js/saveScroll'


createApp(App)
  .use(router)
  .use(store)
  .use(libs)
  .use(directives)
  .mixin(saveScroll) // + 添加mixin混入对象
  .mount('#app')
```

### 47、通用组件 - 倒计时组件

特惠部分存在一个倒计时的功能，所以我们需要先处理对应的倒计时模块，并把它处理成一个通用组件。

**那么对于倒计时模块我们又应该如何进行处理呢?**
所谓倒计时，其实更多的是一个时间的处理，那么对于时间的处理，此时我们就需要使用到一个第三方的包: dayis。通过这个包我们可以处理对应的倒计时格式问题。

那么时间格式处理完成之后，接下来我们就需要处理对应的数据:
我们期望对倒计时模块,可以传递两个值:

1. `time`毫秒值:表示倒计时的时长
2. format格式:表示倒计时的展示格式

那么到这里咱们整个的倒计时功能即使就分析的差不多了，总共分成了两部分:
  1．时间格式
  2．数据

```vue
<template>
  <slot :data="{ timeStr, timeValue }">
    <div>
      {{ timeStr }}
    </div>
  </slot>
</template>

<script setup>
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/zh-cn'
import { watch, ref, computed, onUnmounted } from 'vue'

dayjs.extend(duration)
dayjs.locale('zh-cn')
let timer = null
const props = defineProps({
  time: {
    // 倒计时时间， ms单位
    type: Number,
    required: true
  },
  format: {
    // 格式化时间
    type: String,
    default: 'HH小时mm分钟ss秒SSS'
  }
})

// 组件销毁时清理定时器
onUnmounted(() => {
  close()
})
const timeValue = ref(props.time)

// 封装格式化日期函数
const fmtTime = (milliseconds) => {
  const d = dayjs.duration(milliseconds)
  return d.format(props.format)
}

const handleSetInterval = () => {
  timer = setInterval(() => {
    if (typeof timeValue.value === 'number' && timeValue.value <= 0) {
      //完成
      close()
    } else {
      timeValue.value -= 9
    }
  }, 9)
}
const timeStr = computed(() => {
  return typeof timeValue.value === 'number' ? fmtTime(timeValue.value) : ''
})
/**
 * 关闭定时器
 */
const close = () => {
  clearInterval(timer)
}
/**
 * 开启定时器
 */
const start = () => {
  handleSetInterval()
}
/**
 * 从新设置定时器
 */
const reset = (v) => {
  const setV = v > 0 ? v : props.time
  timeValue.value = setV
}
watch(
  () => props.time,
  (v) => {
    timeValue.value = v
    close()
    start()
  },
  {
    immediate: true
  }
)

defineExpose({
  close,
  start,
  reset,
  timeStr,
  timeValue
})
</script>

```

### 48、第三方平台登录解决方案流程大解析


通常情况下我们所说的第三方登录，多指的是:**通过第三方APP进行登录**

那么我们这个第三方的 `APP` 是如何和我们自己的应用进行关联的呢?

如果大家不是很清楚，那么本小节将为你解答。
想要搞明白这个问题，那么我们首先需要搞清楚整个第三方登录的流程是如何进行的。

**我们以常见app第三方登录为例:**

* 1.点击第三方登录按钮
* 2.弹出一个小窗口，展示对应二维码
* 3.手机打开对应的 APP进行扫码之后，会跳转到同意页面，同时浏览器端也会显示扫码成功
* 4.手机端操作同意登录之后,会出现两种情况:
  * 1．当前用户已注册:直接登录
  * 2.当前用户未注册:执行注册功能



**详细流程如下**：

* 1.点击第三方登录按钮:执行 `window.open`方法，打开一个第三方指定的`URL`窗口，该地址会指向第三方登录的`URL`,并且由第三方提供一个对应的二维码
* 2.弹出一个小窗口，展示对应二维码: **此处展示的二维码，即为上一步中第三方提供的二维码**
* 3.**手机打开对应的 `APP`进行扫码之后，会跳转到同意页面，同时浏览器端也会显示扫码成功:在第三方中会一直对该页面进行轮询,配合第三方APP 来判断是否扫码成功**
* 4.**手机端操作同意登录之后，会出现两种情况:在 APP 中同意之后，第三方会进行对应的跳转，跳转地址为你指定的地址，在该地址中可以获取到第三方的用户信息，该信息即为第三方登录时要获取到的关键数据**
* 5**.至此，第三方操作完成。接下来需要进行本平台的登录判定。**
  * 1．该注册指的是第三方用户是否在本平台中进行了注册。
  * 2.因为在之前的所有操作中，我们拿到的是第三方的用户信息。
  * 3.该信息可以帮助我们直接显示对用的用户名和头像，但是因为不包含关键信息（手机号、用户名、密码）所以我们无法使用该信息帮助用户直接登录
  * 4．所以我们需要判断当前用户是否在咱们自己的平台中完成了注册
    * 1.当前用户已注册:直接登录
    * 2.当前用户未注册:执行注册功能

#### 48.1、QQ开放平台流程大解析

那么接下来我们先来处理`QQ`第三方登录功能。
想要对接`QQ`登录，那么需要使用到[`QQ`互联平台](https://connect.qq.com/index.html)，在该平台中:
1．注册账户

2.认证开发者

3.注册应用



#### 48.2、QQ登录对接流程: 获取QQ用户信息

[官网文档](https://wiki.connect.qq.com/js_sdk%e4%bd%bf%e7%94%a8%e8%af%b4%e6%98%8e)

对接`QQ`登录分为以下几步:

* 1．展示`QQ`登录二维码
* 2．获取用户信息
* 3.完成跨页面数据传输
* 4．认证是否已注册分
* 5．完成`QQ`对接



**展示`QQ`登录二维码**

1、在`index.html`中引入`QQ`的`SDK`

```html
<!-- QQ 登录 -->
    <script
      type="text/javascript"
      charset="utf-8"
      src="https://connect.qq.com/qc_jssdk.js"
      data-appid="[你的appid]"
      data-redirecturi="[你在QQ互联中配置的成功之后的回调]"
    ></script>
```

2、创建`qq-login`组件、来凤凰qq登录组件

```vue
<template>
  <div class="qq-connect-box">
    <span id="qqLoginBtn"></span>
    <svg-icon
      class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
      name="qq"
    ></svg-icon>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  QC.Login(
    {
      btnId: 'qqLoginBtn' //插入按钮的节点id
    },
    (data, ops) => {
      console.log(data, '登录成功')
    }
  )
})
</script>

```

![image-20220922145401409](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220922145401409.png)

上面的图片可以得知、`qqLoginBtn`就是放置调起二维码按钮的地方、点击`qqLoginBtn`标签中的a链接、可以调起二维码；但是这样写有太丑；所以我们可以将a链接的透明度设置为0，并且置于最下方即可;css如下

```vue
<style lang="scss" scoped>
.qq-connect-box {
  position: relative;
  &:deep(#qqLoginBtn) {
    a {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1px;
      opacity: 0;
    }
  }
}
</style>
```

**完整示例**



```vue
<template>
  <div class="qq-connect-box">
    <span id="qqLoginBtn"></span>
    <svg-icon
      class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
      name="qq"
    ></svg-icon>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  // 当我们登录成功之后、会缓存起来、下次登录不需要扫码、所以我们需要注销登录、避免用户下次登录时展示上次的记录
  QC.Login(
    {
      btnId: 'qqLoginBtn' //插入按钮的节点id
    },
    (data, ops) => {
      // 扫码授权登录成功后的回到
      console.log(data, '登录成功')
      // 注销登录
      QC.Login.signOut()
      // 登录成功的回调
      // https://imooc-front.lgdsunday.club/login#access_token=4723B87EC749FA12A7247F40975D7BFB&expires_in=7776000
      // 解析地址栏地址获取token
      const accessToken = getQQAccessToken()
      // 将data中的用户昵称、和用户头像、以及accessToken发送给后台
      // TODO
    }
  )
})

const getQQAccessToken = () => {
  const hash = window.location.hash || ''
  const reg = /access_token=(.+)&expires_in/
  return hash.match(reg)[1]
}
</script>

<style lang="scss" scoped>
.qq-connect-box {
  position: relative;
  &:deep(#qqLoginBtn) {
    a {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1px;
      opacity: 0;
    }
  }
}
</style>

```

![image-20220922151658244](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220922151658244.png)

> 注意：扫码成功重定向的地址是在小窗口打开的、并不是在原来的窗口打开、登录成功的回调也是在小窗口中回调

#### 48.3、 `QQ`登录对接流程:跨页面信息传输

由于拿到扫码用户的 `AccessToken` 和 用户的信息（昵称、头像...） 都是在小窗口上获取到的；

**这小节最要作用:就是将小窗口获取到的这些信息传递给主窗口上**

**想要实现跨页面信息传输,通常由两种方式:**

* 1、[`BroadcastChannel`](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel):允许同源的不同浏览器窗口,Tab页，`frame`或者`iframe`下的不同文档之间相互通信。但是会存在兼容性问题,实测`Safari15.3` 无法使用
* 2、`localStorage` + `window.onstorage`: 通过`localStorage`进行同源的数据传输。用来处理`BroadcastChannel`不兼容的浏览器。
  那么依据以上两个API，我们实现对应的通讯模块:

utils/broadcase.js

```js
/***
 * 向同源且不同tab标签页发送数据
 */

// BroadcastChannel的信道key； 或者localStorage的设置项的key
const BROAD_CASE_CHANNEL_KEY = 'BROAD_CASE_CHANNEL_KEY'
// BroadcastChannel实例
let broadcastChannel = null
if (window.BroadcastChanne) {
  // 创建BroadcastChannel实例
  broadcastChannel = new window.BroadcastChanne(BROAD_CASE_CHANNEL_KEY)
}
/**
 * 发送数据
 * @param {*} data 发送的数据包
 */
export const sendMsg = (data) => {
  if (broadcastChannel) {
    broadcastChannel.postMessage(data)
  } else {
    window.localStorage.setItem(BROAD_CASE_CHANNEL_KEY, JSON.stringify(data))
  }
}

/**
 * 监听数据传输
 * @returns promise对象
 */
export const listener = () => {
  return new Promise((resolve, reject) => {
    if (broadcastChannel) {
      broadcastChannel.onmessage = (event) => {
        resolve(event.data)
      }
    } else {
      window.onstorage = (event) => {
        if (event.key === BROAD_CASE_CHANNEL_KEY) {
          resolve(event.newValue)
        }
      }
    }
  })
}

/**
 * 关闭监听
 */
export const close = () => {
  if (broadcastChannel) {
    broadcastChannel.close()
  } else {
    window.localStorage.removeItem(BROAD_CASE_CHANNEL_KEY)
  }
}

```

在`qq-login`组件中进行使用

```vue
<template>
  <div class="qq-connect-box">
    <span id="qqLoginBtn"></span>
    <svg-icon
      class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
      name="qq"
    ></svg-icon>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { sendMsg, listener, close as broadcaseClose } from '@/utils/broadcase'
import oauthLogin from '../../oauthLogin'
onMounted(() => {
  // 当我们登录成功之后、会缓存起来、下次登录不需要扫码、所以我们需要注销登录、避免用户下次登录时展示上次的记录
  QC.Login(
    {
      btnId: 'qqLoginBtn' //插入按钮的节点id
    },
    (data, ops) => {
      // 扫码授权登录成功后的回到
      console.log(data, '登录成功')
      // 注销登录
      QC.Login.signOut()
      // 登录成功的回调
      // https://imooc-front.lgdsunday.club/login#access_token=4723B87EC749FA12A7247F40975D7BFB&expires_in=7776000
      // 解析地址栏地址获取token
      const accessToken = getQQAccessToken()
      // 将data中的用户昵称、和用户头像、以及accessToken发送给主窗口
      sendMsg({
        ...data,
        accessToken
      })
      // 发送之后关闭子窗口
      setTimeout(() => {
        window.close()
      })
    }
  )
  // 监听子窗口发送的用户信息数据； 拿到接收的用户信息（AccessToken， 用户头像、昵称）进行oauthLogin登录尝试
  listener().then((data) => {
    oauthLogin('QQ', data)
  })
})

// 页面卸载之前关闭监听
onUnmounted(() => {
  broadcaseClose()
})

const getQQAccessToken = () => {
  const hash = window.location.hash || ''
  const reg = /access_token=(.+)&expires_in/
  return hash.match(reg)[1]
}
</script>


```



#### 48.4、`QQ`登录对接流程：QQ登录处理

现在、我们在主窗口能获取到子窗口传过来的**用户信息（AccessToken， 用户头像、昵称）**

剩下的我们只需要进行以下操作：

* 拿到**用户信息（AccessToken， 用户头像、昵称）**发送登录请求
  * 登录返回code为204，表示用户未注册，需要携带者**用户信息（AccessToken， 用户头像、昵称）**跳转至**注册页面**
    * 在注册页，带着**用户信息（AccessToken， 用户头像、昵称）**和 **用户名、密码** 发送注册请求
  * 返回code非204、表示注册成功、跳转至首页



我们封装一个`oauthLogin`方法，是专门处理第三方授权跳转的

```js
import store from '@/store'
import router from '@/router'
import { OAUTH_LOGIN_NO_REGISTER_CODE } from '@/constants'
/**
 * @param loginType 登录类型 QQ、WX
 * @param data 登录时需要传递的数据
 */
export default async (loginType, data) => {
  // 带着accessToken和用户信息进行登录尝试
  const code = await store.dispatch('user/handleLogin', {
    loginType,
    ...data
  })
  // code为 204 用户未进行注册
  if (code === OAUTH_LOGIN_NO_REGISTER_CODE) {
    return router.push({
      path: '/register',
      query: data
    })
  }
  // 用户已注册
  router.push('/')
}
```



在`qq-login`组件中使用`oauthLogin`

```js
onMounted(() => {
  // 监听子窗口发送的用户信息数据； 拿到接收的用户信息（AccessToken， 用户头像、昵称）进行oauthLogin登录尝试
  listener().then((data) => {
    oauthLogin('QQ', data) // + 执行授权登录
  })
})
```

在`store/modules/user.js` 返回登录状态码

```js
export default {
    actions : {
        async handleLogin(context, payload) {
          try {
            // 登录、获取token 当有password时，进行md5加密

            const { token, code } = await getToken({
              ...payload,
              password: payload.password ? md5(payload.password) : ''
            })
            // + code 204表示未注册 code为204时返回
            if (code === OAUTH_LOGIN_NO_REGISTER_CODE) {
              return code
            }
            // 存储token
            context.commit('setToken', token)
            // 获取用户信息
            const userInfo = await getProfile()
            context.commit('setUserInfo', userInfo)
            Message.success(
              `欢迎您 ${
                userInfo.vipLevel
                  ? `最贵的VIP${userInfo.vipLevel}用户 ${userInfo.nickname}`
                  : userInfo.nickname
              }`
            )
            // 跳转到首页
            router.replace('/')
          } catch (error) {
            return Promise.reject(error)
          }
        },
    }
}
```

#### 48.5、移动端QQ登录对接:触发吊起操作，完成移动端QQ登录

目前我们的`QQ`登录功能已经可以在`PC`端中正常使用了。
但是如果在移动端中进行访问，大家会发现,出现了一些问题。
**出现这个问题的原因是因为:**
对于移动端而言:

通过移动端触发`QQ`登录会展示三个页面，**原页面**、**`QQ`吊起页面**、**回调页面**。
并且移动端一个页面展示整屏内容，且无法直接通过`window.close()`关闭。

> 注意： 在移动端、我们没有像pc端浏览器子窗口的改概念、每次打开一个窗口都会沾满浏览器；所以我们没必要执着于调用`window.close()`关闭页面；我们可以直接在新打开的页面上直接进行操作

所以在移动端中,我们需要在当前页面中，继续进行后续操作。
那么据此我们可以在: `src/views/login-register/login/qq-login.vue` 中执行以下代码:

```js
onMounted(() => {
  // 当我们登录成功之后、会缓存起来、下次登录不需要扫码、所以我们需要注销登录、避免用户下次登录时展示上次的记录
  QC.Login(
    {
      btnId: 'qqLoginBtn' //插入按钮的节点id
    },
    (data, ops) => {
      // 扫码授权登录成功后的回到
      console.log(data, '登录成功')
      // 注销登录
      QC.Login.signOut()
      // 登录成功的回调
      // https://imooc-front.lgdsunday.club/login#access_token=4723B87EC749FA12A7247F40975D7BFB&expires_in=7776000
      // 解析地址栏地址获取token
      const accessToken = getQQAccessToken()
	 
      /*
      sendMsg({
        ...data,
        accessToken
      })
      // 发送之后关闭子窗口
      setTimeout(() => {
        window.close()
      })
      */ 
      // + 改为以下逻辑处理
      if (isMoboleTerminal.value) {
        // 移动端
        oauthLogin('QQ', data)
      } else {
        // pc端
        // 将data中的用户昵称、和用户头像、以及accessToken发送给主窗口
        sendMsg({
          ...data,
          accessToken
        })
        // pc端 发送之后关闭子窗口
        setTimeout(() => {
          window.close()
        })
      }
    }
  )
```

#### 48.6 :微信开放平台大解析

搞定了`QQ`扫码登录之后,接下来我们来处理微信扫码登录。
那么对于微信扫码登录而言，同样需要进行开放平台的注册，所以本小节，我们将为大家讲解微信开放平台的注册流程。
**整个讲解将会分为:**
1．微信公众平台与微信开放平台的区别

2.微信开放平台账户注册
3.微信开放平台应用注册

4．开发者资质认证
**这四个大部分:**
微信公众平台与微信开放平台的区别微信公众平台

#### 48.7、对接微信扫码登录

[进入微信登录对接官方文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)
整个微信登录流程与QQ登录流程略有不同,分为以下几步:

* 1.通过微信登录前置数据获取接口，获取登录数据（比如`APPID`)
* 2．根据获敢到的数据,拼接得到 `open url`地址
* 3.打开该地址,展示微信登录二维码
* 4.移动端微信扫码确定登录
* 5.从当前窗口中解析 `window.location.search`得到用户的code 数据
* 6.根据`appId`、`appSecret`、`code`通过接口获取用户的`access_token`
* 7．根据`access_token`获取用户信息
* 8.通过用户信息触发`oauthLogin`方法
  那么接下来我们就根据以上分析分析对应代码代码逻辑:
  1.创建 `src/views/login-register/login/weixin-login.vue` 组件，并写入以下 `html`



```vue
<template>
  <div @click="handleWxLogin">
    <svg-icon
      class="w-4 h-4 fill-zinc-200 dark:fill-zinc-300 duration-500 cursor-pointer"
      name="wexin"
    ></svg-icon>
  </div>
</template>

<script setup>
import { getWXLoginData, getWXLoginToken, getWXLoginUserInfo } from '@/api/sys'
import { sendMsg, listener, close as broadcaseClose } from '@/utils/broadcase'
import oauthLogin from '../../oauthLogin'
import { LOGIN_TYPE_WX } from '@/constants'

let wxConfig = {}
// 点击的时候触发请求
const handleWxLogin = async () => {
  // 1、获取调起wx扫一扫二维码配置信息
  wxConfig = await getWXLoginData()
  const { appId, appSecret, redirectUri, scope, state } = wxConfig
  // 2、代用微信扫一扫二维码有两种方式： 方式一在其他标签页打开二维码。方式二将扫一扫二维码内嵌到当前页面中；
  // 本次采用的是第一种 在其他标签页打开二维码
  window.open(
    `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}#wechat_redirect `,
    '',
    'top=20,right=20,width=585,height=585'
  )
}

// 3、判断是否是微信重定向的页面（判断有没有code,有code则是微信授权之后的重定向页面）拿到code数据传递给主窗口进程
if (window.location.search && /code\=(.+)&state/.test(window.location.search)) {
  const code = window.location.search.match(/code\=(.+)&state/)[0]
  sendMsg({
    code,
    ...wxConfig
  })
}

// 主窗口监听页面的授权成功返回的数据
listener().then(
  async ({ appId, appSecret, redirectUri, scope, state, code }) => {
    broadcaseClose()
    // 4、通过code获取用户access_token和openid
    const { access_token, openid } = await getWXLoginToken({
      appid: appId,
      sectet: appSecret,
      code
    })
    const { nickname, headimgUrl } = await getWXLoginUserInfo({
      accessToken: access_token,
      openid
    })
    // 使用微信授权登录
    oauthLogin(LOGIN_TYPE_WX, { nickname, headimgUrl, openid })
  }
)
</script>
```

那么至此我们完成了QQ扫码登录，微信扫码登录、移动端下的 QQ主动吊起登录。但是对于移动端微信而言，我们不能在普通的HS下吊起微信APP 触发登录。
根据我们本章的内容可以发现，整个的第三方登录逻辑还是比较复杂的，特别是微信的第三方登录步骤更加繁琐。并且我们在调试的时候必须要在线上进行调试(测试环境)，所以大家在企业开发时，需要有更大的耐心才可以。

![image-20220923135426097](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220923135426097.png)

### 49、使用[兔小巢](https://support.qq.com/products/1368/)实现用户反馈平台

我们使用[兔小巢](https://support.qq.com/products/1368/)来实现用户反馈平台：（重点是免费）

![image-20220923142905062](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220923142905062.png)

他的配置也很简单，只需要在官网注册后并创建应用、创建成功之后；直接在页面跳转就行了

```js
 window.open('https://support.qq.com/product/383681', '__blank')
```

但是这种的话，没有用户登录状态，需要用户扫码登录后才能发言；

为了解决这个问题，官网文档给了说明：[传递登录态](https://txc.qq.com/helper/configLogonState)

|  参数名  |  类型  |                    说明                    |
| :------: | :----: | :----------------------------------------: |
|  openid  | string |         用户唯一标识，由接入方生成         |
| nickname | string |                  用户昵称                  |
|  avatar  | string | 用户头像，一般是图片链接 *必须要支持https* |

我们将、吐槽封装为一个组件：

```vue
<template>
  <div
    class="rounded-sm p-1 border border-zinc-300 bg-white flex items-center text-zinc-700 w-[150px] cursor-pointer duration-300 dark:bg-zinc-900 dark:border-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-800"
    @click="handleGoFree"
  >
    <svg-icon
      name="feedback"
      class="w-1.5 h-1.5 fill-zinc-800 dark:fill-zinc-300 duration-300"
    ></svg-icon>
    <span class="text-sm ml-1 text-zinc-600 dark:text-zinc-300">立即吐槽</span>

    <!-- 携带者用户登录参数跳转至兔小巢 -->
    <form
      v-show="false"
      method="post"
      action="https://support.qq.com/product/383681"
    >
      <input type="hidden" name="openid" :value="userInfo.wxOpenId" />
      <input type="hidden" name="nickname" :value="userInfo.nickname" />
      <input type="hidden" name="avatar" :value="userInfo.avatar" />
      <button type="submit" ref="submitBtn" />
    </form>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import Message from '@/libs/message/index.js'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
const store = useStore()
const router = useRouter()
const submitBtn = ref(null)

const userInfo = computed(() => store.getters.userInfo)

const handleGoFree = () => {
    // 看用户是否登录过？ 没登录过跳转登录页面
  if (Object.keys(userInfo.value).length <= 0) {
    Message.warning('请先进行登录后再吐槽！')
    setTimeout(() => {
      router.push({
        path: '/login',
        query: {
          redirect: '/'
        }
      })
    }, 2500)
    return false
  }
   // 用户已经登录，提交form跳转至兔小巢
  submitBtn.value.click()
}
</script>

<style></style>

```



![image-20220923150202823](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220923150202823.png)

登录成功之后的跳转、可以看到兔小巢已经处于登录状态

发布的信息也是可以通过当前账号进行发布



### 50、实现分享功能


本章节中我们主要来处理第三方平台的分享功能。
说到分享,可能很多同学第一时间想到的就是:

* 1．微博分享
* 2．微信分享
* 3.微信朋友圈分享

但是对于网站而言，分享将会收到很大的限制，比如对于微信分享而言，在普通网站应用中将无法进行对接。
所以我们本章中只能针对于微博实现分享功能。
这个也是我们在前言处,需要进行明确的地方。
那么明确好了之后，接下来就让我们进入微博分享的解决方案之中吧。



在对接微博分享之前，我们还是按照老规矩，先来说一下所谓的分享，指的是什么。
这里的分享描述将会从两个平台来进行说明。

**微信**
对于微信分享而言,又分为了两部分:
1．聊天分享
2．朋友圈分享

两种分享方式，**其本质上指的都是:把一段信息或图片，发送到聊天或朋友圈中。**
简单来说,就是节省了咱们复制消息，发送消息的一个过程。
**但是对于微信而言，它不支持普通网站的分享，仅支持:APP或微信公众号、企业号、服务号的分享内容**
**微博**
**微博的分享原理与微信一样:把一段信息或图片,发送到微博中**



* 1、现在[微博开放平台](https://open.weibo.com/)注册开发者账号以及应用

* 2、整个微博的分享对接非常简单，我们知道所谓分享只是将一段内容发布到对应平台，所以我们只需要将这段内容填充到发布的url中即可。
  呈

1、在`index.html`中引入

```html
<script
src="http://tjs	.sjs.sinajs.cn/open/api/js/wb.js"
type="text/javascript"
charset="utf-8"
></script>
```

2、在定义常量

```js
// 微博
export const WEI_BO_APP_KEY = '3454329089'
export const WEI_BO_UID = '5984245953'
```

3、封装分享函数 `utils/weiboShare.js`

```js
import { WEI_BO_APP_KEY, WEI_BO_UID } from '@/constants'
/**
 *微博分享
 * @param{*]imgUrl分享的图片URL* param {*]}path 网页链接
 */
export default (imgUrl, path) => {
  window.open(
    `https://service.weibo.com/share/share.php?url=${path}&title=这章图片不错，给大家分享看下&pic=${imgUrl}&appKey=${WEI_BO_APP_KEY}ralateUid=${WEI_BO_UID}`,
    '_blank '
  )
}

```

4、触发分享

```js
// 分享
const handleShare = () => {
  weiboShare(
    pins.value.photo,
    `${window.location.origin}/pins/${pins.value.id}`
  )
}
```

会跳转至以下页面、点击分享即可

![image-20220923170522086](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220923170522086.png)



### 51、支付功能实现

#### 51.1、支付宝支付实现

1、现在支付宝开放平台、利用企业认证的账号进行注册（个人不能申请支付接口）

2、入住开放平台

3、创建应用

4、添加能力

	手机网站支付 勾选
	电脑网站支付 勾选

5、绑定AppID

6、上线应用



1、封装请求接口

```js

/**
 * 支付宝下单
| subject     | 支付标题         |              |
| ----------- | ---------------- | ------------ |
| totalAmount | 支付价格         | 默认为 0.01  |
| body        | 支付描述         |              |
| isMobile    | 是否为移动端请求 | 默认为 false |
 * @returns
 */
export const alipay = (subject, totalAmount, body, isMobile) => {
  return request({
    url: '/user/alipay',
    data: { subject, totalAmount, body, isMobile }
  })
}

/**
 * 支付宝结果
 * out_trade_no 订单号
 * @returns
 */
export const alipayResult = (out_trade_no) => {
  return request({
    url: '/user/alipay',
    data: { out_trade_no }
  })
}

```



在pc端支付宝支付页面中调用`alipay`获取下单参数、并将参数拼接到调起支付宝支付的页面路径上

```js
const handlePay = async () => {
  // 支付宝下单
  const { title, desc } = props.selectMenuItem
  console.log(props.selectMenuItem)
  // 获取支付页面地址
  const { encodeURI } = await alipay(title, 0.01, desc, false)
  // https://excashier.alipay.com/standard/auth.htm?payOrderId=67ecd10be8c944e38e722017d29cab6b.55#
  window.location.href = decodeURIComponent(encodeURI)
}
```

![image-20220924110756410](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220924110756410.png)

扫描并之后后会跳转到我们项目的`/pay/result`路径(后台配置的)，并携带支付订单号`out_trade_no`、所以我们需要创建路由组件`pay`

`views/pay/index.vue`

在组件内，拿到地址栏中的`out_trade_no`订单号，向后台请求、看支付的结果？来展示对应的支付状态

```js
<template>
  <div
    class="w-full h-screen bg-zinc-200 dark:bg-zinc-800 duration-300 overflow-hidden"
  >
    <navbar v-if="isMoboleTerminal">支付结果</navbar>
    <div
      class="w-full xl:mt-2 overflow-auto xl:max-w-sm mx-auto xl:rounded text-zinc-700 dark:text-zinc-200 duration-300 text-sm"
    >
      <div class="p-8 bg-white dark:bg-zinc-900">
        <div class="flex flex-col items-center justify-center">
          <!-- 支付成功 -->
          <h1
            class="mb-4 flex items-center text-[25px] text-green-700"
            v-if="isSuccess"
          >
            <svg-icon name="pay-success" class="w-4 h-4 mr-2"></svg-icon>
            支付成功
          </h1>

          <!-- 支付失败 -->
          <h1 class="mb-4 flex items-center text-[25px] text-red-700" v-else>
            <svg-icon name="pay-fail" class="w-4 h-4 mr-2"></svg-icon>
            支付失败
          </h1>
          <Button
            type="primary"
            size="middle"
            class="w-[100px]"
            @click="handleConfirm"
            >确定</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { isMoboleTerminal } from '@/utils/flexible'
import {  getProfile } from '@/api/sys'
import {  alipayResult } from '@/api/pay'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
const store = useStore()
const router = useRouter()
const route = useRoute()
const isSuccess = ref(false)
// 获取页面中携带的订单号、拿到订单号向后台请求看看是否支付成功？
const getPayStatus = async () => {
  const out_trade_no = route.query.out_trade_no
  isSuccess.value = await alipayResult(out_trade_no)
}
getPayStatus()
// 重新获取用户信息，并跳转到首页
const handleConfirm = () => {
  const userInfo = await getProfile()
  store.commit('user/setUserInfo', userInfo)
  router.push('/')
}
</script>

<style></style>

```

#### 51.2、手机端支付宝支付实现

其实后台已经帮我们封装好了，我们只需要在前台传递参数时`isMobile`为true即可

```js
/**
 * 支付宝下单
| subject     | 支付标题         |              |
| ----------- | ---------------- | ------------ |
| totalAmount | 支付价格         | 默认为 0.01  |
| body        | 支付描述         |              |
| isMobile    | 是否为移动端请求 | 默认为 false |
 * @returns
 */
export const alipay = (subject, totalAmount, body, isMobile) => {
  return request({
    url: '/user/alipay',
    data: { subject, totalAmount, body, isMobile }
  })
}
```

![image-20220924112006874](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220924112006874.png)

#### 52.3、支付宝支付总体实现思路

调用流程

![image-20220924113320514](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220924113320514.png)

1．用户在前端页面点击支付宝支付功能

2．前端调用服务端接口
3、服务端接收到请求，利用`alipay-sdk` (`nodejs`)创建文付订单信息，得到支付宝返回的url 

4．服务端需要对该`url`进行`encode` (`encodeURIComponent`)操作，以防止意外的转码
5．服务端返回该`url`(`encode`之后的)到前端
6.前端进行`decode` 解码，得到支付的`url`
7．前端控制跳转到该url ，即为支付宝用户支付页面
8．用户在该页面完成支付，支付完成之后，支付宝会回调两个地址:
	1. `returnUrl`:支付完成的跳转地址,用于用户视觉感知支付已成功
	2. `notifylrl`:异步通知地址，以`http`或者`https`开头的，商户外网可以`post`访问的异步地址，用于接收支付宝返回的支付结果
	9．前端通过`returnUrl`告知用户支付完成
	10.．服务端通过`notifyUrl`完成用户支付之后的数据变更，同时需要对通知信息进行验签操作，并且在验签通过之后返回`success` 给支付宝
	11．区分`PC`端支付和移动端支付的关键在于:
	1．电脑端:服务端触发的接口为`alipay.trade.page.pay`
	2．移动端:服务端触发的接口为`alipay.trade.wap.pay`

### 52、组件作用域CSS如何样式穿透（深度选择器）

[组件作用域 CSS](https://cn.vuejs.org/api/sfc-css-features.html#scoped-css)

当 `<style>` 标签带有 `scoped` attribute 的时候，它的 CSS 只会影响当前组件的元素，和 Shadow DOM 中的样式封装类似。使用时有一些注意事项，不过好处是不需要任何的 polyfill。它的实现方式是通过 PostCSS 将以下内容：



```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

转换为：

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

**子组件的根元素**

使用 `scoped` 后，父组件的样式将不会渗透到子组件中。不过，**子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响**。**这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。**

**深度选择器**

处于 `scoped` 样式中的选择器如果想要做更“深度”的选择，也即：影响到子组件，可以使用 `:deep()` 这个伪类：

```vue
<style scoped>
.a :deep(.example {
 color: red;
}
</style>
```

上面的代码会被编译成：

```css
.a[data-v-f3f3eg9] .example {
  color: red;
}
```



**Vue2中的深度选择器**

```ruby
第一种写法箭头三剑客（原生css）：>>>
.类名 >>> .类名{ 样式 }

第二种（预处理器：sass、less）：/deep/
/deep/ .类名{ 样式 }

第三种（预处理器：sass、less）：::v-deep
::v-deep .类名{ 样式 }
```



```vue
<style lang="scss" scoped>
    body {
        &::v-deep .example{
            color: red;
        }
    }
</style>


<style lang="scss" scoped>
    body {
        &/deep/ .example{
            color: red;
        }
    }
</style>
```

```vue
<style scoped>
    body {
        &>>> .example{
            color: red;
        }
    }
</style>
```

### 52、项目上线、配置基础路径

我们在本地开发的时候、是在本地开启的代理、但是上线之后，本地开启的代理就不能用了，需要在服务器上配置代理，具体配置如下：

`nginx.conf`

```
location /prod-api/ {
	proxy_pass xxxx;
}
```

我们在本地开发的时候，根路径是`/`；但是我们服务器有可能有多个项目，所以根路径`/`有可能已经被占用了，所以我们就将`/`改为`/front`。需要进行以下操作：

1、更改`vite.config.js`

```js
export default defineConfig({
    base: '/front' // + 作用打包到的静态文件夹的路径地址前加上 /front 不加这不上线之后静态资源出现404
})
```

2、配置路由基础路径

```js
const router = createRouter({
  history: createWebHistory('/front'), // createWebHistory接收参数为 路由的基础路径，不然上线之后会出现匹配不到路由的情况
  routes: isMoboleTerminal.value ? mobileRoutes : pcRoutes
})
```

3、nginx中创建项目存放文件夹front



![image-20220924175007008](https://blog-1302889287.cos.ap-nanjing.myqcloud.com/%E5%9F%BA%E4%BA%8E%20Vue3%20%E6%89%93%E9%80%A0%E5%89%8D%E5%8F%B0%2B%E4%B8%AD%E5%8F%B0%E9%80%9A%E7%94%A8%E6%8F%90%E6%95%88%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88/image-20220924175007008.png)

4、在nginx中配置当访问`/front`路径时,或404时返回`front/index.html`

```
 location /front {
     alias /usr/local/nginx/html/front/; # 映射到创建文件夹的地址
     index  index.html index.htm; 
     try_files $uri $uri/ /front/index.html; # 当找不到时依次返回index.html
 }
```

5、重启nginx

```
nginx -s reload
```

6、打包、上传到服务器中创建的front目录下

7、访问测试
