<template>
  <ul class="todoLists">
    <template v-if="status == 'completed'">
      <TodoItem
        v-for="todo of completedTasks"
        :key="todo.id"
        icon="uil-adobe-alt"
        :todo="todo"
      />
    </template>
    <template v-else>
      <TodoItem
        v-for="todo of pendingTasks"
        :key="todo.id"
        icon="uil-adobe-alt"
        :todo="todo"
      />
    </template>
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
    const completedTasks = computed(() =>
      todoStore.todos.filter((t) => t.is_done)
    )
    const pendingTasks = computed(() =>
      todoStore.todos.filter((t) => !t.is_done)
    )
    return { completedTasks, pendingTasks }
  },
}
</script>