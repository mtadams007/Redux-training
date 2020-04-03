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

const store = createStore(counter);

const handleClick = () => {
  store.dispatch({ type: "INCREMENT" });
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
          className="App-link"
          onClick={() => {
            handleClick();
          }}
        >
          Plus 1
        </button>
      </header>
    </div>
  );
}

export default App;
