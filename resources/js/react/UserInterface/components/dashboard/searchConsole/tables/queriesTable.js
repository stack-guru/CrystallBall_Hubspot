import React from 'react';

const QueriesTable = (props) => <table className="table table-bordered table-hover gaa-hover">
    <thead><tr><th>Query</th><th>Clicks</th><th>Impressions</th></tr></thead>
    <tbody>
        {
            props.queriesStatistics.map(qS => {
                return <tr>
                    <td>{qS.query}</td>
                    <td>{qS.sum_clicks_count}</td>
                    <td>{qS.sum_impressions_count}</td>
                </tr>
            })
        }
    </tbody>
</table>;

export default QueriesTable;