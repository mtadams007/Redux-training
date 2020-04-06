import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
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

const Todo = ({ todos }) => (
  <div>
    {todos.map((todo) => (
      <p
        onClick={() => toggleTodo(todo.id)}
      >{`${todo.text} Completed:${todo.completed}`}</p>
    ))}

    <button onClick={() => addTodo("Get Milk")}>add Todo</button>
  </div>
);

const store = createStore(multipleTodoReducer);

const render = () =>
  ReactDOM.render(
    <Todo todos={store.getState()} />,
    document.getElementById("root")
  );

store.subscribe(render);
render();
