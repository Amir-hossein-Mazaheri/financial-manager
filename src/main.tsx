import React from "react";
import ReactDOM from "react-dom/client";

// project imports
import App from "./App.tsx";

// assets
import "uno.css";
import "virtual:uno.css";
import "virtual:unocss-devtools";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
