## 基于 Vue3打造前台+中台通用提效解决方案

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

![image-20220816094012941](images/image-20220816094012941.png)

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

![image-20220816105339932](images/image-20220816105339932.png)

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

![image-20220816145837118](images/image-20220816145837118.png)

* 2、在项目的根目录下创建`.prettierrc`文件

  ```yaml
  {
  	"semi": false,
  	"singleQuote": true,
      "trailingComma": "none"
  }
  ```

* 3、在`.vue`和`.js`结尾的文件中，**点击右键**，选择“使用...格式化文档”，选择“配置默认格式化程序”，选择“Prettier”

![image-20220816150512904](images/image-20220816150512904.png)

![image-20220816150527541](images/image-20220816150527541.png)

![image-20220816150548579](images/image-20220816150548579.png)

* 4、在vsode的设置页面，搜索“save”,找到“Format On Save” 勾选上；等到保存时会自动格式化代码

  ![image-20220816150824725](images/image-20220816150824725.png)

#### 5.2、配置`tailwindcss`插件

这个插件可以帮助我们在写代码时，进行`tailwindcss`的`css`类名提示

![image-20220816151044955](images/image-20220816151044955.png)

#### 5.3、安装**Volar**插件

这个插件代替了`Vuter`功能，比`Vuter`更加贴合Vue3

![image-20220816151507317](images/image-20220816151507317.png)

### 6、项目结构分析

咱们的项目分为**移动端**和**PC端**两种显示结果，但是这两种显示结果通过同一套代码进行实现，也就是所谓的响应式构建方案。那么我们在分析的时候就需要分别分析(PS:此处我们只分析大的路由方案，目的是让大家对基本的项目结构有一个初步的认识,以方便我们的项目结构处理，后续具体的细节构建方案不在这次分析行为之内):

* 1．移动端结构

* 2.PC端结构

  

然后把这两种的分析方案，合并到一起，组成一个最终的架构方案。

#### 6.1、移动端结构分析
移动端的结构相对比较简单，当我们去进行路由跳转时，它是以整个页面进行的整体路由切换。
那么由此可知，移动端不存在嵌套路由的概念，只需要在 APP.vue 中保留一个路由出口即可。

![image-20220816154619643](images/image-20220816154619643.png)

#### 6.2、PC端接否分析

pc端相对于移动端、多了一个固定头部的部分，所以处理起来更加复杂一点

![image-20220816154910365](images/image-20220816154910365.png)

我们需要通过两个路由出口进行表示:
1. `App.vue` :一级路由出口,用作整页路由切换

2. `Main.vue` :二级路由出口,用作局部路由切换

  那么由此我们可知，移动端和PC端两者的路由结构是不同的，所以这就**要求我们需要根据当前用户所在设备的不同，构建不同的路由表**

### 7、项目结构

项目的整体结构如下图所示

![image-20220816160615099](images/image-20220816160615099.png)

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

![image-20220820094254567](images/image-20220820094254567.png)

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

![image-20220820095829409](images/image-20220820095829409.png)

配置完成生效

### 11、在vite中封装通用的svg

我们之前在webpack中封装了通用的svg图标、但是在vite中没有进行分装；所以在本项目中我们对svg图标进行通用封装

![image-20220820110904744](images/image-20220820110904744.png)

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

  

![image-20220820111656263](images/image-20220820111656263.png)

### 12、实现移动端navigation头部效果

需要实现的效果如下：

![20220820_144232](images/20220820_144232.gif)

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



![20220822_104005](images/20220822_104005.gif)

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

![20220820_172315](images/20220820_172315.gif)

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

![image-20220823102101628](images/image-20220823102101628.png)

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
  store.commit('theme/changeThemeType', theme.type)
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

![20220824_182441 (1)](images/20220824_182441%20(1).gif)

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

​	缺点:

​		1、计算过程较复杂

​	优点：

​		1、父元素的高度不需要固定

​		2、可以实现上啦加载更多

​		3、布局可以是横向布局

> 综合上面方案：本项目中实现的瀑布流布局是采用**方案3**中的实现方法

#### 20.2、瀑布流布局 - 实现思路

比如： 我们要实现一个 **列数 column** 为 n 列的布局；

​	  每一列的 横向和纵向间距为 gaps (比如：gaps = [10, 10])

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

![20220826_141617 (1)](images/20220826_141617%20(1).gif)

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

这个hook目的就是利用`IntersectionObserver`监视`dom`元素是否在可视范围内

#### 21.2、封装同用组件 - infinite-list

```vue
<template>
  <div class="w-full h-full overflow-auto">
    <!-- 展示列表内容插槽 -->
    <slot />
    <!-- 底部 ---加载中插槽 -->
    <div ref="infiniteLoadEle">
      <slot name="loading" v-if="!isFinished && modelValue">
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
import { nextTick, ref, watch } from 'vue'
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
useIntersectionObserver(infiniteLoadEle, ({ isIntersecting }) => {
  // isIntersecting 表示元素是在可视范围内
  // 触发onLoad条件 isIntersecting 为true; modelValue为false; isFinished为false
  isIntersectingRef.value = isIntersecting
  judgeAndEmit()
})

//判断条件并且触发onLoad
function judgeAndEmit() {
  if (isIntersectingRef.value && !props.modelValue && !props.isFinished) {
    // 修改状态为正在加载中
    emits('update:modelValue', true)
    emits('onLoad') // 触发加载
  }
}

watch(
  () => props.modelValue,
  async (v) => {
    if (v) return false
    await nextTick()
    judgeAndEmit()
  }
)
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

![image-20220827101927965](images/image-20220827101927965.png)

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

![image-20220827110753001](images/image-20220827110753001.png)

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

![image-20220827110148142](images/image-20220827110148142.png)

可以看到首屏加载值请求了27个图片数据，当我们进行屏幕滚动时，也会发现请求会随着滚动而增加

![20220827_110352](images/20220827_110352.gif)

### 23、图片白屏分析

如下图所示、当图片加载比较慢的时候，会出现以下图片区域显示空白的情况；

![image-20220827111533122](images/image-20220827111533122.png)

面对这种情况，我们可以使用在懒加载v-lazy添加默认图片的方式

```vue
<img
     alt=""
     class="w-full rounded"
     v-lazy="'http://121.5.230.70/images/article_default.jpg'"
/>
```

![image-20220827112039879](images/image-20220827112039879.png)

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

![20220827_113758 (1)](images/20220827_113758%20(1).gif)

可以看出我们的自定义颜色指令已经能够使用了

### 25、实现自动注册自定义指令

在**14章节，我们实现了自动注册组件**，那么可以直接将14章节的内容搬过来吗？

答案： 不可以

因为**在14章节、实现的自动注册组件是异步的**，而我们自定义指令不需要异步注册、所以不能通用



再笨章节我们需要使用到的技术就是[import.meta.globEager](https://vitejs.cn/guide/features.html#glob-import)

![image-20220827115319317](images/image-20220827115319317.png)

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

![757c3e6e2572809a0182970ba908df2e (2)](images/757c3e6e2572809a0182970ba908df2e%20(2).gif)

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

























