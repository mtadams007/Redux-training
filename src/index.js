import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import "./App.css";

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };

    case "TOGGLE_TODO":
      return state.id === action.id
        ? {
            ...state,
            completed: !state.completed,
          }
        : state;
    default:
      return state;
  }
};

const multipleTodoReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todoReducer(undefined, action)];
    case "TOGGLE_TODO":
      return state.map((t) => todoReducer(t, action));

    default:
      return state;
  }
};

const visibilityReducer = (state = null, action) => {
  switch (action.type) {
    case "VISIBILITY_FILTER":
      return action.value;
    default:
      return state;
  }
};

const changeFilter = (value) => {
  store.dispatch({
    type: "VISIBILITY_FILTER",
    value,
  });
};

const masterReducer = combineReducers({
  todos: multipleTodoReducer,
  visibilityFilter: visibilityReducer,
});

// const masterReducer = (state = {}, action) => {
//   switch (action.type) {
//     case "ADD_TODO":
//     case "TOGGLE_TODO":
//       return { ...state, todos: multipleTodoReducer(state.todos, action) };
//     case "VISIBILITY_FILTER":
//       return {
//         ...state,
//         visibilityFilter: visibilityReducer(state.visibilityFilter, action),
//       };
//     default:
//       return state;
//   }
// };

const addTodo = (text) =>
  store.dispatch({
    type: "ADD_TODO",
    text,
    id: Math.floor(Math.random() * 100),
  });

const toggleTodo = (id) => {
  store.dispatch({
    type: "TOGGLE_TODO",
    id,
  });
};

const getVisibleTodos = (todos, visibilityFilter) => {
  switch (visibilityFilter) {
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "incompleted":
      return todos.filter((todo) => !todo.completed);
    default:
      return todos;
  }
};

const VisibilityButton = ({ filter, currentFilter, children }) => {
  return (
    <button
      style={
        currentFilter === filter
          ? {
              backgroundColor: "chartreuse",
            }
          : undefined
      }
      onClick={() => changeFilter(filter)}
    >
      {children}
    </button>
  );
};

const Todo = ({ todos = [], visibilityFilter }) => {
  const [inputValue, setInputValue] = React.useState("");
  const visibleTodos = getVisibleTodos(todos, visibilityFilter);
  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
      />
      <div>
        <VisibilityButton filter="completed" currentFilter={visibilityFilter}>
          Show complete
        </VisibilityButton>
        <VisibilityButton filter="incompleted" currentFilter={visibilityFilter}>
          Show incompleted
        </VisibilityButton>
        <VisibilityButton filter={null} currentFilter={visibilityFilter}>
          Show all
        </VisibilityButton>
      </div>
      <button
        onClick={() => {
          addTodo(inputValue);
          setInputValue("");
        }}
      >
        add Todo
      </button>
      {visibleTodos.map((todo) => (
        <h1
          style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          onClick={() => toggleTodo(todo.id)}
        >
          {todo.text}
        </h1>
      ))}
    </div>
  );
};

const store = createStore(masterReducer);

const render = () =>
  ReactDOM.render(
    <Todo
      todos={store.getState().todos}
      visibilityFilter={store.getState().visibilityFilter}
    />,
    document.getElementById("root")
  );

store.subscribe(render);
render();
