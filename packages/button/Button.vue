<!-- packages/button/Button.vue -->
<template>
  <button :class="['ow-button', type]">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'OwButton',
  props: {
    type: {
      type: String,
      default: 'default',
    },
  },
}
</script>

<style scoped>
.ow-button {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
.ow-button.default {
  background-color: #f0f0f0;
  color: #333;
}
.ow-button.primary {
  background-color: #409eff;
  color: white;
}
</style>
