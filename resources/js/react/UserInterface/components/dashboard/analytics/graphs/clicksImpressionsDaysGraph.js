import React from 'react';
import { Chart } from "react-google-charts";

export default function ClicksImpressionsDaysGraph(props) {

    const combinedArray = props.statistics.map(s => {
        const momentDate = moment(s.statistics_date);
        return [
            // new Date(momentDate.format('YYYY'), momentDate.format('MM') - 1, momentDate.format('DD')),
            momentDate.format("DD") + "\n" + momentDate.format("MMM"),
            Number.parseInt(s.sum_clicks_count),
            Number.parseInt(s.sum_impressions_count),
            s.event_name ? s.event_name.split(' ').map(a => a.substr(0, 1)).join('').toUpperCase() : null,
            s.event_name ? s.event_name : null,
        ];
    });

    const dataArray = [
        [
            { type: 'string', label: 'Day' },
            { type: 'number', label: 'Clicks' },
            { type: 'number', label: 'Impressions' },
            { type: 'string', role: 'annotation' },
            { type: 'string', role: 'annotationText' }
        ],
        ...combinedArray,
    ];

    const optionsArray = {
        // chartArea: {
        //     left: 20,
        //     right: 5, // !!! works !!!
        //     bottom: 40,  // !!! works !!!
        //     top: 10,
        //     width: "100%",
        //     // height: "100%"
        // },
        animation: { "startup": true, duration: 500 },
        'chartArea': { 'width': '90%', 'height': '70%', left: 60 },
        pointSize: 5,
        title: '',
        vAxes: {
            0: { logScale: false },
            1: {
                logScale: false,
                minValue: 0,
                title: 'Impressions',
                titleTextStyle: { color: '#dc3912' }
            }
        },
        series: {
            0: { targetAxisIndex: 0 },
            1: { targetAxisIndex: 1 },
            2: { targetAxisIndex: 1 }
        },
        vAxis: {
            minValue: 0,
            title: 'Clicks',
            titleTextStyle: { color: '#3366cc' }
        },
        hAxis: {
            scaleType: 'linear',
            side: 'top',
            format: "d\nMMM",
            textStyle: {
                fontSize: '12',
            },
        },
        annotations: {
            textStyle: {
                fontSize: 8,
                opacity: 0.8
            },
            boxStyle: {
                // Color of the box outline.
                stroke: '#888',
                // Thickness of the box outline.
                strokeWidth: 1,
                // x-radius of the corner curvature.
                rx: 0,
                // y-radius of the corner curvature.
                ry: 0,
                // Attributes for linear gradient fill.
                gradient: {
                    // Start color for gradient.
                    color1: '#fbf6a7',
                    // Finish color for gradient.
                    color2: '#33b679',
                    // Where on the boundary to start and
                    // end the color1/color2 gradient,
                    // relative to the upper left corner
                    // of the boundary.
                    x1: '0%', y1: '0%',
                    x2: '100%', y2: '100%',
                    // If true, the boundary for x1,
                    // y1, x2, and y2 is the box. If
                    // false, it's the entire chart.
                    useObjectBoundingBoxUnits: true
                }
            }
        },
        legend: 'none',
    };

    return (
            <div className="report-box">
                    <div className="d-flex justify-content-between">
                        <div><h4 className="card-heading">Click Impressions</h4>
                        </div>
                    </div>
                <Chart
                    width={'100%'}
                    // style={{ paddingLeft: '10px' }}
                    // height={'50'}
                    chartType="AreaChart"
                    loader={<div>Loading Chart</div>}
                    data={dataArray}
                    options={optionsArray}
                />
            </div>
    )
    
    
    // <div className="row ml-0 mr-0 mt-4">
    //     <h1>ClicksImpressionsDaysGraph????????</h1>
    //     <div className="col-12">
        
    //     </div>
    // </div>
};

