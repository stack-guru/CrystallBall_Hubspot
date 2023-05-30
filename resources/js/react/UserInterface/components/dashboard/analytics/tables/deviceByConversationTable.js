import React from 'react';
import { Doughnut } from 'react-chartjs-2';


export default function DeviceByConversationTable(props) {

    const dataLabels = props.sourcesStatistics.map(s => s.conversionRate.toUpperCase());
    const noOfClicks = props.sourcesStatistics.map(s => s.sum_conversions_count);
    const noOfImpressions = props.sourcesStatistics.map(s => s.sum_users_count);
    const COLORS =  ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    // console.log("devicebyconversation   ===== ",sourcesStatistics.sum_users_count,sourcesStatistics.source_name,sourcesStatistics.sum_conversions_count);

    return (
        <> 

            <div className=" report-box">


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

                <div className="d-flex justify-content-between">
                    <div className="">

                        

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



            
        </>
    )
}







// import React from 'react';
// import { FormGroup, Label } from "reactstrap";

// const DeviceByConversationTable = props => (
//     <>
//     <div className=" report-box">
//                             <div>
//                                 <div className="d-flex justify-content-between mb-5">
//                                     <div>
//                                         <h4 className="card-heading">
//                                             Devivce By Conversation
//                                         </h4>
//                                     </div>
//                                     <div>
//                                         <span>
//                                             <img src="/images/svg/dashboard-list-option.svg" alt="list icon" />
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <table className="table border">
//                                     <thead>
//                                         <tr>
//                                             <td>Source</td>
//                                             <td>User</td>
//                                             <td>Conv.Rate</td>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                             {
//                                                     props.sourcesStatistics.map(sS => {
//                                                     const conversionRate = sS.sum_conversions_count && sS.sum_users_count ? ((sS.sum_conversions_count / sS.sum_users_count) * 100).toFixed(2) : 0;
//                                                     return <tr>
//                                                         <td><img height="25px" width="25px" src={`https://${sS.source_name}/favicon.ico`} onError={(e) => { e.target.remove(); }} /></td>
//                                                         <td>{sS.source_name}</td>
//                                                         <td>{sS.sum_users_count}</td>
//                                                         <td>{conversionRate}</td>
//                                                     </tr>
//                                                 })
//                                             }
//                                     </tbody>
//                                     </table>
//                             </div>
//     </div>
    

//     </>
// )
// export default DeviceByConversationTable;

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
 