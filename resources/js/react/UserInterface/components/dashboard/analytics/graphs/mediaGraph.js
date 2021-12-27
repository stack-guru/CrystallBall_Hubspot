import React from 'react';
import { Bar } from 'react-chartjs-2';


export default function MediaGraph(props) {

    const dataLabels = props.statistics.map(s => s.medium_name);
    const noOfUsers = props.statistics.map(s => s.sum_users_count);

    return <div className="row ml-0 mr-0 mt-4">
        <div className="col-12">
            <Bar
                height={'100px'}
                width={'100%'}
                data={{
                    labels: dataLabels,
                    datasets: [
                        {
                            label: '# of users',
                            data: noOfUsers,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                }} options={{
                    indexAxis: 'y',
                    // Elements options apply to all of the options unless overridden in a dataset
                    // In this case, we are setting the border of each horizontal bar to be 2px wide
                    elements: {
                        bar: {
                            borderWidth: 2,
                        },
                    },
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Media',
                        },
                    },
                }} />
        </div>
    </div>;
}