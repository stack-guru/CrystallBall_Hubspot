import React from 'react';
import { Line } from 'react-chartjs-2';

export default function UsersDaysGraph(props) {

    const dates = props.statistics.map(s => s.statistics_date);
    const noOfUsers = props.statistics.map(s => s.sum_users_count);

    return <Line
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
                    pointBackgroundColor: 'rgb(255, 99, 132)'
                },
            ],
        }}
        options={{
            plugins: {
                legend: {
                    display: false
                },
            },
        }} />
};

