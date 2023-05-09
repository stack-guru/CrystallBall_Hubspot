import React, { Component } from 'react'
import { timezoneToDateFormat } from '../../../../utils/TimezoneTodateFormat';

export default function consoleAnnotationsTable(props) {
    return <div id="annotation-table-container">
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
                                <th colSpan="2">
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
                                <th>Clicks</th>
                                <th>Impressions</th>
                            </tr>
                        </thead>
                        <tbody id="annotation-table-body" >
                            {
                                props.annotations.map(anno => {
                                    return (
                                        <tr key={anno.id}>
                                            <td>{anno.event_name}</td>
                                            <td>{anno.category}</td>
                                            <td>{anno.description}</td>
                                            <td>{moment(anno.show_at).format(timezoneToDateFormat(props.user.timezone))}</td>
                                            <td>{anno.sum_clicks_count}</td>
                                            <td>{anno.sum_impressions_count}</td>
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
