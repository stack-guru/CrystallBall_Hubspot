import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from "react-google-charts";

export default function UsersDaysWithAnnotationsGraph(props) {

    // const dates = props.statistics.map(s => moment(s.statistics_date).format("DD MMM"));
    // const months = props.statistics.map(s => moment(s.statistics_date).format("MMM"));
    // const noOfUsers = props.statistics.map(s => s.sum_users_count);
    const combinedArray = props.statistics.map(s => {
        const momentDate = moment(s.statistics_date);
        const randomAnnotation = Math.floor(Math.random() * 2);
        return [
            new Date(momentDate.format('YYYY'), momentDate.format('MM') - 1, momentDate.format('DD')),
            Number.parseInt(s.sum_users_count),
            randomAnnotation ? String.fromCharCode(65 + (Math.floor(Math.random() * 20))).concat(String.fromCharCode(65 + (Math.floor(Math.random() * 20)))) : null,
            randomAnnotation ? 'Testing Annotation' : null,
        ];
    });

    const dataArray = [
        [
            { type: 'date', label: 'Day' },
            { type: 'number', label: 'Users' },
            { type: 'string', role: 'annotation' },
            { type: 'string', role: 'annotationText' }
        ],
        ...combinedArray,
    ];

    const optionsArray = {
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

    const optionsArray2 = {
        annotations: {
            textStyle: {
                fontName: 'Times-Roman',
                fontSize: 18,
                bold: true,
                italic: true,
                // The color of the text.
                color: '#871b47',
                // The color of the text outline.
                auraColor: '#d799ae',
                // The transparency of the text.
                opacity: 0.8
            }
        }
    };

    return <Chart
        width={'100%'}
        height={'50'}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={dataArray}
        options={optionsArray}
    />
};

