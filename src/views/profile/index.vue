<template>
  <div class="w-full h-full bg-zinc-200 xl:p-2 overflow-auto dark:bg-zinc-800">
    <navbar v-if="isMoboleTerminal"> 个人资料 </navbar>
    <div
      class="bg-white xl:max-w-sm mx-auto p-2 xl:rounded dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 duration-300 text-sm"
    >
      <h1
        v-if="!isMoboleTerminal"
        class="text-base text-zinc-900 dark:text-zinc-200 font-bold mb-3 text-center"
      >
        个人资料
      </h1>
      <div class="flex flex-col xl:flex-row">
        <form class="xl:flex-[2] order-2">
          <div class="flex items-center mb-3">
            <span
              class="font-bold w-10 text-left text-zinc-900 dark:text-zinc-200 duration-300"
              >用户名</span
            >
            <v-input
              v-model="inputValues.nickname"
              placeholder="用户名"
              max="20"
              class="flex-grow"
            />
          </div>

          <div class="flex items-center mb-3">
            <span
              class="font-bold w-10 text-left text-zinc-900 dark:text-zinc-200 duration-300"
              >职位</span
            >
            <v-input
              v-model="inputValues.title"
              placeholder="职位"
              class="flex-grow"
            />
          </div>

          <div class="flex items-center mb-3">
            <span
              class="font-bold w-10 text-left text-zinc-900 dark:text-zinc-200 duration-300"
              >公司</span
            >
            <v-input
              v-model="inputValues.company"
              placeholder="公司"
              class="flex-grow"
            />
          </div>

          <div class="flex items-center mb-3">
            <span
              class="font-bold w-10 text-left text-zinc-900 dark:text-zinc-200 duration-300"
              >个人主页</span
            >
            <v-input
              v-model="inputValues.homePage"
              placeholder="个人主页"
              class="flex-grow"
            />
          </div>

          <div class="flex items-center mb-3">
            <span
              class="font-bold w-10 text-left text-zinc-900 dark:text-zinc-200 duration-300"
              >个人介绍</span
            >
            <v-input
              v-model="inputValues.introduction"
              placeholder="个人介绍"
              class="flex-grow"
              inputType="textarea"
            />
          </div>

          <div class="text-center">
            <Button
              :loading="loading"
              @click="handleSubmit"
              size="large"
              class="bg-red-600 mt-4 px-4 border-red-600 hover:bg-red-600 focus:bg-red-600 hover:border-red-700 focus:border-red-700 active:border-red-700 duration-300 dark:bg-zinc-900 dark:border-zinc-900 xl:dark:bg-zinc-800 xl:dark:border-zinc-800 py-1"
              >保存修改</Button
            >
          </div>
        </form>
        <div
          class="xl:flex-1 flex flex-col items-center xl:order-2 order-1 mb-3"
        >
          <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-200 mb-2">
            我的头像
          </h3>
          <div
            class="w-[80px] h-[80px] rounded-full overflow-hidden relative group"
          >
            <img class="w-full h-full" :src="inputValues.avatar" alt="" />
            <div
              class="absolute xl:group-hover:flex hidden w-full h-full left-0 top-0 bg-zinc-900/60 items-center justify-center flex-col cursor-pointer duration-300"
            >
              <svg-icon
                name="profile"
                class="change-header-image fill-zinc-300 w-2 h-2"
              ></svg-icon>
              <span class="text-zinc-300 text-xs text-center mt-0.5"
                >点击更换头像</span
              >
            </div>
            <input
              type="file"
              class="opacity-0 absolute w-full h-full left-0 top-0 z-[1px]"
              accept="image/jpg,image/png,image/jpeg,image/gif"
              ref="fileInput"
              @change="selectImg"
            />
          </div>
          <div class="text-zinc-500 text-sm mt-1 xl: w-[60%] xl:text-center">
            支持 jpg、png、jpeg 格式大小 5M 以内的图片
          </div>
        </div>
      </div>
    </div>

    <Dialog
      v-if="!isMoboleTerminal"
      v-model="dialogVisible"
      :onOk="onOk"
      title="裁减图片"
    >
      <change-avatar :imgUrl="blobImg" @onConfirm="dialogVisible = false" />
      <template #footer>
        <div></div>
      </template>
    </Dialog>
    <popup v-else v-model="dialogVisible">
      <change-avatar
        :imgUrl="blobImg"
        @onConfirm="dialogVisible = false"
        @close="dialogVisible = false"
      />
    </popup>
  </div>
</template>

<script>
export default {
  name: 'profile'
}
</script>

<script setup>
import { ref, watch } from 'vue'
import { putUser } from '@/api/sys'
import { useStore } from 'vuex'
import Message from '@/libs/message'
import { isMoboleTerminal } from '@/utils/flexible'
import ChangeAvatar from './components/change-avatar/index.vue'

const store = useStore()
// 初始化数据是从vuex中拿到的
const inputValues = ref(store.getters.userInfo)
const loading = ref(false)
// 裁减图片dialog是否展示
const dialogVisible = ref(false)
const fileInput = ref(null)
// blob图片
const blobImg = ref('')
const handleSubmit = async ($event) => {
  $event.preventDefault()
  loading.value = true
  await putUser(inputValues.value)
  // 修改成功后同步到vuex中
  store.commit('user/setUserInfo', inputValues.value)
  Message.success('您的信息已修改成功')
  loading.value = false
}
// 选择图片之后的回调
const selectImg = ($event) => {
  const file = $event.target.files[0]
  console.log(file, URL.createObjectURL(file))
  // 生成blob连接、使其能预览
  blobImg.value = URL.createObjectURL(file)
  // 打开Dialog
  dialogVisible.value = true
}

const onOk = () => {}

// 每次关闭之后都要清除下file的上一次的值
watch(dialogVisible, (v) => {
  if (!v) {
    fileInput.value.value = null
  }
})
watch(
  () => store.getters.userInfo?.avatar,
  (v) => {
    inputValues.value.avatar = v
  }
)
</script>

<style></style>
