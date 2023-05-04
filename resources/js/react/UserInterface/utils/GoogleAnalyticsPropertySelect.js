import React, {Component} from 'react'
import {Redirect} from 'react-router';

import HttpClient from './HttpClient'

import Select from 'react-select';
import GooglePermissionPopup from './GooglePermissionPopup';
import {Modal, Popover, PopoverBody} from 'reactstrap';
import {uniqBy} from 'lodash';

export default class GoogleAnalyticsPropertySelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            allProperties: [],
            isAccountLinked: true,
            isPermissionPopupOpened: false,
            selectedProperties: [],
            showUpgradePopup: false
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.deleteKeyword = this.deleteKeyword.bind(this);
        this.searchGoogleAnalyticsProperties = this.searchGoogleAnalyticsProperties.bind(this);
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
            this.setState({allProperties: options});
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props != prevProps) {
            if (this.props.aProperties && this.props.aProperties.length) {
                this.searchGoogleAnalyticsProperties(' ', (options) => {
                    const currentSelectedProperties = this.props.aProperties.map(sO => {
                        return {
                            value: sO.value,
                            label: sO.label || options.find(gap => gap.value == sO.value)?.labelText,
                        }
                    });

                    this.setState({selectedProperties: currentSelectedProperties})
                });

            }
        }
    }

    deleteKeyword(propertyId) {
        // this.onChangeHandler(null);
        const filteredProperty = this.state.selectedProperties.filter(itm => itm.value != propertyId);
        this.setState({selectedProperties: filteredProperty});
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
                this.props.onChangeCallback2([]);
            }
        } else {
            if (this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: filteredProperty.map(sO => sO.value),
                        wasLastDataFetchingSuccessful: true
                    }
                });
            }

            if (this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: filteredProperty.map(sO => sO.value),
                        wasLastDataFetchingSuccessful: true
                    }
                });
            }
            if (this.props.onChangeCallback2) {
                this.props.onChangeCallback2(filteredProperty);
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
                                <span style={{background: "#2d9cdb"}} className="dot"></span>
                                <span className="text-truncate"
                                      style={{maxWidth: 400}}>{gap.name + ' ' + gap.google_analytics_account.name}</span>
                            </div>
                        )
                    };
                });
                callback(options);
            }, (err) => {
                if (err.response.status == 400) {
                    this.setState({isAccountLinked: false});
                }
            }).catch(err => {
            this.setState({errors: err, isLoading: false});
        });

    }

    onChangeHandler(sOption) {
        if (sOption.value === '') {
            return ''
        }

        let finalSelectedProperty = []
        if (this.props.multiple) {
            const selectedVal = sOption;
            finalSelectedProperty = uniqBy([...this.state.selectedProperties, ...selectedVal.map(itm => ({
                ...itm,
                value: itm.value,
                label: itm.labelText
            }))], 'value');
            this.setState({selectedProperties: finalSelectedProperty})
        } else {
            const selectedVal = sOption;
            finalSelectedProperty = [{
                ...selectedVal,
                value: selectedVal.value,
                label: selectedVal.labelText,
                wasLastDataFetchingSuccessful: true
            }]
            this.setState({selectedProperties: finalSelectedProperty})
        }

        if (
            (this.props.currentPricePlan.google_analytics_property_count < (
                    this.state.allProperties.filter(sO => sO.isInUse).length
                    + finalSelectedProperty.filter(sO => !sO.isInUse).length)
            )
            && (this.props.currentPricePlan.google_analytics_property_count !== 0)
        ) {
            this.setState({showUpgradePopup: true})

        } else {
            if (this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: finalSelectedProperty.map(sO => sO.value),
                        wasLastDataFetchingSuccessful: true
                    }
                });
            }

            if (!this.props.multiple) {
                this.props.onChangeCallback({
                    target: {
                        name: this.props.name,
                        value: finalSelectedProperty[0].value,
                        wasLastDataFetchingSuccessful: sOption.wasLastDataFetchingSuccessful
                    }
                });
            }

            if (this.props.onChangeCallback2) {
                this.props.onChangeCallback2(finalSelectedProperty);
            }
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>

        return (
            <>
                <div>
                    <Modal isOpen={this.state.showUpgradePopup} centered className="gaUpgradePopup"
                           toggle={() => this.setState({showUpgradePopup: false, upgradePopupType: ''})}>
                        <button onClick={() => this.setState({showUpgradePopup: false, upgradePopupType: ''})}
                                class="btn-closeUpgradePopup"><img src="/images/close.svg" alt="close icon"/></button>
                        <ga-upgrade-popup
                            heading={`<h1>Upgrade today to add <span>more properties</span></h1>`}
                            subHeading={`<p>and get access to all amazing features</p>`}
                            button={`<a href="https://calendly.com/crystal-ball/30min" target="_blank" class="btn-bookAdemo">Book a Demo</a>`}
                            bannerImg="/images/more-property-upgrade.svg"
                        >
                        </ga-upgrade-popup>

                    </Modal>

                    <div className="themeNewInputStyle position-relative inputWithIcon">
                        <i className="icon fa">
                            <img src='/icon-plus.svg'/>
                        </i>
                        <Select
                            menuPosition={'fixed'}
                            onFocus={(e) => {
                                if (this.props.onFocus) {
                                    this.props.onFocus();
                                }

                                if (!this.state.isAccountLinked) {
                                    let googlePermissionsHtml = "<div class='contentHolder'>";
                                    googlePermissionsHtml += '<h2>Let’s connect your Google Account</h2>';
                                    googlePermissionsHtml += '<p>Connect your google account to see all your data at one place, be able to filter data by property, see anomalies and analyze your data better</p>';
                                    googlePermissionsHtml += "</div>";

                                    swal.fire({
                                        iconHtml: '<figure class="m-0"><img src="/images/google-account.svg"></figure>',
                                        html: googlePermissionsHtml,
                                        width: 500,
                                        // confirmButtonClass: "m-0 p-0 border-0 rounded-0 bg-white",
                                        confirmButtonText: `Connect Google Account`,
                                        focusConfirm: false,
                                        // cancelButtonClass: "btn btn-secondary ml-5",
                                        showCloseButton: false,
                                        // showCancelButton: false,
                                        // cancelButtonText: 'Cancel',
                                        allowOutsideClick: true,
                                        backdrop: true,
                                        customClass: {
                                            popup: "confirmConnectionTo",
                                            htmlContainer: "confirmConnectionToContent",
                                            closeButton: 'btn-closeplanAlertPopup',
                                        },
                                    }).then(value => {
                                        if (value.isConfirmed) {
                                            // this.setState({ isPermissionPopupOpened: true });
                                            localStorage.setItem("frontend_redirect_to", window.location.pathname);
                                            window.location = "/settings/google-account/create?google_analytics_perm=true";
                                        }
                                    });

                                }
                            }}
                            loadOptions={this.searchGoogleAnalyticsProperties}
                            noOptionsMessage={() => {
                                return "No Property"
                            }}
                            className={`${this.props.className} ga-account-select-holder`}
                            styles={{
                                menu: (provided) => ({
                                    ...provided,
                                    width: 500,
                                }),
                            }}
                            name={this.props.name}
                            disabled={this.props.disabled}
                            // value={this.state.aProperties}
                            value={this.props.multiple ? [] : this.state.selectedProperties}
                            id={this.props.id}
                            isMulti={this.props.multiple}
                            isClearable={this.props.isClearable}
                            onChange={this.onChangeHandler}
                            options={this.state.allProperties}
                            isSearchable={true}
                            placeholder={this.props.placeholder}
                            filterOption={(option, inputValue) => {
                                if (!inputValue) return true;

                                const value = option.data.labelText.toLowerCase();
                                return value.includes(inputValue.toLowerCase());
                            }}
                            components={this.props.components}
                            onKeyDown={(e) => {
                                if (!this.state.isAccountLinked) {
                                    let googlePermissionsHtml = "<div class='contentHolder'>";
                                    googlePermissionsHtml += '<h2>Let’s connect your Google Account</h2>';
                                    googlePermissionsHtml += '<p>Connect your google account to see all your data at one place, be able to filter data by property, see anomalies and analyze your data better</p>';
                                    googlePermissionsHtml += "</div>";

                                    swal.fire({
                                        iconHtml: '<figure class="m-0"><img src="/images/google-account.svg"></figure>',
                                        html: googlePermissionsHtml,
                                        width: 500,
                                        // confirmButtonClass: "m-0 p-0 border-0 rounded-0 bg-white",
                                        confirmButtonText: `Connect Google Account`,
                                        focusConfirm: false,
                                        // cancelButtonClass: "btn btn-secondary ml-5",
                                        showCloseButton: false,
                                        // showCancelButton: false,
                                        // cancelButtonText: 'Cancel',
                                        allowOutsideClick: true,
                                        backdrop: true,
                                        customClass: {
                                            popup: "confirmConnectionTo",
                                            htmlContainer: "confirmConnectionToContent",
                                            closeButton: 'btn-closeplanAlertPopup',
                                        },
                                    }).then(value => {
                                        if (value.isConfirmed) {
                                            // this.setState({ isPermissionPopupOpened: true });
                                            localStorage.setItem("frontend_redirect_to", window.location.pathname);
                                            window.location = "/settings/google-account/create?google_analytics_perm=true";
                                        }
                                    });

                                }
                            }}
                        />
                        {
                            this.state.isPermissionPopupOpened ? <GooglePermissionPopup/> : ''
                        }
                    </div>


                    <div className='ga-analytics-property-selected'>
                        {this.state.selectedProperties.length && this.props.multiple ? <h4>
                            Selected properties: <span>(Click to remove)</span>
                        </h4> : null}
                        {this.state.selectedProperties.length && this.props.multiple ?
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
                                            style={{background: "#2d9cdb"}}
                                            className="dot"
                                        ></span>
                                            <span className="text-truncate ga-selected-label"
                                                  style={{maxWidth: 150}}>{itm.labelText || itm.label}</span>
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
                            </div> : null}
                    </div>
                </div>
            </>
        )
    }
}
