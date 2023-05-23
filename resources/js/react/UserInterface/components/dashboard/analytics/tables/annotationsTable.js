import React, { Component } from 'react'
import { timezoneToDateFormat } from '../../../../utils/TimezoneTodateFormat';

export default function AnnotationsTable(props) {
    
    
    return (
            <>

                <div className="report-box">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="card-heading">
                                        Attribution source
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
                            <table className="table border mb-0">
                                <thead>
                                    <tr>
                                        
                                            <th>Event Name</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Website Visits</th>
                                            <th>Conversions</th>
                                            <th>Conversion Rate</th>
                                    </tr>
                                </thead>
                                {/* <tbody>
                                    {this.state.attributionSourceData.map(
                                        (itm, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {itm.name ===
                                                    "Gannotations" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                            <img
                                                                style={{'width': '100%', 'height':'auto',}}
                                                                src="/images/svg/google.svg"
                                                                alt="list icon"
                                                            />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : itm.name ===
                                                      "wowsite.co" ? (
                                                        <span>{itm.name}</span>
                                                    ) : itm.name ===
                                                      "youtube.com/videos" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                                <img
                                                                    style={{'width': '100%', 'height':'auto',}}
                                                                    src="/images/svg/youtube.svg"
                                                                    alt="list icon"
                                                                />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : itm.name ===
                                                      "news.yahoo.com" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                                <img
                                                                    style={{'width': '100%', 'height':'auto',}}
                                                                    src="/images/svg/yahoo.svg"
                                                                    alt="list icon"
                                                                />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : itm.name ===
                                                      "newwebsite.com" ? (
                                                        <span>{itm.name}</span>
                                                    ) : itm.name ===
                                                      "instagram.com" ? (
                                                        <span className="pr-2 d-flex align-items-center">
                                                            <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                                                <img
                                                                    style={{'width': '100%', 'height':'auto',}}
                                                                    src="/images/svg/instagram.svg"
                                                                    alt="list icon"
                                                                />
                                                            </span>
                                                            {itm.name}
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td>{itm.users}</td>
                                                <td>{itm.conversation}</td>
                                                <td>{itm.conversionRate}</td>
                                            </tr>
                                        )
                                    )}
                                </tbody> */}
                                <tbody id="annotation-table-body" >
                                        {
                                            props.annotations.map(anno => {
                                                const conversionRate = anno.sum_conversions_count && anno.sum_users_count ? ((anno.sum_conversions_count / anno.sum_users_count) * 100).toFixed(2) : 0;
                                                return (
                                                    <tr key={anno.id}>
                                                        <td>{anno.event_name}</td>
                                                        <td>{anno.category}</td>
                                                        <td>{anno.description}</td>
                                                        <td>{moment(anno.show_at).format(timezoneToDateFormat(props.user.timezone))}</td>
                                                        <td>{anno.sum_users_count}</td>
                                                        <td>{anno.sum_conversions_count}</td>
                                                        <td>{conversionRate}%</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                            </table>
                </div>


                

   
                {/* <div id="annotation-table-container">
                    <div className="row ml-0 mr-0 mt-4">
                        <div className="col-12">
                            <div id="annotation-table-container" className="table-responsive">
                                <table className="table table-bordered table-hover gaa-hover">
                                    <thead>
                                        <tr>
                                            <th style={{ border: 'none' }}></th>
                                            <th style={{ border: 'none' }}></th>
                                            <th style={{ border: 'none' }}></th>
                                            <th style={{ border: 'none' }}></th>
                                            <th colSpan="3">
                                                <div className="dropdown">
                                                    {props.statisticsPaddingDays} days after the event
                                                    <button className="btn btn-link btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <a className="dropdown-item" onClick={() => { props.satisticsPaddingDaysCallback(0); }}>Event date</a>
                                                        <a className="dropdown-item" onClick={() => { props.satisticsPaddingDaysCallback(3); }}>3 days after the event</a>
                                                        <a className="dropdown-item" onClick={() => { props.satisticsPaddingDaysCallback(7); }}>7 days after the event</a>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Event Name</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th>Date</th>
                                            <th>Website Visits</th>
                                            <th>Conversions</th>
                                            <th>Conversion Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody id="annotation-table-body" >
                                        {
                                            props.annotations.map(anno => {
                                                const conversionRate = anno.sum_conversions_count && anno.sum_users_count ? ((anno.sum_conversions_count / anno.sum_users_count) * 100).toFixed(2) : 0;
                                                return (
                                                    <tr key={anno.id}>
                                                        <td>{anno.event_name}</td>
                                                        <td>{anno.category}</td>
                                                        <td>{anno.description}</td>
                                                        <td>{moment(anno.show_at).format(timezoneToDateFormat(props.user.timezone))}</td>
                                                        <td>{anno.sum_users_count}</td>
                                                        <td>{anno.sum_conversions_count}</td>
                                                        <td>{conversionRate}%</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>; */}
            </>
        )
}