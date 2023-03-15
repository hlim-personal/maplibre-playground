import React from 'react';
import uPlot, { Plugin } from 'uplot';
import UplotReact from 'uplot-react';
import '../../uplot.css';
// import dummyData2m from '../../data/charts/dummyData2m.json';
// import dummyDataSmall from '../../data/charts/dummyDataSmall.json';

export function test(e): any | null {
    const event = e();
    debugger;
}

export const UPlotChart = () => {

    interface IData {
        id: number,
        dateTime: string,
        value: number
    }
    /*     let data = [
            [1546300800, 1546387200],    // x-values (timestamps)
            [        35,         71],    // y-values (series 1)
            [        90,         15],    // y-values (series 2)
          ]; 
          
    Transform initial Data to uPlot data Array */
    const arryTimestamps: number[] = [];
    const values: number[] = [];
    /* const bigData: IData[] = dummyData2m as [IData];
    bigData.forEach((row) => { */
    // dummyDataSmall.forEach((row) => {
    //     const data = new Date(row.dateTime).getTime() / 1000;
    //     arryTimestamps.push(data);
    //     values.push(row.value);
    // });
    const data = [new Float32Array(arryTimestamps), new Float32Array(values)];


    /*     let opts = {
            title: "My Chart",
            id: "chart1",
            class: "my-chart",
            width: 800,
            height: 600,
            series: [
              {},
              {
                // initial toggled state (optional)
                show: true,          
                spanGaps: false,
          
                // in-legend display
                label: "RAM",
                value: (self, rawValue) => "$" + rawValue.toFixed(2),
          
                // series style
                stroke: "red",
                width: 1,
                fill: "rgba(255, 0, 0, 0.3)",
                dash: [10, 5],
              }
            ],
          };      
          let uplot = new uPlot(opts, data, document.body); */
    let opts = {
        width: 1200,
        height: 600,
        cursor: {
            bind: {
                mouseup: (self, target, handler): any => {
                    const event = handler.call();
                    test(event);
                }
            }
        },
        series: [
            {},
            {
                label: "value",
                stroke: "red",
                size: 5,
                width: 1,
            }
        ]
    }
    return (
        <UplotReact options={opts} data={data} />
    );
}

