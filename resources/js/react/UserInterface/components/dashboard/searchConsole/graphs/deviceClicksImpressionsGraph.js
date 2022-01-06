import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function DeviceClicksImpressionsGraph(props) {

    const dataLabels = props.devicesStatistics.map(s => s.device);
    const noOfClicks = props.devicesStatistics.map(s => s.sum_clicks_count);
    const noOfImpressions = props.devicesStatistics.map(s => s.sum_impressions_count);

    return <div className="row ml-0 mr-0 mt-4">
        <div className="col-12">
            <Doughnut
                // height='100px'
                width='100%'
                data={{
                    labels: dataLabels,
                    datasets: [
                        {
                            label: '# of clicks',
                            data: noOfClicks,
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
                        {
                            label: '# of impressions',
                            data: noOfImpressions,
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
                        }
                    ],
                }} options={{
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    // aspectRatio: 3,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                boxWidth: 5,
                                boxHeight: 5
                            }
                        },
                        title: {
                            display: true,
                            align: 'start',
                            text: 'Devices',
                        },
                    },
                }} />
        </div>
        {/* <div className="col-6">
            <table className="table table-bordered table-hover gaa-hover">
                <thead><tr><th>Device</th><th>Clicks</th><th>Impressions</th></tr></thead>
                <tbody>
                    {
                        props.devicesStatistics.map(dS => {
                            return <tr>
                                <td>{dS.device}</td>
                                <td>{dS.sum_clicks_count}</td>
                                <td>{dS.sum_impressions_count}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div> */}
    </div>;
}
