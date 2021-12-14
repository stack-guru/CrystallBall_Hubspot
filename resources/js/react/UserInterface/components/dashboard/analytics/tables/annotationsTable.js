import React, { Component } from 'react'
import { timezoneToDateFormat } from '../../../../utils/TimezoneTodateFormat';

export default function AnnotationsTable(props) {
    return <div id="annotation-table-container">
        <div className="row ml-0 mr-0 mt-4">
            <div className="col-12" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                <div id="annotation-table-container" className="table-responsive">
                    <table className="table table-bordered table-hover gaa-hover">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th colSpan="4">
                                    <div className="dropdown">
                                        {props.statisticsPaddingDays} days after the event
                                        <button className="btn btn-link btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a className="dropdown-item" onClick={() => { props.satisticsPaddingDaysCallback(0); }}>Event date</a>
                                            <a className="dropdown-item" onClick={() => { props.satisticsPaddingDaysCallback(3); }}>3 days after the event (this count the event day too)</a>
                                            <a className="dropdown-item" onClick={() => { props.satisticsPaddingDaysCallback(7); }}>7 days after the event (this count the event day too)</a>
                                        </div>
                                    </div>
                                </th>
                            </tr>
                            <tr style={{ border: '3px solid #35a1ea' }}>
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
    </div>;
}