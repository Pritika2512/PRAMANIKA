import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { applyTheme } from "./config/themeConfig.js";
import "./index.css";
applyTheme();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
