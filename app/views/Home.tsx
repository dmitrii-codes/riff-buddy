import axios from "axios";
import React, { useEffect } from "react";
import Footer from "../components/Footer";
import NavigationBar, { NavBarPage } from "../components/NavigationBar";

const Home = () => {
    useEffect(() => {
        axios.get("/generate").then(console.log);
    });
    return (
        <div className="home">
            <NavigationBar activePage={NavBarPage.Home} />
            <div className="main-body">
                <h1>Test 123a</h1>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
