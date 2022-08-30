import axios from "axios";
import React, { useState } from "react";
import Footer from "../components/Footer";
import NavigationBar, { NavBarPage } from "../components/NavigationBar";
import { MIDIFile, startLoad, startPlay } from "../midi.js";

const Home = () => {
    const [inputFile, setInputFile] = useState<File>();
    const [model, setModel] = useState<"riffBuddy" | "magenta">();
    const [results, setResults] = useState<File[]>([]);

    const submitFile = () => {
        const formData = new FormData();
        formData.append("midi", inputFile);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        axios.post("/generate", formData, config).then((response) => {
            // TODO:
            // setResults();
            console.log(response.data);
        });
    };

    const downloadFile = (file: File) => {
        // TODO: download file
        return;
    };

    // #region midi player related
    let audioStopped = true;
    const handleStop = () => (audioStopped = true);
    const handlePlay = (file: File) => {
        if (!audioStopped) {
            audioStopped = true;
            // 1 sec timeout for other midi to stop
            setTimeout(() => {
                audioStopped = false;
                loadAndPlay(file);
            }, 1000);
        } else {
            audioStopped = false;
            loadAndPlay(file);
        }
    };
    const loadAndPlay = (file: File) => {
        const fileReader = new FileReader();
        fileReader.onload = function (progressEvent) {
            const arrayBuffer = progressEvent.target.result;
            const midiFile = new MIDIFile(arrayBuffer);
            startLoad(midiFile.parseSong(), (song: any) => {
                startPlay(song, () => audioStopped);
            });
        };
        fileReader.readAsArrayBuffer(file);
    };
    // #endregion

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
                                    audioStopped = true;
                                    const file = event.target.files[0];
                                    setInputFile(file);
                                }}
                            />
                        </div>
                        {inputFile && (
                            <div className="align-center">
                                <span
                                    className="bi bi-stop-btn btn btn-danger"
                                    style={{
                                        fontSize: 20,
                                    }}
                                    onClick={() => handleStop()}
                                />
                                <span
                                    className="bi bi-play-btn btn btn-success"
                                    style={{
                                        fontSize: 20,
                                    }}
                                    onClick={() => handlePlay(inputFile)}
                                />
                            </div>
                        )}
                        <div className="align-center">
                            <button
                                className="btn btn-primary"
                                onClick={submitFile}
                                disabled={!inputFile || !model}
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
                            {results.map((resultFile) => {
                                return (
                                    <div className="align-center">
                                        <b>{resultFile.name}</b>...
                                        <span
                                            className="bi bi-stop-btn btn btn-danger"
                                            style={{
                                                fontSize: 20,
                                            }}
                                            onClick={handleStop}
                                        />
                                        <span
                                            className="bi bi-play-btn btn btn-success"
                                            style={{
                                                fontSize: 20,
                                            }}
                                            onClick={() =>
                                                handlePlay(resultFile)
                                            }
                                        />
                                        <span
                                            className="bi bi-download btn btn-secondary"
                                            style={{
                                                fontSize: 20,
                                            }}
                                            onClick={() =>
                                                downloadFile(resultFile)
                                            }
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
