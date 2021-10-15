import React, { Component } from 'react'
import { timezoneToDateFormat } from '../../../utils/TimezoneTodateFormat';

export default function AnnotationsTable(props) {
    return <div id="annotation-table-container">
        <div className="row ml-0 mr-0">
            <div className="col-12">
                <div id="annotation-table-container" className="table-responsive">
                    <table className="table table-hover table-borderless table-striped">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Website Visits</th>
                                <th>Conversions</th>
                                <th>Conversion Rate</th>
                            </tr>
                        </thead>
                        <tbody id="annotation-table-body">
                            {
                                props.annotations.map(anno => {
                                    const conversionRate = anno.sum_events_count && anno.sum_sessions_count ? ((anno.sum_events_count / anno.sum_sessions_count) * 100).toFixed(2) : 0;
                                    return (
                                        <tr key={anno.id}>
                                            <td>{anno.event_name}</td>
                                            <td>{anno.category}</td>
                                            <td>{moment(anno.show_at).format(timezoneToDateFormat(props.user.timezone))}</td>
                                            <td>{anno.sum_sessions_count}</td>
                                            <td>{anno.sum_events_count}</td>
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