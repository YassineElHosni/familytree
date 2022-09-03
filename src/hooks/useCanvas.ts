import { useState, useEffect, useRef } from "react"
import Coordinate from "../models/Coordinate"
import Member from "../models/Member"
import { MemberCoordinate } from "../models/MemberCoordinate"

// Path2D for a Heart SVG
const heartSVG = "M0 200 v-200 h200 a100,100 90 0,1 0,200 a100,100 90 0,1 -200,0 z"
const SVG_PATH = new Path2D(heartSVG)

// Scaling Constants for Canvas
const SCALE = 0.1
const OFFSET = 80
export const canvasWidth = window.innerWidth * 0.5
export const canvasHeight = window.innerHeight * 0.5

export function draw(ctx: CanvasRenderingContext2D, coordinate: Coordinate) {
    console.log("attempting to draw")
    ctx.fillStyle = "#242424"
    ctx.shadowColor = "orange"
    ctx.shadowBlur = 20
    ctx.save()
    ctx.scale(SCALE, SCALE)
    ctx.translate(coordinate.x / SCALE, coordinate.y / SCALE + OFFSET)
    ctx.rotate((225 * Math.PI) / 180)
    ctx.fill(SVG_PATH)
    // .restore(): Canvas 2D API restores the most recently saved canvas state
    ctx.restore()
}

export const drawMemeber = (ctx: CanvasRenderingContext2D, memeber: Member, coordinate: Coordinate) => {
    const fullname = `${memeber.firstname} - ${memeber.lastname}`
    const xOffSet = (-fullname.length / 2) * 80
    console.log("attempting to drawMemeber")
    ctx.font = "8em Arial"
    ctx.save()
    ctx.scale(SCALE, SCALE)
    ctx.translate(coordinate.x / SCALE + xOffSet, coordinate.y / SCALE)
    ctx.fillText(fullname, 0, 0)
    ctx.restore()
}

export function useCanvas() {
    const canvasRef = useRef()
    const [coordinates, setCoordinates] = useState<MemberCoordinate[]>()

    useEffect(() => {
        if (canvasRef?.current) {
            const canvasObj: any = canvasRef.current
            const ctx = canvasObj.getContext("2d")
            if (ctx) {
                // clear the canvas area before rendering the coordinates held in state
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)

                // draw all coordinates held in state
                coordinates?.forEach((coordinate) => {
                    drawMemeber(ctx, coordinate.memeber, coordinate.coordinate)
                })
            }
        }
    })

    return [coordinates, setCoordinates, canvasRef, canvasWidth, canvasHeight]
}
