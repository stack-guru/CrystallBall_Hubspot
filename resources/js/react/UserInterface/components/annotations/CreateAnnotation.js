import React from 'react';
import { toast } from "react-toastify";
import VideoModalBox from '../../utils/VideoModalBox';

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';

import GoogleAnalyticsPropertySelect from "../../utils/GoogleAnalyticsPropertySelect";
import { loadStateFromLocalStorage, saveStateToLocalStorage, removeStateFromLocalStorage } from '../../helpers/CommonFunctions';

export default class CreateAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            annotation: {
                category: '',
                event_name: '',
                url: '',
                description: '',
                show_at: '',
                google_analytics_property_id: [""]
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
    }

    componentDidMount() {
        document.title = 'Create Annotation'
        setTimeout(() => {
            this.setState(loadStateFromLocalStorage("CreateAnnotation"));
        }, 1000);
    }

    setDefaultState() {
        this.setState({
            annotation: {
                category: '',
                event_name: '',
                url: '',
                description: '',
                show_at: '',
                google_analytics_property_id: [""]
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false,
            errors: undefined
        });
    }

    changeHandler(e) {
        this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } },
            () => {
                setTimeout(() => {
                    saveStateToLocalStorage("CreateAnnotation", { annotation: this.state.annotation });
                }, 500);
            });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            let fd = new FormData;
            for (var key in this.state.annotation) {
                if (key !== 'google_analytics_property_id') fd.append(key, this.state.annotation[key]);
            }
            this.state.annotation.google_analytics_property_id.map(gAA => { fd.append('google_analytics_property_id[]', gAA) })

            HttpClient.post('/annotation', fd)
                .then(response => {
                    removeStateFromLocalStorage("CreateAnnotation");
                    toast.success("Annotation added.");
                    this.setDefaultState();
                }, (err) => {

                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isBusy: false, errors: err });
                });
        }

    }

    validate() {
        let category = this.state.annotation.category;
        let event_name = this.state.annotation.event_name;
        let url = this.state.annotation.url;
        let description = this.state.annotation.description;
        let show_at = this.state.annotation.show_at;


        let errors = {};
        let isValid = true;

        if (!category) {
            isValid = false;
            errors["category"] = "Please enter your category.";
        }

        if (!event_name) {
            isValid = false;
            errors["event_name"] = "Please enter your event_name.";
        }

        // if (!show_at) {
        //     isValid = false;
        //     errors["show_at"] = "Please add show_at date.";
        // }


        this.setState({
            validation: errors
        });

        return isValid;
    }

    render() {
        const validation = this.state.validation;
        return (
            <div className="container-xl bg-white  component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">
                                    Add Annotation<br />
                                    <small>Enter your annotation details</small>
                                </h2>
                            </div>
                            <div className="col-md-12">
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <form onSubmit={this.submitHandler} id="annotation-create-form">
                            <div className="row">

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="event_name" className="form-control-placeholder">Event Name</label>
                                        <input type="text" className="form-control" value={this.state.annotation.event_name} onChange={this.changeHandler} id="event_name" name="event_name" />

                                        {
                                            validation.event_name ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : ''
                                        }

                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="category" className="form-control-placeholder">Category</label>
                                        <input type="text" className="form-control" id="category" name="category"
                                            value={this.state.annotation.category} onChange={this.changeHandler} />
                                        {
                                            validation.category ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.category}</span> : ''
                                        }


                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  has-danger ">
                                        <label htmlFor="description" className="form-control-placeholder">Description</label>
                                        <textarea type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control" id="description" name="description"></textarea>
                                        {
                                            validation.description ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : ''
                                        }
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="url" className="form-control-placeholder">Link</label>
                                        <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control" id="url" name="url" />

                                        {
                                            validation.url ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : ''
                                        }

                                    </div>
                                </div>


                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Show at</label>
                                        <input type="date" onChange={this.changeHandler} value={this.state.annotation.show_at} className="form-control" id="show_at" name="show_at" />

                                        {
                                            validation.show_at ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Google Properties <a id="google-properties-video-modal-button" className="float-right" href="#" target="_blank" data-toggle="modal" data-target="#google-properties-video-modal"><img className="hint-button-3" src="/images/info-logo.png" /></a></label>
                                        <VideoModalBox id="google-properties-video-modal" src="https://www.youtube.com/embed/4tRGhuK7ZWQ" />

                                        <GoogleAnalyticsPropertySelect
                                            name="google_analytics_property_id"
                                            id="google_analytics_property_id"
                                            value={this.state.annotation.google_analytics_property_id}
                                            onChangeCallback={this.changeHandler} placeholder="Select GA Properties"
                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                            multiple
                                            onFocus={(e) => {
                                                if (this.props.currentPricePlan.ga_account_count == 1) swal("Upgrade to Pro Plan!", "Google Analytics Properties are not available in this plan.", "warning");
                                            }}
                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="row ml-0 mr-0 mt-3 mt-sm-3 mt-md-1 mt-lg-1">
                                <div className="col-12 text-right pr-0">
                                    <button type="submit" className="btn gaa-btn-primary btn-fab btn-round" title="submit">
                                        <i className="fa fa-plus mr-1"></i>Add
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </section>
            </div>
        )
    }

}
