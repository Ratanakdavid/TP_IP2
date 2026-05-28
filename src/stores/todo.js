import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apolloClient } from '@/apollo/client'
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from '@/graphql/todos'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const { data } = await apolloClient.query({
        query: GET_TODOS,
        fetchPolicy: 'network-only',
      })
      todos.value = data.todos
    } catch (e) {
      error.value = e.message ?? 'Failed to load todos'
      console.error('fetchTodos error:', e)
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title) {
    const clean = title.trim()
    if (!clean) return
    try {
      await apolloClient.mutate({
        mutation: ADD_TODO,
        variables: { title: clean },
      })
      await fetchTodos()
    } catch (e) {
      console.error('addTodo error:', e)
    }
  }

  async function toggleTodo(todo) {
    try {
      await apolloClient.mutate({
        mutation: TOGGLE_TODO,
        variables: { id: todo.id, done: !todo.is_done },
      })
      await fetchTodos()
    } catch (e) {
      console.error('toggleTodo error:', e)
    }
  }

  async function deleteTodo(id) {
    try {
      await apolloClient.mutate({
        mutation: DELETE_TODO,
        variables: { id },
      })
      await fetchTodos()
    } catch (e) {
      console.error('deleteTodo error:', e)
    }
  }

  async function clearAll() {
    try {
      for (const todo of todos.value) {
        await apolloClient.mutate({
          mutation: DELETE_TODO,
          variables: { id: todo.id },
        })
      }
      await fetchTodos()
    } catch (e) {
      console.error('clearAll error:', e)
    }
  }

  function startRealtime() {
    try {
      const obs = apolloClient.subscribe({ query: TODOS_SUB })
      const sub = obs.subscribe({
        next: ({ data }) => {
          if (data?.todos) todos.value = data.todos
        },
        error: (e) => {
          console.error('Subscription error (non-fatal):', e)
        },
      })
      return () => sub.unsubscribe()
    } catch (e) {
      console.error('startRealtime failed:', e)
      return () => {}
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearAll,
    startRealtime,
  }
})