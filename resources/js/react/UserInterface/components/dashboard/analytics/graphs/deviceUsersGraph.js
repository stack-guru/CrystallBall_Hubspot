import React from 'react';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Pie,
    PieChart,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area,
} from "recharts";

export default function DeviceUsersGraph(props) {


            // COLORS: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"],
            const [Color,setColor]=useState(["#0088FE", "#00C49F", "#FFBB28", "#FF8042"])

    const dataLabels = props.deviceCategoriesStatistics.map(s => s.device_category.toUpperCase());
    const noOfUsers = props.deviceCategoriesStatistics.map(s => s.sum_users_count);

    return(
            <>
        
                <div className=" report-box">
                                <div>
                                    <div className="d-flex justify-content-between mb-5">
                                        <div>
                                            <h4 className="card-heading">
                                                Devivce By Conversation
                                            </h4>
                                        </div>
                                        {/* <div>
                                            <span>
                                                <img src="/images/svg/dashboard-list-option.svg" alt="list icon" />
                                            </span>
                                        </div> */}
                                    </div>
                                    <table className="table border">
                                        <thead>
                                            <tr>
                                                <th>Device</th>
                                                <th>Users</th>
                                                <th>Conv.Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                {
                                                    props.deviceCategoriesStatistics.map(dS => {
                                                        const conversionRate = dS.sum_conversions_count && dS.sum_users_count ? ((dS.sum_conversions_count / dS.sum_users_count) * 100).toFixed(2) : 0;
                                                        return( 
                                                        <tr key={dS.device_category}>
                                                            <td className="text-uppercase">{dS.device_category}</td>
                                                            <td>{dS.sum_users_count}</td>
                                                            <td>{conversionRate}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                        </tbody>
                                        

                                        
                                        {/* <tbody>
                                            {this.state.conversationData.map(
                                                (itm, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {itm.name ===
                                                            "Desktop" ? (
                                                                <span className="pr-1">
                                                                    <img
                                                                        src="/images/svg/desktop.svg"
                                                                        alt="list icon"
                                                                    />
                                                                    {itm.name}
                                                                </span>
                                                            ) : itm.name ===
                                                            "Mobile" ? (
                                                                <span className="pr-1">
                                                                    <img
                                                                        src="/images/svg/mobile.svg"
                                                                        alt="list icon"
                                                                    />
                                                                    {itm.name}
                                                                </span>
                                                            ) : itm.name ===
                                                            "Tablet" ? (
                                                                <span className="pr-1">
                                                                    <img
                                                                        src="/images/svg/tablet.svg"
                                                                        alt="list icon"
                                                                    />
                                                                    {itm.name}
                                                                </span>
                                                            ) : null}
                                                        </td>
                                                        <td>{itm.users}</td>
                                                        <td>
                                                            {itm.conversionRate}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody> */}

                                        
                                    </table>
                                </div>
                                <div className="d-flex justify-content-between ">
                                    <div className="">
                                        <PieChart width={150} height={150}>
                                            <Pie
                                                data={noOfUsers}
                                                dataKey="value"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={30}
                                                outerRadius={40}
                                                fill="#82ca9d"
                                                label
                                            >
                                                {noOfUsers.map(
                                                    (entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                            fill={Color[ index % Color.length]}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                        </PieChart>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="d-flex">
                                            <span className="">
                                                <img src="/images/svg/green-dot.svg" alt="green-dot icon" />
                                            </span>
                                            <h5>Desktop</h5>
                                        </span>
                                        <span className="d-flex">
                                            <span>
                                                <img src="/images/svg/yellow-dot.svg" alt="yellow-dot icon" />
                                            </span>

                                            <h5>Mobile</h5>
                                        </span>
                                        <span className="d-flex">
                                            <span>
                                                <img src="/images/svg/red-dot.svg" alt="red-dot icon" />
                                            </span>
                                            <h5>Tablet</h5>
                                        </span>
                                    </div>
                                </div>
                </div>

    
        
                {/* <div className="row ml-0 mr-0 mt-4">
                    <div className="col-6">
                        <table className="table table-borderless table-hover gaa-hover">
                            <thead>
                                <tr>
                                    <th className="text-left">Device</th>
                                    <th>Users</th>
                                    <th>Conv.Rate</th>
                                    </tr>
                                    </thead>
                            <tbody>
                                {
                                    props.deviceCategoriesStatistics.map(dS => {
                                        const conversionRate = dS.sum_conversions_count && dS.sum_users_count ? ((dS.sum_conversions_count / dS.sum_users_count) * 100).toFixed(2) : 0;
                                        return (
                                        <tr key={dS.device_category}>
                                            <td className="text-uppercase">{dS.device_category}</td>
                                            <td>{dS.sum_users_count}</td>
                                            <td>{conversionRate}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-6">
                        <Doughnut
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
