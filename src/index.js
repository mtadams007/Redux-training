import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { Provider, connect } from "react-redux";

import "./App.css";

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      console.log(action);
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

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (id) =>
      dispatch({
        type: "TOGGLE_TODO",
        id,
      }),
  };
};
const TodoList = (props) =>
  props.todos.map((todo) => (
    <Todo
      key={todo.id}
      completed={todo.completed}
      text={todo.text}
      onClick={() => props.onClick(todo.id)}
    />
  ));

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

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

const mapDispatchToAddTodoButtonProps = (dispatch) => {
  return {
    onClick: (text) => {
      id++;
      return dispatch({
        type: "ADD_TODO",
        text,
        id,
      });
    },
  };
};

const mapAddTodoButtonStateToProps = (state) => {
  return {};
};

const DisconnectedAddTodoButton = (props) => {
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
          id++;
          console.log(inputValue, "onClick");
          return props.dispatch({
            type: "ADD_TODO",
            text: inputValue,
            id,
          });
        }}
      >
        add Todo
      </button>
    </div>
  );
};
const AddTodoButton = connect()(DisconnectedAddTodoButton);
// mapAddTodoButtonStateToProps,
// mapDispatchToAddTodoButtonProps

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
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const mapStateToVisibilityButtonProps = (state, ownProps) => ({
  active: state.visibilityFilter === ownProps.filter,
});
const mapDispatchToVisibilityButtonProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch({
      type: "VISIBILITY_FILTER",
      value: ownProps.filter,
    });
  },
});

const VisibilityButton = connect(
  mapStateToVisibilityButtonProps,
  mapDispatchToVisibilityButtonProps
)(LinkButton);

const Footer = () => (
  <div>
    <VisibilityButton filter="completed">Show complete</VisibilityButton>
    <VisibilityButton filter="incompleted">Show incompleted</VisibilityButton>
    <VisibilityButton filter={null}>Show all</VisibilityButton>
  </div>
);

const App = () => (
  <div>
    <AddTodoButton />
    <VisibleTodoList />
    <Footer />
  </div>
);

// App.contextTypes = { store: PropTypes.object };
// class Provider extends React.Component {
//   getChildContext() {
//     return {
//       store: this.props.store,
//     };
//   }

//   render() {
//     return this.props.children;
//   }
// }

ReactDOM.render(
  <Provider store={createStore(masterReducer)}>
    <App />
  </Provider>,
  document.getElementById("root")
);
