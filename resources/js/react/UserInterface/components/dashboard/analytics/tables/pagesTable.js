import React from 'react';

const PagesTable = props => <table className="table table-bordered table-hover gaa-hover">
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
</table>

export default PagesTable;