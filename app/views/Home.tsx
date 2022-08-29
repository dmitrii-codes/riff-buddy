import axios from "axios";
import React, { useState } from "react";
import Footer from "../components/Footer";
import NavigationBar, { NavBarPage } from "../components/NavigationBar";

const Home = () => {
    const [file, setFile] = useState<File>();
    const [model, setModel] = useState<"riffBuddy" | "magenta">();
    const [results, setResults] = useState<File[]>([]);

    const submitFile = () => {
        const formData = new FormData();
        formData.append("midi", file);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        axios.post("/generate", formData, config).then((response) => {
            console.log(response.data);
        });
    };

    return (
        <>
            <NavigationBar activePage={NavBarPage.Home} />
            <div className="home">
                <div className="row" style={{ margin: "0" }}>
                    <div className="col-2"></div>
                    <div
                        className={`col-${results.length > 0 ? "4" : "8"}`}
                        style={{ maxWidth: "100%" }}
                    >
                        <div className="dropdown align-center">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {model === "riffBuddy"
                                    ? "RiffBuddy RNN"
                                    : model === "magenta"
                                    ? "Magenta RNN"
                                    : "Choose model"}
                            </button>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                            >
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => setModel("riffBuddy")}
                                >
                                    RiffBuddy RNN
                                </button>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => setModel("magenta")}
                                >
                                    Magenta RNN
                                </button>
                            </div>
                        </div>
                        <div className="align-center">
                            <input
                                className="btn btn-dark"
                                type="file"
                                onChange={(event) => {
                                    const file = event.target.files[0];
                                    setFile(file);
                                    file &&
                                        setResults([
                                            file,
                                            file,
                                            file,
                                            file,
                                            file,
                                        ]);
                                    console.log(file);
                                }}
                            />
                        </div>

                        <div className="align-center">
                            <button
                                className="btn btn-primary"
                                onClick={submitFile}
                                disabled={!file || !model}
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                    {results.length > 0 && (
                        <div
                            className="col-4"
                            style={{ maxWidth: "100%", marginBottom: "50px" }}
                        >
                            {results.map((result) => {
                                return (
                                    <div className="align-center">
                                        <b>{result.name}</b>...
                                        <span
                                            className="bi bi-pause-btn btn btn-danger"
                                            style={{
                                                fontSize: 20,
                                            }}
                                            onClick={() => console.log("pause")}
                                        />
                                        <span
                                            className="bi bi-play-btn btn btn-success"
                                            style={{
                                                fontSize: 20,
                                            }}
                                            onClick={() => console.log("play")}
                                        />
                                        <span
                                            className="bi bi-download btn btn-secondary"
                                            style={{
                                                fontSize: 20,
                                            }}
                                            onClick={() => console.log("play")}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="col-2"></div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
