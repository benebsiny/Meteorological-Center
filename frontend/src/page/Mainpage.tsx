import React, {FC, MouseEventHandler, RefObject, useEffect, useRef, useState} from "react";
import "style/mainpage.scss"
import {ReactComponent as Logo} from 'assets/tw.svg'
import ElectricityGauge from "component/ElectricityGauge";
import WaterGauge from "component/WaterGauge";

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
            <div className="flex flex-row justify-between" style={{minWidth: "1240px"}}>
                <div className="flex flex-col ml-32">
                    {clickedCounty && data &&
                        <>
                            <div className="text-4xl text-center font-bold"
                                 style={{width: "250px"}}>{clickedCounty}</div>

                            <div className="flex">
                                <div className="flex flex-col">
                                    <div className="mt-10 mb-1">電力使用狀況</div>
                                    {/* Electricity */}
                                    <ElectricityGauge
                                        usage={data[clickedCounty].electricity.usage}
                                        maxSupply={data[clickedCounty].electricity.max_supply}
                                        minSupply={data[clickedCounty].electricity.min_supply}
                                    />
                                </div>

                                {/*/!* Earthquake *!/*/}
                                {/*<div className="flex flex-col">*/}
                                {/*    <div className="mt-10 mb-1">最近地震</div>*/}
                                {/*    <div>456</div>*/}
                                {/*</div>*/}
                            </div>

                            {/* Water */}
                            <div className="mt-5 mb-1">水庫蓄水狀況</div>
                            <div
                                className="flex flex-row flex-wrap rounded-lg border-slate-400 border-1 bg-slate-800 pt-5"
                                style={{minHeight: "302px"}}>
                                {
                                    data[clickedCounty].water.length !== 0 && data[clickedCounty].water.map((item: any, index: number) => (
                                        <WaterGauge
                                            key={index}
                                            baseAvailable={item.baseAvailable}
                                            volumn={item.volumn}
                                            waterName={item.water}
                                        />
                                    ))
                                }
                                {
                                    data[clickedCounty].water.length === 0 &&
                                    <div className="flex justify-center" style={{width: "250px"}}>
                                        <div
                                            className="text-2xl text-center font-bold align-middle text-rose-400">無水庫資料
                                        </div>
                                    </div>
                                }
                            </div>

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
