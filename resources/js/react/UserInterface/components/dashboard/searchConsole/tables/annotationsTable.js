import React, { Component } from 'react'
import { timezoneToDateFormat } from '../../../../utils/TimezoneTodateFormat';

export default function AnnotationsTable(props) {
    return <div id="annotation-table-container">
        <div className="row ml-0 mr-0 mt-4">
            <div className="col-12">
                <div id="annotation-table-container" className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead style={{ border: 'solid #0962ff' }}>
                            <tr>
                                <th>Event Name</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Clicks</th>
                                <th>Impressions</th>
                            </tr>
                        </thead>
                        <tbody id="annotation-table-body">
                            {
                                props.annotations.map(anno => {
                                    return (
                                        <tr key={anno.id}>
                                            <td>{anno.event_name}</td>
                                            <td>{anno.category}</td>
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