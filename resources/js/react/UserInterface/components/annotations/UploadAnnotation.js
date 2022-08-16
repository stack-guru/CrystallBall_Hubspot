import React from 'react';
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";

import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import GoogleAnalyticsPropertySelect from '../../utils/GoogleAnalyticsPropertySelect';

import UserAnnotationColorPicker from '../../helpers/UserAnnotationColorPickerComponent';

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

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });
        }
    }

    componentDidMount() {
        document.title = 'Upload CSV';

        this.loadUserAnnotationColors();
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
            <div className="container-xl bg-white component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container p-5">
                        <div className="mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Upload Annotations <UserAnnotationColorPicker name="csv" value={this.state.userAnnotationColors.csv} updateCallback={this.updateUserAnnotationColors} /><br />
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
                                            <GoogleAnalyticsPropertySelect
                                                currentPricePlan={this.props.currentPricePlan}
                                                name="google_analytics_property_id"
                                                id="google_analytics_property_id"
                                                value={this.state.google_analytics_property_id}
                                                onChangeCallback={this.changeHandler}
                                                components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                                placeholder="Select GA Propertys"
                                                multiple
                                                onFocus={(e) => {
                                                    if (this.props.currentPricePlan.ga_account_count == 1 || this.props.currentPricePlan.google_analytics_property_count == -1) {
                                                        const accountNotLinkedHtml = '' +
                                                            '<div class="">' +
                                                            '<img src="/images/property-upgrade-modal.jpg" class="img-fluid">' +
                                                            '</div>'
                                                        /*
                                                        * Show new google analytics account popup
                                                        * */
                                                        swal.fire({
                                                            html: accountNotLinkedHtml,
                                                            width: 700,
                                                            customClass: {
                                                                popup: 'custom_bg pb-5',
                                                                htmlContainer: 'm-0',
                                                            },
                                                            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
                                                            confirmButtonText: "Upgrade Now" + "<i class='ml-2 fa fa-caret-right'> </i>",

                                                        }).then(value => {
                                                            if (value.isConfirmed) {
                                                                this.setState({ redirectTo: "/settings/price-plans" });
                                                            }
                                                        });
                                                    }
                                                }}
                                            ></GoogleAnalyticsPropertySelect>
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
                                    <button type="submit" className="btn gaa-btn-primary btn-fab btn-round">
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

