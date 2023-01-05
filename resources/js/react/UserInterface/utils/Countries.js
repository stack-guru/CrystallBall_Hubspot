import React from "react";
import HttpClient from "../utils/HttpClient";

export default class countries extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            isBusy: false,
            errors: "",
            searchText: "",
        };
        this.handleClick = this.handleClick.bind(this);
        this.selectAllShowing = this.selectAllShowing.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get("countries")
                .then(
                    (resp) => {
                        this.setState({
                            isBusy: false,
                            countries: resp.data.countries,
                        });
                    },
                    (err) => {
                        this.setState({
                            isBusy: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ re_render: new Date() });
        }
    }

    handleClick(e) {
        if (e.target.checked) {
            this.props.onCheckCallback({
                code: "holidays",
                name: "Holiday",
                country_name: e.target.name,
                retail_marketing_id: null,
            });
        } else {
            this.props.onUncheckCallback(e.target.id, "holidays");
        }
    }

    selectAllShowing(e) {
        let userCountries = this.props.ds_data.map((ds) => ds.country_name);
        this.state.countries.map((country) => {
            if (country !== null)
                if (
                    country.toLowerCase().indexOf(this.state.searchText) > -1 ||
                    this.state.searchText.length == 0
                ) {
                    if (userCountries.indexOf(country) == -1) {
                        this.props.onCheckCallback({
                            code: "holidays",
                            name: "Holiday",
                            country_name: country,
                            retail_marketing_id: null,
                        });
                    }
                }
        });
    }

    clearAll(e) {
        let userCountries = this.props.ds_data.map((ds) => ds.country_name);
        this.state.countries.map((country) => {
            if (country !== null) {
                if (userCountries.indexOf(country) !== -1) {
                    this.props.onUncheckCallback(
                        this.props.ds_data[userCountries.indexOf(country)].id,
                        "holidays"
                    );
                }
            }
        });
    }

    render() {
        let countries = this.state.countries;
        let userCountries = this.props.ds_data.map((ds) => ds.country_name);
        return (
            <div className="apps-bodyContent grid2layout">
                <div className="column">
                    <div className="white-box">
                        <h4>Select Countries for {this.props.sectionTitle}</h4>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control search-input" placeholder="Search" value={this.state.searchText} name="searchText" onChange={(e) => this.setState({[e.target.name]: e.target.value,})} />
                            <div className="input-group-append"><i className="ti-search"></i></div>
                        </div>
                        <div className="d-flex flex-column border-bottom pb-3 mb-3">
                            <div className="checkBoxList">
                                <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor="check-all">
                                    <input type="checkbox" id="check-all" onChange={this.selectAllShowing}/>
                                    <span>Select All</span>
                                </label>
                            </div>
                        </div>
                        <div className="checkBoxList">
                            {countries ? (
                                countries.map((country) => {
                                    if ( userCountries.indexOf(country) !== -1) {
                                        return null;
                                    }
                                    if (country !== null)
                                        if (country.toLowerCase().indexOf(this.state.searchText) > -1 || this.state.searchText.length == 0)
                                            return (
                                                <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor="defaultCheck1" key={country}>
                                                    <input checked={userCountries.indexOf(country) !== -1} type="checkbox" name={country} id={userCountries.indexOf(country) !== -1 ? this.props.ds_data[userCountries.indexOf(country)].id : null} onChange={this.handleClick}/>
                                                    <span>{country}</span>
                                                </label>
                                            );
                                })
                            ) : (
                                <span>No country found</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="column">
                    <div className="gray-box">
                        <div className="boxTitleBtn d-flex justify-content-between">
                            <h4>Selected Countries</h4>
                            <span className="btn-clearAll" onClick={this.clearAll}>Clear All</span>
                        </div>
                        {countries ? ( countries.map((country) => { if (userCountries.indexOf(country) === -1) { return null; }
                            if (country !== null)
                                if (country.toLowerCase().indexOf(this.state.searchText) > -1 || this.state.searchText.length == 0)
                                    <div className="checkBoxList">
                                        return (
                                            <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor="defaultCheck1" key={country}>
                                                <input checked={userCountries.indexOf(country) !== -1 } type="checkbox" name={country} id={userCountries.indexOf(country) !== -1 ? this.props.ds_data[userCountries.indexOf(country)].id : null } onChange={ this.handleClick }/>
                                                <span>{country}</span>
                                            </label>
                                        );
                                    </div>
                            })
                        ) : (
                            <span>No country found</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
