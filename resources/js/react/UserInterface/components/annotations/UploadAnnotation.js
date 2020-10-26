import React from 'react';
import HttpClient from '../../utils/HttpClient';
import ErrorAlert from '../../utils/ErrorAlert';
import { toast } from "react-toastify";

export default class UploadAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            const formData = new FormData();
            formData.append('csv', document.getElementById('csv').files[0]);
            HttpClient({
                url: `/annotation/upload`, baseURL: "/", method: 'post', headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
            })
                .then(response => {
                    toast.success("CSV file uploaded.");
                    this.setState({ isBusy: false, errors: undefined });
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
        return (
            <div className="container-xl bg-white component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Upload Annotations <br />
                                    <small>Upload all your annotations using CSV</small>
                                </h2>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                            <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="csv" className="form-control-placeholder">CSV</label>
                                        <input type="file" className="form-control upload-csv-input" id="csv" name="csv" />
                                    </div>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 pr-4">
                                <div className="col-12 offset-11">
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

