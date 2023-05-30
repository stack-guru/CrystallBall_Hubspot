import React from 'react';
import { Chart } from "react-google-charts";
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



  import { Line } from 'react-chartjs-2';



export default function UsersDaysWithAnnotationsGraph(props) {


    const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        elements: {
            area: {
              background: {
                orientation: 'vertical',
                from: "rgba(30, 168, 253, 0.3)", // Start color
                to: "rgba(30, 168, 253, 0)", // End color
              },
            },
          },
      };
      const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

      const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Data',
            data: [12, 19, 3, 5, 2, 3, 8],
            fill: true,

            borderColor: 'rgba(30, 168, 253, 1)', // Line color
            tension: 0.4,
            
          },
        ],
      };



    // const dates = props.statistics.map(s => moment(s.statistics_date).format("DD MMM"));
    // const months = props.statistics.map(s => moment(s.statistics_date).format("MMM"));
    // const noOfUsers = props.statistics.map(s => s.sum_users_count);
    const combinedArray = props.statistics.map(s => {
        const momentDate = moment(s.statistics_date);
        return [
            // new Date(momentDate.format('YYYY'), momentDate.format('MM') - 1, momentDate.format('DD')),
            momentDate.format("DD") + "\n" + momentDate.format("MMM"),
            Number.parseInt(s.sum_users_count),
            s.event_name ? s.event_name.split(' ').map(a => a.substr(0, 1)).join('').toUpperCase() : null,
            s.event_name ? s.event_name : null,
        ];
    });

    const dataArray = [
        [
            { type: 'string', label: 'Day' },
            { type: 'number', label: 'Users' },
            { type: 'string', role: 'annotation' },
            { type: 'string', role: 'annotationText' }
        ],
        ...combinedArray,
    ];

    const optionsArray = {
        // chartArea: {
        //     left: 20,
        //     right: 5, // !!! works !!!
        //     bottom: 40,  // !!! works !!!
        //     top: 10,
        //     width: "100%",
        //     // height: "100%"
        // },
        'chartArea': { 'width': '100%', 'height': '70%', left: 60 },
        title: '',
        pointSize: 5,
        vAxis: {
            minValue: 0,
            // maxValue:5000,
            title: 'Users',
            titleTextStyle: { color: '#828282' }
        },
        hAxis: {
            scaleType: 'linear',
            side: 'top',
            format: "d\nMMM",
            textStyle: {
                fontSize: '12',
            },
        },
        annotations: {
            textStyle: {
                fontSize: 8,
                opacity: 0.8
            },
            // boxStyle: {
            //     stroke: '#FE4C3C',
            //     strokeWidth: 3,
            //     rx: 0,
            //     ry: 0,
            //     gradient: {
            //       color1: 'rgba(30, 168, 253, 0.3)',
            //       color2: 'rgba(30, 168, 253, 0)',
            //       x1: '0%',
            //       y1: '0%',
            //       x2: '100%',
            //       y2: '100%',
            //       useObjectBoundingBoxUnits: true
            //     }
            //   },
            //   chartArea: {

            //     backgroundColor: {
            //     fill: 'linear-gradient(180deg, rgba(30, 168, 253, 0.3) 0%, rgba(30, 168, 253, 0) 100%)',
            //     opacity: 1
            //         },
            //   },
              backgroundColor:"00cc00"
            // boxStyle: {
            //     // Color of the box outline.
            //     stroke: '#017ED7',
            //     // Thickness of the box outline.
            //     strokeWidth: 1,
            //     // x-radius of the corner curvature.
            //     rx: 0,
            //     // y-radius of the corner curvature.
            //     ry: 0,
            //     // Attributes for linear gradient fill.
            //     gradient: {

            //         // Start color for gradient.
            //         color1: '#fbf6a7',
            //         // Finish color for gradient.
            //         color2: '#33b679',
            //         // Where on the boundary to start and
            //         // end the color1/color2 gradient,
            //         // relative to the upper left corner
            //         // of the boundary.
            //         x1: '0%', y1: '0%',
            //         x2: '100%', y2: '100%',
            //         // If true, the boundary for x1,
            //         // y1, x2, and y2 is the box. If
            //         // false, it's the entire chart.
            //         useObjectBoundingBoxUnits: true
            //     }
            // }
        },
        legend: 'none',
    };

    const optionsArray2 = {
        annotations: {
            textStyle: {
                fontName: 'Source Sans Pro',
                fontSize: 14,
                // bold: true,
                // italic: true,
                // The color of the text.
                color: '#828282',
                // The color of the text outline.
                // auraColor: '#d799ae',
                // The transparency of the text.
                opacity: 0.8
            }
        }
    };

    return (
        <>
             {/*user's div*/}
                       
                        {/* <div className="report-box">                           
                            
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-heading">Users</h4>
                                </div>
                                <div>
                                    <span>
                                    <img
                                            src="/images/svg/dashboard-goto-link.svg"
                                            alt="link icon"
                                        />                                    
                                        
                                    </span>
                                    <span>
                                        <div class="btn-group gaa-annotation">
                                            
                                            <button class="border-0 p-0 bg-white" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img
                                                src="/images/svg/dashboard-list-option.svg"
                                                alt="list icon"
                                            />
                                            </button>
                                            <div class="dropdown-menu">
                                                a
                                                ball
                                            </div>
                                        </div>
                                        
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <LineChart
                                    width={600}
                                    height={200}
                                    data={dataArray}
                                >
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <CartesianGrid stroke="#ccc" />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="label"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </div>
                        </div> */}
        
            <div className="report-box">
                <div className="d-flex justify-content-between">
                    <div><h4 className="card-heading">Users</h4>
                    </div>
                </div>
                <Line options={options} data={data} />;
                {/* <Chart
                    width={'100%'}
                    // style={{ paddingLeft: '10px' }}
                    // height={'50'}
                    chartType="AreaChart"
                    loader={<div>Loading Chart</div>}
                    data={dataArray}
                    options={optionsArray}
                /> */}
            </div>
        </>
    )
    
};



{/* <div className="report-box">
                            {
                                this.state.cardIsSelected ?
                                <span className="tickicongreen">
                                <img  src="/images/svg/green-tick.svg"
                                 alt="green-tick icon" />
                            </span>
                            : null
                            }
                            
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-heading">Users</h4>
                                </div>
                                <div>
                                    <span>
                                    <img
                                            src="/images/svg/dashboard-goto-link.svg"
                                            alt="link icon"
                                        />                                    
                                        
                                    </span>
                                    <span>
                                        <div class="btn-group gaa-annotation">
                                            
                                            <button class="border-0 p-0 bg-white" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img
                                                src="/images/svg/dashboard-list-option.svg"
                                                alt="list icon"
                                            />
                                            </button>
                                            <div class="dropdown-menu">
                                                a
                                                ball
                                            </div>
                                        </div>
                                        
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <LineChart
                                    width={600}
                                    height={200}
                                    data={this.state.data}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid stroke="#ccc" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" strokeWidth={2} />
                                </LineChart>
                            </div>
                        </div> */}