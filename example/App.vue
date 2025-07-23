<template>
  <div>
    <h1>组件库测试</h1>
    <!-- <ow-scroll> -->
      <ow-search v-model="queryText"></ow-search>
      <ow-board :model="[{ label: '11111' }, { label: '22222' }]" :height="1000"></ow-board>
    <!-- </ow-scroll> -->
  </div>
</template>
<script>

	export default {

  name: 'App',


  data(){
    return {
      queryText: ''
    }
  }
};
</script>
