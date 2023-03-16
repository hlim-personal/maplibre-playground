import React, { useEffect, useRef, useState } from 'react';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { extentLinear, extentTime } from '@d3fc/d3fc-extent';
import { pointer } from '@d3fc/d3fc-pointer';
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
            const tic = Date.now()
            buildGraph(data);
            const toc = Date.now()
            console.log(`buildGraph took ${toc - tic} ms in d3fc`)
        }
    }, [data])

    const buildGraph = (data: any) => {
        const width = 920;
        const height = 800;
        console.log(data.length)
        const xScale = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-5, 5]).range([height, 0]);
        const xScaleOriginal = xScale.copy();
        const yScaleOriginal = yScale.copy();
        const valueFill = d => webglColor(colorScale(d.y));
        const fillColor = webglFillColor().value(valueFill).data(data);
        const quadtree = d3.quadtree()
            .x((d: any) => d.x)
            .y((d: any) => d.y)
            .addAll(data);

        const selectedDatum: Array<{ x: number, y: number }> = [];
        console.log(selectedDatum)

        const pointer1 = pointer().on('point', ([coord]) => {
            selectedDatum.pop();
            const x = xScale.invert(coord.x);
            const y = yScale.invert(coord.y);
            const radius = Math.abs(x - xScale.invert(coord.x - 20));
            const closestDatum = quadtree.find(x, y, radius);
            if (closestDatum) {
                selectedDatum.push(closestDatum);
                render();
            }
        });

        // const canvasgl = d3.select(canvasRef.current).node();

        // if (canvasgl !== null) {
        //     canvasgl.width = width;
        //     canvasgl.height = height;
        // }
        // const gl = canvasgl?.getContext('webgl');

        const webglSeries = fc
            .seriesWebglPoint()
            .crossValue((d) => d.x)
            .mainValue((d) => d.y)
            .size(1)
            .decorate(program => fillColor(program));

        const series = fc
            .seriesWebglMulti()
            .xScale(xScale)
            .yScale(yScale)
            .series([webglSeries])
        // .context(gl);

        // series(data);


        const onClickSeries = fc
            .seriesSvgPoint()
            .crossValue((d) => d.x)
            .mainValue((d) => d.y)
            .size(10)
            .decorate(selection => {
                selection.enter()
                    .style('fill', 'red')
                    .style('stroke', 'red');
            })

        // const svg = d3.select(brushContainerRef.current)
        //     .attr('width', width)
        //     .attr('height', height)
        //     .on('click', (event: any) => {
        //         const x = xScale.invert(d3.pointer(event)[0]);
        //         const y = yScale.invert(d3.pointer(event)[1]);
        //         const radius = Math.abs(x - xScale.invert(d3.pointer(event)[0] - 20));
        //         const closestDatum = quadtree.find(x, y, radius);
        //         console.log(closestDatum);

        //     })

        const zoom = d3
            .zoom()
            .scaleExtent([0.8, 10])
            .on("zoom", (e) => {
                // update the scales based on current zoom
                xScale.domain(e.transform.rescaleX(xScaleOriginal).domain());
                yScale.domain(e.transform.rescaleY(yScaleOriginal).domain());
                render();
            });


        const chart = chartCartesian(xScale, yScale)
            .webglPlotArea(series.mapping(d => d.data))
            .svgPlotArea(
                fc
                    .seriesSvgMulti()
                    .xScale(xScale)
                    .yScale(yScale)
                    .series([onClickSeries])
                    .mapping(d => d.selectedDatum)
            )
            .decorate(sel => {
                sel.enter()
                    .select("d3fc-svg.plot-area")
                    .call(pointer1)
            })

        const render = () => {
            d3.select(chartRef.current)
                .datum({ data, selectedDatum })
                .call(chart)
                .call(zoom);
        }

        render();

    }

    return (
        <div className={Styles.container} >
            {/* <canvas ref={canvasRef} ></canvas>
            <svg ref={brushContainerRef} ></svg> */}
            <div ref={chartRef} className={Styles.chart}></div>
        </div>
    )
}

export default D3FCScatter


