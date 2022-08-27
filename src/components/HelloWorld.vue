<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
  <div class="box">
    <div class="image bg-">
      <img
        v-lazy
        src="https://images.pexels.com/photos/5313576/pexels-photo-5313576.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
      />
    </div>
    <div class="content">
      <div class="desc">
        你能看出示例代码中存在的问题吗？（如果一眼看出来了，那么继续阅读这篇文章可能不会给你带来收益。）这段代码实际运行起来的效果是，页面从
        0 变为 1，之后就一直展示 1。不是直观理解那样，每隔一秒更新一次。
      </div>

      <div class="auth">LGD_Sunday</div>
      <div class="title">前中台解决方案</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  max-width: 1000px;
  min-width: 650px;
  padding: 20px;
  display: flex;
  font-size: 14px;
  background: paleturquoise;
  .image {
    flex: 2;
    /* flex-shrink: 0; */
    /* height: 100%; */
  }
  .content {
    flex: 8;

    padding: 20px;
    .desc {
      color: #222;
    }
    .auth {
      color: deeppink;
    }
  }
}
@media screen and (max-width: 650px) {
  .box {
    flex-direction: column;
    align-items: center;
    .image {
      flex: auto;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      text-align: center;
    }
  }
}
</style>
