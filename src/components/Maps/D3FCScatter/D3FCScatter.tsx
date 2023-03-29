import React, { useEffect, useRef } from 'react';
import { chartCartesian } from '@d3fc/d3fc-chart';
import { pointer } from '@d3fc/d3fc-pointer';
import * as fc from '@d3fc/d3fc-series';
import { webglFillColor } from '@d3fc/d3fc-webgl';
import * as d3 from 'd3';
import Styles from '../D3Graph/D3Graph.module.css';


const D3FCScatter = () => {
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

        const zoom = d3
            .zoom()
            .scaleExtent([0.8, 10])
            .on("zoom", (e) => {
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
            <div ref={chartRef} className={Styles.chart}></div>
        </div>
    )
}

export default D3FCScatter


