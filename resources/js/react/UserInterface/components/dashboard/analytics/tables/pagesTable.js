import React from 'react';

const PagesTable = props =>(
        <>
            <div className="report-box">
                <div className="d-flex justify-content-between">
                    <div>
                        <h4 className="card-heading">
                            Page Table
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
                        <th>Page</th>
                        <th>Clicks</th>
                        <th>Impressions</th>
                        </tr>
                        </thead>
                    <tbody>
                        {
                            props.pagesStatistics.map(pS => {
                                return <tr key={pS.page}>
                                    <td>{pS.page}</td>
                                    <td>{pS.sum_clicks_count}</td>
                                    <td>{pS.sum_impressions_count}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

            {/* <table className="table table-bordered table-hover gaa-hover">
                <thead><tr><th>Page</th><th>Clicks</th><th>Impressions</th></tr></thead>
                <tbody>
                    {
                        props.pagesStatistics.map(pS => {
                            return <tr key={pS.page}>
                                <td>{pS.page}</td>
                                <td>{pS.sum_clicks_count}</td>
                                <td>{pS.sum_impressions_count}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table> */}
        </>
    )
export default PagesTable;