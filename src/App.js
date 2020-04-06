import React from "react";
import { createStore } from "redux";
import logo from "./logo.svg";
import "./App.css";

const counter = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

// HOMEMADE createStore
// const createStore = (reducer) => {
//   let state = 0;
//   let listeners = [];
//   const getState = () => state;
//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach((listener) => listener());
//   };
//   const subscribe = (listener) => {
//     listeners.push(listener);

//     return () => {
//       listeners.filter((l) => l !== listener);
//     };
//   };

//   return { getState, dispatch, subscribe };
// };

const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const store = createStore(counter);

const onIncrement = () => {
  store.dispatch({ type: "INCREMENT" });
};

const onDecrement = () => {
  store.dispatch({ type: "DECREMENT" });
};

function App() {
  const [x, setX] = React.useState(false);
  store.subscribe(() => {
    setX(!x);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{store.getState()}</p>
        <button
          onClick={() => {
            onIncrement();
          }}
        >
          Plus 1
        </button>
        <button
          onClick={() => {
            onDecrement();
          }}
        >
          Minus 1
        </button>
      </header>
    </div>
  );
}

const render = () =>
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );

export default App;
