import React, { useEffect, useRef, useState } from 'react';
import { brush, brushX } from '@d3fc/d3fc-brush';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear, extentTime } from '@d3fc/d3fc-extent';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';
import * as fc from '@d3fc/d3fc-series';
import { webglFillColor } from '@d3fc/d3fc-webgl';
import { zoom } from '@d3fc/d3fc-zoom';
import { render } from '@testing-library/react';
import * as d3 from 'd3';
import _isNil from 'lodash/isNil';
import Styles from '../D3Graph/D3Graph.module.css';


const D3FCGraphExp = () => {
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
        const barColor = (datum) => {
            return datum < 1.01 ? [1, 0, 0, 1] : [0, 0, .5, 1];
        }

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
        //     .on('end', brushed);

        const webglSerires = fc
            .seriesWebglArea()
            .crossValue((_, i) => i)
            .mainValue((d) => d);

        const bar = fc
            .seriesWebglBar()
            .crossValue((_, i) => i)
            .mainValue((d) => d)
            .bandwidth(1)
            //color bars red if index is greater than 500
            .decorate((program, data, index) => {
                webglFillColor()
                    .value(() => {
                        return barColor(data);
                    })
                    .data(data)(program)
            });



        const series = fc
            .seriesWebglMulti()
            .xScale(xScale)
            .yScale(yScale)
            .series([webglSerires, bar])
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

export default D3FCGraphExp

// const filterData = (data, x0, x1) => {
    //   let startIndex = 0;
    //   let endIndex = data.length - 1;
    //   while (startIndex < endIndex) {
    //     const midIndex = Math.floor((startIndex + endIndex) / 2);
    //     if (data[midIndex].time < x0) {
    //       startIndex = midIndex + 1;
    //     } else {
    //       endIndex = midIndex;
    //     }
    //   }
    //   const filteredStartIndex = startIndex;

    //   startIndex = filteredStartIndex;
    //   endIndex = data.length - 1;
    //   while (startIndex <= endIndex) {
    //     const midIndex = Math.floor((startIndex + endIndex) / 2);
    //     if (data[midIndex].time > x1) {
    //       startIndex = midIndex - 1;
    //     } else {
    //       endIndex = midIndex + 1;
    //     }
    //   }
    //   const filteredEndIndex = endIndex;

    //   return data.slice(filteredStartIndex, filteredEndIndex + 1);
    // }