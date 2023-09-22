import React, { useEffect, useState } from "react";
import TodoFilterControl from "./components/TodoFilterControl";
import IconCheck from "./images/check-icon.svg";
import SwitchToDarkIcon from "./images/moon-icon.svg";
import SwitchToLightIcon from "./images/sun-icon.svg";
import "./App.css";

const data = [
  { id: 1, content: "Complete assignment", completed: true },
  { id: 2, content: "Learn React", completed: false },
];

function App() {
  const [todos, setTodos] = useState(data);
  const [todoInput, setTodoInput] = useState("");
  const [themeLight, setThemeLight] = useState(true);
  const [editableTodo, setEditableTodo] = useState(null); 
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState(todos);

  const themeClass = themeLight ? "light" : "dark";
  const textPlacer = filterStatus === "completed" ? "closed task" : "task";
  const switchThemeIcon = themeLight ? SwitchToDarkIcon : SwitchToLightIcon;

  useEffect(() => {
    const handleFilter = () => {
      switch (filterStatus) {
        case "active":
          return setFilteredTodos(todos.filter((todo) => !todo.completed));

        case "completed":
          return setFilteredTodos(todos.filter((todo) => todo.completed));

        default:
          return setFilteredTodos(todos);
      }
    };
    handleFilter();
  }, [todos, filterStatus]);

  const changeTheme = () => {
    setThemeLight(!themeLight);
  };

  const generateId = (array) => {
    const ids = array.map((item) => item.id);
    return Math.max(...ids) + 1;
  };

  const handleChange = (e) => {
    setTodoInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoInput) {
      const newTodo = {
        id: generateId(todos),
        content: todoInput.trim(),
        completed: false,
      };

      setTodos([newTodo, ...todos]);
      setTodoInput("");
    }
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    setFilterStatus("all");
  };

  const toggleCompleted = (todo) => {
    const updatedTodos = todos.map((item) =>
      item.id === todo.id ? { ...item, completed: !item.completed } : item
    );
    setTodos(updatedTodos);
  };

  const startEditing = (todo) => {
    setEditableTodo({ ...todo, originalContent: todo.content });
  };

  const cancelEditing = () => {
    setEditableTodo(null);
  };

  const saveEditedTodo = (editedContent, todo) => {
    if (editedContent !== todo.originalContent) {
      const updatedTodos = todos.map((item) =>
        item.id === todo.id ? { ...item, content: editedContent } : item
      );
      setTodos(updatedTodos);
    }
    setEditableTodo(null);
  };

  const deleteTodo = (todo) => {
    const updatedTodos = todos.filter((item) => item.id !== todo.id);
    setTodos(updatedTodos);
  };

  return (
    <div id="wrapper" className={`wrapper ${themeClass}`}>
      <div className="container">
        <header className="header">
          <h1 className="centered">TODO</h1>
          <button className="switch-theme-btn" onClick={changeTheme}>
            <img src={switchThemeIcon} alt="Dark Theme" />
          </button>
        </header>
        <main>
          <div className="form-control">
            <form onSubmit={handleSubmit}>
              <label htmlFor="todoInput">Add New Todo</label>
              <input
                type="text"
                name="todo-input"
                className="todo-input"
                id="todoInput"
                placeholder="Add a new todo"
                value={todoInput}
                onChange={handleChange}
              />
              <button id="submitNewTodo" type="submit">
                Add
              </button>
            </form>
          </div>

          <section className="todo-list-section">
            {filteredTodos.length < 1 ? (
              <p className="info-text">There's no {textPlacer}</p>
            ) : (
              <ul className="todo-list">
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className={todo.completed ? "completed" : ""}>
                    {editableTodo?.id === todo.id ? (
                      <div>
                        <input
                          type="text"
                          className="editTextInput"
                          value={editableTodo.content}
                          onChange={(e) =>
                            setEditableTodo({
                              ...editableTodo,
                              content: e.target.value,
                            })
                          }
                        />
                        <button className="save-button" onClick={() => saveEditedTodo(editableTodo.content, todo)}>Save</button>
                        <button className="cancel-button" onClick={() => cancelEditing()}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <label htmlFor={`todoCheckbox-${todo.id}`}>
                          Completed Checkbox
                        </label>
                        <input
                          id={`todoCheckbox-${todo.id}`}
                          type="checkbox"
                          name="completed-checkbox"
                          checked={todo.completed}
                          onChange={() => toggleCompleted(todo)}
                        />
                        <div className="checkbox-border-wrap">
                          <span
                            className="checkbox"
                            onClick={() => toggleCompleted(todo)}
                          >
                            {todo.completed && (
                              <img src={IconCheck} alt="Completed" />
                            )}
                          </span>
                        </div>
                        <p>{todo.content}</p>
                        <button className="edit-button" onClick={() => startEditing(todo)}>Edit</button>
                        <button className="delete-button" onClick={() => deleteTodo(todo)}>Delete</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="todo-filter-control">
              <div className="control-btn group filter-control-for-desktop">
                <TodoFilterControl
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                />
              </div>

              <div className="control-btn">
                <button className="btn" onClick={clearCompletedTodos}>
                  Clear-Completed-Task
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
