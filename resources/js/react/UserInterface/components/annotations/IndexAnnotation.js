import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import HttpClient from '../../utils/HttpClient';
import { toast } from "react-toastify";
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';
import { timezoneToDateFormat } from '../../utils/TimezoneTodateFormat';
import { getCompanyName } from '../../helpers/CommonFunctions';
import ErrorAlert from '../../utils/ErrorAlert';

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
            isBusy: false,
            isLoading: false,
            allAnnotationsSelected: false,
            selectedRows: []
        }
        this.deleteAnnotation = this.deleteAnnotation.bind(this)
        this.toggleStatus = this.toggleStatus.bind(this)
        this.sort = this.sort.bind(this)
        this.sortByProperty = this.sortByProperty.bind(this)
        this.sortByCategory = this.sortByCategory.bind(this)

        this.handleChange = this.handleChange.bind(this)
        this.checkSearchText = this.checkSearchText.bind(this)

        this.handleAllSelection = this.handleAllSelection.bind(this)
        this.handleOneSelection = this.handleOneSelection.bind(this)
        this.handleDeleteSelected = this.handleDeleteSelected.bind(this)

    }
    componentDidMount() {
        document.title = 'Annotation';

        this.setState({ isBusy: true, isLoading: true });
        HttpClient.get(`/data-source/user-annotation-color`).then(resp => {
            this.setState({ userAnnotationColors: resp.data.user_annotation_color });
            HttpClient.get(`/annotation`)
                .then(response => {
                    this.setState({ annotations: response.data.annotations, isLoading: false });
                }, (err) => {
                    this.setState({ errors: (err.response).data, isLoading: false });
                }).catch(err => {
                    this.setState({ errors: err, isLoading: false });
                });
            HttpClient.get(`/annotation-categories`)
                .then(response => {
                    this.setState({ isBusy: false, annotationCategories: response.data.categories });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
        }, (err) => {
            this.setState({ errors: (err.response).data });
        }).catch(err => {
            this.setState({ errors: err });
        })

        setTimeout(() => {
            const scrollableAnnotation = document.getElementById("scrollable-annotation");
            const annotationTableBody = document.getElementById("annotation-table-body");
            if (scrollableAnnotation && annotationTableBody) {
                annotationTableBody.scrollTo(0, scrollableAnnotation.offsetTop);
            }
        }, 5000);
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
            let prevAnnotation = this.state.annotations.find(an => an.id == id);
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

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleAllSelection(e) {
        this.setState({
            allAnnotationsSelected: e.target.checked
        });
        if (e.target.checked) {
            let els = document.getElementsByClassName('row_checkbox')
            for (let el of els) {
                let anno_id = el.dataset.anno_id;
                this.state.selectedRows.push(anno_id)
                el.checked = true;
            }
        }
        else {
            this.state.selectedRows = [];
            let els = document.getElementsByClassName('row_checkbox')
            for (let el of els) {
                el.checked = false;
            }
        }
    }

    handleOneSelection(e) {
        let anno_id = e.target.dataset.anno_id;

        // if input is checked
        if (e.target.checked) {
            // if annotation id is not in the array
            if (!this.state.selectedRows.includes(anno_id)) {
                this.state.selectedRows.push(anno_id)
            }
        }
        // if input is not checked, remove the id from array if it exists
        else {
            if (this.state.selectedRows.includes(anno_id)) {
                let rows = this.state.selectedRows;
                let new_rows = rows.filter(item => item !== anno_id)
                this.setState({
                    selectedRows: new_rows
                })
            }
        }

        if (this.state.selectedRows.length > 0) {
            this.setState({
                allAnnotationsSelected: true
            });
        }
        else {
            this.setState({
                allAnnotationsSelected: false
            });
        }
    }

    handleDeleteSelected() {
        this.setState({ isBusy: true });
        HttpClient.post(`annotations/bulk_delete`, {
            annotation_ids: this.state.selectedRows
        }).then(resp => {
            toast.success("Annotation(s) deleted.");

            let selected_annotations = this.state.selectedRows;
            let annotations = this.state.annotations;

            for (let selected_annotation of selected_annotations) {
                annotations = annotations.filter(a => a.id != selected_annotation);
                this.setState({ annotations: annotations })
            }

            this.setState({ isBusy: false })

            this.setState({
                allAnnotationsSelected: false
            });

        }, (err) => {

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    checkSearchText(annotation) {
        if (this.state.searchText.length) {
            const searchText = this.state.searchText.toLowerCase();
            if (
                (annotation.category && annotation.category.toLowerCase().indexOf(searchText) > -1)
                || (annotation.event_name && annotation.event_name.toLowerCase().indexOf(searchText) > -1)
                || (annotation.description && annotation.description.toLowerCase().indexOf(searchText) > -1)
                || (annotation.show_at && annotation.show_at.toLowerCase().indexOf(searchText) > -1)
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    render() {
        let wasLastAnnotationInFuture = true;
        const categories = this.state.annotationCategories;

        return (
            <div className="container-xl bg-white anno-container d-flex flex-column justify-content-center component-wrapper" >
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
                                    <Link to="/annotation/create" className="btn btn-sm gaa-btn-primary text-white float-left w-100 mb-2"><i className=" mr-2 fa fa-plus"></i>Add Manual</Link>
                                    <Link to="/data-source" className="btn btn-sm gaa-btn-primary text-white float-left w-100">Add Automated Annotations</Link>
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
                                        {/* <option value="added-by">By Colour</option> */}
                                    </select>
                                    {
                                        this.state.selectedRows.length ?
                                            <button className='btn btn-danger btn-sm mt-2' onClick={this.handleDeleteSelected}>Delete</button>
                                            : null
                                    }
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
                                    <ErrorAlert errors={this.state.errors} />
                                    <div id="annotation-table-container" className="table-responsive">
                                        <table className="table table-hover gaa-hover table-bordered">
                                            <thead id="annotation-table-head">
                                                <tr>
                                                    <th><input type="checkbox" onClick={this.handleAllSelection} /></th>
                                                    <th>Category</th>
                                                    <th style={{width: "25% !important", wordWrap: "break-word", wordBreak: "break-all"}}>Event Name</th>
                                                    <th>Description</th>
                                                    <th>Properties</th>
                                                    <th>Status</th>
                                                    <th style={{ minWidth: '100px' }}>Show At</th>
                                                    <th style={{ minWidth: '100px' }}>Added By</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody id="annotation-table-body">
                                                {
                                                    this.state.isLoading ?
                                                        <tr key={"blank-row"}>
                                                            <td colSpan="8" className="text-center">
                                                                <i className="fa fa-spinner fa-spin fa-pulse fa-3x"></i>
                                                            </td>
                                                        </tr>
                                                        :

                                                        this.state.annotations.filter(this.checkSearchText).map(anno => {
                                                            let borderLeftColor = "rgba(0,0,0,.0625)";
                                                            switch (anno.category) {
                                                                case "Google Updates": borderLeftColor = this.state.userAnnotationColors.google_algorithm_updates; break;
                                                                case "Retail Marketing Dates": borderLeftColor = this.state.userAnnotationColors.retail_marketings; break;
                                                                case "Weather Alert": borderLeftColor = this.state.userAnnotationColors.weather_alerts; break;
                                                                case "Website Monitoring": borderLeftColor = this.state.userAnnotationColors.web_monitors; break;
                                                                case "WordPress Updates": borderLeftColor = this.state.userAnnotationColors.wordpress_updates; break;
                                                                case "News Alert": borderLeftColor = this.state.userAnnotationColors.google_alerts; break;
                                                            }
                                                            switch (anno.added_by) {
                                                                case "manual": borderLeftColor = "#002e60"; break;
                                                                case "csv-upload": borderLeftColor = this.state.userAnnotationColors.csv; break;
                                                                case "api": borderLeftColor = this.state.userAnnotationColors.api; break;
                                                            }
                                                            if (anno.category.indexOf("Holiday") !== -1) borderLeftColor = this.state.userAnnotationColors.holidays;

                                                            const currentDateTime = new Date; const annotationDateTime = new Date(anno.show_at);
                                                            const diffTime = annotationDateTime - currentDateTime;
                                                            let rowId = null;
                                                            if (diffTime < 0 && wasLastAnnotationInFuture == true) rowId = 'scrollable-annotation';
                                                            if (diffTime > 0) { wasLastAnnotationInFuture = true; } else { wasLastAnnotationInFuture = false; }

                                                            return (
                                                                <tr data-diff-in-milliseconds={diffTime} id={rowId} key={anno.category + anno.event_name + anno.description + anno.url + anno.id}>
                                                                    {/* style={{ borderLeft: `${borderLeftColor} solid 20px` }} */}
                                                                    <td><input type="checkbox" className='row_checkbox' data-anno_id={anno.id} onChange={this.handleOneSelection} /></td>
                                                                    <td>{anno.category}</td>
                                                                    <td>{anno.event_name}</td>
                                                                    <td style={{ overflowWrap: "anywhere" }}>
                                                                        {anno.description ? anno.description.substring(0, 50) : null}{anno.description && anno.description.length > 50 ? '...' : null}
                                                                        {(anno.url && anno.url != "https://" && anno.url != "null") ? <a href={anno.url} target="_blank" className="ml-1"><i className="fa fa-link"></i></a> : null}
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
                                                                    <td>{anno.event_name == 'Sample Annotation' ? getCompanyName() : anno.user_name}</td>
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

    sort(e) {
        this.setState({ sortBy: e.target.value });
        if (e.target.value !== 'ga-account') {
            this.setState({ isLoading: true });
            HttpClient.get(`/annotation?sortBy=${e.target.value}`)
                .then(response => {
                    this.setState({ isLoading: false, annotations: response.data.annotations });
                }, (err) => {

                    this.setState({ isLoading: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isLoading: false, errors: err });
                });
        }

    }
    sortByProperty(gaPropertyId) {
        this.setState({ googleAnalyticsProperty: gaPropertyId });
        if (gaPropertyId !== 'select-ga-property') {
            this.setState({ isLoading: true });
            HttpClient.get(`/annotation?annotation_ga_property_id=${gaPropertyId}`)
                .then(response => {
                    this.setState({ isLoading: false, annotations: response.data.annotations });
                }, (err) => {

                    this.setState({ isLoading: false, errors: (err.response).data });
                }).catch(err => {

                    this.setState({ isLoading: false, errors: err });
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
        this.setState({ isLoading: true });
        HttpClient.get(url)
            .then(response => {
                this.setState({ isLoading: false, annotations: response.data.annotations });
            }, (err) => {
                this.setState({ isLoading: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isLoading: false, errors: err });
            });

    }

}

export default IndexAnnotations;
