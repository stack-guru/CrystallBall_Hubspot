import React from 'react';
import { toast } from "react-toastify";
import { Redirect } from 'react-router';

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import GoogleAnalyticsPropertySelect from "../../utils/GoogleAnalyticsPropertySelect";
import AnnotationCategorySelect from '../../utils/AnnotationCategorySelect';

import { loadStateFromLocalStorage, saveStateToLocalStorage, removeStateFromLocalStorage } from '../../helpers/CommonFunctions';
import ModalHeader from '../AppsMarket/common/ModalHeader';

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

    checkIfCanCreateAnnotation() {
        HttpClient.get('user')
            .then(user_response => {
                this.setState({
                    user: user_response.data.user
                })
                HttpClient.get('user_total_annotations')
                    .then(response => {
                        if (this.state.user.price_plan.code == "free new" || this.state.user.price_plan.code == "Trial") {
                            if (this.state.user.price_plan.annotations_count == 0) {
                                // unlimited
                            } else {
                                if (response.data.user_total_annotations >= this.state.user.price_plan.annotations_count) {
                                    let url = document.location.origin + '/images/annotation_limit_reached.png';
                                    swal.fire({
                                        html: "<img src='" + url + "' style='width:100%;'>",
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
                                    }).then(function () {
                                        if (value.isConfirmed) window.location.href = '/settings/price-plans'
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

    loadCategoriesList() {
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
                if (key !== 'google_analytics_property_id') {
                    fd.append(key, this.state.annotation[key])
                }
            }
            this.state.annotation.google_analytics_property_id.forEach((gAA) => { fd.append('google_analytics_property_id[]', gAA) })

            HttpClient.post('/annotation', fd)
                .then(response => {
                    removeStateFromLocalStorage("CreateAnnotation");
                    toast.success("Annotation added.");
                    this.setState({ redirectTo: "/annotation" });
                    this.props.togglePopup('');
                    // this.setDefaultState();
                    // this.loadCategoriesList();
                }, (err) => {
                    if (err.response.status == 402) {
                        swal.fire({
                            icon: "warning",
                            title: "Limit Reached",
                            html: err.response.data.message,
                        });
                    }
                    this.loadCategoriesList();
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
            errors["category"] = "Please select category.";
        }

        if (!event_name) {
            isValid = false;
            errors["event_name"] = "Please enter your event name.";
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
            <div className="popupContent modal-createAnnotation">
                <ModalHeader
                    userAnnotationColors={this.state}
                    updateUserAnnotationColors={() => { }}
                    userServices={() => { }}
                    serviceStatusHandler={() => { }}
                    closeModal={() => this.props.togglePopup('')}
                    serviceName={'Add annotation manually'}
                    colorKeyName={"manual_annotation"}
                    dsKeyName={null}
                    creditString={null}
                />
                <div className="apps-bodyContent">
                    <form onSubmit={this.submitHandler} id="annotation-create-form">
                        <ErrorAlert errors={this.state.errors} />
                        <div className='grid2layout'>
                            <div className="themeNewInputStyle">
                                <input type="text" className="form-control" value={this.state.annotation.event_name} onChange={this.changeHandler} id="event_name" name="event_name" placeholder='Event name *' />
                                {validation.event_name ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : ''}
                            </div>
                            <div className="themeNewInputStyle">
                                <AnnotationCategorySelect className="gray_clr" name="category" id="category" value={this.state.annotation.category} categories={this.state.categories} onChangeCallback={this.changeHandler} placeholder="Category *" />
                                {validation.category ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.category}</span> : ''}
                            </div>
                        </div>

                        <div className="themeNewInputStyle has-danger mb-3">
                            <input type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control" id="description" name="description" placeholder='Description' />
                            {validation.description ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : ''}
                        </div>

                        <div className='grid2layout'>
                            <div className="themeNewInputStyle position-relative inputWithIcon">
                                <i className="fa fa-link"></i>
                                <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control" id="url" name="url" placeholder='https://' />
                                {validation.url ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : ''}
                            </div>

                            <div className="themeNewInputStyle">
                                <input type="date" onChange={this.changeHandler} value={this.state.annotation.show_at} className="form-control" placeholder='Show on this date' id="show_at" name="show_at" />
                                {validation.show_at ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : ''}
                            </div>
                        </div>
                        <div className='grid2layout'>
                            <div className="themeNewInputStyle">
                                <GoogleAnalyticsPropertySelect name="google_analytics_property_id" id="google_analytics_property_id" className="gray_clr" value={this.state.annotation.google_analytics_property_id} onChangeCallback={this.changeHandler} placeholder="Assign annotation to" components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }} multiple currentPricePlan={this.props.currentPricePlan} />
                            </div>
                        </div>

                        <div className='d-flex pt-3'>
                            {/* <button type="submit" className="btn-cancel mr-3" title="submit">Cancel</button> */}
                            <button type="submit" className="btn-theme" title="submit">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}
