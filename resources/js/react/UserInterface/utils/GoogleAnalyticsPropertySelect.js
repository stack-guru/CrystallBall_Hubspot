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
            allProperties: [],
            isAccountLinked: true,
            isPermissionPopupOpened: false,
            selectedProperties: []
        };
        this.searchGoogleAnalyticsProperties = this.searchGoogleAnalyticsProperties.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.deleteKeyword = this.deleteKeyword.bind(this);
    }

    componentDidMount() {
        this.searchGoogleAnalyticsProperties(' ', (options) => {
            if (options.length) {
                if (this.props.autoSelectFirst) {
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
                this.setState({ selectedProperties: this.props.aProperties });
            }
        }
    }

    deleteKeyword(propertyId) {
        // this.onChangeHandler(null);
        const filteredProperty = this.state.selectedProperties.filter(itm => itm.value != propertyId);
        this.setState({ selectedProperties: filteredProperty });

        if (filteredProperty.length === 0) {
            if (this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: [""],
                        wasLastDataFetchingSuccessful: true
                    }
                });
            }

            if (this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: [""],
                        wasLastDataFetchingSuccessful: true
                    }
                });
            }

            if (this.props.onChangeCallback2) {
                this.props.onChangeCallback2([{ value: "", label: "All Properties" }]);
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
                        labelText: gap.name + ' ' + gap.google_analytics_account.name,
                        wasLastDataFetchingSuccessful: gap.was_last_data_fetching_successful,
                        isInUse: gap.is_in_use,
                        label: (
                            <div className="d-flex propertyLabel">
                                <span style={{ background: "#2d9cdb" }} className="dot"></span>
                                <span className="text-truncate" style={{ maxWidth: 150 }}>{gap.name + ' ' + gap.google_analytics_account.name}</span>
                            </div>
                        )
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
        if(sOption.value === '') {
            return ''
        }

        if (this.props.multiple) {
            const selectedVal = sOption;
            this.setState({ selectedProperties: [...this.state.selectedProperties, ...selectedVal.map(itm => ({ ...itm, value: itm.value, label: itm.labelText }))] })
        } else {
            const selectedVal = sOption[0];
            this.setState({ selectedProperties: [{ ...selectedVal, value: selectedVal.value, label: selectedVal.labelText, wasLastDataFetchingSuccessful: true }] })
        }

        if (
            (this.props.currentPricePlan.google_analytics_property_count < (
                this.state.allProperties.filter(sO => sO.isInUse).length
                + this.state.selectedProperties.filter(sO => !sO.isInUse).length)
            )
            && (this.props.currentPricePlan.google_analytics_property_count !== 0)
        ) {
            const accountNotLinkedHtml = '' +
                '<div class="">' +
                '<img src="/images/property-upgrade-modal.png" class="img-fluid">' +
                '</div>'
            /*
            * Show new google analytics account popup
            * */
            swal.fire({
                html: accountNotLinkedHtml,
                width: 1000,
                showCancelButton: true,
                showCloseButton: true,
                customClass: {
                    popup: "themePlanAlertPopup",
                    htmlContainer: "themePlanAlertPopupContent",
                    closeButton: 'btn-closeplanAlertPopup',
                },
                cancelButtonClass: "btn-bookADemo",
                cancelButtonText: "Book a Demo",
                confirmButtonClass: "btn-subscribeNow",
                confirmButtonText: "Subscribe now",

            }).then(value => {
                if (value.isConfirmed) window.location.href = '/settings/price-plans'
            });

        } else {
            if (this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: this.state.selectedProperties.map(sO => sO.value),
                        wasLastDataFetchingSuccessful: true
                    }
                });
            }

            if (!this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: this.state.selectedProperties[0].value,
                        wasLastDataFetchingSuccessful: sOption.wasLastDataFetchingSuccessful
                    }
                });
            }

            if (this.props.onChangeCallback2) {
                this.props.onChangeCallback2(this.state.selectedProperties);
            }
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        return (
            <>
                <div>
                    <div className="themeNewInputStyle position-relative inputWithIcon">
                        <i className="icon fa"><img src='/icon-plus.svg'/></i>
                        <Select
                            onFocus={this.props.onFocus}
                            loadOptions={this.searchGoogleAnalyticsProperties}
                            noOptionsMessage={() => {
                                return "No Property"
                            }}
                            className={this.props.className}
                            name={this.props.name}
                            disabled={this.props.disabled}
                            // value={this.state.aProperties}
                            value={[]}
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


                    <div className='ga-analytics-property-selected'>
                        {this.state.selectedProperties.length ? <h4>
                            Selected properties: <span>(Click to remove)</span>
                        </h4>: null}
                        <div className="d-flex keywordTags mt-3">
                            {this.state.selectedProperties.map(itm => {
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
                                        <span className="text-truncate ga-selected-label" style={{ maxWidth: 150 }}>{itm.labelText}</span>
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
                                            Are you sure you want to remove "{itm.labelText || itm.label}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={() => this.deleteKeyword(itm.value)}
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
                </div>
            </>
        )
    }
}
