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


const D3FCGraphPractice = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const brushContainerRef = useRef<SVGSVGElement>(null);
    const data = randomGeometricBrownianMotion().steps(1e4)(1);

    useEffect(() => {
        if (data) {
            buildGraph(data);
        }
    }, [data])

    const buildGraph = (data: any) => {
        const width = 920;
        const height = 800;
        const xScale = d3.scaleLinear().domain([0, data.length]).range([0, width]);
        const yScale = d3.scaleLinear().domain(extentLinear()(data)).range([height, 0]);

        const canvasgl = d3.select(canvasRef.current).node();

        if (canvasgl !== null) {
            canvasgl.width = width;
            canvasgl.height = height;
        }
        const gl = canvasgl?.getContext('webgl');

        // const brushed = (event) => {
        //     const extent = event.selection;
        //     console.log(extent);
        // }

        // const brush = brushX()
        //     // .extent([[0, 0], [width, height]])
        //     .on('end', brushed);

        const webglSerires = fc
            .seriesWebglArea()
            // .xScale(xScale)
            // .yScale(yScale)
            .crossValue((_, i) => i)
            .mainValue((d) => d)
        // .context(gl);

        const series = fc
            .seriesWebglMulti()
            .xScale(xScale)
            .yScale(yScale)
            .series([webglSerires])
            // .mapping((data, index, series) => {
            //     switch (series[index]) {
            //         case webglSerires:
            //             return data;
            //         case brush:
            //             return null;
            //     }
            // })
            .context(gl);

        series(data);
        // webglSerires(data);
    }

    return (
        <div className={Styles.container} >
            <canvas ref={canvasRef} ></canvas>
            <svg ref={brushContainerRef} ></svg>
        </div>
    )
}

export default D3FCGraphPractice


