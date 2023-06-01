import React, {FC, useEffect, useRef, useState} from "react";

interface Props {
    baseAvailable: number;
    volumn: number;
    waterName: string
}

const RED1 = "#f87632";
const RED2 = "#F9491A";
const YELLOW1 = "#f8ed93";
const YELLOW2 = "#fce649";
const BLUE1 = "#2BDDCB";
const BLUE2 = "#1FA4E9";


const WaterGauge: FC<Props> = (props) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const percentRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const animation = useRef(-1);


    useEffect(() => {
        if (!canvasRef.current) return;

        if (animation.current !== -1) cancelAnimationFrame(animation.current);
        animation.current = -1;

        updateWave(); // Wave animation
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !percentRef.current || !nameRef.current) return;
        const ctx = canvasRef.current.getContext("2d")!;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (animation.current !== -1) cancelAnimationFrame(animation.current);
        animation.current = -1;

        const percentage = props.volumn / props.baseAvailable;
        percentRef.current.innerText = `${Number.parseFloat(String(percentage * 100)).toFixed(1)}%`;
        if (percentage >= 0.5) {
            percentRef.current.style.color = BLUE1;
            nameRef.current.style.color = BLUE2;
        }
        else if (percentage >= 0.3) {
            percentRef.current.style.color = YELLOW1;
            nameRef.current.style.color = YELLOW2;
        }
        else {
            percentRef.current.style.color = RED1;
            nameRef.current.style.color = RED2;
        }

        updateWave(); // Wave animation
    }, [props]);


    // Define wave properties
    const wave = {
        amplitude: 10, // 波浪振幅
        frequency: 0.02, // 波浪頻率
        phase: 0, // 波浪相位
        speed: 0.05, // 波浪速度
    };

    // 定義更新波浪的函數
    function updateWave() {

        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")!;

        const percentage = props.volumn / props.baseAvailable;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(canvas, ctx, percentage); // Draw circle
        ctx.save();

        // Clip circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 93, 0, 2 * Math.PI);
        ctx.clip();

        drawWave(canvas, ctx, percentage); // Draw wave
        ctx.restore();

        animation.current = requestAnimationFrame(updateWave);
    }

    function drawBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, percentage: number = 0.5) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
        ctx.lineWidth = 5;

        const gradient = ctx.createLinearGradient(0, 0, 250, 250);
        if (percentage >= 0.5) {
            gradient.addColorStop(0, BLUE1);
            gradient.addColorStop(1, BLUE2);
        } else if (percentage >= 0.3) {
            gradient.addColorStop(0, YELLOW1);
            gradient.addColorStop(1, YELLOW2);
        } else {
            gradient.addColorStop(0, RED1);
            gradient.addColorStop(1, RED2);
        }
        ctx.strokeStyle = gradient;
        ctx.stroke();
        ctx.closePath();
    }

    function drawWave(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, percentage: number = 0.5) {

        const height = 200 * (1 - percentage) + 25;

        wave.phase += wave.speed;

        // 繪製波浪
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x < canvas.width; x++) {
            const y = wave.amplitude * Math.sin(wave.frequency * x + wave.phase) + height;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 250, 250);
        if (percentage >= 0.5) {
            gradient.addColorStop(0, BLUE1);
            gradient.addColorStop(1, BLUE2);
        } else if (percentage >= 0.3) {
            gradient.addColorStop(0, YELLOW1);
            gradient.addColorStop(1, YELLOW2);
        } else {
            gradient.addColorStop(0, RED1);
            gradient.addColorStop(1, RED2);
        }
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    return (
        <div>
            <div ref={nameRef} className="text-center text-2xl font-bold">{props.waterName}</div>
            <div className="relative">
                <canvas width={250} height={250} ref={canvasRef}/>
                <div
                    ref={percentRef}
                    className="absolute font-bold text-5xl left-1/2 top-1/2 mix-blend-color-dodge"
                    style={{transform: "translate(-50%,-50%)"}}></div>
            </div>
        </div>

    );
};


export default WaterGauge;
