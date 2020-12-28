import React from 'react';
import { toast } from "react-toastify";

import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient";
import GoogleAnalyticsAccountSelect from "../../utils/GoogleAnalyticsAccountSelect";

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
                google_analytics_account_id: [""]
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this);

    }

    componentDidMount() {
        document.title = 'Edit Annotation'
        if (this.props.routeParams.match.params.id !== undefined) {
            this.setState({ isBusy: true });
            HttpClient.get(`/annotation/${this.props.routeParams.match.params.id}`)
                .then(response => {
                    let gAAIds = response.data.annotation.annotation_ga_accounts.map(aGAAA => aGAAA.google_analytics_account_id);
                    if(gAAIds[0] == null) gAAIds = [""];
                    this.setState({ isBusy: false, annotation: {...response.data.annotation, google_analytics_account_id: gAAIds} });
                }, (err) => {
                    console.log(err);
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    console.log(err)
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    setDefaultState() {
        this.setState({ isBusy: false, isDirty: false, errors: undefined, google_analytics_account_id: [""] });
    }

    changeHandler(e) {
        this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });

            let fd = new FormData;
            for (var key in this.state.annotation) {
                if (key !== 'google_analytics_account_id') fd.append(key, this.state.annotation[key]);
            }
            this.state.annotation.google_analytics_account_id.map(gAA => { fd.append('google_analytics_account_id[]', gAA) })

            HttpClient.put(`/annotation/${this.state.annotation.id}`, fd)
                .then(response => {
                    toast.success("Annotation updated.");
                    this.setDefaultState();
                }, (err) => {
                    console.log(err);
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    console.log(err)
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


        if (!url) {
            isValid = false;
            errors["url"] = "Please enter url here.";
        }
        if (!description) {
            isValid = false;
            errors["description"] = "Please enter your description.";
        }

        if (!show_at) {
            isValid = false;
            errors["show_at"] = "Please add show_at date.";
        }


        this.setState({
            validation: errors
        });

        return isValid;
    }



    render() {
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
                            <div className="row ml-0 mr-0">


                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="event_name" className="form-control-placeholder lead text-dark font-weight-bold">Event Name</label>
                                        <input type="text" className="form-control" value={this.state.annotation.event_name} onChange={this.changeHandler} id="event_name" name="event_name" />

                                        {
                                            validation.event_name ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="category" className="form-control-placeholder lead text-dark font-weight-bold">Category</label>
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
                                        <label htmlFor="description" className="form-control-placeholder lead text-dark font-weight-bold">Description</label>
                                        <textarea type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control" id="description" name="description"></textarea>
                                        {
                                            validation.description ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : ''
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="url" className="form-control-placeholder text-dark lead font-weight-bold">Link</label>
                                        <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control" id="url" name="url" />

                                        {
                                            validation.url ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : ''
                                        }

                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder text-dark font-weight-bold lead">Show at</label>
                                        <input type="date" onChange={this.changeHandler} value={this.state.annotation.show_at} className="form-control" id="show_at" name="show_at" />

                                        {
                                            validation.show_at ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : ''
                                        }

                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">Google Accounts</label>
                                        <GoogleAnalyticsAccountSelect name="google_analytics_account_id" id="google_analytics_account_id" value={this.state.annotation.google_analytics_account_id} onChangeCallback={this.changeHandler} placeholder="Select GA Accounts" multiple></GoogleAnalyticsAccountSelect>

                                        {
                                            validation.google_account_id ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.google_account_id}</span> : ''
                                        }

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
