import React from "react";
import Select from 'react-select'
import HttpClient from "./HttpClient";
import GoogleAnalyticsPropertySelect from "./GoogleAnalyticsPropertySelect";
import {CustomTooltip} from "../components/annotations/IndexAnnotation";
import Toast from "../utils/Toast";

import {
    Popover,
    PopoverBody,
} from "reactstrap";
export default class InstagramTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
            isBusy: false,
            errors: "",
            gaPropertyId: null,
            gaPropertyName: null,
            editProperty: null,
            configuration_id: null,
            when_new_post_on_instagram: true,

            is_post_likes_tracking_on: true,
            is_post_comments_tracking_on: true,
            is_post_views_tracking_on: true,
            is_post_shares_tracking_on: true,

            when_post_reach_likes: 1,
            when_post_reach_comments: 1,
            when_post_reach_shares: 1,
            when_post_reach_views: 1,
            configurations: [],
            activeDeletePopover: null

        };

        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.fetchConfigurations = this.fetchConfigurations.bind(this);
        this.runjob = this.runjob.bind(this);
        this.deleteSelected = this.deleteSelected.bind(this);

    }

    componentDidMount() {
        this.fetchConfigurations();
    }

    fetchConfigurations() {
        /*
        * this function will fetch configurations for given user
        * */
        this.setState({isBusy: true})
        HttpClient.get('/data-source/get-instagram-tracking-configurations').then(resp => {
            this.setState({
                configurations: resp.data.configurations
            });
            document.getElementById('when_new_post_on_instagram').checked = true;
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

    deleteSelected = (payload) => {

        HttpClient.delete(`/data-source/remove-instagram-tracking-configuration/${payload.id}`)
            .then(
                () => {
                    this.fetchConfigurations();
                    Toast.fire({
                        icon: 'success',
                        title: "Instagram configuration deleted successfully.",
                    });
                },
                (err) => {
                    Toast.fire({
                        icon: 'error',
                        title: "Error while delete exists Instagram configuration.",
                    });
                }
            )
            .catch((err) => {
                Toast.fire({
                    icon: 'error',
                    title: "Error while delete exists Instagram configuration.",
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
            text: `Connect your ${ this.props.serviceName } account to create automatic annotations for new posts; when you reach a post goal`,
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

    onSubmitHandler() {
        let form_data = {
            when_new_post_on_instagram: this.state.when_new_post_on_instagram,

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
        if (!this.state.configurations.length) {
            this.props.serviceStatusHandler({ target: { name: 'is_ds_instagram_tracking_enabled', value: true, checked: true }})
        }
        HttpClient.post('/data-source/save-instagram-tracking-configurations', form_data).then(resp => {
            this.setState({isBusy: false, gaPropertyName: resp.data.gaPropertyName, editProperty: false});
            
            this.props.loadUserDataSources();
            this.fetchConfigurations();
            swal.fire('', "We will retrieve the posts added to your account in the past year according to your preferences; it may take a few minutes. Subsequently, the system will perform a daily check and automatically add relevant annotations to your account.", '');

            this.runjob(resp.data.configurationId);
        }, (err) => {
            Toast.fire({
                icon: 'error',
                title: err.response.data.message
            })
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }

    runjob(id) {
        HttpClient.post('/data-source/run-instagram-job', {id}).then(resp => {
        })
    }

    render() {
        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="weather_alert_cities-form">

                    {/* {!this.state.configuration_id || this.state.editProperty
                        ? */}
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

                                <div className="w-86px">
                                    <div className="dd-tooltip">
                                    <CustomTooltip tooltipText={"Add more Account"} maxLength={50}>
                                        <i 
                                            className="ml-2 icon fa cursor-pointer" 
                                            onClick={this.showConfirm.bind(this)}
                                        >
                                            <img className="w-14px" src='/icon-plus.svg' />
                                        </i>
                                    </CustomTooltip>
                                    </div>
                                </div>
                            {/* {
                                this.state.editProperty
                                ?
                                <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: false })}>
                                    <img className="w-14px" src='/close-icon.svg' />
                                </i>
                                : ""
                            } */}
                            </div>
                        {/* :
                            <>
                            <span>{this.state.gaPropertyName ? this.state.gaPropertyName : "All Properties"}</span>
                            <i className="ml-2 icon fa" onClick={() => this.setState({ editProperty: true })}>
                                <img className="w-20px" src='/icon-edit.svg' />
                            </i>
                            </>
                        } */}
                    
                    <h5 className="gaa-text-primary mt-2"><b>Create Annotation When:</b></h5>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input mt-0" id='when_new_post_on_instagram' onChange={(e) => {
                                this.setState({
                                    when_new_post_on_instagram: e.target.checked
                                })
                            }} type="checkbox"/>
                            <label className="d-flex align-items-center form-check-label" htmlFor="when_new_post_on_instagram">
                                New Post On Instagram Profile
                            </label>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex align-items-center form-check themeNewCheckbox">
                            <input className="form-check-input mt-0" type="checkbox" value=""
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
                            <input className="form-check-input mt-0" type="checkbox" value=""
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
                            <input className="form-check-input mt-0" type="checkbox" value=""
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
                            <input className="form-check-input mt-0" type="checkbox" value=""
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

                    <div className="mt-4">
                        <button
                            className="btn btn-success"
                            onClick={this.onSubmitHandler}
                        >
                            Save
                        </button>
                    </div>

                </div>


                <div className="gray-box mt-4">
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
                                        {gAK.gaPropertyName ? gAK.gaPropertyName : "All Properties"}
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
                                            Are you sure you want to remove, it will delete all the annotations related to this."
                                            {gAK.gaPropertyName}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={() => {
                                                this.deleteSelected(this.state.activeDeletePopover)
                                                if (this.state.configurations.length === 1) {
                                                    this.props.serviceStatusHandler({ target: { name: 'is_ds_instagram_tracking_enabled', value: false, checked: false }})
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
