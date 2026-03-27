import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')

  const fetchTodos = async () => {
    const response = await fetch(API_URL)
    const data = await response.json()
    setTodos(data)
  }

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setTodos(data))
  }, [])

  const addTodo = async (event) => {
    event.preventDefault()
    if (!task.trim()) return

    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: task.trim(), completed: false }),
    })

    setTask('')
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    fetchTodos()
  }

  const editTodo = async (todo) => {
    const newTask = window.prompt('Edit task name:', todo.task)
    if (newTask === null) return
    if (!newTask.trim()) return

    await fetch(`${API_URL}/${todo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: newTask.trim() }),
    })

    fetchTodos()
  }

  return (
    <main className="todo-page py-5">
      <div className="container">
        <div className="todo-shell mx-auto">
          <header className="text-center mb-4">
            <h1 className="display-6 fw-bold todo-title mb-2">Eddie&apos;s to-do App :)</h1>
            <p className="mb-0 text-secondary">get stuff done</p>
          </header>

          <section className="card border-0 shadow-sm todo-card">
            <div className="card-body p-4">
              <form className="row g-2 mb-3" onSubmit={addTodo}>
                <div className="col-12 col-md-9">
                  <label htmlFor="newTask" className="visually-hidden">
                    New task
                  </label>
                  <input
                    id="newTask"
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Add a new task..."
                    value={task}
                    onChange={(event) => setTask(event.target.value)}
                  />
                </div>
                <div className="col-12 col-md-3 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={!task.trim()}
                  >
                    Add
                  </button>
                </div>
              </form>

              <ul className="list-group list-group-flush">
                {todos.length === 0 && (
                  <li className="list-group-item text-center text-muted py-4">
                    No tasks yet. Add one above.
                  </li>
                )}

                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="list-group-item d-flex flex-column flex-md-row gap-2 align-items-md-center justify-content-between todo-item"
                  >
                    <span className="task-text">{todo.task}</span>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => editTodo(todo)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
