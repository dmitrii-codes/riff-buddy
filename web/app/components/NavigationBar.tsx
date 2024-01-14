import React from "react";
import { Link } from "react-router-dom";

export interface NavigationBarProps {
    activePage: NavBarPage;
    text?: string;
}

export enum NavBarPage {
    About,
    Home,
    // HowItWorks, TODO: if there is time
}

const NavigationBar = (props: NavigationBarProps) => {
    return (
        <nav
            className="navbar navbar-expand-lg navbar-light"
            style={{ backgroundColor: "#FFFFFF" }}
        >
            <Link
                className={`navbar-logo disable-select ${
                    props.activePage === NavBarPage.Home && "active"
                }`}
                to="/"
            >
                Riff Buddy
            </Link>
            <button
                className="navbar-toggler disable-select"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav mr-auto">
                    <li
                        className={`nav-item ${
                            props.activePage === NavBarPage.Home ? "active" : ""
                        }`}
                    >
                        <Link className="nav-link disable-select" to={"/"}>
                            Generate
                        </Link>
                    </li>
                    <li
                        className={`nav-item ${
                            props.activePage === NavBarPage.About
                                ? "active"
                                : ""
                        }`}
                    >
                        <Link className="nav-link disable-select" to={"/about"}>
                            About
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a
                            href="mailto:dmitrii.io@protonmail.com"
                            className="nav-link disable-select"
                        >
                            Feedback
                        </a>
                        {/* <Link
                                className="nav-link disable-select"
                                to="#"
                            >
                                Feedback
                            </Link> */}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavigationBar;
