import React from 'react';
import { Doughnut } from 'react-chartjs-2';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     Pie,
//     PieChart,
//     Cell,
//     BarChart,
//     Bar,
//     AreaChart,
//     Area,
// } from "recharts";

export default function DeviceClicksImpressionsGraph(props) {

    const dataLabels = props.devicesStatistics.map(s => s.device.toUpperCase());
    const noOfClicks = props.devicesStatistics.map(s => s.sum_clicks_count);
    const noOfImpressions = props.devicesStatistics.map(s => s.sum_impressions_count);
    const COLORS =  ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <> 

            <div className=" report-box">
                <div className="d-flex justify-content-between mb-5">
                    <div>
                        <h4 className="card-heading">
                            Devivce By Impression
                        </h4>
                    </div>
                    {/* <div>
                        <span>
                            <img
                                src="/images/svg/dashboard-list-option.svg"
                                alt="list icon"
                            />
                        </span>
                    </div> */}
                </div>
                <div>
                    <table className="table border dashboard-analytics">
                        <thead>
                            <tr>
                                <th>Device</th>
                                <th>Clicks</th>
                                <th>Impressions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                props.devicesStatistics.map(dS => {
                                    return <tr key={dS.device}>
                                        <td className="text-uppercase">{dS.device}</td>
                                        <td>{dS.sum_clicks_count}</td>
                                        <td>{dS.sum_impressions_count}</td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="">

                            {/* <Doughnut
                                    width='183%'
                                    data={{
                                        labels: dataLabels,
                                        datasets: [
                                            {
                                                label: '# of users',
                                                // data: noOfUsers,
                                                data: [80, 50,19,5],
                                                backgroundColor: [
                                                    '#0BD25F',
                                                    '#FFC514',
                                                    '#FE4C3C',
                                                    '#E0E0E0',
                                                    // 'rgba(255, 206, 86, 0.2)',
                                                    // 'rgba(75, 192, 192, 0.2)',
                                                    // 'rgba(153, 102, 255, 0.2)',
                                                    // 'rgba(255, 159, 64, 0.2)',
                                                ],
                                                borderColor: [
                                                    '#0BD25F',
                                                    '#FFC514',
                                                    '#FE4C3C',
                                                    '#E0E0E0',
                                                    // 'rgba(255, 206, 86, 1)',
                                                    // 'rgba(75, 192, 192, 1)',
                                                    // 'rgba(153, 102, 255, 1)',
                                                    // 'rgba(255, 159, 64, 1)',
                                                ],
                                                // borderWidth: 1,
                                            },
                                        ],
                                    }} options={{
                                        indexAxis: 'y',
                                        responsive: true,
                                        maintainAspectRatio: true,
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
                                                align: 'center',
                                                // text: 'Devices',
                                            },
                                        },
                                }} />   */}

                            <Doughnut
                                // height='100px'
                                width='183%'
                                data={{
                                    labels: dataLabels,
                                    datasets: [
                                        {
                                            label: '# of clicks',
                                            data: noOfClicks,
                                            // data:[60,30,15,5],
                                            backgroundColor: [
                                                '#0BD25F',
                                                '#FFC514',
                                                '#FE4C3C',
                                                '#E0E0E0',
                                                // 'rgba(153, 102, 255, 0.2)',
                                                // 'rgba(255, 159, 64, 0.2)',
                                            ],
                                            borderColor: [
                                                '#0BD25F',
                                                '#FFC514',
                                                '#FE4C3C',
                                                '#E0E0E0',
                                                // 'rgba(153, 102, 255, 1)',
                                                // 'rgba(255, 159, 64, 1)',
                                            ],
                                            // borderWidth: 1,
                                        },
                                        {
                                            label: '# of impressions',
                                            data: noOfImpressions,
                                            // data:[60,30,15,5],
                                            backgroundColor: [
                                                '#0BD25F',
                                                '#FFC514',
                                                '#FE4C3C',
                                                '#E0E0E0',
                                                // 'rgba(153, 102, 255, 0.2)',
                                                // 'rgba(255, 159, 64, 0.2)',
                                            ],
                                            borderColor: [
                                                '#0BD25F',
                                                '#FFC514',
                                                '#FE4C3C',
                                                '#E0E0E0',
                                                // 'rgba(153, 102, 255, 1)',
                                                // 'rgba(255, 159, 64, 1)',
                                            ],
                                            // borderWidth: 1,
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
                                            // text: 'Devices',
                                        },
                                    },
                                }} />


                        
                        
                    </div>
                    <div className="d-flex flex-column">
                            <span className="d-flex">
                                <span className="">
                                    <img
                                        src="/images/svg/green-dot.svg"
                                        alt="green-dot icon"
                                    />
                                </span>
                                <h5>Devices</h5>
                            </span>
                            <span className="d-flex">
                                <span>
                                    <img
                                        src="/images/svg/yellow-dot.svg"
                                        alt="yellow-dot icon"
                                    />
                                </span>

                                <h5>Clicks</h5>
                            </span>
                            <span className="d-flex">
                                <span>
                                    <img
                                        src="/images/svg/red-dot.svg"
                                        alt="red-dot icon"
                                    />
                                </span>
                                <h5>Impressions</h5>
                            </span>
                            
                    </div>
                </div>
            </div>



            {/* <div className="row ml-0 mr-0 mt-4">
                <div className="col-6">
                    <table className="table table-borderless table-hover gaa-hover">
                        <thead><tr><th className="text-left">Device</th><th>Clicks</th><th>Impressions</th></tr></thead>
                        <tbody>
                            {
                                props.devicesStatistics.map(dS => {
                                    return <tr key={dS.device}>
                                        <td className="text-uppercase">{dS.device}</td>
                                        <td>{dS.sum_clicks_count}</td>
                                        <td>{dS.sum_impressions_count}</td>
                                    </tr>
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
            </div>; */}
        </>
    )
}


{/* <div className=" report-box">
                            <div className="d-flex justify-content-between mb-5">
                                <div>
                                    <h4 className="card-heading">
                                        Devivce By Impression
                                    </h4>
                                </div>
                                <div>
                                    <span>
                                        <img
                                            src="/images/svg/dashboard-list-option.svg"
                                            alt="list icon"
                                        />
                                    </span>
                                </div>
                            </div>
                            <div>
                                <table className="table border">
                                    <thead>
                                        <tr>
                                            <td>Source</td>
                                            <td>Click</td>
                                            <td>Impr.</td>
                                            <td>unknown</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.data.map((itm, index) => (
                                            <tr key={index}>
                                                <td>{itm.name}</td>
                                                <td>{itm.pv}</td>
                                                <td>{itm.uv}</td>
                                                <td>{itm.uv}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="d-flex flex-row">
                                    <PieChart width={150} height={150}>
                                        <Pie
                                            data={this.state.data02}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={40}
                                            fill="#82ca9d"
                                            label
                                        >
                                            {this.state.data02.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            this.state.COLORS[
                                                                index %
                                                                    this.state
                                                                        .COLORS
                                                                        .length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                    </PieChart>
                                    <div className="d-flex flex-column pl-3 justify-content-center">
                                        <span className="d-flex">
                                            <span className="">
                                                <img
                                                    src="/images/svg/green-dot.svg"
                                                    alt="green-dot icon"
                                                />
                                            </span>
                                            <h5>Desktop</h5>
                                        </span>
                                        <span className="d-flex">
                                            <span>
                                                <img
                                                    src="/images/svg/yellow-dot.svg"
                                                    alt="yellow-dot icon"
                                                />
                                            </span>

                                            <h5>Mobile</h5>
                                        </span>
                                        <span className="d-flex">
                                            <span>
                                                <img
                                                    src="/images/svg/red-dot.svg"
                                                    alt="red-dot icon"
                                                />
                                            </span>
                                            <h5>Tablet</h5>
                                        </span>
                                      
                                    </div>
                                </div>
                            </div>
                        </div> */}