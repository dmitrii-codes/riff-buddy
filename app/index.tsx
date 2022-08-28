import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/home";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="invoices" element={<Invoices />} /> */}
        </Routes>
    </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById("root"));
