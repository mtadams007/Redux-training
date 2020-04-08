import React, { useState, useEffect } from "react";
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

const changeFilter = (store, value) => {
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

let id = 0;

const addTodo = (store, text) => {
  id++;
  return store.dispatch({
    type: "ADD_TODO",
    text,
    id,
  });
};

const toggleTodo = (store, id) => {
  store.dispatch({
    type: "TOGGLE_TODO",
    id,
  });
};

const Todo = ({ completed, text, onClick }) => (
  <h1
    style={{ textDecoration: completed ? "line-through" : "none" }}
    onClick={onClick}
  >
    {text}
  </h1>
);

const VisibleTodoList = ({ store }) => {
  const [forced, setForced] = useState(false);
  useEffect(() => {
    return store.subscribe(() => setForced(!forced));
  });
  const { todos, visibilityFilter } = store.getState();

  return getVisibleTodos(todos, visibilityFilter).map((todo) => (
    <Todo
      key={todo.id}
      completed={todo.completed}
      text={todo.text}
      onClick={() => toggleTodo(store, todo.id)}
    />
  ));
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

const AddTodoButton = ({ store }) => {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
      />
      <button
        onClick={() => {
          addTodo(store, inputValue);
          setInputValue("");
        }}
      >
        add Todo
      </button>
    </div>
  );
};

const LinkButton = ({ active, onClick, children }) => {
  return (
    <button
      style={
        active
          ? {
              backgroundColor: "chartreuse",
            }
          : undefined
      }
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
};

const VisibilityButton = ({ store, filter, children }) => {
  const [forced, setForced] = useState(false);
  useEffect(() => {
    return store.subscribe(() => setForced(!forced));
  });

  const state = store.getState();

  return (
    <LinkButton
      active={state.visibilityFilter === filter}
      onClick={() => changeFilter(store, filter)}
    >
      {children}
    </LinkButton>
  );
};

const Footer = ({ store }) => (
  <div>
    <VisibilityButton store={store} filter="completed">
      Show complete
    </VisibilityButton>
    <VisibilityButton store={store} filter="incompleted">
      Show incompleted
    </VisibilityButton>
    <VisibilityButton store={store} filter={null}>
      Show all
    </VisibilityButton>
  </div>
);

const App = ({ store }) => (
  <div>
    <AddTodoButton store={store} />
    <VisibleTodoList store={store} />
    <Footer store={store} />
  </div>
);

ReactDOM.render(
  <App store={createStore(masterReducer)} />,
  document.getElementById("root")
);
