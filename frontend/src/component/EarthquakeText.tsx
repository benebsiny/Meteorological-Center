import React, { FC, useEffect, useRef } from "react";

interface Props {
    "time": string,
    "epicenter": string,
    "deep": string,
    "magnitude": string,
    "vib": string
}

const EarthquakeText: FC<Props> = (props) => {

    const vibRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        if (!vibRef.current) return;

        const v = parseInt(props.vib.slice(0, 1));
        if (v < 3) {
            vibRef.current!.style.backgroundColor = "#31b9d6";
        } else if (v < 5) {
            vibRef.current!.style.backgroundColor = "#F5BB00";
        } else {
            vibRef.current!.style.backgroundColor = "#FB6B21";
        }


    }, [props]);


    return (
        <div className="flex gap-3">
            <div ref={vibRef} className="rounded-full w-10 h-10 flex justify-center items-center my-1">
                {props.vib}
            </div>
            <div className="flex items-center">
                {props.time.slice(5,-3)} | 震央：{props.epicenter} | 規模：{props.magnitude}
            </div>
        </div>
    );
};

export default EarthquakeText;