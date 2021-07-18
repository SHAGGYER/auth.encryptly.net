import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import "react-nice-dates/build/style.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./index.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
