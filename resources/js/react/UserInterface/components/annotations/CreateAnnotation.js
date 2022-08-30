import React from 'react';
import { toast } from "react-toastify";
import { Redirect } from 'react-router';

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import GoogleAnalyticsPropertySelect from "../../utils/GoogleAnalyticsPropertySelect";
import AnnotationCategorySelect from '../../utils/AnnotationCategorySelect';

import { loadStateFromLocalStorage, saveStateToLocalStorage, removeStateFromLocalStorage } from '../../helpers/CommonFunctions';

export default class CreateAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            annotation: {
                category: '',
                event_name: '',
                url: 'https://',
                description: '',
                show_at: '',
                google_analytics_property_id: [""]
            },
            categories: [],
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false,
            redirectTo: null,
            user: null,
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.loadCategoriesList = this.loadCategoriesList.bind(this)
        this.checkIfCanCreateAnnotation = this.checkIfCanCreateAnnotation.bind(this)
    }

    checkIfCanCreateAnnotation(){
        HttpClient.get('user')
        .then(user_response => {
            this.setState({
                user: user_response.data.user
            })
            HttpClient.get('user_total_annotations')
            .then(response => {
                if( this.state.user.price_plan.code == "free new" || this.state.user.price_plan.code == "Trial"){
                    if(this.state.user.price_plan.annotations_count == 0){
                        // unlimited
                    }else{
                        if(response.data.user_total_annotations >= this.state.user.price_plan.annotations_count){
                            let url = document.location.origin + '/images/annotation_limit_reached.jpg';
                            swal.fire({
                                html: "<img src='"+url+"' style='width:100%;'>",
                                width: 700,
                                customClass: {
                                    popup: 'custom_bg pb-5',
                                    htmlContainer: 'm-0',
                                },
                                showCloseButton: false,
                                // title: "You have reached your plan limits!",
                                // text: "Upgrade your plan to add more annotations.",
                                confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                confirmButtonText: "<a href='#' class='text-white'>Upgrade Now</a>",
                            }).then(function(){
                                window.location.href = '/settings/price-plans';
                            });
                        }
                    }
                    
                }
                
            });
        });
    }

    componentDidMount() {
        document.title = 'Create Annotation'
        setTimeout(() => {
            this.setState(loadStateFromLocalStorage("CreateAnnotation"));
        }, 1000);


        this.loadCategoriesList();
        this.checkIfCanCreateAnnotation();
    }

    loadCategoriesList(){
        this.setState({ isBusy: true })
        HttpClient.get(`/annotation-categories`)
            .then(response => {
                this.setState({ isBusy: false, categories: response.data.categories.map(c => { return { label: c.category, value: c.category } }) });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
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
        switch (e.target.name) {
            default:
                this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } },
                    () => {
                        setTimeout(() => {
                            saveStateToLocalStorage("CreateAnnotation", { annotation: this.state.annotation });
                        }, 500);
                    });
                break;
        }
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
                    this.loadCategoriesList();
                }, (err) => {
                    if (err.response.status == 402) {
                        swal.fire({
                            icon: "warning",
                            title: "Limit Reached",
                            html: err.response.data.message,
                        });
                    }
                    loadCategoriesList();
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
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

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
                                        <label htmlFor="event_name" className="form-control-placeholder">Event Name *</label>
                                        <input type="text" className="form-control gray_clr" value={this.state.annotation.event_name} onChange={this.changeHandler} id="event_name" name="event_name" placeholder='Name the Annotation' />

                                        {
                                            validation.event_name ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : ''
                                        }

                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="category" className="form-control-placeholder">Category *</label>
                                        <AnnotationCategorySelect className="gray_clr" name="category" id="category" value={this.state.annotation.category} categories={this.state.categories} onChangeCallback={this.changeHandler} placeholder="Select Category or Create" />
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  has-danger ">
                                        <label htmlFor="description" className="form-control-placeholder">Description</label>
                                        <textarea type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control gray_clr" id="description" name="description" placeholder='Add descriptive info'></textarea>
                                        {
                                            validation.description ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : ''
                                        }
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="url" className="form-control-placeholder">Link</label>
                                        <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control gray_clr" id="url" name="url" placeholder='https://example.com' />

                                        {
                                            validation.url ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : ''
                                        }

                                    </div>
                                </div>


                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Show on this date</label>
                                        <input type="date" onChange={this.changeHandler} value={this.state.annotation.show_at} className="form-control gray_clr" id="show_at" name="show_at" />

                                        {
                                            validation.show_at ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Assign Annotation to:
                                            {/* <a id="google-properties-video-modal-button" className="float-right" href="#" target="_blank" data-toggle="modal" data-target="#google-properties-video-modal"><img className="hint-button-3" src="/images/info-logo.png" /></a> */}
                                        </label>
                                        {/* <VideoModalBox id="google-properties-video-modal" src="https://www.youtube.com/embed/4tRGhuK7ZWQ" /> */}

                                        <GoogleAnalyticsPropertySelect
                                            name="google_analytics_property_id"
                                            id="google_analytics_property_id"
                                            className="gray_clr"
                                            value={this.state.annotation.google_analytics_property_id}
                                            onChangeCallback={this.changeHandler} placeholder="Select GA Properties"
                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                            multiple
                                            currentPricePlan={this.props.currentPricePlan}
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
