import React, {Component} from 'react'

import HttpClient from './HttpClient'

import Select from 'react-select';

export default class GoogleAnalyticsPropertySelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aProperties: [{value: "", label: "All Properties"}],
            allProperties: [],
            isAccountLinked: true
        };
        this.searchGoogleAnalyticsProperties = this.searchGoogleAnalyticsProperties.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    componentDidMount() {
        this.searchGoogleAnalyticsProperties(' ', (options) => {
            if (options.length) {
                if (this.props.autoSelectFirst) {
                    this.setState({aProperties: [{value: "", label: "Loading..."}]});
                    setTimeout(() => {
                        this.onChangeHandler(options[0]);
                    }, 5000);
                }
            }
            this.setState({allProperties: options});
        });

    }

    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            if (this.props.aProperties) {
                this.setState({aProperties: this.props.aProperties});
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
                        wasLastDataFetchingSuccessful: gap.was_last_data_fetching_successful
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
                allowOutsideClick: false
            }).then(value => {
                if (value.isConfirmed) {
                    
                    /*
                    * Show permissions popup
                    * */
                    
                    let googlePermissionsHtml = "<div class='text-center font-weight-bold'>Confirm the tools you'd like to activate</div>";
                    
                    googlePermissionsHtml += "<div class='text-left my-4'>";

                    googlePermissionsHtml += "<div class='form-check form-check-inline'>";
                    googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_analytics_perm">';
                    googlePermissionsHtml += '<label class="form-check-label" for="google_analytics_perm">Access to Google Analytics <i class="fa fa-exclamation-circle"></i></label>';
                    googlePermissionsHtml += '</div>';

                    googlePermissionsHtml += "<div class='form-check form-check-inline mt-2'>";
                    googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_search_console_perm">';
                    googlePermissionsHtml += '<label class="form-check-label" for="google_search_console_perm">Access to Google Search Console <i class="fa fa-exclamation-circle"></i></label>';
                    googlePermissionsHtml += '</div>';

                    googlePermissionsHtml += "<div class='form-check form-check-inline mt-2'>";
                    googlePermissionsHtml += '<input class="form-check-input" type="checkbox" id="google_ads_perm">';
                    googlePermissionsHtml += '<label class="form-check-label" for="google_ads_perm">Access to Google Ads <i class="fa fa-exclamation-circle"></i></label>';
                    googlePermissionsHtml += '</div>';

                    googlePermissionsHtml += '<div class="mt-4">';
                    googlePermissionsHtml += '<a href="https://www.crystalballinsight.com/privacy-policy" target="_blank" class="">See our privacy policy</a>';
                    googlePermissionsHtml += '</div>';

                    googlePermissionsHtml += "</div>";

                    swal.fire({
                        html: googlePermissionsHtml,
                        width: 500,
                        confirmButtonClass: "btn btn-primary",
                        cancelButtonClass: "btn btn-secondary",
                        confirmButtonText: "Connect",
                        showCloseButton: true,
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        allowOutsideClick: false
                    }).then(value => {
                        if (value.isConfirmed) {
                            let query_string_obj = {
                                'google_analytics_perm': document.getElementById('google_analytics_perm').checked,
                                'google_search_console_perm': document.getElementById('google_search_console_perm').checked,
                                'google_ads_perm': document.getElementById('google_ads_perm').checked,
                            }
                            let query_string = new URLSearchParams(query_string_obj).toString();
                            // Save pathname in this storage without domain name
                            localStorage.setItem("frontend_redirect_to", window.location.pathname);
                            window.location = "/settings/google-account/create?"+query_string;
                        }
                    });

                }
            });
        }


    }

    onChangeHandler(sOption) {
        if (sOption == null) {
            this.setState({aProperties: [{value: "", label: "All Properties"}]});
            if (this.props.multiple) this.props.onChangeCallback({
                target: {
                    name: this.props.name,
                    value: [""],
                    wasLastDataFetchingSuccessful: sOption.was_last_data_fetching_successful
                }
            });
            if (!this.props.multiple) this.props.onChangeCallback({
                target: {name: this.props.name, value: ""},
                wasLastDataFetchingSuccessful: sOption.was_last_data_fetching_successful
            });
            if (this.props.onChangeCallback2) (this.props.onChangeCallback2)([{value: "", label: "All Properties"}]);
        } else {
            // aProperties.push(sOption);
            let aProperties = null;
            if (this.props.multiple) {
                aProperties = sOption.filter(sO => sO.value !== "");
            } else {
                aProperties = sOption;
            }
            this.setState({aProperties: aProperties});
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
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>
        let aProperties = this.state.aProperties;

        // let selectedOptions;
        // if (this.props.multiple) {
        //     selectedOptions = allOptions.filter(aO => this.props.value.indexOf(aO.value) !== -1);
        // } else {
        //     selectedOptions = this.props.value;
        // }

        // const accountNotLinkedHtml = '' +
        //     '<div class="">' +
        //     '<img src="/images/imgpopup.png" class="img-fluid">' +
        //     '<div class="bg-light p-3">' +
        //     '<h1  class=" text-black mt-2 py-4">Let\'s Connect Your Google Account</h1>' +
        //     '<p style="line-height:23px; color: rgba(153,153,153,1.7) !important;font-family: \'Roboto\', sans-serif;" class="px-5 text-dark">' +
        //     'Connect your Google Account to see all your data in one place, be able to filter data by property, see anomalies and analyze your data better.' +
        //     '</p>' +
        //     '<p style="font-size:14px; color: rgba(153,153,153,1.7) !important;font-family: \'Roboto\', sans-serif;" class="text-dark">' +
        //     'We do not share any data from your Google Accounts (<span class="text-primary"><a href="https://www.crystalballinsight.com/privacy-policy" target="_blank">see Privacy Policy</a></span>)' +
        //     '</p>' +
        //     '</div>' +
        //     '</div>'

        return (
            <Select
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
                onFocus={(e) => {
                    // if (!this.state.isAccountLinked) {
                    //     /*
                    //     * Show new google analytics account popup
                    //     * */
                    //     swal.fire({
                    //         html: accountNotLinkedHtml,
                    //         width: 700,
                    //         customClass: {
                    //             popup: 'bg-light pb-5',
                    //             htmlContainer: 'm-0',
                    //         },
                    //         confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                    //         confirmButtonText: "Connect"+ "<i class='ml-2 fa fa-caret-right'> </i>"
                    //     }).then(value => {
                    //         if (value.isConfirmed) {
                    //             // Save pathname in this storage without domain name
                    //             localStorage.setItem("frontend_redirect_to", window.location.pathname);
                    //             window.location = "/settings/google-account/create";
                    //         }
                    //     });
                    // }
                    this.props.onFocus(e);
                }}
            />
        )
    }
}
