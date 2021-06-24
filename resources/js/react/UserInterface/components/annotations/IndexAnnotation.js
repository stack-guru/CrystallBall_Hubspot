import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient from '../../utils/HttpClient';
import { toast } from "react-toastify";
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';
import { timezoneToDateFormat } from '../../utils/TimezoneTodateFormat';
import UserAnnotationColorPicker from '../../helpers/UserAnnotationColorPickerComponent';

class IndexAnnotations extends React.Component {

    constructor() {
        super();
        this.state = {
            annotations: [],
            accounts: [],
            annotationCategories: [],
            userAnnotationColors: {},
            sortBy: '',
            googleAccount: '',
            googleAnalyticsProperty: '',
            category: '',
            searchText: '',
            error: '',
            isBusy: false
        }
        this.deleteAnnotation = this.deleteAnnotation.bind(this)
        this.toggleStatus = this.toggleStatus.bind(this)
        this.sort = this.sort.bind(this)
        this.sortByProperty = this.sortByProperty.bind(this)
        this.sortByCategory = this.sortByCategory.bind(this)

        this.handleChange = this.handleChange.bind(this)
        this.checkSearchText = this.checkSearchText.bind(this)

        this.loadUserAnnotationColors = this.loadUserAnnotationColors.bind(this);


    }
    componentDidMount() {
        document.title = 'Annotation';

        this.setState({ isBusy: true });
        this.loadUserAnnotationColors();
        HttpClient.get(`/annotation`)
            .then(response => {
                this.setState({ annotations: response.data.annotations });
            }, (err) => {

                this.setState({ errors: (err.response).data });
            }).catch(err => {

                this.setState({ errors: err });
            });
        //////////////////////////////////////////////////////////////////////////////////////
        HttpClient.get(`/annotation-categories`)
            .then(response => {
                this.setState({ isBusy: false, annotationCategories: response.data.categories });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });

    }

