import React from 'react';

const CountriesTable = props => <table className="table table-bordered table-hover gaa-hover">
    <thead><tr><th>Country</th><th>Clicks</th><th>Impressions</th></tr></thead>
    <tbody>
        {
            props.countriesStatistics.map(cS => {
                return <tr>
                    <td>{cS.country}</td>
                    <td>{cS.sum_clicks_count}</td>
                    <td>{cS.sum_impressions_count}</td>
                </tr>
            })
        }
    </tbody>
</table>

export default CountriesTable;