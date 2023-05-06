import React, { useEffect } from "react";
import { Container, FormGroup, Input, Label } from "reactstrap";
import { Link } from "react-router-dom";
import HttpClient from "../../utils/HttpClient";
import GoogleAnalyticsPropertySelect from "../../utils/GoogleAnalyticsPropertySelect";
import { timezoneToDateFormat } from "../../utils/TimezoneTodateFormat";
import { getCompanyName } from "../../helpers/CommonFunctions";
import ErrorAlert from "../../utils/ErrorAlert";
import xor from 'lodash/xor';
import AppsModal from "../AppsMarket/AppsModal";
import AnnotationsUpdate from './EditAnnotation';
import ShowChartAnnotation from './ShowChartAnnotation';
import Toast from "../../utils/Toast";
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import { capitalize, uniqBy } from "lodash";


function splitDisplayString(displayString, maxLength = 300) {
    const items = displayString.split(",");
    let lines = [];
    let currentLine = items[0];

    for (let i = 1; i < items.length; i++) {
        if (currentLine.length + items[i].length + 1 <= maxLength) {
            currentLine += "," + items[i];
        } else {
            lines.push(currentLine);
            currentLine = items[i];
        }
    }

    lines.push(currentLine);
    return lines;
}


export function CustomTooltip({ children, tooltipText, maxLength }) {
    const lines = splitDisplayString(tooltipText, maxLength);
    const formattedTooltipText = lines.join("<br>");

    return (
        <div className="dd-tooltip">
            {children}
            <div
                className="dd-tooltip-text"
                dangerouslySetInnerHTML={{ __html: formattedTooltipText }}
            />
        </div>
    );
}

function stripHtmlTags(str) {
    if (!str) {
        return '';
    }

    if (typeof str !== 'string') {
        // throw new TypeError('stripHtmlTags() expects a string argument.');
        return '';
    }

    return str.replace(/<[^>]*>/g, '');
}

class IndexAnnotations extends React.Component {

    axiosCancelToken = null;
    loadAnnotationsCancelToken = null;

