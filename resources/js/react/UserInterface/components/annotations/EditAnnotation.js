import React from 'react';
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient";
import GoogleAnalyticsAccountSelect from "../../utils/GoogleAnalyticsAccountSelect";
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

export default class EditAnnotation extends React.Component {

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
            isDirty: false,
            redirectTo: null,
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.gAPropertyChangeHandler = this.gAPropertyChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.setDefaultState = this.setDefaultState.bind(this);

    }

    componentDidMount() {
        document.title = 'Edit Annotation'
        if (this.props.routeParams.match.params.id !== undefined) {
            this.setState({ isBusy: true });
            HttpClient.get(`/annotation/${this.props.routeParams.match.params.id}`)
                .then(response => {
                    let gAPs = [];
                    if (!response.data.annotation.annotation_ga_properties.length) {
                        gAPs = [{ value: "", label: "All Properties" }];
                    } else if (response.data.annotation.annotation_ga_properties[0].google_analytics_property_id == null) {
                        gAPs = [{ value: "", label: "All properties" }];
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
    }

    setDefaultState() {
        this.setState({ isBusy: false, isDirty: false, errors: undefined, google_analytics_property_id: [""] });
    }

    changeHandler(e) {
        this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } });
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
            this.state.annotation.google_analytics_property_id.map(gAP => { fd.append('google_analytics_property_id[]', gAP) })

            fd.append('_method', 'PUT');
            HttpClient.post(`/annotation/${this.state.annotation.id}`, fd)
                .then(response => {
                    toast.success("Annotation updated.");
                    this.setState({ redirectTo: "/annotation" });
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

        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        const validation = this.state.validation;
        return (
            <div className="container-xl bg-white component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Edit Annotation <br />
                                    <small>Update your annotation details</small>
                                </h2>
                            </div>
                        </div>

                        <div className="row ml-0 mr-0">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <form onSubmit={this.submitHandler}>
                            <div className="row">


                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="event_name" className="form-control-placeholder">Event Name</label>
                                        <input type="text" className="form-control" value={this.state.annotation.event_name} onChange={this.changeHandler} id="event_name" name="event_name" />

                                        {
                                            validation.event_name ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : null
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
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.category}</span> : null
                                        }


                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  has-danger ">
                                        <label htmlFor="description" className="form-control-placeholder">Description</label>
                                        <textarea type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control" id="description" name="description"></textarea>
                                        {
                                            validation.description ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : null
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="url" className="form-control-placeholder">Link</label>
                                        <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control" id="url" name="url" />

                                        {
                                            validation.url ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : null
                                        }

                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Show at</label>
                                        <input type="date" onChange={this.changeHandler} value={moment(this.state.annotation.show_at).format('YYYY-MM-DD')} className="form-control" id="show_at" name="show_at" />

                                        {
                                            validation.show_at ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : null
                                        }

                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Analytics Properties</label>
                                        <GoogleAnalyticsPropertySelect
                                            aProperties={this.state.googleAnnotationProperties}
                                            name="google_analytics_property_id"
                                            id="google_analytics_property_id"
                                            value={this.state.annotation.google_analytics_property_id}
                                            onChangeCallback={this.changeHandler}
                                            onChangeCallback2={this.gAPropertyChangeHandler}
                                            placeholder="Select GA Properties"
                                            multiple
                                            onFocus={(e) => {
                                                if (this.props.currentPricePlan.ga_account_count == 1) swal("Upgrade to Pro Plan!", "Google Aalytics Properties are not available in this plan.", "warning");
                                            }}
                                        ></GoogleAnalyticsPropertySelect>
                                    </div>
                                </div>

                            </div>
                            <div className="row ml-0 mr-0">
                                <div className="col-12 text-right">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round" title="submit">
                                        {/* <i className="ti-save mr-2"></i> */}
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </section>
            </div>
        );
    }


}
