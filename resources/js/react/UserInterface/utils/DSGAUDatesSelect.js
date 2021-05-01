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

        this.selectedStatusChanged = this.selectedStatusChanged.bind(this);
        this.fetchUpdatesList = this.fetchUpdatesList.bind(this);
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true })
            this.fetchUpdatesList("");
        }
    }

    fetchUpdatesList(status) {
        let getUrl = 'data-source/google-algorithm-updates/date';
        if (status) if (status !== "") getUrl += '?status=' + status
        HttpClient.get(getUrl).then(resp => {
            this.setState({ isBusy: false, google_algorithm_updates: resp.data.google_algorithm_updates })
        }, (err) => {
            
            this.setState({ isBusy: false, errors: err.response })
        }).catch(err => {
            
            this.setState({ isBusy: false, errors: err })
        })
    }

    selectedStatusChanged(e) {
        this.setState({ [e.target.name]: e.target.value });
        (this.props.onCheckCallback)({ code: 'google_algorithm_update_dates', name: 'GoogleAlgorithmUpdateDate', country_name: null, status: e.target.value })
        this.fetchUpdatesList(e.target.value);
    }

    render() {

        return (
            <div className="switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">
                        Algorithm Updates
                </h4>
                    <div className="input-group mb-3">
                        <select
                            className="form-control"
                            placeholder="Search"
                            value={this.props.ds_data.length ? (this.props.ds_data[0].status ? this.props.ds_data[0].status : "") : ""}
                            name="searchStatus"
                            onChange={this.selectedStatusChanged}
                        >
                            <option value="">Both</option>
                            <option value="unconfirmed">Unconfirmed</option>
                            <option value="confirmed">Confirmed</option>
                        </select>
                    </div>
                    <div className="checkbox-box mt-3">
                        {
                            this.state.google_algorithm_updates.map(gAU => {
                                return <div className="form-check wac" key={gAU.id}>
                                    <label
                                        className="form-check-label"
                                        htmlFor="defaultCheck1"
                                    >
                                        {moment(gAU.update_date).format('YYYY-MM-DD')} - {gAU.event_name}
                                        {/* {gAU.update_date} - {gAU.event_name} */}
                                    </label>
                                    <hr />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
