<template>
  <div class="container">
    <AddTodo @added="handleAddTodo" />
    <h3>Pending Tasks:</h3>
    <TodoLists status="pending" />
    <h3>Completed Tasks:</h3>
    <TodoLists status="completed" />
    <div class="pending-tasks">
      <span>You have <span class="pending-num">{{ pendingCount }}</span> tasks pending.</span>
      <button class="clear-button" @click="clearAll">Clear All</button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoLists from './components/TodoList.vue'
import { useTodoStore } from './stores/todo'

export default {
  name: 'App',
  components: { AddTodo, TodoLists },
  setup() {
    const store = useTodoStore()
    let stopRealtime = null

    onMounted(async () => {
      await store.fetchTodos()
      stopRealtime = store.startRealtime()
    })

    onBeforeUnmount(() => stopRealtime?.())

    const pendingCount = computed(() =>
      store.todos.filter((t) => !t.is_done).length
    )

    function handleAddTodo(title) {
      store.addTodo(title)
    }

    function clearAll() {
      store.clearAll()
    }

    return { pendingCount, handleAddTodo, clearAll }
  },
}
</script>

<style>
@import "https://unicons.iconscout.com/release/v4.0.0/css/line.css";
</style>