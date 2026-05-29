<template>
  <div class="input-wrapper">
    <i class="uil uil-plus-circle add-icon"></i>
    <input
      @keyup.enter.prevent="addTodo"
      ref="input"
      placeholder="Add a new task..."
      class="todo-input"
    />
  </div>
</template>

<script>
export default {
  methods: {
    addTodo(e) {
      this.$emit('added', e.target.value)
      this.$refs.input.value = null
    },
  },
}
</script>