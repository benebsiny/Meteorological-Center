import React, {FC, useEffect, useRef, useState} from "react";

interface Props {
    usage: number;
    maxSupply: number;
    minSupply: number;
}

let cur = 0;
let dir = 1; // 1: clockwise, -1: counter clockwise

const ElectricityGauge: FC<Props> = (props) => {
    let usage = Math.round(props.usage);
    const maxSupply = Math.round(props.maxSupply);
    const minSupply = Math.round(props.minSupply);
    if (usage < minSupply) usage = minSupply;
    if (usage > maxSupply) usage = maxSupply;

    const [oldProps, setOldProps] = useState<Props>({usage: 0, maxSupply: 1000, minSupply: 0});
    const gaugeRef = useRef<HTMLCanvasElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const minRef = useRef<HTMLDivElement>(null);
    const maxRef = useRef<HTMLDivElement>(null);

    const oldPercentage = (oldProps.usage - oldProps.minSupply) / (oldProps.maxSupply - oldProps.minSupply);
    const newPercentage = (props.usage - props.minSupply) / (props.maxSupply - props.minSupply);
    const diff = Math.abs(newPercentage - oldPercentage);

    useEffect(() => {

        if (oldPercentage === newPercentage) return;
        else if (oldPercentage > newPercentage) dir = -1;
        else dir = 1;
        cur = 0;

        pointerAnimation();
        changeText();

        setOldProps(props);
    }, [props]);

    function changeText() {
        if (!statsRef.current || !minRef.current || !maxRef.current || !gaugeRef.current) return;

        statsRef.current.innerText = `${usage}萬瓩`;
        minRef.current.innerText = `${minSupply}`;
        maxRef.current.innerText = `${maxSupply}`;

        if (0 < newPercentage && newPercentage <= 0.5) statsRef.current.style.color = "#34D5F6";
        else if (0.5 < newPercentage && newPercentage <= (10/14)) statsRef.current.style.color = "#FFF47D";
        else statsRef.current.style.color = "#FB6B21";
    }

    function pointerAnimation() {

        const ctx = gaugeRef.current!.getContext("2d")!;
        ctx.clearRect(0, 0, gaugeRef.current!.width, gaugeRef.current!.height);

        drawBackground();

        if (dir === 1) drawPointer((0.8 + 1.4 * (oldPercentage + (diff * (cur / 100)))) * Math.PI);
        else drawPointer((0.8 + 1.4 * (oldPercentage - (diff * (cur / 100)))) * Math.PI);

        if (cur >= 100) return;
        cur += 15; // Steps
        if (cur > 100) cur = 100;

        requestAnimationFrame(pointerAnimation);
    }

    function drawBackground()   {
        if (!gaugeRef.current) return;
        const ctx = gaugeRef.current.getContext("2d");
        if (!ctx) return;

        const centerX = gaugeRef.current.width / 2;
        const centerY = gaugeRef.current.height / 2;

        /*** DRAW ARC ***/
        ctx.lineWidth = 20;
        // ctx.shadowBlur = 20;

        // const gradient = ctx.createLinearGradient(0, 0, 0, 170);
        let gradient = ctx.createConicGradient(0.8 * Math.PI, centerX, centerY);
        gradient.addColorStop(0, "#34D5F6");
                gradient.addColorStop(0.3, "#05BBFE");
        ctx.beginPath();
        ctx.arc(centerX, centerY, 100, 0.8 * Math.PI, 1.5 * Math.PI);
        ctx.strokeStyle = gradient;
        ctx.shadowColor = "#34D5F6";
        ctx.stroke();
        ctx.closePath();

        gradient = ctx.createConicGradient(1.5 * Math.PI, centerX, centerY);
        gradient.addColorStop(0, "#FFF47D");
        gradient.addColorStop(0.2, "#fce649");
        ctx.beginPath();
        ctx.arc(centerX, centerY, 100, 1.5 * Math.PI, 1.8 * Math.PI);
        ctx.strokeStyle = gradient;
        ctx.shadowColor = "#FFF47D";
        ctx.stroke();
        ctx.closePath();

        gradient = ctx.createConicGradient(1.8 * Math.PI, centerX, centerY);
        gradient.addColorStop(0, "#FB6B21");
        gradient.addColorStop(0.2, "#F9491A");
        ctx.beginPath();
        ctx.arc(centerX, centerY, 100, 1.8 * Math.PI, 2.2 * Math.PI);
        ctx.strokeStyle = gradient;
        ctx.shadowColor = "#FB6B21";
        ctx.stroke();
        ctx.closePath();
    }

    function drawPointer(radian: number) {
        if (!gaugeRef.current) return;
        const ctx = gaugeRef.current.getContext("2d");
        if (!ctx) return;

        const centerX = gaugeRef.current.width / 2;
        const centerY = gaugeRef.current.height / 2;

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.shadowColor = "transparent";
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + 100 * Math.cos(radian), centerY + 100 * Math.sin(radian));

        radian %= 2 * Math.PI;
        if (0.7 * Math.PI <= radian && radian <= 1.5 * Math.PI) ctx.strokeStyle = "#34D5F6";
        else if (1.5 * Math.PI < radian && radian <= 1.8 * Math.PI) ctx.strokeStyle = "#FFF47D";
        else ctx.strokeStyle = "#FB6B21";

        ctx.stroke();
        ctx.closePath();
    }

    useEffect(() => {

        drawBackground();
        drawPointer(0.8 * Math.PI);

    }, []);

    return (
        <div className="relative rounded-lg border-slate-400 border-1 bg-slate-800" style={{width: "250px", height: "250px"}}>
            <canvas width={250} height={250} ref={gaugeRef}></canvas>
            <div className="absolute z-50 text-2xl font-bold" style={{top: "60%", left: "50%", transform: "translateX(-50%)"}} ref={statsRef}></div>
            <div className="absolute z-50 text-lg" style={{top: "75%", left: "20%", transform: "translateX(-50%)", color: "#34D5F6"}} ref={minRef}></div>
            <div className="absolute z-50 text-lg" style={{top: "75%", left: "80%", transform: "translateX(-50%)", color: "#F9491A"}} ref={maxRef}></div>
        </div>
    );
}

export default ElectricityGauge;
