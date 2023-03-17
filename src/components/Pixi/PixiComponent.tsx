import React, { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import * as PIXI from 'pixi.js';
import D3FCGraph from '../Charts/D3FCGraph/D3FCGraph';
import testData from './data.json';
import { PixiContainer } from './PixiContainer';

export const PixiComponent = (props) => {
    const height = 450;
    const width = 900;
    const xAccessor = (d) => d.dateTime;
    const yAccessor = (d) => d.value;

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!data) {
            const parsedData = testData.map(d => {
                return {
                    ...d,
                    dateTime: new Date(d.dateTime)
                }
            })
            setData(parsedData);
        }
    }, [data])

    const xScale = useMemo(() => {
        return data
            ? d3
                .scaleTime()
                .domain(d3.extent(data, xAccessor))
                .nice()
                .range([0, width])
            : null;

    }, [data]);

    const yScale = useMemo(() => {
        return data
            ? d3
                .scaleLinear()
                .domain(d3.extent(data, yAccessor))
                .nice()
                .range([height, 0])
            : null;

    }, [data]);

    return (
        <div style={{ height: height, width: width }}>
            <D3FCGraph
                height={height}
                width={width}
                data={data}
                xScale={xScale}
                yScale={yScale}
            />
            <PixiContainer
                height={height}
                width={width}
            />
        </div>

    );
}