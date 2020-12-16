import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient from '../../utils/HttpClient';
import { toast } from "react-toastify";
import GoogleAccountSelect from "../../utils/GoogleAccountSelect";
require('../../Main.css');

class IndexAnnotations extends React.Component {

    constructor() {
        super();
        this.state = {
            annotations: [],
            sortBy: '',
            accounts: [],
            annotationCategories: [],
            googleAccount: '',
            category: '',

            error: '',
            isBusy: false
        }
        this.deleteAnnotation = this.deleteAnnotation.bind(this)
        this.toggleStatus = this.toggleStatus.bind(this)
        this.sort = this.sort.bind(this)
        this.sortByAccount = this.sortByAccount.bind(this)
        this.sortByCategory = this.sortByCategory.bind(this)
    }
    componentDidMount() {
        document.title = 'Annotation';

        this.setState({ isBusy: true });
        HttpClient.get(`/annotation`)
            .then(response => {
                this.setState({ annotations: response.data.annotations });
            }, (err) => {
                console.log(err);
                this.setState({ errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ errors: err });
            });
        /////
        HttpClient.get(`/annotation-categories`)
            .then(response => {
                this.setState({ isBusy: false, annotationCategories: response.data.categories });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });

    }

    deleteAnnotation(id) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/annotation/${id}`).then(resp => {
            toast.success("Annotation deleted.");
            let annotations = this.state.annotations;
            annotations = annotations.filter(a => a.id != id);
            this.setState({ isBusy: false, annotations: annotations })
        }, (err) => {
            console.log(err);
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            console.log(err);
            this.setState({ isBusy: false, errors: err });
        });
    }

    toggleStatus(id) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            let prevAnnotation = this.state.annotations.filter(an => an.id == id)[0];
            let newStatus = 0;
            if (prevAnnotation.is_enabled) { newStatus = 0 } else { newStatus = 1 }
            HttpClient.put(`/annotation/${id}`, { is_enabled: newStatus }).then(response => {
                toast.success("Annotation status changed.");
                let newAnnotation = response.data.annotation;
                let annotations = this.state.annotations.map(an => { if (an.id == id) { return newAnnotation } else { return an } })
                this.setState({ isBusy: false, 'annotations': annotations })
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err);
                this.setState({ isBusy: false, errors: err });
            });
        }
    }

    sort(e) {
        this.setState({ sortBy: e.target.value });
        if (e.target.value !== 'ga-account') {
            this.setState({ isBusy: true });
            HttpClient.get(`/annotation?sortBy=${e.target.value}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    console.log(err);
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    console.log(err)
                    this.setState({ isBusy: false, errors: err });
                });
        }

    }
    sortByAccount(gaAccountId) {
        this.setState({ googleAccount: gaAccountId });
        if (gaAccountId !== 'select-ga-account') {
            this.setState({ isBusy: true });
            HttpClient.get(`/annotation?google_account_id=${gaAccountId}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    console.log(err);
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    console.log(err)
                    this.setState({ isBusy: false, errors: err });
                });
        }

    }
    sortByCategory(catName) {
        this.setState({ category: catName });
        if (catName !== 'select-category') {
            this.setState({ isBusy: true });
            HttpClient.get(`/annotation?by_category=${catName}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    console.log(err);
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    console.log(err)
                    this.setState({ isBusy: false, errors: err });
                });
        }

    }



    render() {

        const annotations = this.state.annotations;
        const categories = this.state.annotationCategories;
        return (
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section   " id="inputs">
                    <div className="container-xl p-0">
                        <div className="row ml-0 mr-0 mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Annotations</h2>
                            </div>
                        </div>
                        <div className="row mb-4 ml-0 mr-0">
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6  text-center text-sm-center text-md-left text-lg-left">
                                <div className="d-flex flex-row ">

                                    <select name="sortBy" id="sort-by" value={this.state.sortBy} className="form-control mr-3" onChange={this.sort}>
                                        <option value="Null">Sort By</option>
                                        <option value="added">Added</option>
                                        <option value="date">By Date</option>
                                        <option value="by-category">By Category</option>
                                        <option value="ga-account">By Ga-annotation-account</option>
                                    </select>
                                    {

                                        this.state.sortBy == "ga-account" ?
                                            <GoogleAccountSelect name={'googleAccount'} disabled={this.state.sortBy !== "ga-account"} id={'googleAccount'} value={this.state.googleAccount} onChangeCallback={(e) => { this.sortByAccount(e.target.value) }} />
                                            : this.state.sortBy == "by-category" ?
                                                <select name="category" id="category" value={this.state.category} className="form-control" onChange={(e) => { this.sortByCategory(e.target.value) }}>
                                                    <option value="select-category">Select Category</option>
                                                    {
                                                        categories.map(cats => (
                                                            <option value={cats.category} key={cats.category}>{cats.category}</option>
                                                        ))
                                                    }
                                                </select>

                                                : ''

                                    }

                                </div>
                            </div>
                            <div className="col-12 col-sm-12 col-md-6 col-lg-6 pt-4 pt-sm-0 p-md-0 pt-lg-0 text-center text-sm-center text-md-right text-lg-right">
                                <Link to="/annotation/create" className="btn btn-sm gaa-bg-primary text-white mr-2"><i className=" mr-2 fa fa-plus"></i>Add Manual</Link>
                                <Link to="/annotation/upload" className="btn btn-sm gaa-bg-primary text-white"><i className=" mr-2 fa fa-upload"></i>CSV Upload</Link>

                            </div>
                        </div>
                        <div className="row ml-0 mr-0">
                            <div className="col-12">

                                <table className="table table-hover table-bordered table-striped table-responsive table-responsive-md annotation-table">
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Event Name</th>
                                            <th>Description</th>
                                            <th>Google Account</th>
                                            <th>Status</th>
                                            <th>Show At</th>
                                            <th>Actions</th>

                                        </tr>
                                    </thead>
                                    <tbody>


                                        {

                                            annotations.map(anno => (
                                                <tr key={anno.id} className={
                                                    anno.category == "Holidays" || anno.category == "holidays" ? "text-primary" :
                                                        anno.category == "google updates" || anno.category == "Google Updates" ? "text-success" :
                                                            anno.category == "sales event" || anno.category == "Sales Event" ? "text-alert" : "gaa-text-primary"

                                                }>
                                                    <td>{anno.category}</td>
                                                    <td>{anno.event_name}</td>
                                                    <td>
                                                        <div className="desc-wrap">
                                                            <div className="desc-td">
                                                                <p>{anno.description}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {anno.google_account_id ? anno.google_account_email : 'All accounts'}
                                                    </td>
                                                    <td>
                                                        {anno.id ?
                                                            <button className={"btn btn-sm" + (anno.is_enabled ? " btn-success" : " btn-danger") + (this.state.isBusy ? " disabled" : "")} onClick={() => this.toggleStatus(anno.id)}>
                                                                {anno.is_enabled ? "On" : "Off"}
                                                            </button>
                                                            : null}
                                                    </td>
                                                    <td>{moment(anno.show_at).format('YYYY-MM-DD')}</td>
                                                    <td className="d-flex">
                                                        {anno.id?
                                                            <React.Fragment>
                                                                <button type="button" onClick={() => {
                                                                    this.deleteAnnotation(anno.id)

                                                                }} className="btn btn-sm gaa-btn-danger anno-action-btn text-white mr-1 mr-md-2">
                                                                    <i className="mr-0 mr-md-1 fa fa-trash"></i>
                                                                <span className="action-text">Delete</span>
                                                            </button>
                                                                <Link to={`/annotation/${anno.id}/edit`} className="btn anno-action-btn btn-sm gaa-bg-primary text-white" >
                                                                    <i className="mr-0 mr-md-1 fa fa-edit"></i>
                                                                    <span className="action-text"> Edit</span>
                                                        </Link>

                                                            </React.Fragment>
                                                            : null}
                                                    </td>
                                                </tr>
                                            ))
                                        }


                                    </tbody>



                                </table>
                            </div>

                        </div>
                    </div>

                </section>
            </div>
        );
    }

}

export default IndexAnnotations;
