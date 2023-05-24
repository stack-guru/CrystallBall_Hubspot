import React from 'react';
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
import { FormGroup, Label } from "reactstrap";

const DeviceByConversationTable = props => (
    <>
    <div className=" report-box">
                            <div>
                                <div className="d-flex justify-content-between mb-5">
                                    <div>
                                        <h4 className="card-heading">
                                            Devivce By Conversation
                                        </h4>
                                    </div>
                                    <div>
                                        <span>
                                            <img src="/images/svg/dashboard-list-option.svg" alt="list icon" />
                                        </span>
                                    </div>
                                </div>
                                <table className="table border">
                                    <thead>
                                        <tr>
                                            <td>Source</td>
                                            <td>User</td>
                                            <td>Conv.Rate</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {
                                                    props.sourcesStatistics.map(sS => {
                                                    const conversionRate = sS.sum_conversions_count && sS.sum_users_count ? ((sS.sum_conversions_count / sS.sum_users_count) * 100).toFixed(2) : 0;
                                                    return <tr>
                                                        <td><img height="25px" width="25px" src={`https://${sS.source_name}/favicon.ico`} onError={(e) => { e.target.remove(); }} /></td>
                                                        <td>{sS.source_name}</td>
                                                        <td>{sS.sum_users_count}</td>
                                                        <td>{conversionRate}</td>
                                                    </tr>
                                                })
                                            }
                                    </tbody>
                                    </table>
                            </div>
                        </div>
    

    </>
)
export default DeviceByConversationTable;

{

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
                               
                            {/* <div className="d-flex justify-content-between ">
                                <div className="">
]                                    <PieChart width={150} height={150}>
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
                                                    <Cell key={`cell-${index}`}
                                                        fill={this.state.COLORS[index % this.state.COLORS.length]}
                                                    />
                                                )
                                            )}
                                        </Pie>
                                    </PieChart>
                                </div>
                                <div className="d-flex flex-column">
                                    <span className="d-flex">
                                        <span className="">
                                            <img src="/images/svg/green-dot.svg"alt="green-dot icon" />
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
                            </div> */}
}
 