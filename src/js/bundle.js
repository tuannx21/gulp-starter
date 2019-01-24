import {
  addTodo,
  removeTodo,
  updateTodo,
  toggleTodo,
  completeAll,
  remainingTodos
} from './todo-function'

let TodoList

//App 
const initial = () => {
  const TodoListFromLocalStorage = JSON.parse(window.localStorage.getItem('todos'))
  if (TodoListFromLocalStorage === null) {
    TodoList = []
  } else {
    TodoList = TodoListFromLocalStorage
  }
}

const saveToLocalStorage = () => {
  window.localStorage.setItem('todos', JSON.stringify(TodoList))
}

const clearTodos = () => {
  let todoList = document.querySelector('#todo-list')
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild)
  }
}

const showTodos = (mode) => {
  TodoList.map((todo) => {
    let template = document.querySelector('#todo-template')
    let clone = template.content.cloneNode(true)
    let todoItem = clone.querySelector('li')

    switch (mode) {
      case 'uncomplete':
        todoItem.style.display = todo.completed === true ? 'none' : 'block'
        break
      case 'completed':
        todoItem.style.display = todo.completed === true ? 'block' : 'none'
        break
      default:
        todoItem.style.display = 'block'
    }

    todoItem.id = `todo${todo.id}`
    let input = todoItem.querySelector('#input-todo')
    let edit = todoItem.querySelector('#edit-todo')
    let remove = todoItem.querySelector('#remove-todo')
    let complete = todoItem.querySelector('#complete-todo')

    input.value = todo.title
    input.style.textDecoration = todo.completed === true ? 'line-through' : 'none'

    input.addEventListener('dblclick', function () { this.readOnly = false })
    input.addEventListener('blur', function () {
      input.readOnly = true
      if (input.value !== '') {
        TodoList = updateTodo(TodoList, { id: todo.id, title: input.value })
      } else {
        TodoList = removeTodo(TodoList, todo)
      }
      rerender(mode)
    })
    remove.addEventListener('click', function () {
      TodoList = removeTodo(TodoList, todo)
      rerender(mode)
    })
    complete.addEventListener('click', function () {
      TodoList = toggleTodo(TodoList, todo)
      rerender(mode)
    })

    document.querySelector('#todo-list').appendChild(clone)
  })
  saveToLocalStorage()
}

const showStatistical = () => {
  document.querySelector('#all').innerHTML = TodoList.length
  document.querySelector('#remaining').innerHTML = remainingTodos(TodoList).length
}

const rerender = (mode) => {
  clearTodos()
  showTodos(mode)
  showStatistical()
}

const TodoApp = () => {
  initial()
  let inputNewTodo = document.querySelector('#input-new-todo')

  inputNewTodo.addEventListener('keypress', function (event) {
    if (event.which === 13 || event.keyCode === 13) {
      TodoList = addTodo(TodoList, inputNewTodo.value)
      inputNewTodo.value = ''
      rerender()
    }
  })

  document.querySelector('#new-todo').addEventListener('click', function () {
    TodoList = addTodo(TodoList, inputNewTodo.value)
    rerender()
  })

  document.querySelector('#complete-all-todo').addEventListener('click', function () {
    completeAll(TodoList)
    rerender()
  })

  document.querySelector('#show-all').addEventListener('click', function () {
    rerender()
  })

  document.querySelector('#show-uncomplete').addEventListener('click', function () {
    rerender('uncomplete')
  })

  document.querySelector('#show-completed').addEventListener('click', function () {
    rerender('completed')
  })

  rerender()
}

//Start App
TodoApp()
