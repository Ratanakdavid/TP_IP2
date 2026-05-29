<template>
  <div class="page">
    <div class="card">
      <div class="card-header">
        <i class="uil uil-clipboard-alt"></i>
        <h1>My Todo List</h1>
      </div>

      <AddTodo @added="handleAddTodo" />

      <!-- Filter Tabs -->
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: store.filter === 'all' }"
          @click="store.setFilter('all')"
        >
          All
          <span class="tab-badge">{{ store.todos.length }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: store.filter === 'active' }"
          @click="store.setFilter('active')"
        >
          Active
          <span class="tab-badge">{{ store.pendingCount }}</span>
        </button>
        <button
          class="tab"
          :class="{ active: store.filter === 'done' }"
          @click="store.setFilter('done')"
        >
          Done
          <span class="tab-badge">{{ store.doneCount }}</span>
        </button>
      </div>

      <!-- Todo List -->
      <ul class="todo-list">
        <TodoItem
          v-for="todo in store.filteredTodos"
          :key="todo.id"
          :todo="todo"
        />
        <li v-if="store.filteredTodos.length === 0" class="empty-msg">
          No tasks here 🎉
        </li>
      </ul>

      <div class="card-footer">
        <span>{{ store.pendingCount }} task{{ store.pendingCount !== 1 ? 's' : '' }} remaining</span>
        <button class="clear-btn" @click="clearAll">
          <i class="uil uil-trash"></i>
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoItem from './components/TodoItem.vue'
import { useTodoStore } from './stores/todo'

export default {
  name: 'App',
  components: { AddTodo, TodoItem },
  setup() {
    const store = useTodoStore()
    let stopRealtime = null

    onMounted(async () => {
      await store.fetchTodos()
      stopRealtime = store.startRealtime()
    })

    onBeforeUnmount(() => stopRealtime?.())

    function handleAddTodo(title) { store.addTodo(title) }
    function clearAll() { store.clearAll() }

    return { store, handleAddTodo, clearAll }
  },
}
</script>

<style>
@import "https://unicons.iconscout.com/release/v4.0.0/css/line.css";

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.page {
  width: 100%;
  display: flex;
  justify-content: center;
}

.card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.card-header i { font-size: 28px; color: #667eea; }
.card-header h1 { font-size: 22px; font-weight: 700; color: #2d3748; }

/* Input */
.input-wrapper {
  display: flex;
  align-items: center;
  background: #f7f8fc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.6rem 1rem;
  gap: 10px;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within { border-color: #667eea; }
.add-icon { font-size: 22px; color: #667eea; }

.todo-input {
  border: none;
  background: transparent;
  font-size: 15px;
  width: 100%;
  color: #2d3748;
  outline: none;
}

.todo-input::placeholder { color: #a0aec0; }

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 1.2rem;
  background: #f7f8fc;
  border-radius: 12px;
  padding: 6px;
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.tab-badge {
  background: #e2e8f0;
  color: #718096;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 20px;
}

.tab.active .tab-badge {
  background: #667eea;
  color: white;
}

/* Todo list */
.todo-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f7f8fc;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  transition: background 0.2s;
  border: 1.5px solid transparent;
}

.todo-item:hover { border-color: #667eea33; }
.todo-item.done { background: #f0fff4; }

/* Custom checkbox */
.checkbox-wrapper {
  position: relative;
  cursor: pointer;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.checkbox-wrapper input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.checkmark {
  position: absolute;
  top: 0; left: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkmark::after {
  content: '';
  position: absolute;
  display: none;
  left: 5px; top: 2px;
  width: 5px; height: 10px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.checkbox-wrapper input:checked ~ .checkmark::after { display: block; }

.todo-title {
  flex: 1;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.2s;
}

.todo-item.done .todo-title {
  text-decoration: line-through;
  color: #a0aec0;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #cbd5e0;
  font-size: 18px;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.delete-btn:hover { color: #fc8181; background: #fff5f5; }

.empty-msg {
  text-align: center;
  color: #a0aec0;
  font-size: 14px;
  padding: 1rem;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1.5px solid #e2e8f0;
  font-size: 14px;
  color: #718096;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff5f5;
  color: #fc8181;
  border: 1.5px solid #fed7d7;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover { background: #fc8181; color: white; border-color: #fc8181; }
</style>