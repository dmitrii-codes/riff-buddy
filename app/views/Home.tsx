import axios from "axios";
import React, { useState } from "react";
import Footer from "../components/Footer";
import NavigationBar, { NavBarPage } from "../components/NavigationBar";
import { MIDIFile, startLoad, startPlay } from "../midi.js";
import { b64toBlob } from "../utils";

const Home = () => {
    const [inputFile, setInputFile] = useState<File>();
    const [model, setModel] = useState<"riffBuddy" | "magenta">("magenta");
    const [results, setResults] = useState<Blob[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPlayLoading, setIsPlayLoading] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    // mutable value for a callback
    const playingState = React.useRef<boolean>();
    playingState.current = isPlaying;

    const submitFile = () => {
        const formData = new FormData();
        formData.append("midi", inputFile);
        formData.set("model", model);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };

        setIsSubmitting(true);
        setResults([]);
        axios
            .post<Array<string>>("/generate", formData, config)
            .then((response) => {
                const data = response.data;
                setResults(
                    data.map((bytes) => {
                        return b64toBlob(bytes, "audio/mid");
                    })
                );
            })
            .catch((error) => alert(String(error)))
            .finally(() => setIsSubmitting(false));
    };

    const downloadFile = (blob: Blob) => {
        (window.location as any) = URL.createObjectURL(blob);
    };

    // #region midi player related
    const handleStop = () => setIsPlaying(false);
    const handlePlay = (file: Blob, index = 0) => {
        const isStopped = () => !playingState.current;
        const loadAndPlay = (file: Blob) => {
            const fileReader = new FileReader();
            fileReader.onload = function (progressEvent) {
                const arrayBuffer = progressEvent.target.result;
                const midiFile = new MIDIFile(arrayBuffer);
                startLoad(midiFile.parseSong(), (song: any) => {
                    setIsPlayLoading(-1);
                    setIsPlaying(true);
                    startPlay(song, isStopped);
                });
            };
            fileReader.readAsArrayBuffer(file);
        };

        setIsPlayLoading(index);
        if (playingState.current) {
            setIsPlaying(false);
            // wait for a playing midi to stop
            setTimeout(() => {
                loadAndPlay(file);
            }, 1000);
        } else {
            loadAndPlay(file);
        }
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
                                    onClick={() => setModel("magenta")}
                                >
                                    Magenta RNN
                                </button>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => setModel("riffBuddy")}
                                >
                                    RiffBuddy RNN
                                </button>
                            </div>
                        </div>
                        <div className="align-center">
                            <input
                                className="btn btn-dark"
                                type="file"
                                onChange={(event) => {
                                    setIsPlaying(false);
                                    const file = event.target.files[0];
                                    setInputFile(file);
                                }}
                            />
                        </div>
                        {inputFile && (
                            <div className="align-center">
                                <button
                                    className="bi bi-stop-btn btn btn-danger"
                                    style={{
                                        fontSize: 20,
                                    }}
                                    onClick={() => handleStop()}
                                />
                                <button
                                    className={`bi bi-play-btn${
                                        isPlayLoading === 0 ? "-fill" : ""
                                    } btn btn-success`}
                                    style={{
                                        fontSize: 20,
                                    }}
                                    onClick={() => handlePlay(inputFile)}
                                    disabled={isPlayLoading === 0}
                                />
                            </div>
                        )}
                        <div className="align-center">
                            <button
                                className="btn btn-primary"
                                onClick={submitFile}
                                disabled={!inputFile || !model || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="spinner-grow" role="status">
                                        <span className="sr-only">
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    "Generate"
                                )}
                            </button>
                        </div>

                        {isSubmitting && (
                            <div className="align-center">
                                <span>
                                    Generating melodies. Might take a few
                                    seconds.
                                </span>
                            </div>
                        )}
                    </div>
                    {results.length > 0 && (
                        <div
                            className="col-4"
                            style={{ maxWidth: "100%", marginBottom: "50px" }}
                        >
                            {results.map((resultBlob, index) => {
                                return (
                                    <div className="align-center">
                                        <b
                                            style={{ marginRight: "10px" }}
                                        >{`Generated_Riff_${index + 1}.mid`}</b>
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
                                                handlePlay(
                                                    resultBlob,
                                                    index + 1
                                                )
                                            }
                                        />
                                        <span
                                            className="bi bi-download btn btn-secondary"
                                            style={{
                                                fontSize: 20,
                                            }}
                                            onClick={() =>
                                                downloadFile(resultBlob)
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