    loadUserAnnotationColors() {
        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
            HttpClient.get(`/data-source/user-annotation-color`).then(resp => {
                this.setState({ isLoading: false, userAnnotationColors: resp.data.user_annotation_color });
            }, (err) => {
                this.setState({ isLoading: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isLoading: false, errors: err });
            })
        }
    }

    deleteAnnotation(id) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/annotation/${id}`).then(resp => {
            toast.success("Annotation deleted.");
            let annotations = this.state.annotations;
            annotations = annotations.filter(a => a.id != id);
            this.setState({ isBusy: false, annotations: annotations })
        }, (err) => {

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

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

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

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

                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isBusy: false, errors: err });
                });
        }

    }
    sortByProperty(gaPropertyId) {
        this.setState({ googleAnalyticsProperty: gaPropertyId });
        if (gaPropertyId !== 'select-ga-property') {
            this.setState({ isBusy: true });
            HttpClient.get(`/annotation?annotation_ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {

                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isBusy: false, errors: err });
                });
        }

    }
    sortByCategory(catName) {
        this.setState({ category: catName });
        let url = "";
        if (catName !== 'select-category') {
            url = `/annotation?category=${catName}`;
        } else {
            url = `/annotation?sortBy=category`;
        }
        this.setState({ isBusy: true });
        HttpClient.get(url)
            .then(response => {
                this.setState({ isBusy: false, annotations: response.data.annotations });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });

    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    checkSearchText(annotation) {
        if (this.state.searchText.length) {
            if (
                annotation.category.toLowerCase().indexOf(this.state.searchText) > -1
                || annotation.event_name.toLowerCase().indexOf(this.state.searchText) > -1
                || annotation.description.toLowerCase().indexOf(this.state.searchText) > -1
                || annotation.show_at.toLowerCase().indexOf(this.state.searchText) > -1
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    render() {

        const categories = this.state.annotationCategories;
        return (
            <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section" id="inputs">
                    <div className="container-xl p-0">
                        <div className="row ml-0 mr-0 mb-1">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Annotations</h2>
                            </div>
                        </div>
                        <div id="annotation-index-container">
                            <div className="row mb-3 ml-0 mr-0">
                                <div className="col-sm-12 col-md-9 col-lg-9 text-center text-sm-center text-md-left text-lg-left mb-3"></div>
                                <div className="col-sm-12 col-md-3 col-lg-3 text-center text-sm-center text-md-right text-lg-right">
                                    <Link to="/annotation/create" className="btn btn-sm gaa-btn-primary text-white float-left"><i className=" mr-2 fa fa-plus"></i>Add Manual&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Link>
                                    <Link to="/annotation/upload" className="btn btn-sm gaa-btn-primary text-white float-right"><i className=" mr-2 fa fa-upload"></i>CSV Upload&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Link>
                                </div>
                            </div>
                            <div className="row mb-1 ml-0 mr-0">
                                <div className="col-sm-12 col-md-2 col-lg-2 text-center text-sm-center text-md-left text-lg-left mb-3">
                                    <select name="sortBy" id="sort-by" value={this.state.sortBy} className="form-control" onChange={this.sort}>
                                        <option value="Null">Sort By</option>
                                        <option value="added">Added</option>
                                        <option value="date">By Date</option>
                                        <option value="category">By Category</option>
                                        <option value="ga-property">By GA Property</option>
                                    </select>

                                </div>
                                <div className="col-sm-12 col-md-3 col-lg-3 text-center text-sm-center text-md-left text-lg-left">
                                    {
                                        this.state.sortBy == "ga-property" ?
                                            <GoogleAnalyticsPropertySelect name={'googleAnalyticsProperty'} id={'googleAnalyticsProperty'} value={this.state.googleAnalyticsProperty} onChangeCallback={(e) => { this.sortByProperty(e.target.value) }} />
                                            : null
                                    }
                                    {
                                        this.state.sortBy == "category" ?
                                            <select name="category" id="category" value={this.state.category} className="form-control" onChange={(e) => { this.sortByCategory(e.target.value) }}>
                                                <option value="select-category">Select Category</option>
                                                {
                                                    categories.map(cats => (
                                                        <option value={cats.category} key={cats.category}>{cats.category}</option>
                                                    ))
                                                }
                                            </select>
                                            : null
                                    }
                                </div>
                                <div className="col-sm-12 col-md-4 col-lg-4  text-center text-sm-center text-md-right text-lg-right"></div>
                                <div className="col-sm-12 col-md-3 col-lg-3  text-center text-sm-center text-md-right text-lg-right">
                                    <input name="searchText" value={this.state.searchText} className="form-control float-right m-w-255px" placeholder="Search..." onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="row ml-0 mr-0">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Category</th>
                                                    <th>Event Name</th>
                                                    <th>Description</th>
                                                    <th>Properties</th>
                                                    <th>Status</th>
                                                    <th style={{ minWidth: '100px' }}>Show At</th>
                                                    <th style={{ minWidth: '100px' }}>Added By</th>
                                                    <th>Actions</th>

                                                </tr>
                                            </thead>
                                            <tbody>


                                                {

                                                    this.state.annotations.filter(this.checkSearchText).map(anno => {
                                                        let borderLeftColor = "rgba(0,0,0,.0625)";
                                                        switch (anno.category) {
                                                            // case "": borderLeftColor = this.state.userAnnotationColors.manual; break;
                                                            // case "": borderLeftColor = this.state.userAnnotationColors.csv; break;
                                                            case "API": borderLeftColor = this.state.userAnnotationColors.api; break;
                                                            case "Google Updates": borderLeftColor = this.state.userAnnotationColors.google_algorithm_updates; break;
                                                            case "Retail Marketing Dates": borderLeftColor = this.state.userAnnotationColors.retail_marketings; break;
                                                            case "Weather Alert": borderLeftColor = this.state.userAnnotationColors.weather_alerts; break;
                                                            case "Website Monitoring": borderLeftColor = this.state.userAnnotationColors.web_monitors; break;
                                                            case "Wordpress Updates": borderLeftColor = this.state.userAnnotationColors.wordpress_updates; break;
                                                            case "News Alert": borderLeftColor = this.state.userAnnotationColors.google_alerts; break;
                                                        }
                                                        if (anno.category.indexOf("Holiday") !== -1) borderLeftColor = this.state.userAnnotationColors.holidays;
                                                        return (
                                                            <tr>
                                                                <td style={{ borderLeft: `${borderLeftColor} solid 20px` }}>{anno.category}</td>
                                                                <td>{anno.event_name}</td>
                                                                <td>
                                                                    <div className="desc-wrap">
                                                                        <div className="desc-td">
                                                                            <p>{anno.description}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {anno.google_analytics_property_name ? anno.google_analytics_property_name : 'All Properties'}
                                                                </td>
                                                                <td className="text-center">
                                                                    {anno.id ?
                                                                        <button className={"btn btn-sm" + (anno.is_enabled ? " btn-success" : " btn-danger") + (this.state.isBusy ? " disabled" : "")} onClick={() => this.toggleStatus(anno.id)}>
                                                                            {anno.is_enabled ? "On" : "Off"}
                                                                        </button>
                                                                        : null}
                                                                </td>
                                                                <td>{moment(anno.show_at).format(timezoneToDateFormat(this.props.user.timezone))}</td>
                                                                <td>{anno.event_name == 'Sample Annotation' ? 'GAannotations' : anno.user_name}</td>
                                                                <td className="text-center">
                                                                    {anno.id ?
                                                                        <React.Fragment>
                                                                            <button type="button" onClick={() => {
                                                                                this.deleteAnnotation(anno.id)

                                                                            }} className="btn btn-sm gaa-btn-danger anno-action-btn text-white m-1">
                                                                                <i className="fa fa-trash"></i>
                                                                            </button>
                                                                            <Link to={`/annotation/${anno.id}/edit`} className="btn anno-action-btn btn-sm gaa-btn-primary text-white m-1" style={{ width: '28.3667px' }}>
                                                                                <i className="fa fa-edit"></i>
                                                                            </Link>

                                                                        </React.Fragment>
                                                                        : null}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }


                                            </tbody>



                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </section>
            </div >
        );
    }

}

export default IndexAnnotations;
