<template>
  <li class="todo-item" :class="{ done: todo.is_done }">
    <label class="checkbox-wrapper">
      <input type="checkbox" :checked="todo.is_done" @change="toggle" />
      <span class="checkmark"></span>
    </label>
    <span class="todo-title">{{ todo.title }}</span>
    <button class="delete-btn" @click.stop="remove" aria-label="Delete">
      <i class="uil uil-trash-alt"></i>
    </button>
  </li>
</template>

<script>
import { useTodoStore } from '../stores/todo'
export default {
  props: ['todo', 'icon'],
  setup(props) {
    const todoStore = useTodoStore()
    function toggle() {
      todoStore.toggleTodo(props.todo)
    }
    function remove() {
      todoStore.deleteTodo(props.todo.id)
    }
    return { toggle, remove }
  },
}
</script>