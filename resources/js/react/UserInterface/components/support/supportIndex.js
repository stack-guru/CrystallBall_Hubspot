import React, { Component } from 'react'
import { toast } from 'react-toastify'

import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient";

export default class SupportIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            support: {
                details: ''
            },
            isBusy: false,
            errors: undefined
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    setDefaultState() {
        this.setState({
            support: {
                details: ''
            },
            isBusy: false,
            errors: undefined
        });
    }

    componentDidMount() {
        document.title = "Get Support";
    }

    handleChange(e) {
        this.setState({ support: { ...this.state.support, [e.target.name]: e.target.value } })
    }

    handleSubmit(e) {
        e.preventDefault();
        let fD = new FormData(e.target);
        // HttpClient({
        //     url: `/support`, baseURL: "/ui/", method: 'post', headers: { 'Content-Type': 'multipart/form-data' },
        //     data: fD
        // })
        this.setState({ isBusy: true })
        HttpClient.post("/settings/support", fD, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                toast.info("Your request has been submitted.");
                this.setDefaultState();
            }, (err) => {
                
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                
                this.setState({ isBusy: false, errors: err });
            });
    }

    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >
                <section className="ftco-section " id="inputs" >
                    <div className="container p-5">
                        <div className="row mb-5 mr-0 ml-0">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">Get Support</h2>
                            </div>
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <form onSubmit={this.handleSubmit} encType="multipart/form-data" id="support-form-container">

                            <div className="row mr-0 ml-0">
                                <div className="col-lg-5 col-sm-5">
                                    <label htmlFor="details" className="form-control-placeholder">Message</label>
                                    <textarea name="details" className="form-control" rows="6" onChange={this.handleChange} value={this.state.support.details}></textarea>
                                </div>
                            </div>
                            <div className="row mr-0 ml-0 mt-3">
                                <div className="col-lg-5 col-sm-5">
                                    <div className="form-group">
                                        <label htmlFor="attachment" className="form-control-placeholder">Add Attachment</label>
                                        <input type="file" className="form-control" id="attachment" name="attachment" />
                                    </div>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0  mt-3">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round">
                                        {!this.state.isBusy ?
                                            <i className="fa fa-upload mr-1"></i>
                                            :
                                            <i className="fa fa-spinner fa-pulse mr-1"></i>
                                        }
                                        Send
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