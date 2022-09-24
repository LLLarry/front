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

<style></style>
