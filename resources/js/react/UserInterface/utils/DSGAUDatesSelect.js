import React from 'react';
import HttpClient from '../utils/HttpClient';

export default class DSGAUDatesSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            google_algorithm_updates: [],
            isBusy: false,
            errors: '',
        }

    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true })
            HttpClient.get('data-source/google-algorithm-updates/date').then(resp => {
                this.setState({ isBusy: false, google_algorithm_updates: resp.data.google_algorithm_updates })
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: err.response })
            }).catch(err => {
                console.log(err);
                this.setState({ isBusy: false, errors: err })
            })
        }
    }

    render() {

        return (
            <div className="weather_alert_cities-form">
                <h4 className="gaa-text-primary">
                    Updates
                </h4>
                <div className="input-group mb-3">
                    {/* <select
                        className="form-control"
                        placeholder="Search"
                        value={this.state.searchCountry}
                        name="searchCountry"
                        onChange={this.selectedCountryChanged}
                    >
                        {
                            [{ country_name: 'Please select country', value: '' }].concat(this.state.weather_alerts_countries).map(wAC => { return <option value={wAC.country_code}>{wAC.country_name}</option> })
                        }
                    </select> */}
                </div>
                <div className="checkbox-box mt-3">
                    {
                        this.state.google_algorithm_updates.map(gAU => {
                            return <div className="form-check wac" key={gAU.id}>
                                <label
                                    className="form-check-label"
                                    htmlFor="defaultCheck1"
                                >
                                    {gAU.event_name} - {gAU.update_date}
                                </label>
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }
}
