import React from 'react';
import HttpClient from '../utils/HttpClient';

export default class countries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            isBusy: false,
            errors: '',
            searchText: ''
        }
        this.handleClick = this.handleClick.bind(this)
        this.selectAllShowing = this.selectAllShowing.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true })
            HttpClient.get('countries').then(resp => {
                this.setState({ isBusy: false, countries: resp.data.countries })
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: err.response })
            }).catch(err => {
                console.log(err);
                this.setState({ isBusy: false, errors: err })
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ re_render: new Date() })
        }
    }

    handleClick(e) {
        if (e.target.checked) {
            (this.props.onCheckCallback)({ code: 'holidays', name: 'Holiday', country_name: e.target.name, retail_marketing_id: null })
        } else {
            (this.props.onUncheckCallback)(e.target.id, 'holidays')
        }
    }

    selectAllShowing(e) {
        let userCountries = this.props.ds_data.map(ds => ds.country_name);
        this.state.countries.map(country => {
            if (country !== null) if (country.toLowerCase().indexOf(this.state.searchText) > -1 || this.state.searchText.length == 0) {
                if (userCountries.indexOf(country) == -1) {
                    (this.props.onCheckCallback)({ code: 'holidays', name: 'Holiday', country_name: country, retail_marketing_id: null })
                }
            }
        })
    }

    clearAll(e) {
        let userCountries = this.props.ds_data.map(ds => ds.country_name);
        this.state.countries.map(country => {
            if (country !== null) {
                if (userCountries.indexOf(country) !== -1) {
                    (this.props.onUncheckCallback)(this.props.ds_data[userCountries.indexOf(country)].id, 'holidays')
                }
            }
        })
    }

    render() {
        let countries = this.state.countries;
        let userCountries = this.props.ds_data.map(ds => ds.country_name);
        return (
            <div className="countries-form">
                <h4 className="gaa-text-primary">
                    Select Countries for {this.props.sectionTitle}
                </h4>
                <div className="input-group search-input-box mb-3">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search"
                        value={this.state.searchText}
                        name="searchText"
                        onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
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
                            onChange={this.selectAllShowing}
                        />
                        <label
                            className="form-check-label font-weight-bold"
                            htmlFor="check-all"
                        >
                            Select All
                        </label>
                    </div>
                    <div>
                        <p className="font-weight-bold cursor m-0" onClick={this.clearAll}>Clear All</p>
                    </div>
                </div>
                <div className="checkbox-box mt-3">
                    {
                        countries
                            ? countries.map(country => {
                                if (country !== null) if (country.toLowerCase().indexOf(this.state.searchText) > -1 || this.state.searchText.length == 0) return <div className="form-check country" key={country}>
                                    <input
                                        className="form-check-input"
                                        checked={userCountries.indexOf(country) !== -1}
                                        type="checkbox"
                                        name={country}
                                        id={userCountries.indexOf(country) !== -1 ? this.props.ds_data[userCountries.indexOf(country)].id : null}
                                        onChange={this.handleClick}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="defaultCheck1"
                                    >
                                        {country}
                                    </label>
                                </div>
                            })
                            : <span>No country found</span>
                    }
                </div>
            </div>
        );
    }
}
