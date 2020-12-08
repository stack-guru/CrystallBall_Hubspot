import React from 'react';
import HttpClient from '../utils/HttpClient';

require('../Main.css');

export default class countries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            isBusy: false,
            errors: ''
        }
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({isBusy: true})
            HttpClient.get('countries').then(resp => {
                this.setState({isBusy: false, countries: resp.data.countries})
            }, (err) => {
                console.log(err);
                this.setState({isBusy: false, errors: err.response})
            }).catch(err => {
                console.log(err);
                this.setState({isBusy: false, errors: err})
            })
        }
    }

    render() {
        let countries = this.state.countries;
        let userCountries = this.props.ds_data.map(ds => ds.country_name);
        return (
            <div className="countries-form">
                <h3 className="gaa-text-primary">
                    { this.props.sectionTitle === 'weather' && (
                        'Select Countries for Weather Alert'
                    )}
                    { this.props.sectionTitle !== 'weather' && (
                        `Select Countries for ${this.props.sectionTitle}`
                    )}
                </h3>
                {/*<h3 className="gaa-text-primary">Select Countries</h3>*/}
                <div className="input-group search-input-box mb-3">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="search"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                    />
                    <div className="input-group-append">
                        <i className="ti-search"></i>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center border-bottom">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="check-all"
                            onChange={this.props.showAllChange}
                        />
                        <label
                            className="form-check-label font-weight-bold"
                            htmlFor="check-all"
                        >
                            Select All
                        </label>
                    </div>
                    <div>
                        <p className="font-weight-bold cursor m-0" onClick={this.props.clearAllChange}>Clear All</p>
                    </div>
                </div>
                <div className="checkbox-box mt-3">
                    {
                        countries
                            ? countries.map(country => (
                                <div className="form-check country" key={country}>
                                    <input
                                        className="form-check-input"
                                        defaultChecked={userCountries.indexOf(country) !== -1}
                                        type="checkbox"
                                        name={country}
                                        id={userCountries.indexOf(country) !== -1 ? this.props.ds_data[userCountries.indexOf(country)].id : null}
                                        onChange={this.props.onChangeCallback}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="defaultCheck1"
                                    >
                                        {country}
                                    </label>
                                </div>
                            ))
                            : <span>No country found</span>
                    }
                </div>
            </div>
        );
    }
}
