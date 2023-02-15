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
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)

        this.updateUserAnnotationColors = this.updateUserAnnotationColors.bind(this);
        this.loadUserAnnotationColors = this.loadUserAnnotationColors.bind(this);
        this.checkIfCanCreateAnnotation = this.checkIfCanCreateAnnotation.bind(this)
        this.onDragLeave = this.onDragLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onFileDrop = this.onFileDrop.bind(this)
        this.onFileSelect = this.onFileSelect.bind(this)
    }

    onDragLeave (e) {
        e.preventDefault();
        $("#csv-caption").text("Drag and drop or click here")
    }

    onDragOver (e) {
        e.preventDefault();
        $("#csv-caption").text("Drop here")
    }

    onFileDrop (e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        $("#csv-caption").text(files[0].name)
        $("#csv")[0].files = files;
    }

    onFileSelect (e) {
        e.preventDefault();
        const files = e.target.files;
        $("#csv-caption").text(files[0].name)
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
                Toast.fire({
                    icon: 'success',
                    title: "CSV file uploaded."
                });
                this.setState({ isBusy: false, errors: response.data.message });
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
                            <Button className='btn-cancel'>Cancel</Button>
                            <Button className='btn-theme'>Save</Button>
                            {/* <a href="/csv/upload_sample.csv" target="_blank" download>Download sample CSV file</a>
                            <button type="submit" className="btn gaa-btn-primary btn-fab btn-round"><i className="fa fa-upload mr-3"></i>Upload</button> */}
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

