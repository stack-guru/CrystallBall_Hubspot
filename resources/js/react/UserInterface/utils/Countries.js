import React from "react";
import HttpClient from "../utils/HttpClient";
import GoogleAnalyticsPropertySelect from "../utils/GoogleAnalyticsPropertySelect";
import Toast from "./Toast";
import {CustomTooltip} from "../components/annotations/IndexAnnotation";

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
            this.props.updateTrackingStatus(true)
            this.props.updateUserService({ target: {
                    name: "is_ds_holidays_enabled",
                    checked: true,
                },
            });
        } else {
            this.props.onUncheckCallback(e.target.id, "holidays");
        }
    }

    selectAllShowing(e) {
        let userCountries = this.props.ds_data.map(ds => ds.country_name);
        const data = [];
        this.state.countries.forEach(country => {
            if (country !== null) if (country.toLowerCase().indexOf(this.state.searchText) > -1 || this.state.searchText.length == 0) {
                if (userCountries.indexOf(country) == -1) {
                    data.push({ code: 'holidays', name: 'Holiday', country_name: country, retail_marketing_id: null })
                    // (this.props.onCheckCallback)({ code: 'holidays', name: 'Holiday', country_name: country, retail_marketing_id: null })
                }
            }
        });
        this.props.onCheckAllCallback(data);
        this.props.updateTrackingStatus(true)
        this.props.updateUserService({ target: {
                name: "is_ds_holidays_enabled",
                checked: true,
            },
        });
    }

    clearAll(e) {
        let userCountries = this.props.ds_data.map(ds => ds.country_name);
        const data = [];
        this.state.countries.forEach(country => {
            if (country !== null) {
                if (userCountries.indexOf(country) !== -1) {
                    data.push(
                        this.props.ds_data[userCountries.indexOf(country)].id
                    );
                }
            }
        });
        this.props.onUncheckAllCallback(data, 'holidays');
        this.props.updateTrackingStatus(false)
        this.props.updateUserService({ target: {
                name: "is_ds_holidays_enabled",
                checked: false,
            },
        });
    }

    render() {
        let countries = this.state.countries;
        let userCountries = this.props.ds_data.map((ds) => ds.country_name);
        return (

            <div className="apps-bodyContent rmd-content">
                <h4>Select Countries for {this.props.sectionTitle}</h4>
                <div className="d-flex align-items-center mb-3">
                    <div className="w-100 pr-3">
                        <div className="input-group">
                            <input type="text" className="form-control search-input" placeholder="Search" value={this.state.searchText} name="searchText" onChange={(e) => this.setState({[e.target.name]: e.target.value,})} />
                            <div className="input-group-append"><i className="ti-search"></i></div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center w-100 justify-content-end">
                        <span className="betweentext">for</span>
                        <GoogleAnalyticsPropertySelect
                            className="themeNewselect hide-icon"
                            name="ga_property_id"
                            id="ga_property_id"
                            currentPricePlan={this.props.user.price_plan}
                            value={this.props.gaPropertyId}
                            onChangeCallback={(gAP) => {
                                this.props.updateGAPropertyId(gAP.target.value || null)

                                const currentValue = userCountries.length
                                if (currentValue) {
                                    // this.handleClick({target: {checked: true, name: userCountries[0]}});
                                } else {
                                    // Toast.fire({
                                    //     icon: 'success',
                                    //     title: "Successfully saved holidays settings.",
                                    // });
                                }
                            }}
                            placeholder="Select GA Properties"
                            isClearable={true}
                            onDeleteCallback={this.props.onUncheckCallback}
                        />
                    </div>
                </div>
                <div className="grid2layout">
                    <div className="column">
                        <div className="white-box">
                            <div className="d-flex flex-column border-bottom pb-3 mb-3">
                                <div className="checkBoxList">
                                    <span className="btn-clearAll text-primary cursor-pointer" onClick={this.selectAllShowing}>Select All</span>
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
                            <div className="checkBoxList">
                                {countries ? ( countries.map((country) => { if (userCountries.indexOf(country) === -1) { return null; }
                                    if (country !== null) {
                                            let gaProperty = this.props.ds_data[userCountries.indexOf(country)]
                                            let gaPropertyName = gaProperty?.ga_property_name
                                            if (!gaPropertyName) {
                                                gaPropertyName = 'All Properties';
                                            }
                                            return (
                                                <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor="defaultCheck1" key={country}>
                                                    <input checked={userCountries.indexOf(country) !== -1 } type="checkbox" name={country} id={userCountries.indexOf(country) !== -1 ? gaProperty.id : null } onChange={ this.handleClick }/>
                                                    <span className="d-flex w-100 justify-content-between">
                                                        <div>{country}</div>
                                                        {gaProperty.id === this.state.editSelected
                                                            ?
                                                            <div className="d-flex text-nowrap align-items-center">
                                                                <GoogleAnalyticsPropertySelect
                                                                    className="w-175px themeNewselect hide-icon"
                                                                    name="ga_property_id"
                                                                    id="ga_property_id"
                                                                    currentPricePlan={this.props.user.price_plan}
                                                                    value={this.props.gaPropertyId}
                                                                    onChangeCallback={(gAP) => {
                                                                        this.setState({ editSelected: '' })
                                                                        this.props.userDataSourceUpdateHandler(gaProperty.id, gAP.target.value || null)
                                                                    }}
                                                                    placeholder="Select GA Properties"
                                                                    isClearable={true}
                                                                />
                                                                <i className="ml-2 icon fa" onClick={() => this.setState({ editSelected: null })}>
                                                                    <img className="w-14px" src='/close-icon.svg' />
                                                                </i>
                                                            </div>
                                                            :
                                                            <div className="d-flex text-nowrap">
                                                                <div className="dd-tooltip d-flex">
                                                                    <CustomTooltip tooltipText={gaPropertyName}
                                                                                    maxLength={50}>
                                                                        <span
                                                                            style={{background: "#2d9cdb"}}
                                                                            className="dot"
                                                                        ></span>
                                                                        <div className="pl-2 ellipsis-prop">{gaPropertyName}</div>
                                                                    </CustomTooltip>
                                                                </div>
                                                                <i className="ml-2 icon fa" onClick={() => this.setState({ editSelected: gaProperty.id })}>
                                                                    <img className="w-20px" src='/icon-edit.svg' />
                                                                </i>
                                                            </div>
                                                        }
                                                    </span>
                                                </label>
                                            );
                                        }
                                    })
                                ) : (

                                    <span>No country found</span>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
