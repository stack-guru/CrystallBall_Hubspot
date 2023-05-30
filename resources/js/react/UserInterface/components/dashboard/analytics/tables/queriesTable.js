import React from 'react';

const QueriesTable = (props) => (
        <>
            <div className="report-box">
                <div className="d-flex justify-content-between">
                    <div>
                        <h4 className="card-heading">
                            Queries Table
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
                <table className="table border mb-0 dashboard-analytics">
                    <thead>
                    <tr>
                        <th>Query</th>
                        <th>Clicks</th>
                        <th>Impressions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        props.queriesStatistics.map(qS => {
                            return <tr key={qS.query}>
                                <td>{qS.query}</td>
                                <td>{qS.sum_clicks_count}</td>
                                <td>{qS.sum_impressions_count}</td>
                            </tr>
                        })
                    }
                </tbody>
                </table>
            </div>

            {/* <table className="table table-bordered table-hover gaa-hover">
                <thead><tr><th>Query</th><th>Clicks</th><th>Impressions</th></tr></thead>
                <tbody>
                    {
                        props.queriesStatistics.map(qS => {
                            return <tr key={qS.query}>
                                <td>{qS.query}</td>
                                <td>{qS.sum_clicks_count}</td>
                                <td>{qS.sum_impressions_count}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>; */}
        </>
)

export default QueriesTable;