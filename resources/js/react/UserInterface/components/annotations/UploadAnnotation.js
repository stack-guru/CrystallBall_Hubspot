import React from 'react';
import Toast from "../../utils/Toast";
import { Redirect } from "react-router-dom";

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

import ModalHeader from '../AppsMarket/common/ModalHeader';
import { Button } from 'reactstrap';

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
            csvFields: {
                'Category': 'Category',
                'Event Name':  'Event Name',
                'Url': 'Url',
                'Description': 'Description',
                'Show At': 'Show At',

            }
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


    prepareFieldErrorsData () {
        if(!Object.values(this.state.importReview).find(x => x)) {
            const data = this.state.fieldErrors
            const csvFields = this.state.csvFields

            console.log(csvFields)

            const result = data.map(itm => ({
                'category': itm[csvFields['Category']],
                'event_name': itm[csvFields['Event Name']],
                'description': itm[csvFields['Description']],
                'show_at': itm[csvFields['Show At']],
                'url': itm[csvFields['Url']],
            
            }))

            console.log(result)
        }
    }

    saveCsv () {

        const formData = new FormData();
        formData.append('date_format', this.state.date_format);
        formData.append('fieldErrors', JSON.stringify(this.state.fieldErrors));

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
                    title: "CSV file uploaded."
                });
            } else {

                const { fieldErrors, fieldErrorsCount, importReview, importReviewErrorCount, fileHeaders } = response.data;                
                this.setState(
                    { 
                        review: true, 
                        fieldErrors, 
                        fieldErrorsCount,
                        importReview,
                        importReviewErrorCount,      
                        fileHeaders,
                        csvFields: {
                            ...this.state.csvFields,
                            ...(importReview['Description'] ?  { 'Description': '' } : {}),
                            ...(importReview['Category'] ?  { 'Category': '' } : {}),
                            ...(importReview['Event Name'] ?  { 'Event Name': '' } : {}),
                            ...(importReview['Url'] ?  { 'Url': '' } : {}),
                            ...(importReview['Show At'] ?  { 'Show At': '' } : {}),
                        }
                    }
                )
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
    }

    onDragOver (e) {
        e.preventDefault();
        $(".csvFileUpload > label").css("background", "#f0f6ff");
        $("#csv-caption").text("Drop here")
    }

    onFileDrop (e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        $("#csv-caption").text(files[0].name)
        $(".csvFileUpload > label").css("background", "#e8e8e8");
        $("#csv")[0].files = files;
    }

    onFileSelect (e) {
        e.preventDefault();
        const files = e.target.files;
        $("#csv-caption").text(files[0].name)
        $(".csvFileUpload > label").css("background", "#e8e8e8");
        $("#csv")[0].files = files;
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

            formData.append('date_format', this.state.date_format);
            HttpClient({
                url: `/annotation/upload`, baseURL: "/", method: 'post', headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
            }).then(response => {

                if (response.data.success) {
                    Toast.fire({
                        icon: 'success',
                        title: "CSV file uploaded."
                    });
                } else {

                    const { fieldErrors, fieldErrorsCount, importReview, importReviewErrorCount, fileHeaders } = response.data;
                    this.setState(
                        { 
                            review: true, 
                            fieldErrors, 
                            fieldErrorsCount,
                            importReview,
                            importReviewErrorCount,
                            fileHeaders,
                            csvFields: {
                                ...this.state.csvFields,
                                ...(importReview['Description'] ?  { 'Description': '' } : {}),
                                ...(importReview['Category'] ?  { 'Category': '' } : {}),
                                ...(importReview['Event Name'] ?  { 'Event Name': '' } : {}),
                                ...(importReview['Url'] ?  { 'Url': '' } : {}),
                                ...(importReview['Show At'] ?  { 'Show At': '' } : {}),
                            }

                        }
                    )

                }
                
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
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
    }

    changeMapHandler (e, id) {
        const { name, value } = e.target;
        const data = this.state.fieldErrors.map((list, index) => {
            return (index === id ? { ...list, [name]: value} : list)
        })

        this.setState({ fieldErrors: data })
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
                { this.state.review ? 
                    <div>
                        { !this.state.fieldErrorsCheck ? 
                        <>
                        <div className="apps-modalHead">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2>Import review | <span className='text-danger'>{this.state.importReviewErrorCount} errors</span></h2>
                                <span onClick={() => this.props.togglePopup('')} className="btn-close">
                                    <img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" />
                                </span>
                            </div>
                        </div>

                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Column Name</th>
                                    <th>Field</th>
                                    <th>Sample Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Category</td>
                                    <td>
                                        <select className={`form-control ${this.state.importReview.category_error && 'is-invalid'}`} onChange={(ev)=> {
                                            this.setState({
                                                csvFields: {
                                                    ...this.state.csvFields,
                                                    'Category': ev.target.value
                                                },
                                                importReview: {...this.state.importReview, category_error:"" }
                                            })
                                        }}>
                                            {this.state.fileHeaders.map((itm, idx) => <option selected={!this.state.importReview.category_error && idx == 0} value={itm}>{itm}</option>)}
                                        </select>
                                    </td>
                                    <td>Sales Event</td>
                                </tr>
                                <tr>
                                    <td>Event Name</td>
                                    <td>
                                        <select className={`form-control ${this.state.importReview.event_name_error && 'is-invalid'}`} onChange={(ev)=> {
                                            this.setState({
                                                csvFields: {
                                                    ...this.state.csvFields,
                                                    'Event Name': ev.target.value
                                                },
                                                importReview: {...this.state.importReview, event_name_error:"" }
                                            })
                                        }}>
                                            {this.state.fileHeaders.map((itm, idx) => <option selected={!this.state.importReview.event_name_error && idx == 1} value={itm}>{itm}</option>)}
                                        </select>
                                    </td>
                                    <td>Black Friday</td>
                                </tr>
                                <tr>
                                    <td>Url</td>
                                    <td>
                                        <select className={`form-control ${this.state.importReview.url_error && 'is-invalid'}`} onChange={(ev)=> {
                                            this.setState({
                                                csvFields: {
                                                    ...this.state.csvFields,
                                                    'Url': ev.target.value
                                                },
                                                importReview: {...this.state.importReview, url_error:"" }
                                            })
                                        }}>
                                            {this.state.fileHeaders.map((itm, idx) => <option selected={!this.state.importReview.url_error && idx == 2} value={itm}>{itm}</option>)}
                                        </select>
                                    </td>
                                    <td>https://gannotations.com</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>
                                        <select className={`form-control ${this.state.importReview.description_error && 'is-invalid'}`} onChange={(ev)=> {
                                            this.setState({
                                                csvFields: {
                                                    ...this.state.csvFields,
                                                    'Description': ev.target.value
                                                },
                                                importReview: {...this.state.importReview, description_error:"" }
                                            })
                                        }}>
                                            {this.state.fileHeaders.map((itm, idx) => <option selected={!this.state.importReview.description_error && idx == 3} value={itm}>{itm}</option>)}
                                        </select>
                                    </td>
                                    <td>Black Friday Deals 2023</td>
                                </tr>
                                <tr>
                                    <td>Show At</td>
                                    <td>
                                        <select className={`form-control ${this.state.importReview.show_at_error && 'is-invalid'}`} onChange={(ev)=> {
                                            this.setState({
                                                csvFields: {
                                                    ...this.state.csvFields,
                                                    'Show At': ev.target.value
                                                },
                                                importReview: {...this.state.importReview, show_at_error:"" }
                                            })
                                        }}>
                                            {this.state.fileHeaders.map((itm, idx) => <option selected={!this.state.importReview.show_at_error && idx == 4} value={itm}>{itm}</option>)}
                                        </select>
                                    </td>
                                    <td>{ this.state.date_format }</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="text-right mt-3">
                            <Button className='btn-submit btn-theme' onClick={this.prepareFieldErrorsData}>Continue</Button>
                        </div>
                        </>
                        : 
                        
                        <>
                        <div className="apps-modalHead">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2>Field errors | <span className='text-danger'>{this.state.fieldErrorsCount} errors</span></h2>
                                <span onClick={() => this.props.togglePopup('')} className="btn-close">
                                    <img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" />
                                </span>
                            </div>
                        </div>

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
                                { this.state.fieldErrors.map((rd, i) => {

                                    return (
                                        <tr>
                                            <td>
                                                { rd.category_error ? 
                                                    <input title={rd.category_error} onChange={(e) => this.changeMapHandler(e, i)} className='form-control is-invalid' name='category' value={rd.category} />
                                                :
                                                    <div>{rd.category}</div>
                                                }
                                            </td>
                                            <td>
                                                { rd.event_name_error ? 
                                                    <input title={rd.event_name_error} onChange={(e) => this.changeMapHandler(e, i)} className='form-control is-invalid' name='event_name' value={rd.event_name} />
                                                :
                                                    <div>{rd.event_name}</div>
                                                }
                                            </td>
                                            <td>
                                                { rd.url_error ? 
                                                    <input title={rd.url_error} onChange={(e) => this.changeMapHandler(e, i)} className='form-control is-invalid' name='url' value={rd.url} />
                                                :
                                                    <div>{rd.url}</div>
                                                }
                                            </td>
                                            <td>
                                                { rd.description_error ? 
                                                    <input title={rd.description_error} onChange={(e) => this.changeMapHandler(e, i)} className='form-control is-invalid' name='description' value={rd.description} />
                                                :
                                                    <div>{rd.description}</div>
                                                }
                                            </td>
                                            <td>
                                                { rd.show_at_error ? 
                                                    <input title={rd.show_at_error} onChange={(e) => this.changeMapHandler(e, i)} className='form-control is-invalid' name='show_at' value={rd.show_at} />
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

                        <div className="text-right mt-3">
                            <Button className='btn-submit btn-theme' onClick={this.saveCsv}>Submit</Button>
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

                            <form className='form-csvUpload' onSubmit={this.handleSubmit} encType="multipart/form-data" id="csv-upload-form-container">
                                <div className="themeNewInputGroup csvFileUpload mb-4" onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onFileDrop}>
                                    <label htmlFor="csv">
                                        <i><img src={'/icon-csvUpload.svg'} alt={'CSV Upload Icon'} className="svg-inject" /></i>
                                        <strong id='csv-caption'>Drag and drop or click here</strong>
                                        <span>.csv files only — 5mb max</span>
                                        <input type="file" onChange={this.onFileSelect} className="form-control upload-csv-input" id="csv" name="csv" />
                                    </label>
                                </div>

                                <div className='grid2layout mb-3'>
                                    <div className="themeNewInputStyle">
                                        <GoogleAnalyticsPropertySelect
                                            currentPricePlan={this.props.currentPricePlan}
                                            name="google_analytics_property_id"
                                            id="google_analytics_property_id"
                                            value={this.state.google_analytics_property_id}
                                            onChangeCallback={this.changeHandler}
                                            components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                            placeholder="Select GA property"
                                            multiple
                                            onFocus={(e) => {
                                                if (this.props.currentPricePlan.ga_account_count == 1 || this.props.currentPricePlan.google_analytics_property_count == -1) {
                                                    this.props.upgradePopup('add-more-property')
                                                }
                                            }}
                                        ></GoogleAnalyticsPropertySelect>
                                    </div>
                                    <div className="themeNewInputStyle">
                                        <select name="date_format" id="date_format" className="form-control " value={this.state.date_format} onChange={this.changeHandler} required>
                                            <option value="">Select your date format</option>
                                            <option value="j/n/Y">{moment("2021-01-15").format('DD/MM/YYYY')}</option>
                                            <option value="n-j-Y">{moment("2021-01-15").format('M-D-YYYY')}</option>
                                            <option value="n-j-y">{moment("2021-01-15").format('M-D-YY')}</option>
                                            <option value="m-d-y">{moment("2021-01-15").format('MM-DD-YY')}</option>
                                            <option value="m-d-Y">{moment("2021-01-15").format('MM-DD-YYYY')}</option>
                                            <option value="y-m-d">{moment("2021-01-15").format('YY-MM-DD')}</option>
                                            <option value="Y-m-d">{moment("2021-01-15").format('YYYY-MM-DD')}</option>
                                            <option value="d-M-y">{moment("2021-01-15").format('DD-MMM-YY')}</option>
                                            <option value="n/j/Y">{moment("2021-01-15").format('M/D/YYYY')}</option>
                                            <option value="n/j/y">{moment("2021-01-15").format('M/D/YY')}</option>
                                            <option value="m/d/y">{moment("2021-01-15").format('MM/DD/YY')}</option>
                                            <option value="m/d/Y">{moment("2021-01-15").format('MM/DD/YYYY')}</option>
                                            <option value="y/m/d">{moment("2021-01-15").format('YY/MM/DD')}</option>
                                            <option value="Y/m/d">{moment("2021-01-15").format('YYYY/MM/DD')}</option>
                                            <option value="d/M/y">{moment("2021-01-15").format('DD/MMM/YY')}</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="btns-csvUpload d-flex justify-content-center">
                                    <Button className='btn-cancel' onClick={() => this.props.togglePopup('')}>Cancel</Button>
                                    <Button type='submit' className='btn-theme'>Upload and review</Button>
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

