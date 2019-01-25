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
let completeAllState = true;

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
    let remove = todoItem.querySelector('#remove-todo')
    let complete = todoItem.querySelector('#complete-todo')

    input.value = todo.title
    // input.style.textDecoration = todo.completed === true ? 'line-through' : 'none'
    // input.style.opacity = todo.completed === true ? '.3' : '1'
    if (todo.completed === true) {
      input.style.textDecoration = 'line-through'
      input.style.opacity = '.3'
      complete.style.opacity = '1'
    } else {
      input.style.textDecoration = 'none'
      input.style.opacity = '1'
      complete.style.opacity = '.3'
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
      document.querySelector('#show-completed').classList.add('active')
      document.querySelector('#show-uncomplete').classList.remove('active')
      document.querySelector('#show-all').classList.remove('active')
      break
    case 'uncomplete':
      document.querySelector('#show-completed').classList.remove('active')
      document.querySelector('#show-uncomplete').classList.add('active')
      document.querySelector('#show-all').classList.remove('active')
      break
    default:
      document.querySelector('#show-completed').classList.remove('active')
      document.querySelector('#show-uncomplete').classList.remove('active')
      document.querySelector('#show-all').classList.add('active')
  }
}

const TodoApp = () => {
  initial()
  rerender()
  let inputNewTodo = document.querySelector('#input-new-todo')
  let completeAllTodo = document.querySelector('#complete-all-todo')
  let showAllTodo = document.querySelector('#show-all')
  let showUncompleteTodo = document.querySelector('#show-uncomplete')
  let showCompletedTodo = document.querySelector('#show-completed')

  inputNewTodo.addEventListener('keypress', function (event) {
    if (event.which === 13 || event.keyCode === 13) {
      TodoList = addTodo(TodoList, inputNewTodo.value)
      inputNewTodo.value = ''
      rerender()
    }
  })

  completeAllTodo.addEventListener('click', function () {
    if (completeAllState === true) {
      completeAll(TodoList);
      this.style.opacity = '.3'
    } else {
      uncompleteAll(TodoList);
      this.style.opacity = '1'
    }
    completeAllState = !completeAllState;
    rerender();
  })

  showAllTodo.addEventListener('click', function () {
    currentMode = 'all'
    rerender()
  })

  showUncompleteTodo.addEventListener('click', function () {
    currentMode = 'uncomplete'
    rerender()
  })

  showCompletedTodo.addEventListener('click', function () {
    currentMode = 'completed'
    rerender()
  })

  rerender()
}

//Start App
TodoApp()
