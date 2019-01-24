//Basic Function
const addTodo = (todosBeforeAdd, title) => {
  if (title !== '') {
    return [...todosBeforeAdd, {
      id: todosBeforeAdd.reduce((a, b) => ((a.id > b.id) ? a.id : b.id), 0) + 1,
      title: title,
      completed: false
    }]
  } else {
    alert("u must type something first !!")
    return todosBeforeAdd
  }
}

const removeTodo = (todosBeforeRemove, { id }) => {
  return todosBeforeRemove.filter((todo) => todo.id !== id)
}

const updateTodo = (todosBeforeUpdate, { id, title }) => {
  let temp = [...todosBeforeUpdate]
  temp[temp.findIndex((todo) => (todo.id === id))].title = title
  return temp
}

const toggleTodo = (todosBeforeUpdate, { id }) => {
  let temp = [...todosBeforeUpdate]
  let i = temp.findIndex((todo) => (todo.id === id))
  temp[i].completed = !temp[i].completed
  return temp
}

const completeAll = (todos) => {
  return todos.map((todo) => (todo.completed = true))
}

const remainingTodos = (todos) => {
  return todos.filter((todo) => (todo.completed === false))
}

export {
  addTodo,
  removeTodo,
  updateTodo,
  toggleTodo,
  completeAll,
  remainingTodos
}
