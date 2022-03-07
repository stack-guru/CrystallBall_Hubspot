import React, { Component } from 'react'
import { timezoneToDateFormat } from '../../utils/TimezoneTodateFormat';

export default function AnnotationsTable(props) {
    return <div id="annotation-table-container">
        <div className="row ml-0 mr-0 mt-4">
            <div className="col-12 pl-0 pr-0 scrollable">
                <div id="annotation-table-container" className="table-responsive">
                    <table className="table table-bordered table-hover gaa-hover">
                        <thead>
                            <tr>
                                <th colSpan="4">Annotations</th>
                                <th colSpan="5">
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
                                <th>Date</th>
                                <th>Event Name</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Clicks</th>
                                <th>Impressions</th>
                                <th>Website Visits</th>
                                <th>Conversions</th>
                                <th>Conversion Rate</th>
                            </tr>
                        </thead>
                        <tbody id="annotation-table-body" >
                            {
                                props.allDates.map(d => {
                                    const sCAnno = props.searchConsoleData[d];
                                    const aAnno = props.analyticsData[d];

                                    const conversionRate = aAnno ? (aAnno.sum_conversions_count && aAnno.sum_users_count ? ((aAnno.sum_conversions_count / aAnno.sum_users_count) * 100).toFixed(2) : 0) : 0;

                                    return (
                                        <tr key={d}>
                                            <td>{moment(d).format(timezoneToDateFormat(props.user.timezone))}</td>
                                            <td>{sCAnno ? sCAnno.event_name : (aAnno ? aAnno.event_name : '')}</td>
                                            <td>{sCAnno ? sCAnno.category : (aAnno ? aAnno.category : '')}</td>
                                            <td>{sCAnno ? sCAnno.description : (aAnno ? aAnno.description : '')}</td>
                                            <td>{sCAnno ? sCAnno.sum_clicks_count : 0}</td>
                                            <td>{sCAnno ? sCAnno.sum_impressions_count : 0}</td>
                                            <td>{aAnno ? aAnno.sum_users_count : 0}</td>
                                            <td>{aAnno ? aAnno.sum_conversions_count : 0}</td>
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
    </div>;
}