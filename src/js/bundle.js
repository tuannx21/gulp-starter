import {
  addTodo,
  removeTodo,
  updateTodo,
  toggleTodo,
  completeAll,
  uncompleteAll,
  remainingTodos
} from './todo-function'

let TodoList
let currentMode = 'all'
let completeAllState = true
const inputNewTodo = document.querySelector('#input-new-todo')
const completeAllTodo = document.querySelector('#complete-all-todo')
const showAllTodo = document.querySelector('#show-all')
const showUncompleteTodo = document.querySelector('#show-uncomplete')
const showCompletedTodo = document.querySelector('#show-completed')

//App
const initial = () => {
  const TodoListFromLocalStorage = JSON.parse(window.localStorage.getItem('todos'))
  TodoList = TodoListFromLocalStorage === null ? [] : TodoListFromLocalStorage
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
    let input = todoItem.querySelector('#input-todo')
    let remove = todoItem.querySelector('#remove-todo')
    let complete = todoItem.querySelector('#complete-todo')
    input.value = todo.title

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

    if (todo.completed === true) {
      input.classList.add('has-completed')
      complete.classList.add('has-completed')
    }

    todoItem.addEventListener('mouseover', function () {
      remove.classList.add('active')
      complete.classList.add('active')
    })

    todoItem.addEventListener('mouseout', function () {
      remove.classList.remove('active')
      complete.classList.remove('active')
    })

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

    input.addEventListener('keypress', function () {
      if (event.which === 13 || event.keyCode === 13) {
        TodoList = updateTodo(TodoList, { id: todo.id, title: input.value })
        rerender()
      }
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

const rerender = () => {
  clearTodos()
  showTodos(currentMode)
  showStatistical()
  switch (currentMode) {
    case 'completed':
      showCompletedTodo.classList.add('active')
      showUncompleteTodo.classList.remove('active')
      showAllTodo.classList.remove('active')
      break
    case 'uncomplete':
      showCompletedTodo.classList.remove('active')
      showUncompleteTodo.classList.add('active')
      showAllTodo.classList.remove('active')
      break
    default:
      showCompletedTodo.classList.remove('active')
      showUncompleteTodo.classList.remove('active')
      showAllTodo.classList.add('active')
  }
}

const createOnEnter = () => {
  inputNewTodo.addEventListener('keypress', function (event) {
    if (event.which === 13 || event.keyCode === 13) {
      TodoList = addTodo(TodoList, inputNewTodo.value)
      inputNewTodo.value = ''
      completeAllState = true
      rerender()
    }
  })
}

const clickCompleteAll = () => {
  completeAllTodo.addEventListener('click', function () {
    if (completeAllState === true) {
      completeAll(TodoList)
    } else {
      uncompleteAll(TodoList)
    }
    completeAllState = !completeAllState
    rerender()
  })
}

const clickShowAllTodo = () => {
  showAllTodo.addEventListener('click', function () {
    currentMode = 'all'
    rerender()
  })
}

const clickShowUncompleteTodo = () => {
  showUncompleteTodo.addEventListener('click', function () {
    currentMode = 'uncomplete'
    rerender()
  })
}

const clickShowCompleteTodo = () => {
  showCompletedTodo.addEventListener('click', function () {
    currentMode = 'completed'
    rerender()
  })
}

const TodoApp = () => {
  initial()

  createOnEnter();
  clickCompleteAll();
  clickShowAllTodo();
  clickShowUncompleteTodo();
  clickShowCompleteTodo();

  rerender()
}

//Start App
TodoApp()
