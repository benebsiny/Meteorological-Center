import React, {FC, MouseEventHandler, RefObject, useEffect, useRef, useState} from "react";
import "style/mainpage.scss"
import {ReactComponent as Logo} from 'assets/tw.svg'
import Gauge from "component/Gauge";

const Mainpage: FC<any> = () => {

    const [clickedCounty, setClickedCounty] = useState("");
    const [data, setData] = useState<any>([]);

    const mapRef = useRef() as RefObject<SVGSVGElement>;
    // const mapRef = useRef<SVGSVGElement|null>(null);

    // @ts-ignore
    function clicked(event: MouseEvent<HTMLElement, MouseEvent>): MouseEventHandler<SVGSVGElement> {
        const target = event.target;
        const countyName = target.getAttribute("name");
        if (countyName !== null) {
            setClickedCounty(unicodeToString(countyName)); // Unicode string to string
        }
    }

    useEffect(() => {
        if (!clickedCounty || !mapRef.current) {
            return;
        }

        // Color changed
        mapRef.current.querySelectorAll("path").forEach((path: SVGPathElement) => {
            if (unicodeToString(path.getAttribute("name") as string) === clickedCounty) {
                path.classList.add("clicked");
            } else {
                path.classList.remove("clicked");
            }
        });

        // Set local storage
        localStorage.setItem("county", clickedCounty);

        // Set data


    }, [clickedCounty]);



    useEffect(() => {

        const storedCounty = localStorage.getItem("county");

        fetch("/api/", {
            method: "GET"
        })
            .then(resp => {
                if (!resp.ok) throw new Error(resp.statusText);
                return resp.json();
            })
            .then(data => {
                setData(data);
                if (storedCounty) {
                    setClickedCounty(storedCounty);
                    localStorage.setItem("county", storedCounty);
                } else {
                    setClickedCounty("臺北市");
                    localStorage.setItem("county", "臺北市");
                }
            })
            .catch(err => console.log(err));

    }, []);

    return (
        <>
            <div className="flex flex-row">
                <div>
                    {clickedCounty && data &&
                        <>
                            <h1>{clickedCounty}</h1>
                            <Gauge
                                usage={data[clickedCounty].electricity.usage}
                                maxSupply={data[clickedCounty].electricity.max_supply}
                                minSupply={data[clickedCounty].electricity.min_supply}
                            />
                        </>
                    }
                </div>

                <div className="flex-1">
                    <Logo className="tw-map" ref={mapRef} onClick={clicked}/>
                </div>
            </div>
        </>
    )

}

export default Mainpage;

function unicodeToString(str: string) {
    return JSON.parse(`["${str}"]`)[0];
}
