import React from 'react';
import HttpClient from '../../utils/HttpClient';

export default class CreateAnnotation extends React.Component {

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
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
    }

    setDefaultState() {
        this.setState({
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
        });
    }

    changeHandler(e) {
        this.setState({ annotation: { ...this.state.annotation, [e.target.name]: e.target.value } });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate()) {
            HttpClient.post("/annotation", this.state.annotation).then(resp => {
                this.setDefaultState();
            }).catch(err => {
                this.setState({ error: err });
                console.log(err)
            });
        }

    }

    validate() {
        let category = this.state.category;
        let event_type = this.state.event_type;
        let event_name = this.state.event_name;
        let url = this.state.url;
        let description = this.state.description;
        let title = this.state.title;
        let show_at = this.state.show_at;
        let type = this.state.type;

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

    componentDidMount() {
        document.title = 'Create Annotation'
    }

    render() {
        const validation = this.state.validation;
        return (
            <div className="container-xl bg-white" style={{ minHeight: '100vh' }}>
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section">Add Annotation <br />
                                    <small>Enter your annotation details</small>
                                </h2>
                            </div>
                        </div>

                        <form onSubmit={this.submitHandler}>
                            <div className="row">

                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <input type="text" className="form-control" id="category" name="category"
                                            value={this.state.category} onChange={this.changeHandler} />
                                        <label htmlFor="category" className="form-control-placeholder">Category</label>
                                        {
                                            validation.category ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.category}</span> : ''
                                        }


                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  ">
                                        <select className="form-control" onChange={this.changeHandler} name="event_type" id="event_type" value={this.state.event_type} >
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
                                        <input type="text" className="form-control" value={this.state.event_name} onChange={this.changeHandler} id="event_name" name="event_name" />
                                        <label htmlFor="event_name" className="form-control-placeholder">event_name</label>

                                        {
                                            validation.event_name ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.event_name}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <input type="text" value={this.state.url} onChange={this.changeHandler} className="form-control" id="url" name="url" />
                                        <label htmlFor="url" className="form-control-placeholder">url</label>

                                        {
                                            validation.url ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.url}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group  has-danger ">
                                        <textarea type="text" value={this.state.description} onChange={this.changeHandler} className="form-control" id="description" name="description"></textarea>
                                        <label htmlFor="description" className="form-control-placeholder">description</label>
                                        {
                                            validation.description ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.description}</span> : ''
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <input type="text" value={this.state.title} onChange={this.changeHandler} className="form-control" id="title" name="title" />
                                        <label htmlFor="title" className="form-control-placeholder">title</label>

                                        {
                                            validation.title ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.title}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <input type="date" onChange={this.changeHandler} value={this.state.show_at} className="form-control" id="show_at" name="show_at" />
                                        <label htmlFor="show_at" className="form-control-placeholder">show_at</label>

                                        {
                                            validation.show_at ?
                                                <span className="bmd-help text-danger"> &nbsp; &nbsp;{validation.show_at}</span> : ''
                                        }

                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group ">
                                        <input type="text" value={this.state.type} onChange={this.changeHandler} className="form-control" id="type" name="type" />
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
                                        <i className="ion-ios-plus"></i>
                                        save
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
