<template>
  <ul class="todo-list">
    <template v-if="status == 'completed'">
      <TodoItem
        v-for="todo of completedTasks"
        :key="todo.id"
        :todo="todo"
      />
    </template>
    <template v-else>
      <TodoItem
        v-for="todo of pendingTasks"
        :key="todo.id"
        :todo="todo"
      />
    </template>
    <li v-if="status == 'pending' && pendingTasks.length === 0" class="empty-msg">
      No pending tasks 
    </li>
  </ul>
</template>

<script>
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'
import { useTodoStore } from '../stores/todo'
export default {
  name: 'TodoList',
  components: { TodoItem },
  props: ['status'],
  setup() {
    const todoStore = useTodoStore()
    const completedTasks = computed(() => todoStore.todos.filter((t) => t.is_done))
    const pendingTasks = computed(() => todoStore.todos.filter((t) => !t.is_done))
    return { completedTasks, pendingTasks }
  },
}
</script>