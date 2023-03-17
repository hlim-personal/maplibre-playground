import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { brush } from '@d3fc/d3fc-brush';
import { extentLinear, extentTime } from '@d3fc/d3fc-extent';
import { randomGeometricBrownianMotion } from '@d3fc/d3fc-random-data';
import * as fc from '@d3fc/d3fc-series';
import { webglFillColor, webglStrokeColor } from '@d3fc/d3fc-webgl';
import { render } from '@testing-library/react';
import * as d3 from 'd3';
import _isNil from 'lodash/isNil';
import { useSelector } from 'react-redux';
import GeoApi from '../../../data/geo/Api';
import { deckDataState } from '../../../data/geo/Reducer';
import Styles from '../D3Graph/D3Graph.module.css';
// import data2m from '../../../data/dummyData2m.json';

const D3FCGraph = ({
    height,
    width,
    xScale,
    yScale,
    data
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const brushContainerRef = useRef<SVGSVGElement>(null);
    const extentL = extentLinear().accessors([d => d.value]);
    const extentT = extentTime().accessors([d => d.time]);

    useLayoutEffect(() => {
        if (data && canvasRef.current) {

            const ctx = canvasRef.current?.getContext('webgl');

            const pointSeries = fc
                .seriesWebglPoint()
                .crossValue((d) => d.dateTime)
                .mainValue((d) => d.value);


            const series = fc
                .seriesWebglMulti()
                .xScale(xScale)
                .yScale(yScale)
                .series([pointSeries])
                .context(ctx);

            series(data);
        }
    }, [data, canvasRef])

    return (
        <canvas height={height} width={width} ref={canvasRef} style={{ position: 'absolute' }} />
    )
}

export default D3FCGraph
