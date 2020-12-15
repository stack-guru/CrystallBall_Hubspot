import React from 'react';
import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import { toast } from "react-toastify";
import GoogleAccountSelect from "../../utils/GoogleAccountSelect";
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
                google_account_id: '',
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

    setDefaultState() {
        this.setState({
            annotation: {
                category: '',
                event_name: '',
                url: '',
                description: '',
                show_at: '',
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
        this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.post('/annotation', this.state.annotation)
                .then(response => {
                    toast.success("Annotation added.");
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

    componentDidMount() {
        document.title = 'Create Annotation'
    }

    render() {
        const validation = this.state.validation;
        return (
            <div className="container-xl bg-white  component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Add Annotation</h2>
                            </div>
                            <div className="col-md-12">
                                <h5>Enter your annotation details</h5>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <form onSubmit={this.submitHandler}>
                            <div className="row">

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="event_name" className="form-control-placeholder">event_name</label>
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
                                        <label htmlFor="description" className="form-control-placeholder">description</label>
                                        <textarea type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control" id="description" name="description"></textarea>
                                        {
                                            validation.description ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : ''
                                        }
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="url" className="form-control-placeholder">url</label>
                                        <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control" id="url" name="url" />

                                        {
                                            validation.url ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : ''
                                        }

                                    </div>
                                </div>


                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <label htmlFor="show_at" className="form-control-placeholder">show_at</label>
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
                                        <GoogleAccountSelect name={'google_account_id'} id={'google_account_id'} value={this.state.annotation.google_account_id} onChangeCallback={this.changeHandler}></GoogleAccountSelect>

                                        {
                                            validation.google_account_id ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.google_account_id}</span> : ''
                                        }

                                    </div>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-12 text-right">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round" title="submit">
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
