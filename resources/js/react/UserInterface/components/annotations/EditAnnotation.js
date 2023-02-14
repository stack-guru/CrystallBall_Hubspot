import React from 'react';
import Toast from "../../utils/Toast";
import { Redirect } from "react-router-dom";

import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient";

import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';
import AnnotationCategorySelect from '../../utils/AnnotationCategorySelect';
import ModalHeader from '../AppsMarket/common/ModalHeader';

export default class EditAnnotation extends React.Component {

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
            userAnnotationColors: {},
            redirectTo: null,
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.gAPropertyChangeHandler = this.gAPropertyChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.loadCategoriesList = this.loadCategoriesList.bind(this)
        this.updateUserAnnotationColors = this.updateUserAnnotationColors.bind(this);
        this.loadUserAnnotationColors = this.loadUserAnnotationColors.bind(this);
    }

    componentDidMount() {
        if (this.props.editAnnotationId) {
            this.setState({ isBusy: true });
            HttpClient.get(`/annotation/${this.props.editAnnotationId}`)
                .then(response => {
                    let gAPs = [];
                    if (!response.data.annotation.annotation_ga_properties.length) {
                        gAPs = [];
                    } else if (response.data.annotation.annotation_ga_properties[0].google_analytics_property_id == null) {
                        gAPs = [];
                    } else {
                        gAPs = response.data.annotation.annotation_ga_properties.map(aGAP => { return { value: aGAP.google_analytics_property_id, label: aGAP.google_analytics_property.name }; });
                    }

                    let gAPIds = response.data.annotation.annotation_ga_properties.map(agAPA => agAPA.google_analytics_property_id);
                    if (gAPIds[0] == null) gAPIds = [""];
                    this.setState({ isBusy: false, annotation: { ...response.data.annotation, google_analytics_property_id: gAPIds }, googleAnnotationProperties: gAPs });
                }, (err) => {

                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isBusy: false, errors: err });
                });
        }
        this.loadUserAnnotationColors();
        this.loadCategoriesList();
    }

    loadCategoriesList() {
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
        this.setState({ isBusy: false, isDirty: false, errors: undefined, google_analytics_property_id: [""] });
    }

    changeHandler(e) {
        switch (e.target.name) {
            case "google_analytics_property_id":
                if ((this.props.currentPricePlan.google_analytics_property_count < e.target.value.length) && (this.props.currentPricePlan.google_analytics_property_count !== 0)) {
                    this.props.upgradePopup('add-more-property')
                    // const accountNotLinkedHtml = '' +
                    //     '<div class="">' +
                    //     '<img src="/images/property-upgrade-modal.png" class="img-fluid">' +
                    //     '</div>'
                    // /*
                    // * Show new google analytics account popup
                    // * */
                    // swal.fire({
                    //     html: accountNotLinkedHtml,
                    //     width: 1000,
                    //     showCancelButton: true,
                    //     showCloseButton: true,
                    //     customClass: {
                    //         popup: "themePlanAlertPopup",
                    //         htmlContainer: "themePlanAlertPopupContent",
                    //         closeButton: 'btn-closeplanAlertPopup',
                    //     },
                    //     cancelButtonClass: "btn-bookADemo",
                    //     cancelButtonText: "Book a Demo",
                    //     confirmButtonClass: "btn-subscribeNow",
                    //     confirmButtonText: "Subscribe now",
                    // }).then(value => {
                    //     if (value.isConfirmed) window.location.href = '/settings/price-plans'
                    // });
                } else {
                    this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } });
                }
                break;
            default:
                this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } });
                break;
        }
    }

    gAPropertyChangeHandler(aProperties) {
        this.setState({
            googleAnnotationProperties: aProperties
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
            this.state.annotation.google_analytics_property_id.forEach((gAP) => { fd.append('google_analytics_property_id[]', gAP) })

            fd.append('_method', 'PUT');
            HttpClient.post(`/annotation/${this.state.annotation.id}`, fd)
                .then(response => {
                    Toast.fire({
                        icon: 'success',
                        title: "Annotation updated."
                    });
                    this.setState({ redirectTo: "/annotation" });
                    this.props.togglePopup('');
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

    loadUserAnnotationColors() {
        HttpClient.get(`/data-source/user-annotation-color`).then(resp => {
            this.setState({ isLoading: false, userAnnotationColors: resp.data.user_annotation_color });
        }, (err) => {
            this.setState({ isLoading: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isLoading: false, errors: err });
        })

    }
    updateUserAnnotationColors(userAnnotationColors) {
        this.setState({ userAnnotationColors: userAnnotationColors });
    }


    render() {

        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        const validation = this.state.validation;
        return (
            <div className="popupContent modal-editAnnotation">
                <ModalHeader
                    userAnnotationColors={this.state.userAnnotationColors}
                    updateUserAnnotationColors={this.updateUserAnnotationColors}
                    userServices={null}
                    serviceStatusHandler={null}
                    closeModal={() => this.props.togglePopup('')}
                    serviceName={'Edit Annotation'}
                    colorKeyName={this.state.annotation.added_by}
                    dsKeyName={null}
                    creditString={null}
                />

                <div className="apps-bodyContent">
                    <form onSubmit={this.submitHandler} id="annotation-edit-form">
                        <ErrorAlert errors={this.state.errors} />
                        <div className='grid2layout'>
                            <div className="themeNewInputStyle">
                                <input type="text" className="form-control gray_clr" value={this.state.annotation.event_name} onChange={this.changeHandler} id="event_name" name="event_name" placeholder='Name the Annotation' />
                                {validation.event_name ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : null}
                            </div>
                            <div className="themeNewInputStyle">
                                <AnnotationCategorySelect categories={this.state.categories} className="gray_clr" name="category" id="category" value={this.state.annotation.category} onChangeCallback={this.changeHandler} placeholder="Select Category or Create" />
                            </div>
                        </div>

                        <div className="themeNewInputStyle has-danger mb-3">
                            <input type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control gray_clr" id="description" name="description" placeholder='Add descriptive info' />
                            {validation.description ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : null}
                        </div>

                        <div className='grid2layout'>
                            <div className="themeNewInputStyle position-relative inputWithIcon">
                                <i className="fa fa-link"></i>
                                <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control gray_clr" id="url" name="url" placeholder='https://example.com' />
                                {validation.url ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : null}
                            </div>
                            <div className="themeNewInputStyle">
                                <input type="date" onChange={this.changeHandler} value={moment(this.state.annotation.show_at).format('YYYY-MM-DD')} className="form-control gray_clr" id="show_at" name="show_at" />
                                {validation.show_at ? <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : null}
                            </div>
                        </div>

                        <div className='grid2layout'>
                            <div className="themeNewInputStyle">
                                <GoogleAnalyticsPropertySelect
                                    aProperties={this.state.googleAnnotationProperties}
                                    name="google_analytics_property_id"
                                    id="google_analytics_property_id"
                                    className="gray_clr"
                                    value={this.state.annotation.google_analytics_property_id}
                                    onChangeCallback={this.changeHandler}
                                    onChangeCallback2={this.gAPropertyChangeHandler}
                                    placeholder="Select GA Properties"
                                    multiple
                                    currentPricePlan={this.props.currentPricePlan}
                                ></GoogleAnalyticsPropertySelect>
                            </div>
                        </div>

                        <div className='d-flex pt-3'>
                            <button type="submit" className="btn-theme" title="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }


}
