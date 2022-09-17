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
import { getSts, putUser } from '@/api/sys'
import { REGION, BUCKET } from '@/constants'
import { useStore } from 'vuex'
import Message from '@/libs/message'
import OSS from 'ali-oss'
let cropper = null
const store = useStore()
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
    const typeArr = blob.type.split('/')
    const filename = `${store.getters.userInfo.username}/${Date.now()}.${
      typeArr[typeArr.length - 1]
    }`
    handleUpload(filename, blob)
    // Blob { size: 8975, type: 'image/png' }
    // console.log(URL.createObjectURL(blob))
    // blob:http://localhost:5173/fd101aff-90ec-4e56-a5a0-846e69b67577
  })
}
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
const handleClose = () => {
  emits('close')
}
</script>

<style></style>
