import React, { useEffect } from "react";
import { Container, FormGroup, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import HttpClient from "../../utils/HttpClient";
import { toast } from "react-toastify";
import GoogleAnalyticsPropertySelect from "../../utils/GoogleAnalyticsPropertySelect";
import { timezoneToDateFormat } from "../../utils/TimezoneTodateFormat";
import { getCompanyName } from "../../helpers/CommonFunctions";
import ErrorAlert from "../../utils/ErrorAlert";
import xor from 'lodash/xor';
import AppsModal from "../AppsMarket/AppsModal";
import AnnotationsUpdate from './EditAnnotation';

class IndexAnnotations extends React.Component {
    constructor() {
        super();
        this.state = {
            annotations: [],
            accounts: [],
            annotationCategories: [],
            userAnnotationColors: {},
            sortBy: "",
            googleAccount: "",
            googleAnalyticsProperty: "",
            category: "",
            searchText: "",
            error: "",
            isBusy: false,
            isLoading: false,
            allAnnotationsSelected: false,
            selectedRows: [],
            editAnnotationId: ''
        };
        this.deleteAnnotation = this.deleteAnnotation.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.sort = this.sort.bind(this);
        this.sortByProperty = this.sortByProperty.bind(this);
        this.sortByCategory = this.sortByCategory.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.checkSearchText = this.checkSearchText.bind(this);

        this.handleAllSelection = this.handleAllSelection.bind(this);
        this.handleOneSelection = this.handleOneSelection.bind(this);
        this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
        this.seeCompleteDescription = this.seeCompleteDescription.bind(this);
    }
    componentDidMount() {
        document.title = "Annotation";

        this.setState({ isBusy: true, isLoading: true });
        HttpClient.get(`/data-source/user-annotation-color`)
            .then(
                (resp) => {
                    this.setState({
                        userAnnotationColors: resp.data.user_annotation_color,
                    });
                    HttpClient.get(`/annotation`)
                        .then(
                            (response) => {
                                this.setState({
                                    annotations: response.data.annotations,
                                    isLoading: false,
                                });
                            },
                            (err) => {
                                this.setState({
                                    errors: err.response.data,
                                    isLoading: false,
                                });
                            }
                        )
                        .catch((err) => {
                            this.setState({ errors: err, isLoading: false });
                        });
                    HttpClient.get(`/annotation-categories`)
                        .then(
                            (response) => {
                                this.setState({
                                    isBusy: false,
                                    annotationCategories:
                                        response.data.categories,
                                });
                            },
                            (err) => {
                                this.setState({
                                    isBusy: false,
                                    errors: err.response.data,
                                });
                            }
                        )
                        .catch((err) => {
                            this.setState({ isBusy: false, errors: err });
                        });
                },
                (err) => {
                    this.setState({ errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ errors: err });
            });

        setTimeout(() => {
            const scrollableAnnotation = document.getElementById(
                "scrollable-annotation"
            );
            const annotationTableBody = document.getElementById(
                "annotation-table-body"
            );
            if (scrollableAnnotation && annotationTableBody) {
                annotationTableBody.scrollTo(0, scrollableAnnotation.offsetTop);
            }
        }, 5000);
    }

    deleteAnnotation(id) {
        this.setState({ isBusy: true });
        HttpClient.delete(`/annotation/${id}`)
            .then(
                (resp) => {
                    toast.success("Annotation deleted.");
                    let annotations = this.state.annotations;
                    annotations = annotations.filter((a) => a.id != id);
                    this.setState({ isBusy: false, annotations: annotations });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    toggleStatus(id) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            let prevAnnotation = this.state.annotations.find(
                (an) => an.id == id
            );
            let newStatus = 0;
            if (prevAnnotation.is_enabled) {
                newStatus = 0;
            } else {
                newStatus = 1;
            }
            HttpClient.put(`/annotation/${id}`, { is_enabled: newStatus })
                .then(
                    (response) => {
                        toast.success("Annotation status changed.");
                        let newAnnotation = response.data.annotation;
                        let annotations = this.state.annotations.map((an) => {
                            if (an.id == id) {
                                return newAnnotation;
                            } else {
                                return an;
                            }
                        });
                        this.setState({
                            isBusy: false,
                            annotations: annotations,
                        });
                    },
                    (err) => {
                        this.setState({
                            isBusy: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleAllSelection(e) {
        this.setState({
            allAnnotationsSelected: e.target.checked,
        });
        if (e.target.checked) {
            let els = document.getElementsByClassName("row_checkbox");
            for (let el of els) {
                let anno_id = el.dataset.anno_id;
                this.state.selectedRows.push(anno_id);
                el.checked = true;
            }
        } else {
            this.state.selectedRows = [];
            let els = document.getElementsByClassName("row_checkbox");
            for (let el of els) {
                el.checked = false;
            }
        }
    }

    handleOneSelection(anno_id) {
        // let anno_id = e.target.dataset.anno_id;

        this.setState({ selectedRows: xor(this.state.selectedRows, [anno_id]) });

        // if input is checked
        // if (e.target.checked) {
        // if annotation id is not in the array
        // if (!this.state.selectedRows.includes(anno_id)) {
        // this.state.selectedRows.push(anno_id);
        // }
        // }
        // if input is not checked, remove the id from array if it exists
        // else {
        // if (this.state.selectedRows.includes(anno_id)) {
        //     let rows = this.state.selectedRows;
        //     let new_rows = rows.filter((item) => item !== anno_id);
        //     this.setState({
        //         selectedRows: new_rows,
        //     });
        // }
        // }

        // if (this.state.selectedRows.length > 0) {
        //     this.setState({
        //         allAnnotationsSelected: true,
        //     });
        // } else {
        //     this.setState({
        //         allAnnotationsSelected: false,
        //     });
        // }
    }

    handleDeleteSelected() {
        this.setState({ isBusy: true });
        HttpClient.post(`annotations/bulk_delete`, {
            annotation_ids: this.state.selectedRows,
        })
            .then(
                (resp) => {
                    toast.success("Annotation(s) deleted.");

                    let selected_annotations = this.state.selectedRows;
                    let annotations = this.state.annotations;

                    for (let selected_annotation of selected_annotations) {
                        annotations = annotations.filter(
                            (a) => a.id != selected_annotation
                        );
                        this.setState({ annotations: annotations });
                    }

                    this.setState({ isBusy: false });

                    this.setState({
                        allAnnotationsSelected: false,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    checkSearchText(annotation) {
        if (this.state.searchText.length) {
            const searchText = this.state.searchText.toLowerCase();
            if (
                (annotation.category &&
                    annotation.category.toLowerCase().indexOf(searchText) >
                    -1) ||
                (annotation.event_name &&
                    annotation.event_name.toLowerCase().indexOf(searchText) >
                    -1) ||
                (annotation.description &&
                    annotation.description.toLowerCase().indexOf(searchText) >
                    -1) ||
                (annotation.show_at &&
                    annotation.show_at.toLowerCase().indexOf(searchText) > -1)
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
            <div id="annotationPage" className="annotationPage">
                <Container>
                    <div className="pageHead">
                        <div className="d-flex justify-content-between align-items-center">
                            <h2 className="pageTitle m-0">Annotations</h2>
                            <div className="addAnnotation">
                                <span>Add Annotation:</span>
                                <a href="javascript:void(0);" onClick={() => this.props.openAnnotationPopup('manual')}><img className='inject-me' src='/manual.svg' width='16' height='16' alt='menu icon' /></a>
                                <Link href="/data-source"><img className='inject-me' src='/appMarket.svg' width='16' height='16' alt='menu icon' /></Link>
                                {this.props.user.user_level == "admin" || this.props.user.user_level == "team" ? (<a onClick={() => this.props.openAnnotationPopup('upload')} href="javascript:void(0);"><img className='inject-me' src='/csvUploadd.svg' width='16' height='16' alt='menu icon' /></a>) : null}
                            </div>
                        </div>

                        <form className="pageFilters d-flex justify-content-between align-items-center">
                            <FormGroup className="filter-sort position-relative">
                                <Label className="sr-only" for="dropdownFilters">sort by filter</Label>
                                <i className="btn-searchIcon left-0">
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666" />
                                    </svg>
                                </i>
                                <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                <select name="sortBy" id="sort-by" value={this.state.sortBy} className="form-control" onChange={this.sort}>
                                    <option value="Null">Sort By</option>
                                    <option value="added">Added</option>
                                    <option value="date">By Date</option>
                                    <option value="category">By Category</option>
                                    <option value="ga-property">By GA Property</option>
                                </select>
                                {this.state.selectedRows.length ? (
                                    <button className="btn btn-danger btn-sm mt-2" onClick={this.handleDeleteSelected}>Delete</button>
                                ) : null}
                            </FormGroup>

                            <div className="d-flex">
                                <FormGroup className="extraSelect position-relative">
                                    <span className="selectIcon"><img src={'/icon-select.svg'} /></span>
                                    <select name="category" id="category" className="form-control">
                                        <option value="select-category">Select</option>
                                    </select>
                                </FormGroup>

                                <FormGroup className="filter-search position-relative">
                                    <Label className="sr-only" for="search">search</Label>
                                    <Input name="searchText" value={this.state.searchText} placeholder="Search..." onChange={this.handleChange} />
                                    <button className="btn-searchIcon"><img className="d-block" src="/search-new.svg" width="16" height="16" alt="Search" /></button>
                                </FormGroup>
                            </div>
                        </form>
                    </div>

                    {this.state.isLoading ? (
                        <></>
                    ) : (
                        <>
                            {this.state.annotations
                                .filter(this.checkSearchText)
                                .map((anno, idx) => {
                                    let borderLeftColor = "rgba(0,0,0,.0625)";
                                    let selectedIcon = anno.category;

                                    switch (anno.category) {
                                        case "Google Updates":
                                            borderLeftColor = this.state.userAnnotationColors.google_algorithm_updates;
                                            break;
                                        case "Retail Marketing Dates":
                                            borderLeftColor = this.state.userAnnotationColors.retail_marketings;
                                            break;
                                        case "Weather Alert":
                                            borderLeftColor = this.state.userAnnotationColors.weather_alerts;
                                            break;
                                        case "Website Monitoring":
                                            borderLeftColor = this.state.userAnnotationColors.web_monitors;
                                            break;
                                        case "WordPress Updates":
                                            borderLeftColor = this.state.userAnnotationColors.wordpress_updates;
                                            break;
                                        case "News Alert":
                                            borderLeftColor = this.state.userAnnotationColors.google_alerts;
                                            break;
                                    }
                                    switch (anno.added_by) {
                                        case "manual":
                                            borderLeftColor = "#002e60";
                                            break;
                                        case "csv-upload":
                                            borderLeftColor = this.state.userAnnotationColors.csv;
                                            break;
                                        case "api":
                                            borderLeftColor = this.state.userAnnotationColors.api;
                                            break;
                                    }
                                    if (anno.category.indexOf("Holiday") !== -1)
                                        borderLeftColor = this.state.userAnnotationColors.holidays;

                                    const currentDateTime =
                                        new Date();
                                    const annotationDateTime =
                                        new Date(anno.show_at);
                                    const diffTime =
                                        annotationDateTime -
                                        currentDateTime;
                                    let rowId = null;
                                    if (
                                        diffTime < 0 &&
                                        wasLastAnnotationInFuture ==
                                        true
                                    )
                                        rowId =
                                            "scrollable-annotation";
                                    if (diffTime > 0) {
                                        wasLastAnnotationInFuture = true;
                                    } else {
                                        wasLastAnnotationInFuture = false;
                                    }

                                    return (
                                        <div
                                            className={`annotionRow d-flex align-items-center ${this.state.selectedRows.includes(anno.id) && "record-checked"}`}
                                            data-diff-in-milliseconds={diffTime}
                                            style={{ 'borderLeftColor': borderLeftColor }}
                                            id={rowId}
                                            key={anno.category + anno.event_name + anno.description + anno.url + anno.id}
                                            onClick={() => this.handleOneSelection(anno.id)}
                                            data-anno_id={anno.id}>

                                            <span className="annotionRowIcon"><img src={`/${selectedIcon}.svg`} onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = "/annotation-default.svg"; }} /></span>

                                            <div className="description d-flex flex-column flex-shrink-1">
                                                <p className="titleCategory d-flex align-items-center">
                                                    <span>{anno.event_name}</span>
                                                    <a href="">{anno.category}</a>
                                                    <i className="fa fa-link"></i>
                                                </p>
                                                <p className="annotationDesc mb-0 d-flex ">
                                                    {anno.description &&
                                                        !anno.show_complete_desc ? anno.description.substring(0, 150) : ""}
                                                    {anno.description &&
                                                        anno.description.length > 150 &&
                                                        !anno.show_complete_desc ? (
                                                        <span>...<a onClick={() => { this.seeCompleteDescription(anno, idx); }} target="_blank" className="ml-1">Read more</a></span>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {anno.description && anno.description.length > 150 && anno.show_complete_desc ? (
                                                        <div id="">{anno.description}</div>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {anno.url && anno.url != "https://" && anno.url != "null" ? (
                                                        <a href={anno.url} target="_blank" className="ml-1"><i className="fa fa-link"></i></a>
                                                    ) : (
                                                        ""
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                                                <ul className="d-flex list-unstyled">
                                                    <li><span className="properties">{anno.google_analytics_property_name ? anno.google_analytics_property_name : "All Properties"}</span></li>
                                                    <li><time datetime={moment(anno.show_at).format(timezoneToDateFormat(this.props.user.timezone))}>{moment(anno.show_at).format(timezoneToDateFormat(this.props.user.timezone))}</time></li>
                                                    <li><a href="#"><i className="mr-2"><img src={"/icon-chart.svg"} /></i><span>open chart</span></a></li>
                                                </ul>

                                                <ul className="d-flex list-unstyled">
                                                    <li>{anno.id ? (
                                                        <span className="cursor-pointer" onClick={() => this.toggleStatus(anno.id)}>
                                                            {anno.is_enabled ? <img src={`/icon-eye-open.svg`} /> : <img src={`/icon-eye-close.svg`} />}
                                                        </span>
                                                    ) : null}
                                                    </li>
                                                    <li>
                                                        <span className="cursor-pointer" onClick={() => this.setState({ editAnnotationId: anno.id })}>
                                                            <img src={`icon-edit.svg`} />
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className="text-danger" onClick={() => { this.deleteAnnotation(anno.id); }}><img src={`icon-trash.svg`} /></span>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                    );

                                })}{" "}
                        </>
                    )}
                </Container>
                <AppsModal isOpen={this.state.editAnnotationId} popupSize={'md'} toggle={() => { this.setState({ editAnnotationId: '' }); }}>
                    <AnnotationsUpdate togglePopup={() => this.setState({editAnnotationId: ''})} editAnnotationId={this.state.editAnnotationId} currentPricePlan={this.props.user.price_plan} />
                </AppsModal>

            </div>
        );
    }

    sort(e) {
        this.setState({ sortBy: e.target.value });
        if (e.target.value !== "ga-account") {
            this.setState({ isLoading: true });
            HttpClient.get(`/annotation?sortBy=${e.target.value}`)
                .then(
                    (response) => {
                        this.setState({
                            isLoading: false,
                            annotations: response.data.annotations,
                        });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });
        }
    }
    sortByProperty(gaPropertyId) {
        this.setState({ googleAnalyticsProperty: gaPropertyId });
        if (gaPropertyId !== "select-ga-property") {
            this.setState({ isLoading: true });
            HttpClient.get(
                `/annotation?annotation_ga_property_id=${gaPropertyId}`
            )
                .then(
                    (response) => {
                        this.setState({
                            isLoading: false,
                            annotations: response.data.annotations,
                        });
                    },
                    (err) => {
                        this.setState({
                            isLoading: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isLoading: false, errors: err });
                });
        }
    }
    sortByCategory(catName) {
        this.setState({ category: catName });
        let url = "";
        if (catName !== "select-category") {
            url = `/annotation?category=${catName}`;
        } else {
            url = `/annotation?sortBy=category`;
        }
        this.setState({ isLoading: true });
        HttpClient.get(url)
            .then(
                (response) => {
                    this.setState({
                        isLoading: false,
                        annotations: response.data.annotations,
                    });
                },
                (err) => {
                    this.setState({
                        isLoading: false,
                        errors: err.response.data,
                    });
                }
            )
            .catch((err) => {
                this.setState({ isLoading: false, errors: err });
            });
    }
    seeCompleteDescription(anno, idx) {
        anno.show_complete_desc = true;
        let annotations_new = this.state.annotations;
        annotations_new[idx] = anno;
        this.setState({
            annotations: annotations_new,
        });
    }
}

export default IndexAnnotations;
