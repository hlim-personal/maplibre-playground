import React, { useEffect, useMemo, useRef, useState } from 'react';
import { brush } from '@d3fc/d3fc-brush';
import { extentLinear, extentTime } from '@d3fc/d3fc-extent';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';
import * as fc from '@d3fc/d3fc-series';
import { webglFillColor, webglStrokeColor } from '@d3fc/d3fc-webgl';
import { render } from '@testing-library/react';
import * as d3 from 'd3';
import _isNil from 'lodash/isNil';
import { useSelector } from 'react-redux';
import data2m from '../../../data/dummyData2m.json';
import GeoApi from '../../../data/geo/Api';
import { deckDataState } from '../../../data/geo/Reducer';
import Styles from '../D3Graph/D3Graph.module.css';

const D3FCGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushContainerRef = useRef<SVGSVGElement>(null);
  const extentL = extentLinear().accessors([d => d.value]);
  const extentT = extentTime().accessors([d => d.time]);
  const data2 = randomGeometricBrownianMotion().steps(1e3)(1);

  const timeSeriesGenerator = (array) => {
    const tic = Date.now()
    console.log(array.length)
    const timeArray = new Array(array.length);
    timeArray[0] = new Date()

    for (let i = 1; i < array.length; i++) {

      const timeDiff = i * 1000;

      const time = new Date(Date.parse(timeArray[0]) + timeDiff);

      timeArray[i] = time
    }
    const toc = Date.now()
    console.log(`timeSeriesGenerator took ${toc - tic} ms in d3fc`)
    return array.map((value, index) => ({
      time: timeArray[index],
      value,
    }));
  }

  const timeSeriesData = useMemo(() => {
    return timeSeriesGenerator(data2);
  }, [data2])

  useEffect(() => {
    if (timeSeriesData) {
      const tic = Date.now()
      buildGraph(timeSeriesData);
      const toc = Date.now()
      console.log(`buildGraph took ${toc - tic} ms in d3fc`)
    }
  }, [timeSeriesData])

  const buildGraph = (data: Array<{ time: Date, value: number }>) => {
    const width = 920;
    const height = 800;
    const xScale = d3.scaleTime().domain(extentT(data)).range([0, width]);
    const yScale = d3.scaleLinear().domain(extentL(data)).range([height, 0]);

    const canvasgl = d3.select(canvasRef.current).node();

    if (canvasgl !== null) {
      canvasgl.width = width;
      canvasgl.height = height;
    }
    const gl = canvasgl?.getContext('webgl');

    const brushed = (event) => {
      const extent = event.selection;
      if (extent) {
        const x0 = xScale.invert(extent[0]);
        const x1 = xScale.invert(extent[1]);
        console.log(x0, x1)
        const filteredData = data.filter(d => d.time >= x0 && d.time <= x1);

        // series(filteredData);
      }
    }

    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('end', brushed);

    const svg = d3.select(brushContainerRef.current)
      .attr('width', width)
      .attr('height', height)
      .on('click', (event: any) => {
        const x = xScale.invert(d3.pointer(event)[0]);
        const y = yScale.invert(d3.pointer(event)[1]);
        console.log(x, y)
      })

    svg.append('g')
      .attr('class', 'brush')
      .call(brush);

    const webglSerires = fc
      .seriesWebglArea()
      .crossValue((d) => d.time)
      .mainValue((d) => d.value);


    const line = fc
      .seriesWebglLine()
      .crossValue((d) => d.time)
      .mainValue((d) => d.value)
      .decorate((program) => {
        // webglStrokeColor(d => (x0 < d.time && d.time < x1 ? [0.8, 0.4, 0.3, 1] : [0.2, 0.2, 0.2, 1]))(program);
        webglStrokeColor([0.8, 0.4, 0.3, 1])(program);
      });

    const series = fc
      .seriesWebglMulti()
      .xScale(xScale)
      .yScale(yScale)
      .series([webglSerires, line])
      .context(gl);

    series(data);
  }

  return (
    <div className={Styles.container} >
      <canvas ref={canvasRef} ></canvas>
      <svg ref={brushContainerRef} ></svg>
    </div>
  )
}

export default D3FCGraph

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