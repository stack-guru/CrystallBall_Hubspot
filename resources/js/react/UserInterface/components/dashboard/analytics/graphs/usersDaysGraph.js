import React from 'react';
import { Line } from 'react-chartjs-2';

export default function UsersDaysGraph(props) {

    const dates = props.statistics.map(s => moment(s.statistics_date).format("DD MMM"));
    const months = props.statistics.map(s => moment(s.statistics_date).format("MMM"));
    const noOfUsers = props.statistics.map(s => s.sum_users_count);

    return (
        <>
        <h2>UsersDaysGraph</h2>
   
        <Line
            height={'50px'}
            data={{
                labels: dates,
                datasets: [
                    {
                        label: 'Users',
                        data: noOfUsers,
                        fill: true,
                        backgroundColor: 'rgba(0, 99, 132, 0.2)',
                        borderWidth: '2',
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.1,
                        pointRadius: 2,
                        pointBackgroundColor: 'rgb(255, 99, 132)',
                    }
                ],
            }}
            options={{
                plugins: {
                    legend: {
                        display: false
                    },
                },
                // scales: {
                //     x: {
                //         ticks: {
                //             // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                //             callback: function (val, index) {
                //                 // Hide the label of every 2nd dataset
                //                 return index % 2 === 0 ? this.getLabelForValue(val) : '';
                //             },
                //             maxRotation: 0
                //         }
                //     },
                //     x2: {
                //         id: 'x2',
                //         type: 'linear',
                //         display: true,
                //         position: 'bottom',
                //         ticks: {
                //             callback: function (value, index, values) {
                //                 return months[index];
                //             },

                //         },
                //         grid: {
                //             display: false,
                //         },
                //     }
                // }
            }} />
             </>
    )
};

