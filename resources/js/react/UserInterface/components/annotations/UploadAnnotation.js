import React from 'react';
import { toast } from "react-toastify";

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

export default class UploadAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            google_analytics_property_id: [""],
            date_format: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            const formData = new FormData();
            formData.append('csv', document.getElementById('csv').files[0]);
            
            this.state.google_analytics_property_id.map(gAA => { formData.append('google_analytics_property_id[]', gAA) })
            
            formData.append('date_format', this.state.date_format);
            HttpClient({
                url: `/annotation/upload`, baseURL: "/", method: 'post', headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
            }).then(response => {
                toast.success("CSV file uploaded.");
                this.setState({ isBusy: false, errors: response.data.message });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
        }
    }

    componentDidMount() {
        document.title = 'Upload CSV';
    }
    changeHandler(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container p-5">
                        <div className="mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Upload Annotations <br />
                                    <small>Upload all your annotations using CSV</small>
                                </h2>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        {/* <div className="text-primary mb-3 mt-3 ml-3 "><b>Notice: </b>Please upload CSV with date formatted as "yyyy-mm-dd"</div> */}

                        <form onSubmit={this.handleSubmit} encType="multipart/form-data" id="csv-upload-form-container">

                            <div className="row mr-0 ml-0">
                                <div className="col-lg-12 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="csv" className="form-control-placeholder">CSV</label>
                                        <input type="file" className="form-control upload-csv-input" id="csv" name="csv" />
                                    </div>
                                    <div className="row ml-0 mr-0 mt-2">
                                        <div className="form-group  col-12 col-sm-12 col-md-5 col-lg-5 p-0 ua-r-pr ">
                                            <label htmlFor="property" className="form-control-placeholder">Google Properties</label>
                                            <GoogleAnalyticsPropertySelect name="google_analytics_property_id" id="google_analytics_property_id" value={this.state.google_analytics_property_id} onChangeCallback={this.changeHandler} placeholder="Select GA Propertys" multiple></GoogleAnalyticsPropertySelect>
                                        </div>
                                        <div className="col-md-2 col-lg-2"></div>
                                        <div className="form-group col-12 col-sm-12 col-md-5 col-lg-5 p-0 ua-r-pl ">
                                            <label htmlFor="date-format" className="form-control-placeholder" >Select Date format</label>
                                            <select name="date_format" id="date_format" className="form-control " value={this.state.date_format} onChange={this.changeHandler} required>
                                                <option value="">select your date format</option>
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

                                </div>
                            </div>
                            <div className="row ml-0 mr-0  mt-3">
                                <div className="col-12 col-sm-12 col-md-4 col-lg-4 d-flex flex-column justify-content-center">
                                    <a href="/csv/upload_sample.csv" target="_blank" download>Download sample CSV file</a>
                                </div>
                                <div className="col-12 col-sm-12 col-md-8 col-lg-8 text-right">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round">
                                        <i className="fa fa-upload mr-3"></i>
                                        Upload
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

