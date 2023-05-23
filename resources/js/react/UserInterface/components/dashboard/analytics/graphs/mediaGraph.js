import React from 'react';
import { Bar } from 'react-chartjs-2';


export default function MediaGraph(props) {

    const dataLabels = props.statistics.map(s => s.medium_name);
    const noOfUsers = props.statistics.map(s => s.sum_users_count);

    return (
        <>
            <div className="w-100 report-box">
                <div className="justify-content-between d-flex mb-3">
                    <div><h3 className="card-heading">Media</h3></div>
                    {/* <div>
                        <span>
                            <img
                                src="/images/svg/dashboard-list-option.svg"
                                alt="list icon"
                            />
                        </span>
                    </div> */}
                </div>
                <div className="d-flex flex-column">
                    <div className="progressbar d-flex flex-column pb-4">
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>Twitter</h5>
                            <span className="ml-2">{Math.min((noOfUsers / 1000) * 100,100)}%</span>
                        </div>
                        <div className="progress m-0">
                            <div className="progress-bar" role="progressbar"
                                style={{width: `${Math.min((noOfUsers /1000) *100,100)}%`,}} aria-valuenow={`${Math.min((132645 / 150000) *100,100)}`} aria-valuemin="0" aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div className="progressbar d-flex flex-column pb-4">
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>Instagram</h5>
                            <span className="ml-2">{Math.min((noOfUsers / 1000) * 100,100)}%</span>
                        </div>
                        <div className="progress m-0">
                            <div className="progress-bar" role="progressbar"
                                style={{width: `${Math.min((noOfUsers /1000) *100,100)}%`,}} aria-valuenow={`${Math.min((132645 / 150000) *100,100)}`} aria-valuemin="0" aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div className="progressbar d-flex flex-column pb-4">
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>Tiktok</h5>
                            <span className="ml-2">{Math.min((noOfUsers / 1000) * 100,100)}%</span>
                        </div>
                        <div className="progress m-0">
                            <div className="progress-bar" role="progressbar"
                                style={{width: `${Math.min((noOfUsers /1000) *100,100)}%`,}} aria-valuenow={`${Math.min((132645 / 150000) *100,100)}`} aria-valuemin="0" aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                    <div className="progressbar d-flex flex-column pb-4">
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 style={{color: "#333333", fontSize:"16px",fontWeight:"400"}}>Facebook</h5>
                            <span className="ml-2">{Math.min((noOfUsers / 1000) * 100,100)}%</span>
                        </div>
                        <div className="progress m-0">
                            <div className="progress-bar" role="progressbar"
                                style={{width: `${Math.min((noOfUsers /1000) *100,100)}%`,}} aria-valuenow={`${Math.min((132645 / 150000) *100,100)}`} aria-valuemin="0" aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                </div>
                <p className='mb-0'>Source:BestGenNewtonSite</p>
            </div>
            {/* <Bar
                height='200px'
                // width='100%'
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
                }}
                options={{
                    indexAxis: 'y',
                   
                    elements: {
                        bar: {
                            borderWidth: 2,
                        },
                    },
                    responsive: true,
                   
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                boxWidth: 0,
                                boxHeight: 0
                            }
                        },
                        title: {
                            display: true,
                            align: 'start',
                            text: 'Media',
                        },
                    },
                }} />; */}      
        </>
    )
}