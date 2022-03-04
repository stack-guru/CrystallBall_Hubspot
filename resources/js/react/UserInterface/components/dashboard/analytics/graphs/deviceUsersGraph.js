import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function DeviceUsersGraph(props) {

    const dataLabels = props.deviceCategoriesStatistics.map(s => s.device_category.toUpperCase());
    const noOfUsers = props.deviceCategoriesStatistics.map(s => s.sum_users_count);

    return <div className="row ml-0 mr-0 mt-4">
        <div className="col-6">
            <table className="table table-borderless table-hover gaa-hover">
                <thead><tr><th>Device</th><th>Users</th><th>Conv.Rate</th></tr></thead>
                <tbody>
                    {
                        props.deviceCategoriesStatistics.map(dS => {
                            const conversionRate = dS.sum_conversions_count && dS.sum_users_count ? ((dS.sum_conversions_count / dS.sum_users_count) * 100).toFixed(2) : 0;
                            return <tr key={dS.device_category}><td className="text-uppercase">{dS.device_category}</td><td>{dS.sum_users_count}</td><td>{conversionRate}</td></tr>
                        })
                    }
                </tbody>
            </table>
        </div>
        <div className="col-6">
            <Doughnut
                // height='100px'
                width='100%'
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
    </div>;
}
