<template>
  <li class="list" @click="toggle">
    <input type="checkbox" :checked="todo.is_done" />
    <span class="task" :style="todo.is_done ? 'text-decoration: line-through' : ''">
      {{ todo.title }}
    </span>
    <i class="uil" :class="icon"></i>
    <button @click.stop="remove" style="margin-left: 10px; color: red;">✕</button>
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