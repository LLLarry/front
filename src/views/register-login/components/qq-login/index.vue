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
import { isMoboleTerminal } from '@/flexible'
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
