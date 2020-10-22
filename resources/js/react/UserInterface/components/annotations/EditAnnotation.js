import React from 'react';
import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient";
export default class EditAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            annotation: {
                category: '',
                event_type: '',
                event_name: '',
                url: '',
                description: '',
                title: '',
                show_at: '',
                type: '',
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)

    }

    componentDidMount() {
        document.title = 'Edit Annotation'
        if (this.props.routeParams.match.params.id !== undefined) {

            this.setState({ isBusy: true });
            HttpClient.get(`/annotation/${this.props.routeParams.match.params.id}`)
                .then(response => {
                    this.setState({ isBusy: false, annotation: response.data.annotation });
                }, (err) => {
                    console.log(err);
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    console.log(err)
                    this.setState({ isBusy: false, errors: err });
                });

        }
    }


    changeHandler(e) {
        this.setState({ isDirty: true, annotation: { ...this.state.annotation, [e.target.name]: e.target.value } });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.put(`/annotation/${this.state.annotation.id}`, this.state.annotation)
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
        let event_type = this.state.annotation.event_type;
        let event_name = this.state.annotation.event_name;
        let url = this.state.annotation.url;
        let description = this.state.annotation.description;
        let title = this.state.annotation.title;
        let show_at = this.state.annotation.show_at;
        let type = this.state.annotation.type;

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

        if (!event_type) {
            isValid = false;
            errors["event_type"] = "Please enter your event_type.";
        }
        if (!url) {
            isValid = false;
            errors["url"] = "Please enter url here.";
        }
        if (!description) {
            isValid = false;
            errors["description"] = "Please enter your description.";
        }
        if (!title) {
            isValid = false;
            errors["title"] = "Please enter title here.";
        }
        if (!show_at) {
            isValid = false;
            errors["show_at"] = "Please add show_at date.";
        }
        if (!type) {
            isValid = false;
            errors["type"] = "Please enter annotation type.";
        }

        this.setState({
            validation: errors
        });

        return isValid;
    }



    render() {
        const validation = this.state.validation;
        return (
            <div className="container-xl bg-white" style={{ minHeight: '100vh' }}>
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section">Edit Annotation <br />
                                    <small>Update your annotation details</small>
                                </h2>
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
                                    <div className="form-group ">
                                        <input type="text" className="form-control" id="category" name="category"
                                            value={this.state.annotation.category} onChange={this.changeHandler} />
                                        <label htmlFor="category" className="form-control-placeholder">Category</label>
                                        {
                                            validation.category ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.category}</span> : ''
                                        }


                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  ">
                                        <select className="form-control" onChange={this.changeHandler} name="event_type" id="event_type" value={this.state.annotation.event_type} >
                                            <option value="Default" >Default</option>
                                            <option value="Annotaions">Annotaions</option>
                                            <option value="Api">Api</option>
                                            <option value="Google-updates">Google-updates</option>
                                            <option value="Holidays">Holidays</option>
                                            <option value="Gtm">Gtm</option>
                                        </select>
                                        <label htmlFor="event_type" className="form-control-placeholder">event_type</label>

                                        {
                                            validation.event_type ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_type}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <input type="text" className="form-control" value={this.state.annotation.event_name} onChange={this.changeHandler} id="event_name" name="event_name" />
                                        <label htmlFor="event_name" className="form-control-placeholder">event_name</label>

                                        {
                                            validation.event_name ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <input type="text" value={this.state.annotation.url} onChange={this.changeHandler} className="form-control" id="url" name="url" />
                                        <label htmlFor="url" className="form-control-placeholder">url</label>

                                        {
                                            validation.url ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  has-danger ">
                                        <textarea type="text" value={this.state.annotation.description} onChange={this.changeHandler} className="form-control" id="description" name="description"></textarea>
                                        <label htmlFor="description" className="form-control-placeholder">description</label>
                                        {
                                            validation.description ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : ''
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <input type="text" value={this.state.annotation.title} onChange={this.changeHandler} className="form-control" id="title" name="title" />
                                        <label htmlFor="title" className="form-control-placeholder">title</label>

                                        {
                                            validation.title ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.title}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <input type="date" onChange={this.changeHandler} value={this.state.annotation.show_at} className="form-control" id="show_at" name="show_at" />
                                        <label htmlFor="show_at" className="form-control-placeholder">show_at</label>

                                        {
                                            validation.show_at ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <input type="text" value={this.state.annotation.type} onChange={this.changeHandler} className="form-control" id="type" name="type" />
                                        <label htmlFor="type" className="form-control-placeholder">type</label>

                                        {
                                            validation.type ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.type}</span> : ''
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-1 offset-11">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round" title="submit">
                                        <i className="ion-ios-plus"></i>Edit
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
