import React from "react";
import NavigationBar from "../components/NavigationBar";
import { NavBarPage } from "../components/NavigationBar";
import Footer from "../components/Footer";

const About = () => {
    return (
        <div className="about">
            <NavigationBar activePage={NavBarPage.About} />

            <div className="content" style={{ marginBottom: 0 }}>
                <h1 className="display-4">What is Riff Buddy?</h1>
                <p className="lead">
                    Riff Buddy aims to help with music composition. It provides
                    generative ideas for a given piece of music to help you be
                    more creative.
                </p>
                <p className="lead">
                    This Web Application and generative models were designed and
                    built as part of the final project of the CM3070 module.
                    University of London, BSc in Computer Science program.
                </p>
            </div>

            <div className="content">
                <h1 className="display-4">Who designed Riff Buddy?</h1>
                <p className="lead">
                    I am a BSc Computer Science student, a full-time software
                    engineer @AWS, and a father.
                </p>
                <div className="container-fluid">
                    <div className="row py-2">
                        <div className="col-auto">
                            <img
                                className="photo"
                                src={require("../assets/photo.jpg")}
                                alt="Dmitrii Vasilev"
                            />
                        </div>
                        <div className="col">
                            <p>Dmitrii Vasilev</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
