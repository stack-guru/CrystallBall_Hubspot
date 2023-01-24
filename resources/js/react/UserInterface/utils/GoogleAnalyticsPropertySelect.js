import React, { Component } from 'react'
import { Redirect } from 'react-router';

import HttpClient from './HttpClient'

import Select from 'react-select';
import GooglePermissionPopup from './GooglePermissionPopup';
import { Popover, PopoverBody } from 'reactstrap';

export default class GoogleAnalyticsPropertySelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aProperties: [{ value: "", label: "All Properties" }],
            allProperties: [],
            isAccountLinked: true,
            isPermissionPopupOpened: false,
        };
        this.searchGoogleAnalyticsProperties = this.searchGoogleAnalyticsProperties.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        this.searchGoogleAnalyticsProperties(' ', (options) => {
            if (options.length) {
                if (this.props.autoSelectFirst) {
                    this.setState({ aProperties: [{ value: "", label: "Loading..." }] });
                    setTimeout(() => {
                        this.onChangeHandler(options[0]);
                    }, 5000);
                }
            }
            this.setState({ allProperties: options });
        });


    }

    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            if (this.props.aProperties) {
                this.setState({ aProperties: this.props.aProperties });
            }
        }
    }

    searchGoogleAnalyticsProperties(keyword, callback) {
        HttpClient.get('settings/google-analytics-property?keyword=' + keyword)
            .then((response) => {
                let gaps = response.data.google_analytics_properties;
                let options = gaps.map(gap => {
                    return {
                        value: gap.id,
                        label: gap.name + ' ' + gap.google_analytics_account.name,
                        wasLastDataFetchingSuccessful: gap.was_last_data_fetching_successful,
                        isInUse: gap.is_in_use,
                    };
                });
                callback(options);
            }, (err) => {
                if (err.response.status == 400) {
                    this.setState({ isAccountLinked: false });
                }
            }).catch(err => {
                this.setState({ errors: err, isLoading: false });
            });

    }

    onChangeHandler(sOption) {
        console.log(sOption);

        if (sOption == null) {
            this.setState({ aProperties: [{ value: "", label: "All Properties" }] });
            if (this.props.multiple) this.props.onChangeCallback({
                target: {
                    name: this.props.name,
                    value: [""],
                    wasLastDataFetchingSuccessful: true
                }
            });
            if (!this.props.multiple) this.props.onChangeCallback({
                target: { name: this.props.name, value: "" },
                wasLastDataFetchingSuccessful: true
            });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)([{ value: "", label: "All Properties" }]);
        } else {
            let tempProperties = sOption;
            if (!this.props.multiple) {
                tempProperties = [sOption];
            }
            if (
                (this.props.currentPricePlan.google_analytics_property_count < (
                    this.state.allProperties.filter(sO => sO.isInUse).length
                    + tempProperties.filter(sO => sO.value !== "").filter(sO => !sO.isInUse).length)
                )
                && (this.props.currentPricePlan.google_analytics_property_count !== 0)
            ) {
                const accountNotLinkedHtml = '' +
                    '<div class="">' +
                    '<img src="/images/property-upgrade-modal.jpg" class="img-fluid">' +
                    '</div>'
                /*
                * Show new google analytics account popup
                * */
                swal.fire({
                    html: accountNotLinkedHtml,
                    width: 700,
                    customClass: {
                        popup: 'custom_bg pb-5',
                        htmlContainer: 'm-0',
                    },
                    confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                    confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

                }).then(value => {
                    this.setState({ redirectTo: "/settings/price-plans" });
                });
            }
            let aProperties = null;
            if (this.props.multiple) {
                aProperties = sOption.filter(sO => sO.value !== "");
            } else {
                aProperties = sOption;
            }
            this.setState({ aProperties: aProperties });
            if (this.props.multiple) (this.props.onChangeCallback)({
                target: {
                    name: this.props.name,
                    value: sOption.filter(sO => sO.value !== "").map(sO => sO.value),
                    wasLastDataFetchingSuccessful: sOption.wasLastDataFetchingSuccessful
                }
            });
            if (!this.props.multiple) (this.props.onChangeCallback)({
                target: {
                    name: this.props.name,
                    value: sOption.value,
                    wasLastDataFetchingSuccessful: sOption.wasLastDataFetchingSuccessful
                }
            });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)(aProperties);
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        let aProperties = this.state.aProperties;
        return (
            <>
                <div className='grid2layout'>
                    <div className="themeNewInputStyle position-relative inputWithIcon">
                        <i class="fa fa-plus"></i>
                        <Select
                            onFocus={this.props.onFocus}
                            loadOptions={this.searchGoogleAnalyticsProperties}
                            noOptionsMessage={() => {
                                return "Enter chars to search"
                            }}
                            className={this.props.className}
                            name={this.props.name}
                            disabled={this.props.disabled}
                            value={this.state.aProperties}
                            id={this.props.id}
                            isMulti={this.props.multiple}
                            isClearable={this.props.isClearable}
                            onChange={this.onChangeHandler}
                            options={this.state.allProperties}
                            isSearchable={true}
                            placeholder={this.props.placeholder}
                            components={this.props.components}
                            onKeyDown={(e) => {
                                if (!this.state.isAccountLinked) {
                                    const accountNotLinkedHtml = '' +
                                        '<div class="">' +
                                        '<img src="/images/imgpopup.png" class="img-fluid">' +
                                        '<div class="bg-light p-3">' +
                                        '<h1  class=" text-black mt-2 py-4">Let\'s Connect Your Google Account</h1>' +
                                        '<p style="line-height:23px; color: rgba(153,153,153,1.7) !important;font-family: \'Roboto\', sans-serif;" class="px-5 text-dark">' +
                                        'Connect your Google Account to see all your data in one place, be able to filter data by property, see anomalies and analyze your data better.' +
                                        '</p>' +
                                        '<p style="font-size:14px; color: rgba(153,153,153,1.7) !important;font-family: \'Roboto\', sans-serif;" class="text-dark">' +
                                        'We do not share any data from your Google Accounts (<span class="text-primary"><a href="https://www.crystalballinsight.com/privacy-policy" target="_blank">see Privacy Policy</a></span>)' +
                                        '</p>' +
                                        '</div>' +
                                        '</div>'
                                    /*
                                    * Show new google analytics account popup
                                    * */
                                    swal.fire({
                                        html: accountNotLinkedHtml,
                                        width: 700,
                                        customClass: {
                                            popup: 'bg-light pb-5',
                                            htmlContainer: 'm-0',
                                        },
                                        confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                        confirmButtonText: "Connect" + "<i class='ml-2 fa fa-caret-right'> </i>",

                                    }).then(value => {
                                        if (value.isConfirmed) {
                                            this.setState({ isPermissionPopupOpened: true });
                                        }
                                    });
                                }
                            }}
                        />
                        {
                            this.state.isPermissionPopupOpened ? <GooglePermissionPopup /> : ''
                        }
                    </div>
                </div>

                <div>
                    <h4>
                        Selected properties: <span>(Click to remove)</span>
                    </h4>
                    <div className="d-flex keywordTags">
                        {aProperties.map(itm => {
                            if (itm.value === "") {
                                return null;
                            }
                            return (<>
                                <button
                                    onClick={() =>
                                        this.setState({
                                            activeDeletePopover: itm.value,
                                        })
                                    }
                                    id={"gAK-" + itm.value}
                                    type="button"
                                    className="keywordTag"
                                    key={itm.value}
                                    user_data_source_id={itm.value}
                                >
                                    <span
                                        style={{ background: "#2d9cdb" }}
                                        className="dot"
                                    ></span>
                                    <span className="text-truncate" style={{ maxWidth: 150 }}>{itm.label}</span>
                                </button>

                                <Popover
                                    placement="top"
                                    target={"gAK-" + itm.value}
                                    isOpen={
                                        this.state.activeDeletePopover ===
                                        itm.value
                                    }
                                >
                                    <PopoverBody web_monitor_id={itm.value}>
                                        Are you sure you want to remove "
                                        {itm.label}"?.
                                    </PopoverBody>
                                    <button
                                        onClick={this.deleteKeyword}
                                        key={itm.value}
                                        user_data_source_id={itm.value}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() =>
                                            this.setState({
                                                activeDeletePopover: null,
                                            })
                                        }
                                    >
                                        No
                                    </button>
                                </Popover>
                            </>)
                        })}
                    </div>
                </div>
            </>
        )
    }
}
