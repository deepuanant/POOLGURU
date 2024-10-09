import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Make sure App contains valid JSX and has the correct file extension
import { Provider } from "react-redux";
import store from "./Redux/store";
import "./index.css"; // Ensure the path and file exists

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
