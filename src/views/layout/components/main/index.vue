<template>
  <h1 class="h-main">
    <Button type="primary" plain>搜索</Button>
    <Button type="warning" plain>搜索</Button>
    <Button type="danger" plain>搜索</Button>
    <Button type="success" plain>搜索</Button>
    <Button type="default">搜索</Button>
    <Button type="primary" size="small">搜索</Button>
    <Button type="primary" size="middle">搜索</Button>
    <Button type="primary" size="default">搜索</Button>
    <Button type="primary" size="large">搜索</Button>
    <Button icon="delete">搜索1</Button>

    <Button type="danger" plain icon="delete">搜索</Button>
    <Button type="warning" plain icon="delete">搜索</Button>
    <Button type="success" plain icon="delete">搜索</Button>
    <Button type="default" plain icon="delete"></Button>
    <Button type="primary" icon="delete" @click="handle" loading></Button>
    <popover trigger="hover"> hover </popover>
    <popover trigger="click"> click </popover>
    <popover trigger="focus"> focus </popover>
    <popover trigger="manual"> manual </popover>
    <div style="height: 2000vh; width: 2000vh"></div>
  </h1>
</template>

<script setup>
const handle = () => {
  console.log(1)
}
</script>
