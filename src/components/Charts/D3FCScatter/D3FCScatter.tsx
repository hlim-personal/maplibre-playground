import React, { useEffect, useRef, useState } from 'react';
import { brush, brushX } from '@d3fc/d3fc-brush';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear, extentTime } from '@d3fc/d3fc-extent';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';
import * as fc from '@d3fc/d3fc-series';
import { render } from '@testing-library/react';
import * as d3 from 'd3';
import _isNil from 'lodash/isNil';
import Styles from '../D3Graph/D3Graph.module.css';


const D3FCGraphPractice = ({ height, width }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

    useEffect(() => {
        if (data) {
            buildGraph(data);
        }
    }, [data])

    const buildGraph = (data: any) => {
        console.log(data.length)
        const xScale = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-5, 5]).range([height, 0]);

        const canvasgl = d3.select(canvasRef.current).node();

        if (canvasgl !== null) {
            canvasgl.width = width;
            canvasgl.height = height;
        }
        const gl = canvasgl?.getContext('webgl');

        const webglSeries = fc
            .seriesWebglPoint()
            .crossValue((d) => d.x)
            .mainValue((d) => d.y)
            .size(2);
        // .context(gl);

        const series = fc
            .seriesWebglMulti()
            .xScale(xScale)
            .yScale(yScale)
            .series([webglSeries])
            .context(gl);

        series(data);
    }

    return (
        <canvas ref={canvasRef} height={height} width={width}></canvas>
    )
}

export default D3FCGraphPractice


