import React from "react";
import HttpClient from "./HttpClient";
import FacebookPagesSelect from "./FacebookPagesSelect";
import GoogleAnalyticsPropertySelect from "./GoogleAnalyticsPropertySelect";
import {CustomTooltip} from "../components/annotations/IndexAnnotation";
import Toast from "../utils/Toast";

import {
    Popover,
    PopoverBody,
} from "reactstrap";
export default class FacebookTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            gaPropertyId: null,
            gaPropertyName: null,
            editProperty: null,
            errors: "",
            facebook_pages: [],
            selected_facebook_pages: [],
            when_new_post_on_facebook: true,
            when_new_ad_compaing_launched: true,
            when_ad_compaign_ended: true,
            when_changes_on_ad_compaign: true,

            is_post_likes_tracking_on: true,
            is_post_comments_tracking_on: true,
            is_post_views_tracking_on: true,
            is_post_shares_tracking_on: true,
            configuration_id: null,

            when_post_reach_likes: 1000,
            when_post_reach_comments: 1000,
            when_post_reach_shares: 1000,
            when_post_reach_views: 1000,
            configurations: [],
            activeDeletePopover: null
        };

        this.changePageHandler = this.changePageHandler.bind(this);
        this.runjob = this.runjob.bind(this);
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.fetchConfigurations = this.fetchConfigurations.bind(this);
        this.deleteSelected = this.deleteSelected.bind(this);
    }

    deleteSelected = (payload) => {

        HttpClient.delete(`/data-source/remove-facebook-tracking-configuration/${payload.id}`)
            .then(
                () => {
                    this.fetchConfigurations();
                    Toast.fire({
                        icon: 'success',
                        title: "Facebook configuration deleted successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while delete exists Facebook configuration.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while delete exists Facebook configuration.",
                });
            });

    }

    showConfirm = () => {

        const _this = this;
        // this.props.closeModal();
        swal.fire({
            iconHtml: `<img src="/${(this.props.serviceName || '').toLowerCase()}-small.svg">`,
            showCloseButton: true,
            title: `Connect with ${ this.props.serviceName }`,
            text: `Connect your ${ this.props.serviceName } account to create automatic annotations for commits`,
            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
            confirmButtonText: `<span class='text-white'><i class='mr-2 fa fa-${ this.props.serviceName.toLowerCase() }'> </i>${ this.props.serviceName }</span>`,
            customClass: {
                htmlContainer: "py-3",
            },
            customClass: {
                popup: "popupAlert",
                closeButton: "closeButtonTwitterAlert",
            },
        }).then( result => {
            if( result.isConfirmed ) {
                location.href = `/socialite/${ this.props.serviceName.toLowerCase() }`;
                localStorage.setItem("repo", this.props.serviceName);
            }
        });
    }

    componentDidMount() {
        this.fetchConfigurations();
    }

    fetchConfigurations() {
        /*
        * this function will fetch configurations for given user
        * */
        this.setState({isBusy: true})
        HttpClient.get('/data-source/get-facebook-tracking-configurations').then(resp => {
            this.setState({
                configurations: resp.data.configurations
                // selected_facebook_pages: resp.data.selected_pages,
                // when_ad_compaign_ended: resp.data.when_ad_compaign_ended,
                // when_changes_on_ad_compaign: resp.data.when_changes_on_ad_compaign,
                // when_new_ad_compaing_launched: resp.data.when_new_ad_compaign_launched,
                // when_new_post_on_facebook: resp.data.when_new_post_on_facebook,
                // when_post_reach_comments: resp.data.when_post_reach_comments,
                // when_post_reach_likes: resp.data.when_post_reach_likes,
                // when_post_reach_shares: resp.data.when_post_reach_shares,
                // when_post_reach_views: resp.data.when_post_reach_views,

                // is_post_likes_tracking_on: resp.data.is_post_likes_tracking_on,
                // is_post_comments_tracking_on: resp.data.is_post_comments_tracking_on,
                // is_post_views_tracking_on: resp.data.is_post_views_tracking_on,
                // is_post_shares_tracking_on: resp.data.is_post_shares_tracking_on,
                // gaPropertyId: resp.data.ga_property_id,
                // gaPropertyName: resp.data.gaPropertyName,
                // configuration_id: resp.data.configuration_id

            });
            document.getElementById('when_new_post_on_facebook').checked = true;
            document.getElementById('new_ad_compaign_launched').checked = true;
            document.getElementById('an_ad_compaign_ended').checked = true;
            document.getElementById('changes_on_ad_compaign').checked = true;
            document.getElementById('post_likes').value = 1;
            document.getElementById('post_comments').value = 1;
            document.getElementById('post_views').value = 1;
            document.getElementById('post_shares').value = 1;

            document.getElementById('is_post_likes_tracking_on_checkbox').checked = true;
            document.getElementById('is_post_comments_tracking_on_checkbox').checked = true;
            document.getElementById('is_post_views_tracking_on_checkbox').checked = true;
            document.getElementById('is_post_shares_tracking_on_checkbox').checked = true;

        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    onSubmitHandler() {
        let form_data = {
            selected_facebook_pages: this.state.selected_facebook_pages,
            when_new_post_on_facebook: this.state.when_new_post_on_facebook,
            when_new_ad_campaign_launched: this.state.when_new_ad_compaing_launched,
            when_ad_campaign_ended: this.state.when_ad_compaign_ended,
            when_changes_on_ad_campaign: this.state.when_changes_on_ad_compaign,

            when_post_reach_likes: this.state.when_post_reach_likes,
            when_post_reach_comments: this.state.when_post_reach_comments,
            when_post_reach_shares: this.state.when_post_reach_shares,
            when_post_reach_views: this.state.when_post_reach_views,

            is_post_likes_tracking_on: this.state.is_post_likes_tracking_on,
            is_post_comments_tracking_on: this.state.is_post_comments_tracking_on,
            is_post_views_tracking_on: this.state.is_post_views_tracking_on,
            is_post_shares_tracking_on: this.state.is_post_shares_tracking_on,

            ga_property_id: this.state.gaPropertyId,
        }

        HttpClient.post('/data-source/save-facebook-tracking-configurations', form_data).then(resp => {
            this.setState({facebook_pages: resp.data.facebook_pages, isBusy: false, gaPropertyName: resp.data.gaPropertyName, configuration_id: true, editProperty: false});
            if (!this.state.configurations.length) {
                this.props.serviceStatusHandler({ target: { name: 'is_ds_facebook_tracking_enabled', value: true, checked: true }})
            }
            this.props.loadUserDataSources();
            this.fetchConfigurations();
            Toast.fire({
                icon: 'success',
                title: 'Stored successfully!'
            })
            this.runjob();
        }, (err) => {
            Toast.fire({
                icon: 'error',
                title: err.response.data.message
            })

            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            console.log(err)
            this.setState({isBusy: false, errors: err});
        });
    }

    runjob() {
        HttpClient.post('/data-source/run-facebook-job').then(resp => {
        })
    }

    changePageHandler(val) {
        this.setState({
            selected_facebook_pages: val
        })
    }

    render() {
        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="weather_alert_cities-form">
                    <div className="d-flex mb-2">
                        <div className="w-50">
                        <label>Select Facebook Pages</label>
                        <FacebookPagesSelect className="gray_clr" multiple name="facebook_page" id="facebook_page"
                            value={this.state.selected_facebook_pages}
                            onChangeCallback={this.changePageHandler}
                            placeholder="Select Facebook Page"/>
                        </div>
                        <div className="w-86px">
                            <label>&nbsp;</label>
                            <div className="pt-2">
                                <div className="dd-tooltip">
                                <CustomTooltip tooltipText={"Add more Account"} maxLength={50}>
                                    <i 
                                        className="ml-2 icon fa" 
                                        onClick={this.showConfirm.bind(this)}
                                    >
                                        <img className="w-14px" src='/icon-plus.svg' />
                                    </i>
                                </CustomTooltip>
                                </div>
                            </div>
                        </div>
                        <div className="pl-2">
                            <label>Assign to property</label>
                        {!this.state.configuration_id || this.state.editProperty
                        ?
                            <div className="d-flex align-items-center w-100">
                                <GoogleAnalyticsPropertySelect
                                    className="themeNewselect hide-icon"
                                    name="ga_property_id"
                                    id="ga_property_id"
                                    currentPricePlan={this.props.user.price_plan}
                                    value={this.state.gaPropertyId}
                                    onChangeCallback={(gAP) => {
                                        this.setState({gaPropertyId: gAP.target.value || null})
                                    }}
                                    placeholder="Select GA Properties"
                                    isClearable={true}
                                />
                            {
                                this.state.editProperty
                                ?
                                <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: false })}>
                                    <img className="w-14px" src='/close-icon.svg' />
                                </i>
                                : ""
                            }
                            </div>
                        :
                            <div className="pt-2">
                            <span>{this.state.gaPropertyName ? this.state.gaPropertyName : "All Properties"}</span>
                            <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: true })}>
                                <img className="w-20px" src='/icon-edit.svg' />
                            </i>
                            </div>
                        }
                        </div>
                    </div>


                    <h5 className="gaa-text-primary"><b>Create Annotation When:</b></h5>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" id='when_new_post_on_facebook' onChange={(e) => {
                                this.setState({
                                    when_new_post_on_facebook: e.target.checked
                                })
                            }} type="checkbox"/>
                            <label className="form-check-label" htmlFor="when_new_post_on_facebook">
                                New Post On Facebook Page
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_likes_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_likes_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="is_post_likes_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_likes"
                                    id="post_likes"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_likes: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Likes
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_comments_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_comments_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="is_post_comments_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_comments"
                                    id="post_comments"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_comments: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Comments
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_views_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_views_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="is_post_views_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_views"
                                    id="post_views"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_views: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Views
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" type="checkbox" value=""
                                   id="is_post_shares_tracking_on_checkbox" onChange={(e) => {
                                this.setState({
                                    is_post_shares_tracking_on: e.target.checked
                                })
                            }}/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="is_post_shares_tracking_on_checkbox">
                                A Post Reached
                                <input
                                    name="post_shares"
                                    id="post_shares"
                                    onKeyUp={(e) => {
                                        this.setState({
                                            when_post_reach_shares: e.target.value
                                        })
                                    }}
                                    className="d-inline border m-1 mx-3 text-center p-1 w-25"/>
                                Shares
                            </label>
                        </div>
                    </div>


                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" type="checkbox" value="" id="new_ad_compaign_launched"
                                   onChange={(e) => {
                                       this.setState({
                                           when_new_ad_compaing_launched: e.target.checked
                                       })
                                   }}/>
                            <label className="form-check-label" htmlFor="new_ad_compaign_launched">
                                A New Ad Campaign Launched
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" type="checkbox" value="" id="an_ad_compaign_ended"
                                   onChange={(e) => {
                                       this.setState({
                                           when_ad_compaign_ended: e.target.checked
                                       })
                                   }}/>
                            <label className="form-check-label" htmlFor="an_ad_compaign_ended">
                                An Ad Campaign Ended
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input" type="checkbox" value="" id="changes_on_ad_compaign"
                                   onChange={(e) => {
                                       this.setState({
                                           when_changes_on_ad_compaign: e.target.checked
                                       })
                                   }}/>
                            <label className="form-check-label" htmlFor="changes_on_ad_compaign">
                                Changes On An Ad Compaign
                            </label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="btn btn-success"
                            onClick={this.onSubmitHandler}
                        >
                            Save
                        </button>
                    </div>

                </div>

                <div className="gray-box">
                    <h4>
                        Active pages: <span>(Click to remove)</span>
                    </h4>
                    <div className="d-flex keywordTags">
                        {this.state.configurations?.map((gAK, index) => {
                            return (
                                <>
                                    <button
                                        onClick={() => {
                                            this.setState({activeDeletePopover: gAK})
                                        }}
                                        id={"gAK-" + gAK.id}
                                        type="button"
                                        className="keywordTag dd-tooltip d-flex"
                                        key={gAK.id}
                                        user_data_source_id={gAK.id}
                                    >
                                        <CustomTooltip tooltipText={`${gAK.selected_pages_array.map(pg => pg.label)}`}
                                                        maxLength={50}>
                                            <span
                                                style={{background: "#2d9cdb"}}
                                                className="dot"
                                            ></span>
                                            {gAK.gaPropertyName}
                                        </CustomTooltip>
                                    </button>

                                    <Popover
                                        placement="top"
                                        target={"gAK-" + gAK.id}
                                        isOpen={
                                            this.state.activeDeletePopover?.id ===
                                            gAK.id
                                        }
                                    >
                                        <PopoverBody web_monitor_id={gAK.id}>
                                            Are you sure you want to remove "
                                            {gAK.gaPropertyName}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={() => {
                                                this.deleteSelected(this.state.activeDeletePopover)
                                                if (this.state.configurations.length === 1) {
                                                    this.props.serviceStatusHandler({ target: { name: 'is_ds_facebook_tracking_enabled', value: false, checked: false }})
                                                    this.props.sectionToggler();
                                                }
                                            }}
                                            key={gAK.id}
                                            user_data_source_id={gAK.id}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() =>
                                                this.setState({activeDeletePopover: ""})
                                            }
                                        >
                                            No
                                        </button>
                                    </Popover>
                                </>
                            );
                        })}
                    </div>
                </div>

            </div>
        );
    }
}
