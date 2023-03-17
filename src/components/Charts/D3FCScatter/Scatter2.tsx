import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { brush, brushX } from '@d3fc/d3fc-brush';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear, extentTime } from '@d3fc/d3fc-extent';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';
import { render } from '@testing-library/react';
import * as d3 from 'd3';
import * as fc from 'd3fc';
import _isNil from 'lodash/isNil';
import Styles from '../D3Graph/D3Graph.module.css';

export const Scatter2 = ({ height, width, xScale, yScale, data }) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chart, setChart] = useState<any>(null);

    useLayoutEffect(() => {
        if (data && canvasRef.current) {
            buildGraph(data);
        }
    }, [data, canvasRef])

    const buildGraph = (data: any) => {
        const ctx = canvasRef.current?.getContext('webgl');

        const webglSeries = fc
            .seriesWebglPoint()
            .crossValue((d) => d.value)
            .mainValue((d) => d.dateTime)
            .size(2)
            .context(ctx)

        const fcChart = fc
            .chartCartesian(xScale, yScale)
            .webglPlotArea(webglSeries)

        setChart(
            fcChart
        )

        render();
    }

    const render = () => {
        if (chart && data) {
            d3.select('#chart')
                .datum(data)
                .call(chart)
        }

    }

    return (
        <canvas
            id="#chart"
            ref={canvasRef}
            height={height}
            width={width}
        />
    )
}

