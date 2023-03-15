import React, { useEffect, useRef, useState } from 'react';
import { brush, brushX } from '@d3fc/d3fc-brush';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear, extentTime } from '@d3fc/d3fc-extent';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';
import * as fc from '@d3fc/d3fc-series';
import { webglFillColor } from '@d3fc/d3fc-webgl';
import { render } from '@testing-library/react';
import * as d3 from 'd3';
import _isNil from 'lodash/isNil';
import Styles from '../D3Graph/D3Graph.module.css';


const D3FCScatter = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const brushContainerRef = useRef<SVGSVGElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const prng = d3.randomNormal();
    const data = d3.range(2000000).map(d => ({
        x: prng(),
        y: prng()
    }));
    const colorScale = d3.scaleSequential(d3.interpolateViridis).domain([-5, 5]);
    const webglColor = color => {
        const { r, g, b, opacity }: any = d3.color(color)?.rgb();
        return [r / 255, g / 255, b / 255, opacity];
    };
    const iterateElements = (selector, fn) => [].forEach.call(document.querySelectorAll(selector), fn);



    useEffect(() => {
        if (data) {
            buildGraph(data);
        }
    }, [data])

    const buildGraph = (data: any) => {
        const width = 920;
        const height = 800;
        console.log(data.length)
        const xScale = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-5, 5]).range([height, 0]);
        const valueFill = d => webglColor(colorScale(d.y));
        const fillColor = webglFillColor().value(valueFill).data(data);
        const canvasgl = d3.select(canvasRef.current).node();

        if (canvasgl !== null) {
            canvasgl.width = width;
            canvasgl.height = height;
        }
        const gl = canvasgl?.getContext('webgl');

        const webglSerires = fc
            .seriesWebglPoint()
            .crossValue((d) => d.x)
            .mainValue((d) => d.y)
            .size(1)
            .decorate(program => fillColor(program));

        const series = fc
            .seriesWebglMulti()
            .xScale(xScale)
            .yScale(yScale)
            .series([webglSerires])
            .context(gl);

        series(data);

        const quadtree = d3.quadtree()
            .x((d: any) => d.x)
            .y((d: any) => d.y)
            .addAll(data);

        const svg = d3.select(brushContainerRef.current)
            .attr('width', width)
            .attr('height', height)
            .on('click', (event: any) => {
                const x = xScale.invert(d3.pointer(event)[0]);
                const y = yScale.invert(d3.pointer(event)[1]);
                const radius = Math.abs(x - xScale.invert(d3.pointer(event)[0] - 20));
                const closestDatum = quadtree.find(x, y, radius);
                console.log(closestDatum);

            })




    }

    return (
        <div className={Styles.container} >
            <canvas ref={canvasRef} ></canvas>
            <svg ref={brushContainerRef} ></svg>
            {/* <div ref={chartRef} className={Styles.chart}></div> */}
        </div>
    )
}

export default D3FCScatter