    constructor() {
        super();
        this.state = {
            error: "",
            isBusy: false,
            isLoading: false,

            annotations: [],
            accounts: [],
            annotationCategories: [],
            userAnnotationColors: {},
            allAnnotationsSelected: false,
            selectedRows: [],
            editAnnotationId: '',
            showChartAnnotationId: '',

            // Table Actions
            sortBy: "",
            searchText: "",
            googleAccount: "",
            category: "",
            googleAnalyticsProperty: "",

            // Table Infinite Scroll
            pageSize: 20,
            pageNumber: 0,
            enableSelect: false,
            hideInfiniteScroll: false,
            hasMore: true,
        };
        this.deleteAnnotation = this.deleteAnnotation.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.sort = this.sort.bind(this);
        this.sortByProperty = this.sortByProperty.bind(this);
        this.sortByCategory = this.sortByCategory.bind(this);

        this.handleChange = this.handleChange.bind(this);
        // this.registerScrollEvent = this.registerScrollEvent.bind(this);

        this.handleAllSelection = this.handleAllSelection.bind(this);
        this.handleOneSelection = this.handleOneSelection.bind(this);
        this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
        this.seeCompleteDescription = this.seeCompleteDescription.bind(this);
        this.loadMoreAnnotations = this.loadMoreAnnotations.bind(this);
        this.loadInitAnnotations = this.loadInitAnnotations.bind(this);
        this.loadAnnotationColors = this.loadAnnotationColors.bind(this);
    }
    componentDidMount() {
        this.axiosCancelToken = axios.CancelToken;
        document.title = "Annotation";

        this.loadMoreAnnotations(0);
        this.setState({ isBusy: true, isLoading: true });
        this.loadAnnotationColors ()
        // setTimeout(() => {
        //     const scrollableAnnotation = document.getElementById(
        //         "scrollable-annotation"
        //     );
        //     const annotationTableBody = document.getElementById(
        //         "annotation-table-body"
        //     );
        //     if (scrollableAnnotation && annotationTableBody) {
        //         annotationTableBody.scrollTo(0, scrollableAnnotation.offsetTop);
        //     }
        // }, 5000);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.mKeyAnnotation !== this.props.mKeyAnnotation) {
            if (prevProps.mKeyAnnotation === 'manual' || prevProps.mKeyAnnotation === 'upload' && (this.props.mKeyAnnotation === '')) {
                this.setState({
                    annotations: [],
                    pageNumber: 0,
                    isLoading: false,
                    hideInfiniteScroll: true
                }, () => {
                    this.setState({ hideInfiniteScroll: false }, () => {
                        this.loadMoreAnnotations()
                        this.loadAnnotationColors()
                    })
                });
            }

        }
    }

    loadMoreAnnotations(page) {
        if (!this.state.isLoading) {
            this.setState({
                pageNumber: this.state.pageNumber + 1,
                isLoading: true,
                hideInfiniteScroll: false,
            }, this.loadInitAnnotations)
        }
    }

    loadAnnotationColors () {

        HttpClient.get(`/data-source/user-annotation-color`)
            .then(
                (resp) => {
                    this.setState({
                        userAnnotationColors: resp.data.user_annotation_color,
                    });
                    // this.registerScrollEvent()
                    // this.loadInitAnnotations()
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

    }

    deleteAnnotation(id, tableName) {
        this.setState({ isBusy: true });
        HttpClient.post(`annotations/delete_annotations`, {
            annotation_id: id,
            table_name: tableName,
        })
            .then(
                (resp) => {
                    Toast.fire({
                        icon: 'success',
                        title: "Annotation deleted."
                    });
                    let annotations = this.state.annotations;
                    annotations = annotations.filter((a) => !(a.added_by.indexOf(`${tableName}~~~~${id}~~~~`) > -1));
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

    toggleStatus(id, addedBy) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            let prevAnnotation = this.state.annotations.find(
                (an) => an.added_by == addedBy
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
                        let title = "Annotation is hidden in GA charts";
                        if (newStatus === 1) {
                            title = "Annotation is visible in GA charts";
                        }
                        Toast.fire({
                            icon: 'success',
                            title
                        });

                        let annotations = this.state.annotations.map((an) => {
                            if (an.added_by == addedBy) {
                                return {...an, is_enabled: newStatus};
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

    loadInitAnnotations() {
        const { sortBy, searchText, category, googleAnalyticsProperty, pageSize, pageNumber } = this.state;
        let link = '/annotation?';

        if (sortBy) link += `&sort_by=${sortBy}`;
        if (searchText) link += `&search=${searchText}`;
        if (sortBy === 'category' && category) link += `&cateogry=${category}`;
        if (sortBy === 'ga-property' && googleAnalyticsProperty) link += `&annotation_ga_property_id=${googleAnalyticsProperty}`;
        if (pageSize) link += `&page_size=${pageSize}`;
        if (pageNumber) link += `&page_number=${pageNumber}`;

        if (this.loadAnnotationsCancelToken) {
            this.loadAnnotationsCancelToken.cancel('Request overridden.');
        }
        this.loadAnnotationsCancelToken = this.axiosCancelToken.source();
        HttpClient.get(
            link,
            { cancelToken: this.loadAnnotationsCancelToken.token }
        )
            .then(
                (response) => {
                    this.loadAnnotationsCancelToken = null;
                    this.setState({
                        annotations: uniqBy(this.state.annotations.concat(response.data.annotations), 'added_by'),
                        isLoading: false,
                        hasMore: response.data.annotations.length >= pageSize,
                    });

                    setTimeout(() => {
                        $(function () {
                            $('.miniPreview').miniPreview({ prefetch: 'pageload' });
                        })
                    }, 2000);
                },
                (err) => {
                    this.loadAnnotationsCancelToken = null;
                    this.setState({
                        errors: err.response.data,
                        isLoading: false,
                    });
                }
            )
            .catch((err) => {
                this.loadAnnotationsCancelToken = null;
                this.setState({ errors: err, isLoading: false });
            });

    }

    handleChange(e) {
        this.setState({
            searchText: e.target.value,
            annotations: [],
            pageNumber: 0,
            isLoading: false,
            hideInfiniteScroll: true
        }, () => { this.setState({ hideInfiniteScroll: false }, () => this.loadMoreAnnotations(0)) });
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

    isValidURL(urlString) {
        // check is the string is the valid url
        var a  = document.createElement('a');
        a.href = urlString;
        return (a.host && a.host != window.location.host);
    }

    handleDeleteSelected() {
        this.setState({ isBusy: true });
        this.state.selectedRows.forEach((anno) => {
            const added_by = (anno || "").split('~~~~');
            const tableName = added_by[0];
            const tableId = added_by[1];
            const tableType = added_by[2];
            const dataSource = added_by[3];
            this.deleteAnnotation(tableId, tableName);
        });



        // HttpClient.post(`annotations/bulk_delete`, {
        //     annotation_ids: this.state.selectedRows,
        // })
        //     .then(
        //         (resp) => {
        //             Toast.fire({
        //                 icon: 'success',
        //                 title: "Annotation(s) deleted."
        //             });
        //             let selected_annotations = this.state.selectedRows;
        //             let annotations = this.state.annotations;

        //             for (let selected_annotation of selected_annotations) {
        //                 annotations = annotations.filter(
        //                     (a) => a.id != selected_annotation
        //                 );
        //                 this.setState({ annotations: annotations });
        //             }

        //             this.setState({ isBusy: false, selectedRows: [] });

        //             this.setState({
        //                 allAnnotationsSelected: false,
        //             });
        //         },
        //         (err) => {
        //             this.setState({ isBusy: false, errors: err.response.data });
        //         }
        //     )
        //     .catch((err) => {
        //         this.setState({ isBusy: false, errors: err });
        //     });
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
                                <a data-toggle="tooltip" data-placement="top" title="Manual"
                                    href="javascript:void(0);"
                                    onClick={() => this.props.openAnnotationPopup('manual')} >
                                    <img className='inject-me' src='/images/plus-icon.svg' onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = "/images/plus-icon.svg"; }} width='16' height='16' alt='menu icon' />
                                </a>
                                <a data-toggle="tooltip" data-placement="top" title="Apps Market" to="/data-source" href="/data-source">
                                    <img className='inject-me' src='/appMarket.svg' onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = "/appMarket.svg"; }} width='16' height='16' alt='menu icon' />
                                </a>
                                {this.props.user.user_level == "admin" || this.props.user.user_level == "team" ? (
                                    <a className="d-none d-sm-block" data-toggle="tooltip" data-placement="top" title="CSV Upload" onClick={() => this.props.openAnnotationPopup('upload')} href="javascript:void(0);">
                                        <img className='inject-me' src='/csvUploadd.svg' onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = "/csvUploadd.svg"; }} width='16' height='16' alt='menu icon' />
                                    </a>)
                                    :
                                    null
                                }
                            </div>
                        </div>

                        <div className="pageFilters d-flex justify-content-between align-items-center">
                            <div className="d-flex">
                                <FormGroup className="filter-sort position-relative mr-3">
                                    <Label className="sr-only" for="dropdownFilters">sort by filter</Label>
                                    <i className="btn-searchIcon left-0">
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666" />
                                        </svg>
                                    </i>
                                    <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                    <select name="sortBy" id="sort-by" value={this.state.sortBy} className="form-control" onChange={this.sort}>
                                        <option value="">Sort By</option>
                                        <option value="added">Added</option>
                                        <option value="user">By User</option>
                                        <option value="today">By Today</option>
                                        <option value="date">By Date</option>
                                        <option value="category">By Category</option>
                                        <option value="ga-property">By GA Property</option>
                                    </select>
                                </FormGroup>
                                <FormGroup className="filter-sort position-relative">
                                    {this.state.sortBy == "ga-property" ? (
                                        <GoogleAnalyticsPropertySelect
                                            name={"googleAnalyticsProperty"}
                                            id={"googleAnalyticsProperty"}
                                            currentPricePlan={this.props.user.price_plan}
                                            value={
                                                this.state
                                                    .googleAnalyticsProperty
                                            }
                                            onChangeCallback={(e) => {
                                                this.sortByProperty(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    ) : null}

                                    {this.state.sortBy == "category" ? (
                                        <select
                                            name="category"
                                            id="category"
                                            value={this.state.category}
                                            className="form-control"
                                            onChange={(e) => {
                                                this.sortByCategory(
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            <option value="">
                                                Select Category
                                            </option>
                                            {categories.map((cats) => (
                                                <option
                                                    value={cats.category}
                                                    key={cats.category}
                                                >
                                                    {cats.category}
                                                </option>
                                            ))}
                                        </select>
                                    ) : null}
                                </FormGroup>
                            </div>
                            <div className="d-flex">
                                <button
                                    onClick={() => {
                                        this.setState({ enableSelect: !this.state.enableSelect })
                                        if (this.state.enableSelect) {
                                            this.setState({ selectedRows: [] })
                                        }
                                    }}
                                    type="button" className={`btn-extraSelect position-relative ${this.state.enableSelect ? 'active' : ''}`}>
                                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.19922 3.00098H18.1992M7.19922 9.00098H18.1992" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1.80078 8.98566L2.65792 9.84281L4.80078 7.69995" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M3.19922 3.011L3.20922 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Select</span>
                                </button>

                                <FormGroup className="filter-search position-relative">
                                    <Label className="sr-only" for="search">search</Label>
                                    <Input name="searchText" value={this.state.searchText} placeholder="Search..." onChange={this.handleChange} />
                                    <button className="btn-searchIcon"><img className="d-block" src="/search-new.svg" width="16" height="16" alt="Search" /></button>
                                </FormGroup>
                            </div>
                        </div>
                        {this.state.enableSelect ? (
                            <div className="btnBox d-flex">
                                <p className="mb-0">{`${this.state.selectedRows.length} annotations selected`}</p>
                                <div className="d-flex">
                                    <button onClick={() => this.setState({ selectedRows: [] })} className="btn-cancel">Cancel selection</button>
                                    <button className="btn-delete d-block align-items-center justify-content-center" onClick={this.handleDeleteSelected}>
                                        <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.33398 12C1.96732 12 1.65354 11.8696 1.39265 11.6087C1.13132 11.3473 1.00065 11.0333 1.00065 10.6667V2H0.333984V0.666667H3.66732V0H7.66732V0.666667H11.0007V2H10.334V10.6667C10.334 11.0333 10.2035 11.3473 9.94265 11.6087C9.68132 11.8696 9.36732 12 9.00065 12H2.33398ZM9.00065 2H2.33398V10.6667H9.00065V2ZM3.66732 9.33333H5.00065V3.33333H3.66732V9.33333ZM6.33398 9.33333H7.66732V3.33333H6.33398V9.33333ZM2.33398 2V10.6667V2Z" fill="currentColor" />
                                        </svg>
                                        <span>Delete selected</span>
                                    </button>
                                </div>
                            </div>)
                            :
                            null
                        }
                    </div>


                    <InfiniteScroll
                        pageStart={1}
                        loadMore={this.loadMoreAnnotations}
                        hasMore={this.state.hasMore}
                        initialLoad={false}
                        loader={<>Loading...</>}
                    >
                        <>
                            {/* {this.state.isLoading ? (
                            <>Loading...</>
                        ) : ( */}
                            <>
                                {this.state.annotations
                                    // .filter(this.checkSearchText)
                                    .map((anno, idx) => {
                                        let borderLeftColor = "rgba(0,0,0,.0625)";
                                        let selectedIcon = anno.category || '';
                                        const annoPropertyString = (anno.table_ga_property_id || "").split("~~~~")?.[1] || "";
                                        const propertyNames = annoPropertyString.split(",");

                                        let displayString = "";
                                        if (propertyNames.length > 0) {
                                            displayString = propertyNames[0];

                                            if (propertyNames.length > 1) {
                                                displayString += ` <span>+${propertyNames.length - 1}<span>`;
                                            }
                                        }

                                        anno.description = anno.description || anno.event_name
                                        const added_by = (anno.added_by || "").split('~~~~');
                                        const tableName = added_by[0];
                                        const tableId = added_by[1];
                                        const tableType = added_by[2];
                                        const dataSource = added_by[3];
                                        if (dataSource === 'manual' && tableName === 'annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.manual;
                                            selectedIcon = '/manual.svg';
                                        } else if (dataSource === 'csv-upload' && tableName === 'annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.csv;
                                            selectedIcon = '/csv-upload.svg';
                                        } else if (dataSource === 'api' && tableName === 'annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.api;
                                            selectedIcon = '/api-image.svg';
                                        } else if (dataSource === 'System' && tableName === 'google_algorithm_updates') {
                                            borderLeftColor = this.state.userAnnotationColors.google_algorithm_updates;
                                            selectedIcon = '/google_algorithm_updates.svg';
                                        } else if (dataSource === 'System' && tableName === 'web_monitor_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.web_monitors;
                                            selectedIcon = '/web_monitor_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'shopify_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.shopify;
                                            selectedIcon = '/shopify_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'holidays') {
                                            borderLeftColor = this.state.userAnnotationColors.holidays;
                                            selectedIcon = '/holidays.svg';
                                        } else if (dataSource === 'System' && tableName === 'retail_marketings') {
                                            borderLeftColor = this.state.userAnnotationColors.retail_marketings;
                                            selectedIcon = '/retail_marketings.svg';
                                        } else if (dataSource === 'System' && tableName === 'open_weather_map_alerts') {
                                            borderLeftColor = this.state.userAnnotationColors.weather_alerts;
                                            selectedIcon = '/open_weather_map_alerts.svg';
                                        } else if (dataSource === 'System' && tableName === 'google_alerts') {
                                            borderLeftColor = this.state.userAnnotationColors.google_alerts;
                                            selectedIcon = '/google_alerts.svg';
                                        } else if (dataSource === 'System' && tableName === 'wordpress_updates') {
                                            borderLeftColor = this.state.userAnnotationColors.wordpress_updates;
                                            selectedIcon = '/wordpress_updates.svg';
                                        } else if (dataSource === 'System' && tableName === 'keyword_tracking_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.keyword_tracking;
                                            selectedIcon = '/keyword_tracking_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'facebook_tracking_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.facebook_tracking;
                                            selectedIcon = '/facebook_tracking_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'instagram_tracking_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.instagram_tracking;
                                            selectedIcon = '/instagram_tracking_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'twitter_tracking_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.twitter_tracking;
                                            selectedIcon = '/twitter_tracking_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'bitbucket_commit_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.bitbucket_tracking;
                                            selectedIcon = '/bitbucket_commit_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'github_commit_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.github_tracking;
                                            selectedIcon = '/github_commit_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'google_ads_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.g_ads_history_change;
                                            selectedIcon = '/google_ads_annotations.svg';
                                        } else if (dataSource === 'System' && tableName === 'apple_podcast_annotations') {
                                            borderLeftColor = this.state.userAnnotationColors.apple_podcast;
                                            selectedIcon = '/apple_podcast_annotations.svg';
                                        }


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
                                            <div className={`annotionRow d-flex align-items-center ${this.state.selectedRows.includes(anno.added_by) && "record-checked"}`} data-diff-in-milliseconds={diffTime} style={{ 'borderLeftColor': borderLeftColor }} id={rowId}
                                                key={anno.added_by.toString()}
                                                onClick={
                                                    () => {
                                                        if (anno.added_by && this.state.enableSelect) {
                                                            this.handleOneSelection(anno.added_by)
                                                        } else {
                                                            // toast.error("This annotation can't be selected.");
                                                        }
                                                    }
                                                } data-anno_id={anno.added_by}>

                                                <span className="checkedIcon"><img src={`/icon-checked.svg`} /></span>

                                                <span className="annotionRowIcon"><img src={`${selectedIcon}`} onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = "/annotation-default.svg"; }} /></span>

                                                <div className="description d-flex flex-column flex-shrink-1">
                                                    <p className="titleCategory d-flex align-items-center">
                                                        <span>{anno.event_name}</span>
                                                        <a href="javascript:void(0)">{anno.category}</a>
                                                        {this.isValidURL(anno.url) ? (
                                                            <a href={anno.url} target="_blank" className="ml-1 miniPreview"><i className="icon"><img src={'/icon-chain.svg'} /></i></a>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </p>
                                                    <p className="annotationDesc mb-0 d-flex-inline">
                                                        {stripHtmlTags(anno.description) &&
                                                            !anno.show_complete_desc ? stripHtmlTags(anno.description).substring(0, 150) : ""}
                                                        {stripHtmlTags(anno.description) &&
                                                        stripHtmlTags(anno.description).length > 150 &&
                                                            !anno.show_complete_desc ? (
                                                            <span>...<a onClick={() => { this.seeCompleteDescription(anno, idx); }} target="_blank" className="ml-1">Read more</a></span>
                                                        ) : (
                                                            ""
                                                        )}

                                                        {stripHtmlTags(anno.description) && stripHtmlTags(anno.description).length > 150 && anno.show_complete_desc ? (
                                                            <div id="">{stripHtmlTags(anno.description)}</div>
                                                        ) : (
                                                            ""
                                                        )}

                                                    </p>
                                                </div>

                                                <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                                                    <ul className="d-flex list-unstyled">
                                                        <li><span className="properties">{anno.google_analytics_property_name ? <CustomTooltip tooltipText={annoPropertyString} maxLength={50}><p dangerouslySetInnerHTML={{__html: displayString}}></p></CustomTooltip> : "All Properties"}</span></li>
                                                        <li><span>{capitalize(added_by[2])}</span></li>
                                                        <li><time dateTime={moment(anno.show_at).format(timezoneToDateFormat(this.props.user.timezone))}>{moment(anno.show_at).format(timezoneToDateFormat(this.props.user.timezone))}</time></li>
                                                        {/* <li>
                                                    <a href="javascript:void(0);" className="cursor-pointer" onClick={() => this.setState({showChartAnnotationId :tableId})}>
                                                        <i className="mr-2">
                                                        <img src={"/icon-chart.svg"} /></i><span>open chart</span>
                                                        </a>
                                                    </li> */}
                                                    </ul>

                                                    <ul className="d-flex list-unstyled">
                                                        {/* {added_by[3] == "manual" ? <> */}
                                                        {tableName === 'annotations' ? <>
                                                            <li>
                                                                <span className="cursor-pointer" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.toggleStatus(tableId, anno.added_by)
                                                                }}>
                                                                    {anno.is_enabled ?
                                                                        <img src={`/icon-eye-open.svg`}/> :
                                                                        <img src={`/icon-eye-close.svg`}/>}
                                                                </span>
                                                            </li>
                                                            <li>
                                                                <span className="cursor-pointer" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.setState({editAnnotationId: tableId})
                                                                }}>
                                                                    <img src={`icon-edit.svg`}/>
                                                                </span>
                                                            </li>
                                                            <li>
                                                                <span className="text-danger" onClick={(e) => { e.stopPropagation(); this.deleteAnnotation(tableId, tableName); }}><img src={`icon-trash.svg`} /></span>
                                                            </li>
                                                        </> : null}
                                                        <li>
                                                            {/*<span className="text-danger" onClick={(e) => { e.stopPropagation(); this.deleteAnnotation(tableId, tableName); }}><img src={`icon-trash.svg`} /></span>*/}
                                                        </li>
                                                        {/* </> : null} */}
                                                    </ul>
                                                </div>

                                            </div>
                                        );

                                    })}

                                {!this.state.isLoading && !this.state.annotations.length && !this.state.hideInfiniteScroll ?
                                    <div className="nodata">
                                        <p>No annotations added yet.</p>
                                        <p className="mb-0">Suggestions: <a onClick={() => this.props.openAnnotationPopup('manual')} href="javascript:void(0);">Add manual annotation</a> {this.props.user.user_level == "admin" || this.props.user.user_level == "team" ? (<>or <a onClick={() => this.props.openAnnotationPopup('upload')} href="javascript:void(0);">Upload CSV</a></>) : null}</p>
                                    </div> : null
                                }
                            </>
                            {/* )} */}
                        </>
                    </InfiniteScroll>
                </Container>
                <AppsModal isOpen={!!this.state.editAnnotationId} popupSize={'md'} toggle={() => { this.setState({ editAnnotationId: '' }); }}>
                    <AnnotationsUpdate upgradePopup={this.props.upgradePopup} togglePopup={() => {
                        this.setState({
                            editAnnotationId: '',
                            annotations: [],
                            pageNumber: 0,
                            isLoading: false,
                            hideInfiniteScroll: true
                        }, () => { this.setState({ hideInfiniteScroll: false }, () => {
                                this.loadMoreAnnotations()
                                this.loadAnnotationColors()
                            })
                        });
                    }} editAnnotationId={this.state.editAnnotationId} currentPricePlan={this.props.user.price_plan} />
                </AppsModal>
                <AppsModal isOpen={!!this.state.showChartAnnotationId} popupSize={'null'} toggle={() => { this.setState({ showChartAnnotationId: '' }); }}>
                    <ShowChartAnnotation togglePopup={() => this.setState({ showChartAnnotationId: '' })} showChartAnnotationId={this.state.showChartAnnotationId} currentPricePlan={this.props.user.price_plan} />
                </AppsModal>
            </div>
        );
    }

    sort(e) {
        this.setState({
            sortBy: e.target.value,
            annotations: [],
            pageNumber: 0,
            isLoading: false,
            hideInfiniteScroll: true
        }, () => { this.setState({ hideInfiniteScroll: false }, () => this.loadMoreAnnotations(0)) });
    }

    // registerScrollEvent() {
    //     // $(window).off('scroll');
    //     $(window).on('scroll', () => {
    //         if (parseFloat($(window).scrollTop() + $(window).height()).toFixed(0) == $(document).height()) {
    //             this.setState({ pageNumber: this.state.pageNumber + 1 }, this.loadInitAnnotations)
    //         }
    //     });
    // }

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
        this.setState({
            category: catName,
            annotations: [],
            pageNumber: 0,
            isLoading: false,
            hideInfiniteScroll: true
        }, () => { this.setState({ hideInfiniteScroll: false }, () => this.loadMoreAnnotations(0)) });
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
