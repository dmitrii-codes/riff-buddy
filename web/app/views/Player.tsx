import React, { useState, useEffect } from "react";

const Player = (props: { url: string }) => {
    const [audio] = useState(new Audio(props.url));
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing]);

    useEffect(() => {
        audio.addEventListener("ended", () => setPlaying(false));
        return () => {
            audio.removeEventListener("ended", () => setPlaying(false));
        };
    }, []);

    const toggle = () => setPlaying(!playing);

    return (
        <div>
            <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
};

export default Player;
