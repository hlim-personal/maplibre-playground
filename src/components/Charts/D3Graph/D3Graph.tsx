import React, { useEffect, useRef, useState } from 'react';
import { extentLinear } from '@d3fc/d3fc-extent';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import GeoApi from '../../../data/geo/Api';
import { deckDataState } from '../../../data/geo/Reducer';
import Styles from './D3Graph.module.css';


const D3Graph = () => {

    // const rawData: any = useSelector(deckDataState);
    // const [data, setData] = useState<any>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const extent = extentLinear();
    const data2 = randomGeometricBrownianMotion().steps(1e5)(1);

    const timeSeriesGenerator = (data: []) => {
        const timeSeries = data.map((d, i) => {
            return {
                date: new Date(2019, 0, i),
                value: d
            }
        })
        return timeSeries;
    }

    const timeSeriesData = timeSeriesGenerator(data2);

    // useEffect(() => {
    //     if (!rawData) {
    //         GeoApi.loadDeckData(() => {
    //             console.log('loaded data');
    //         })
    //     } else {
    //         setData(rawData);
    //     }
    // }, [rawData])

    useEffect(() => {
        if (data2) {
            const tic = Date.now()
            buildGraph(data2);
            const toc = Date.now()
            console.log(`buildGraph took ${toc - tic} ms in d3`)
        }
    }, [data2])

    const buildGraph = (data) => {
        const svg = d3.select(svgRef.current);
        const margin = { top: 10, right: 30, bottom: 30, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        svg
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);


        const xScale = d3.scaleLinear().domain([0, data2.length - 1]).range([0, width]);
        const yScale = d3.scaleLinear().domain(extent(data2)).range([height, 0]);

        const line = svg.append('g')

        line.append('path')
            .datum(data)
            .attr('fill', '#cce5df')
            .attr('stroke', '#69b3a2')
            .attr('stroke-width', 1.5)
            .attr('d', d3.area()
                .x((d: any, i) => xScale(i))
                .y0(yScale(0))
                .y1((d: any) => yScale(d))
            )

        // const brushed = (event) => {
        //     const extent = event.selection;
        //     console.log(extent);
        // }

        // const brush = d3.brushX()
        //     .extent([[0, 0], [width, height]])
        //     .on('end', brushed);

        // line.append('g')
        //     .attr('class', 'brush')
        //     .call(brush);

    }

    return (
        <svg ref={svgRef} />
    )
}

export default D3Graph

// const xDomain: Date[] = d3.extent(data, (d: any) => new Date(d.tpep_dropoff_datetime)) as Date[];
        // const yDomain: number[] = [0, d3.max(data, (d: any) => +d.total_amount)] as number[];

        // const x: any = d3.scaleTime()
        //     .domain(xDomain)
        //     .range([0, width]);

// svg.append('g')
        //     .attr('transform', `translate(0, ${height})`)
        //     .call(d3.axisBottom(x));

        // const y: any = d3.scaleLinear()
        //     .domain(yDomain)
        //     .range([height, 0]);
        // svg.append('g')
        //     .call(d3.axisLeft(y));

        // svg.append('path')
        //     .datum(data)
        //     .attr('fill', '#cce5df')
        //     .attr('stroke', '#69b3a2')
        //     .attr('stroke-width', 1.5)
        //     .attr('d', d3.area()
        //         .x((d: any) => x(new Date(d.tpep_dropoff_datetime)))
        //         .y0(y(0))
        //         .y1((d: any) => y(+d.total_amount))
        //     )