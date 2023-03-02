import React from 'react';
import Toast from "../../utils/Toast";
import { Redirect } from "react-router-dom";
import { Popover, PopoverBody } from "reactstrap";

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

import ModalHeader from '../AppsMarket/common/ModalHeader';
import { Button } from 'reactstrap';
import moment from 'moment';

export default class UploadAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            google_analytics_property_id: [""],
            date_format: '',
            userAnnotationColors: {},
            redirectTo: null,
            review: false,
            fieldErrorsCheck: false,
            fieldErrorsCount: 0,
            fieldErrors: [],
            importReviewErrorCount: 0,
            importReview: [],
            fileHeaders: [],
            fileName: '',
            csvFields: {
                'Category': 'category',
                'Event Name':  'event_name',
                'Url': 'url',
                'Description': 'description',
                'Show At': 'show_at',

            },
            csvError: '',
            isBusy: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.saveCsv = this.saveCsv.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.changeMapHandler = this.changeMapHandler.bind(this)

        this.updateUserAnnotationColors = this.updateUserAnnotationColors.bind(this);
        this.loadUserAnnotationColors = this.loadUserAnnotationColors.bind(this);
        this.checkIfCanCreateAnnotation = this.checkIfCanCreateAnnotation.bind(this)
        this.onDragLeave = this.onDragLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onFileDrop = this.onFileDrop.bind(this)
        this.onFileSelect = this.onFileSelect.bind(this)

        this.prepareFieldErrorsData = this.prepareFieldErrorsData.bind(this)
    }

    isValidURL(urlString) {
        // check is the string is the valid url
        var a  = document.createElement('a');
        a.href = urlString;
        return (a.host && a.host != window.location.host);
    }

    prepareFieldErrorsData () {
        if(!Object.values(this.state.importReview).find(x => x)) {
            const { fieldErrors, csvFields, date_format } = this.state;

            let fieldErrorsCount = 0;
            const result = fieldErrors.map((itm) => {
                const obj = {
                    'category': itm[csvFields['Category']],
                    'event_name': itm[csvFields['Event Name']],
                    'description': itm[csvFields['Description']],
                    'show_at': itm[csvFields['Show At']],
                    'url': itm[csvFields['Url']],
                }

                if (obj.url && !this.isValidURL(obj.url)) {
                    fieldErrorsCount++;
                    obj.url_error = 'Enter a valid URL';
                }

                if (obj.show_at && !(moment(obj.show_at || "", this.state.date_format, true).isValid())) {
                    fieldErrorsCount++;
                    obj.show_at_error = `Date format is incorrect, use format [${this.state.date_format}]`;
                }
                if (!obj.category) {
                    fieldErrorsCount++;
                    obj.category_error = `Category can't be empty`;
                }

                if (!obj.event_name) {
                    fieldErrorsCount++;
                    obj.event_name_error = `Event Name can't be empty`;
                }

                return obj;
            })

            this.setState({ fieldErrors: result, fieldErrorsCheck: true, fieldErrorsCount }, () => {
                const target = document.querySelector('.is-invalid');
                target?.parentElement?.parentElement?.previousElementSibling?.scrollIntoViewIfNeeded()
                target?.focus()
            })
        }
    }

    saveCsv () {

        this.setState({ isBusy: true })
        const formData = new FormData();
        formData.append('date_format', this.state.date_format);
        formData.append('fileName', this.state.fileName);

        const data = this.state.fieldErrors.map((list) => {
            if (this.isValidURL(list.url)) {
                delete list.url_error
            }
            if ((moment(list.show_at || "", this.state.date_format, true).isValid())) {
                delete list.show_at_error
            }
            if (list.category) {
                delete list.category_error
            }
            if (list.event_name) {
                delete list.event_name_error
            }
            if (list.description) {
                delete list.description_error
            }
            return list;
        })

        formData.append('fieldErrors', JSON.stringify(data));

        this.state.google_analytics_property_id.forEach((gAA) => {
            formData.append('google_analytics_property_id[]', gAA) }
        )

        HttpClient({
            url: `/annotation/saveCsv`, baseURL: "/", method: 'post',
            data: formData
        }).then(response => {

            if (response.data.success) {
                Toast.fire({
                    icon: 'success',
                    title: "CSV file uploaded. Duplicate records are ignored"
                });

                this.props.togglePopup('')
            } else {
                Toast.fire({
                    icon: 'error',
                    title: "CSV data is not valid."
                });

                const { fieldErrors, fieldErrorsCount } = response.data;
                this.setState({ fieldErrors, fieldErrorsCount }, () => {
                    const target = document.querySelector('.is-invalid');
                    target?.parentElement?.parentElement?.previousElementSibling?.scrollIntoViewIfNeeded()
                    target?.focus()
                })

                this.setState({ isBusy: false })

            }

        }, (err) => {

            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {

            this.setState({ isBusy: false, errors: err });
        });
    }

    onDragLeave (e) {
        e.preventDefault();
        $(".csvFileUpload > label").css("background", "#e8e8e8");
        $("#csv-caption").text("Drag and drop or click here")
        $(".csv-caption").text(".csv files only")
    }

    onDragOver (e) {
        e.preventDefault();
        $(".csvFileUpload > label").css("background", "#f0f6ff");
        $("#csv-caption").text("Drop here")
        $(".csv-caption").text("\xA0")
    }

    onFileDrop (e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        $("#csv-caption").text(files[0].name)
        $(".csv-caption").text('\xA0')
        $(".csvFileUpload > label").css("background", "#e8e8e8");
        $("#csv")[0].files = files;
        this.setState({ csvError: '', errors: [] })
    }

    onFileSelect (e) {
        e.preventDefault();
        const files = e.target.files;
        $("#csv-caption").text(files[0].name)
        $(".csv-caption").text('\xA0')
        $(".csvFileUpload > label").css("background", "#e8e8e8");
        $("#csv")[0].files = files;
        this.setState({ csvError: '', errors: [] })
    }

    checkIfCanCreateAnnotation(){
        HttpClient.get('user')
        .then(user_response => {
            this.setState({
                user: user_response.data.user
            })
            HttpClient.get('user_total_annotations')
            .then(response => {
                if( this.state.user.price_plan.code == "free new" || this.state.user.price_plan.code == "Trial"){
                    if(this.state.user.price_plan.annotations_count == 0){
                        // unlimited
                    }else{
                        if(response.data.user_total_annotations >= this.state.user.price_plan.annotations_count){
                            this.props.upgradePopup('more-annotations')
                        }
                    }

                }

            });
        });
    }
    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            const formData = new FormData();
            formData.append('csv', document.getElementById('csv').files[0]);

            this.state.google_analytics_property_id.forEach((gAA) => { formData.append('google_analytics_property_id[]', gAA) })

            // formData.append('date_format', this.state.date_format);
            HttpClient({
                url: `/annotation/upload`, baseURL: "/", method: 'post', headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
            }).then(response => {

                this.setState({ csvError: '', errors: [] })

                const { fieldErrors, importReview, importReviewErrorCount, fileHeaders, fileName, sampleDate } = response.data;
                this.setState(
                    {
                        isBusy: false,
                        review: true,
                        fieldErrors,
                        importReview,
                        importReviewErrorCount: importReviewErrorCount + 1,
                        fileHeaders,
                        fileName,
                        sampleDate,
                        csvFields: {
                            ...this.state.csvFields,
                            ...(importReview['Description'] ?  { 'Description': '' } : {}),
                            ...(importReview['Category'] ?  { 'Category': '' } : {}),
                            ...(importReview['Event Name'] ?  { 'Event Name': '' } : {}),
                            ...(importReview['Url'] ?  { 'Url': '' } : {}),
                            ...(importReview['Show At'] ?  { 'Show At': '' } : {}),
                        }

                    },
                    () => {
                        this.props.updateCSVUploadStep('lg upload-csv-lg')
                    }
                )

            }, (err) => {

                const errors = (err.response).data;
                
                this.setState({ csvError: errors.errors.csv ? "File type must be CSV" : '' }, () => {
                    if (errors.errors.csv) {
                        delete errors.errors.csv;
                    }
                })
                this.setState({ isBusy: false, errors });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
        }
    }

    componentDidMount() {
        this.loadUserAnnotationColors();
        this.checkIfCanCreateAnnotation();
    }
    changeHandler(e) {
        this.setState({ [e.target.name]: e.target.value })
        if(e.target.name === 'date_format') {
            const importReviewErrorCount = e.target.value ? this.state.importReviewErrorCount - 1 : this.state.importReviewErrorCount + 1;
            this.setState({ importReviewErrorCount })
        }
    }

    changeMapHandler (e, id, focusOut = false) {
        const { name, value } = e.target;
        let fieldErrorsCount = parseInt(this.state.fieldErrorsCount);

        const data = this.state.fieldErrors.map((list, index) => {
            if (e.key === 'Enter' || focusOut) {
                if (name === 'url' && list.url_error && (!list.url || this.isValidURL(list.url))) {
                    fieldErrorsCount = fieldErrorsCount - 1;
                    delete list.url_error
                }
                if (name === 'category' && list.category_error && list.category) {
                    fieldErrorsCount = fieldErrorsCount - 1;
                    delete list.category_error
                }
                if (name === 'event_name' && list.event_name_error && list.event_name) {
                    fieldErrorsCount = fieldErrorsCount - 1;
                    delete list.event_name_error
                }
                if (name === 'show_at' && list.show_at_error && (!list.show_at || (moment(list.show_at || "", this.state.date_format, true).isValid()))) {
                    fieldErrorsCount = fieldErrorsCount - 1;
                    delete list.show_at_error
                }
            }
            return (index === id ? { ...list, [name]: value} : list)
        })

        this.setState({ fieldErrors: data, fieldErrorsCount }, () => {
            if (e.key === 'Enter' || focusOut) {
                const target = document.querySelector('.is-invalid');
                target?.parentElement?.parentElement?.previousElementSibling?.scrollIntoViewIfNeeded()
                target?.focus()
            }
        })
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

    updateUserAnnotationColors(userAnnotationColors) {
        this.setState({ userAnnotationColors: userAnnotationColors });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        return (
            <div className="popupContent modal-csvUpload">
                {this.state.review ?
                    <div className="csv-review-columns">
                        {!this.state.fieldErrorsCheck ?
                            <>
                                <div className="apps-modalHead">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h2>
                                            {this.state.importReviewErrorCount ?
                                                <>
                                                Import review &nbsp; <span class="text-gray">|</span> &nbsp; 
                                                <span className='text-danger'>
                                                    {this.state.importReviewErrorCount + (this.state.importReviewErrorCount > 1 ? " errors" : " error")}
                                                </span>
                                                </>
                                                : 
                                                    "Good job, Click Continue"
                                            }
                                        </h2>
                                        <span onClick={() => this.props.togglePopup('')} className="btn-close">
                                    <img className="inject-me" src="/close-icon.svg" width="26" height="26"
                                         alt="menu icon"/>
                                </span>
                                    </div>

                                    <p>Please review the column mapping and map the columns that weren't found</p>
                                </div>


                                <table className='table'>
                                    <thead>
                                    <tr>
                                        <th>Column Name</th>
                                        <th>Field</th>
                                        <th>Sample Data</th>
                                    </tr>
                                    </thead>
                                    <tbody className='dataTableAnalyticsAccount'>
                                    <tr>
                                        <td>Category</td>
                                        <td>
                                            <div className='themeNewInputStyle position-relative'>
                                                <select value={this.state.csvFields['Category']} style={{height: 38}}
                                                        className={`form-control ${this.state.importReview.category_error ? 'is-invalid' : 'selected'}`}
                                                        onChange={(ev) => {
                                                            this.setState({
                                                                csvFields: {
                                                                    ...this.state.csvFields,
                                                                    'Category': ev.target.value
                                                                },
                                                                importReviewErrorCount: this.state.importReview.category_error ? this.state.importReviewErrorCount - 1 : this.state.importReviewErrorCount,
                                                                importReview: {
                                                                    ...this.state.importReview,
                                                                    category_error: ""
                                                                }
                                                            })
                                                        }}>
                                                    <option>Select...</option>
                                                    {this.state.fileHeaders.map((itm, idx) => <option
                                                        selected={!this.state.importReview.category_error && idx == 0}
                                                        value={itm}>{itm}</option>)}
                                                </select>
                                                <i className="btn-searchIcon fa fa-check-circle"></i>
                                            </div>
                                        </td>
                                        <td>Sales Event</td>
                                    </tr>
                                    <tr>
                                        <td>Event Name</td>
                                        <td>
                                            <div className='themeNewInputStyle position-relative'>
                                                <select value={this.state.csvFields['Event Name']} style={{height: 38}}
                                                        className={`form-control ${this.state.importReview.event_name_error ? 'is-invalid' : 'selected'}`}
                                                        onChange={(ev) => {
                                                            this.setState({
                                                                csvFields: {
                                                                    ...this.state.csvFields,
                                                                    'Event Name': ev.target.value
                                                                },
                                                                importReviewErrorCount: this.state.importReview.event_name_error ? this.state.importReviewErrorCount - 1 : this.state.importReviewErrorCount,
                                                                importReview: {
                                                                    ...this.state.importReview,
                                                                    event_name_error: ""
                                                                }
                                                            })
                                                        }}>
                                                    <option>Select...</option>
                                                    {this.state.fileHeaders.map((itm, idx) => <option
                                                        selected={!this.state.importReview.event_name_error && idx == 1}
                                                        value={itm}>{itm}</option>)}
                                                </select>
                                                <i className="btn-searchIcon fa fa-check-circle"></i>
                                            </div>
                                        </td>
                                        <td>Black Friday</td>
                                    </tr>
                                    <tr>
                                        <td>Url</td>
                                        <td>
                                            <div className='themeNewInputStyle position-relative'>
                                                <select value={this.state.csvFields['Url']} style={{height: 38}}
                                                        className={`form-control ${this.state.importReview.url_error ? 'is-invalid' : 'selected'}`}
                                                        onChange={(ev) => {
                                                            this.setState({
                                                                csvFields: {
                                                                    ...this.state.csvFields,
                                                                    'Url': ev.target.value
                                                                },
                                                                importReviewErrorCount: this.state.importReview.url_error ? this.state.importReviewErrorCount - 1 : this.state.importReviewErrorCount,
                                                                importReview: {
                                                                    ...this.state.importReview,
                                                                    url_error: ""
                                                                }
                                                            })
                                                        }}>
                                                    <option>Select...</option>
                                                    {this.state.fileHeaders.map((itm, idx) => <option
                                                        selected={!this.state.importReview.url_error && idx == 2}
                                                        value={itm}>{itm}</option>)}
                                                </select>
                                                <i className="btn-searchIcon fa fa-check-circle"></i>
                                            </div>
                                        </td>
                                        <td>https://gannotations.com</td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>
                                            <div className='themeNewInputStyle position-relative'>
                                                <select value={this.state.csvFields['Description']} style={{height: 38}}
                                                        className={`form-control ${this.state.importReview.description_error ? 'is-invalid' : 'selected'}`}
                                                        onChange={(ev) => {
                                                            this.setState({
                                                                csvFields: {
                                                                    ...this.state.csvFields,
                                                                    'Description': ev.target.value
                                                                },
                                                                importReviewErrorCount: this.state.importReview.description_error ? this.state.importReviewErrorCount - 1 : this.state.importReviewErrorCount,
                                                                importReview: {
                                                                    ...this.state.importReview,
                                                                    description_error: ""
                                                                }
                                                            })
                                                        }}>
                                                    <option>Select...</option>
                                                    {this.state.fileHeaders.map((itm, idx) => <option
                                                        selected={!this.state.importReview.description_error && idx == 3}
                                                        value={itm}>{itm}</option>)}
                                                </select>
                                                <i className="btn-searchIcon fa fa-check-circle"></i>
                                            </div>
                                        </td>
                                        <td>Black Friday Deals 2023</td>
                                    </tr>
                                    <tr>
                                        <td>Show At</td>
                                        <td>
                                            <div className='themeNewInputStyle position-relative'>
                                                <select value={this.state.csvFields['Show At']} style={{height: 38}}
                                                        className={`form-control ${this.state.importReview.show_at_error ? 'is-invalid' : 'selected'}`}
                                                        onChange={(ev) => {
                                                            this.setState({
                                                                csvFields: {
                                                                    ...this.state.csvFields,
                                                                    'Show At': ev.target.value
                                                                },
                                                                importReviewErrorCount: this.state.importReview.show_at_error ? this.state.importReviewErrorCount - 1 : this.state.importReviewErrorCount,
                                                                importReview: {
                                                                    ...this.state.importReview,
                                                                    show_at_error: ""
                                                                }
                                                            })
                                                        }}>
                                                    <option>Select...</option>
                                                    {this.state.fileHeaders.map((itm, idx) => <option
                                                        selected={!this.state.importReview.show_at_error && idx == 0}
                                                        value={itm}>{itm}</option>)}
                                                </select>
                                                <i className="btn-searchIcon fa fa-check-circle"></i>
                                            </div>
                                        </td>
                                        <td>
                                            {this.state.sampleDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Date Format</td>
                                        <td>
                                            <div className='themeNewInputStyle position-relative'>
                                                <select style={{height: 38}} name="date_format" id="date_format"
                                                        className={`form-control ${!this.state.date_format ? 'is-invalid' : 'selected'}`}
                                                        value={this.state.date_format} onChange={this.changeHandler}
                                                        required>
                                                    <option value="">Select your date format</option>
                                                    <option
                                                        value="DD/MM/YYYY">{moment("2021-01-15").format('DD/MM/YYYY')}</option>
                                                    <option
                                                        value="M-D-YYYY">{moment("2021-01-15").format('M-D-YYYY')}</option>
                                                    <option
                                                        value="M-D-YY">{moment("2021-01-15").format('M-D-YY')}</option>
                                                    <option
                                                        value="MM-DD-YY">{moment("2021-01-15").format('MM-DD-YY')}</option>
                                                    <option
                                                        value="MM-DD-YYYY">{moment("2021-01-15").format('MM-DD-YYYY')}</option>
                                                    <option
                                                        value="YY-MM-DD">{moment("2021-01-15").format('YY-MM-DD')}</option>
                                                    <option
                                                        value="YYYY-MM-DD">{moment("2021-01-15").format('YYYY-MM-DD')}</option>
                                                    <option
                                                        value="DD-MMM-YY">{moment("2021-01-15").format('DD-MMM-YY')}</option>
                                                    <option
                                                        value="M/D/YYYY">{moment("2021-01-15").format('M/D/YYYY')}</option>
                                                    <option
                                                        value="M/D/YY">{moment("2021-01-15").format('M/D/YY')}</option>
                                                    <option
                                                        value="MM/DD/YY">{moment("2021-01-15").format('MM/DD/YY')}</option>
                                                    <option
                                                        value="MM/DD/YYYY">{moment("2021-01-15").format('MM/DD/YYYY')}</option>
                                                    <option
                                                        value="YY/MM/DD">{moment("2021-01-15").format('YY/MM/DD')}</option>
                                                    <option
                                                        value="YYYY/MM/DD">{moment("2021-01-15").format('YYYY/MM/DD')}</option>
                                                    <option
                                                        value="DD/MMM/YY">{moment("2021-01-15").format('DD/MMM/YY')}</option>
                                                </select>
                                                <i className="btn-searchIcon fa fa-check-circle"></i>
                                            </div>
                                        </td>
                                        <td>
                                            {this.state.sampleDate}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <div className="text-right mt-3">
                                    <Button className='btn-submit btn-theme'
                                            disabled={this.props.importReviewErrorCount || this.state.date_format === ''}
                                            onClick={this.prepareFieldErrorsData}>Continue</Button>
                                </div>
                            </>
                            :

                            <>
                                <div className="apps-modalHead">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h2>
                                        {this.state.fieldErrorsCount ? 
                                            <>
                                            Field errors &nbsp; <span class="text-gray">|</span> &nbsp; 
                                            <span className='text-danger'>
                                                {this.state.fieldErrorsCount + (this.state.fieldErrorsCount > 1 ? " errors" : " error")}
                                            </span>
                                            </>
                                            : 
                                                "Well done! Click on submit to upload the list"
                                        }
                                        </h2>
                                        <span onClick={() => this.props.togglePopup('')} className="btn-close">
                                    <img className="inject-me" src="/close-icon.svg" width="26" height="26"
                                         alt="menu icon"/>
                                </span>
                                    </div>
                                    <p>Please review the table and Fix the errors highlighted</p>
                                </div>

                                <div className="csv-review-data-container">
                                    <table className='table-bordered'>
                                        <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Event Name</th>
                                            <th>Url</th>
                                            <th>Description</th>
                                            <th>Show At</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.fieldErrors.map((rd, i) => {

                                            return (
                                                <tr>
                                                    <td>
                                                        {rd.category_error ?
                                                            <>
                                                                <input
                                                                    onMouseOver={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: 'category' + i,
                                                                        })
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: '',
                                                                        })
                                                                    }
                                                                    id={"gAK-" + 'category' + i}
                                                                    onBlur={(e) => this.changeMapHandler(e, i, true)}
                                                                    onKeyUp={(e) => this.changeMapHandler(e, i)}
                                                                    onChange={(e) => this.changeMapHandler(e, i)}
                                                                    className='form-control is-invalid'
                                                                    name='category'
                                                                    value={rd.category}/>
                                                                <Popover className="bg-dark"
                                                                         placement="top"
                                                                         target={"gAK-" + 'category' + i}
                                                                         isOpen={
                                                                             this.state.activeDeletePopover === 'category' + i
                                                                         }
                                                                >
                                                                    <PopoverBody className="w-100">
                                                                        {rd.category_error}
                                                                    </PopoverBody>
                                                                </Popover>
                                                            </>
                                                            :
                                                            <div>{rd.category}</div>
                                                        }
                                                    </td>
                                                    <td>
                                                        {rd.event_name_error ?
                                                            <>
                                                                <input
                                                                    onMouseOver={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: 'event_name' + i,
                                                                        })
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: '',
                                                                        })
                                                                    }
                                                                    id={"gAK-" + 'event_name' + i}
                                                                    onBlur={(e) => this.changeMapHandler(e, i, true)}
                                                                    onKeyUp={(e) => this.changeMapHandler(e, i)}
                                                                    onChange={(e) => this.changeMapHandler(e, i)}
                                                                    className='form-control is-invalid'
                                                                    name='event_name'
                                                                    value={rd.event_name}/>
                                                                <Popover className="bg-dark"
                                                                         placement="top"
                                                                         target={"gAK-" + 'event_name' + i}
                                                                         isOpen={
                                                                             this.state.activeDeletePopover === 'event_name' + i
                                                                         }
                                                                >
                                                                    <PopoverBody className="w-100">
                                                                        {rd.event_name_error}
                                                                    </PopoverBody>
                                                                </Popover>
                                                            </>
                                                            :
                                                            <div>{rd.event_name}</div>
                                                        }
                                                    </td>
                                                    <td>
                                                        {rd.url_error ?
                                                            <>
                                                                <input
                                                                    onMouseOver={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: 'url' + i,
                                                                        })
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: '',
                                                                        })
                                                                    }
                                                                    id={"gAK-" + 'url' + i}
                                                                    onBlur={(e) => this.changeMapHandler(e, i, true)}
                                                                    onKeyUp={(e) => this.changeMapHandler(e, i)}
                                                                    onChange={(e) => this.changeMapHandler(e, i)}
                                                                    className='form-control is-invalid'
                                                                    name='url'
                                                                    value={rd.url}/>
                                                                <Popover className="bg-dark"
                                                                         placement="top-right"
                                                                         target={"gAK-" + 'url' + i}
                                                                         isOpen={
                                                                             this.state.activeDeletePopover === 'url' + i
                                                                         }
                                                                >
                                                                    <PopoverBody className="w-100">
                                                                        {rd.url_error}
                                                                    </PopoverBody>
                                                                </Popover>
                                                            </>
                                                            :
                                                            <div>{rd.url}</div>
                                                        }
                                                    </td>
                                                    <td>
                                                        {rd.description_error ?
                                                            <>
                                                                <input
                                                                    onMouseOver={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: 'description' + i,
                                                                        })
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: '',
                                                                        })
                                                                    }
                                                                    id={"gAK-" + 'description' + i}
                                                                    onBlur={(e) => this.changeMapHandler(e, i, true)}
                                                                    onKeyUp={(e) => this.changeMapHandler(e, i)}
                                                                    onChange={(e) => this.changeMapHandler(e, i)}
                                                                    className='form-control is-invalid'
                                                                    name='description'
                                                                    value={rd.description}/>
                                                                <Popover className="bg-dark"
                                                                         placement="top"
                                                                         target={"gAK-" + 'description' + i}
                                                                         isOpen={
                                                                             this.state.activeDeletePopover === 'description' + i
                                                                         }
                                                                >
                                                                    <PopoverBody className="w-100">
                                                                        {rd.description_error}
                                                                    </PopoverBody>
                                                                </Popover>
                                                            </>
                                                            :
                                                            <div>{rd.description}</div>
                                                        }
                                                    </td>
                                                    <td>
                                                        {rd.show_at_error ?
                                                            <>
                                                                <input
                                                                    onMouseOver={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: 'show_at' + i,
                                                                        })
                                                                    }
                                                                    onMouseLeave={() =>
                                                                        this.setState({
                                                                            activeDeletePopover: '',
                                                                        })
                                                                    }
                                                                    id={"gAK-" + 'show_at' + i}
                                                                    onBlur={(e) => this.changeMapHandler(e, i, true)}
                                                                    onKeyUp={(e) => this.changeMapHandler(e, i)}
                                                                    onChange={(e) => this.changeMapHandler(e, i)}
                                                                    className='form-control is-invalid'
                                                                    name='show_at'
                                                                    value={rd.show_at}/>
                                                                <Popover className="bg-dark"
                                                                         placement="top"
                                                                         target={"gAK-" + 'show_at' + i}
                                                                         isOpen={
                                                                             this.state.activeDeletePopover === 'show_at' + i
                                                                         }
                                                                >
                                                                    <PopoverBody className="w-100">
                                                                        {rd.show_at_error}
                                                                    </PopoverBody>
                                                                </Popover>
                                                            </>
                                                            :
                                                            <div>{rd.show_at}</div>
                                                        }
                                                    </td>
                                                </tr>
                                            );

                                        })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                                    <div className="text-right mt-3">
                                        <Button className='btn-submit btn-theme' disabled={this.state.isBusy}
                                                onClick={this.saveCsv}>Submit</Button>
                                    </div>
                                </>

                                }

                    </div>
                    :
                    <div>
                        <ModalHeader
                            userAnnotationColors={this.state.userAnnotationColors}
                            updateUserAnnotationColors={this.updateUserAnnotationColors}
                            userServices={this.state}
                            serviceStatusHandler={this.updateUserAnnotationColors}
                            closeModal={() => this.props.togglePopup('')}
                            serviceName={'Upload CSV'}
                            colorKeyName={"csv"}
                            dsKeyName={null}
                            creditString={null}
                            downloadButton={true}
                        />

                        <div className='apps-bodyContent'>
                            <ErrorAlert errors={this.state.errors}/>
                            {
                                this.state.csvError ? 
                                <span class="errorList pl-4 pb-3 text-danger">{this.state.csvError}</span>
                                : ""
                            }

                            <form className='form-csvUpload' onSubmit={this.handleSubmit} encType="multipart/form-data"
                                  id="csv-upload-form-container">
                                <div className="themeNewInputGroup csvFileUpload mb-4" onDragLeave={this.onDragLeave}
                                     onDragOver={this.onDragOver} onDrop={this.onFileDrop}>
                                    <label htmlFor="csv">
                                        <i><img src={'/icon-csvUpload.svg'} alt={'CSV Upload Icon'}
                                                className="svg-inject"/></i>
                                        <strong id='csv-caption'>Drag and drop or click here</strong>
                                        <span class='csv-caption'>.csv files only</span>
                                        <input type="file" onChange={this.onFileSelect}
                                               className="form-control upload-csv-input" id="csv" name="csv"/>
                                    </label>
                                </div>

                                <div className='grid2layout mb-3'>
                                    <div className="themeNewInputStyle position-relative">
                                        <GoogleAnalyticsPropertySelect
                                            currentPricePlan={this.props.currentPricePlan}
                                            name="google_analytics_property_id"
                                            id="google_analytics_property_id"
                                            value={this.state.google_analytics_property_id}
                                            onChangeCallback={this.changeHandler}
                                            components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}
                                            placeholder="Select GA property"
                                            multiple
                                            onFocus={(e) => {
                                                if (this.props.currentPricePlan.ga_account_count == 1 || this.props.currentPricePlan.google_analytics_property_count == -1) {
                                                    this.props.upgradePopup('add-more-property')
                                                }
                                            }}
                                        ></GoogleAnalyticsPropertySelect>
                                    </div>
                                </div>

                                <div className="btns-csvUpload d-flex justify-content-center">
                                    <Button type='submit' disabled={this.state.isBusy} className='btn-theme'>Upload and
                                        review</Button>
                                    {/* <a href="/csv/upload_sample.csv" target="_blank" download>Download sample CSV file</a>
                                    <button type="submit" className="btn gaa-btn-primary btn-fab btn-round"><i className="fa fa-upload mr-3"></i>Upload</button> */}
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        );
    }

}

