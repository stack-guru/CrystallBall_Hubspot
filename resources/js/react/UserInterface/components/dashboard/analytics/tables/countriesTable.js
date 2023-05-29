import React from 'react';
import { findCountry } from '../../../../libraries/countryCodeResolver';

const CountriesTable = props => (
    <>

        <div className=" report-box ">
            <div className="d-flex justify-content-between mb-5">
                <div>
                    <h4 className="card-heading">
                        Countries Table
                    </h4>
                </div>
                <div>
                    
                    {/* <span>
                        <img
                            src="/images/svg/dashboard-list-option.svg"
                            alt="list icon"
                        />
                    </span> */}
                </div>
            </div>

            <table className="table border">
            <thead>
                <tr>
                    <th>Country</th>
                    <th>Clicks</th>
                    <th>Impressions</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.countriesStatistics.map(cS => {
                        return <tr key={cS.country}>
                            <td>{findCountry(cS.country)}</td>
                            <td>{cS.sum_clicks_count}</td>
                            <td>{cS.sum_impressions_count}</td>
                        </tr>
                    })
                }
            </tbody>
                
            </table>
        </div>


        {/* <table className="table table-bordered table-hover gaa-hover">
            <thead><tr><th>Country</th><th>Clicks</th><th>Impressions</th></tr></thead>
            <tbody>
                {
                    props.countriesStatistics.map(cS => {
                        return <tr key={cS.country}>
                            <td>{findCountry(cS.country)}</td>
                            <td>{cS.sum_clicks_count}</td>
                            <td>{cS.sum_impressions_count}</td>
                        </tr>
                    })
                }
            </tbody>
        </table> */}
    </>
    )
export default CountriesTable;