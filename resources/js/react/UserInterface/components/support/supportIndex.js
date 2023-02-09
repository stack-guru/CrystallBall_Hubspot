import React, { Component } from 'react'
import { Container } from 'reactstrap';

import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient";

export default class SupportIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            support: {
                details: '',
                successMessage: false
            },
            isBusy: false,
            errors: undefined,
            fileSelected: false
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
        this.setState({ isBusy: true, successMessage: false })
        HttpClient.post("/settings/support", fD, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(response => {
                this.setState({ successMessage: true })
                this.setDefaultState();
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    render() {
        return (
            <div id="supportPage" className="supportPage pageWrapper">
                <Container>
                    <div className="pageHeader supportPageHead">
                        <h2 className="pageTitle">Support</h2>
                        <p>Send any query or questions. We’d be happy to answer them</p>
                        <ErrorAlert errors={this.state.errors} />
                        {this.state.successMessage ? <div className='alert alert-success border-0'>
                            <i><img src={'/icon-check-success.svg'} alt={'icon'} className="svg-inject" /></i>
                            <span>Message sent successfully. We’ll try to reply as soon as possible.</span>
                        </div> : null}
                    </div>

                    <form className='supportForm' onSubmit={this.handleSubmit} encType="multipart/form-data" id="support-form-container">
                        <div className="themeNewInputGroup mb-4">
                            <textarea name="details" className="form-control" placeholder='Enter your message here...' onChange={this.handleChange} value={this.state.support.details}></textarea>
                        </div>
                        <div className="themeNewInputGroup inputFie mb-4">
                            <span className='d-block'>Attach files (optional)</span>
                            <label>
                                <span><i><img src={'/icon-paperclip.svg'} alt={'Paper Clip icon'} className="svg-inject" /></i>
                                { this.state.fileSelected ? 
                                    <span>Chosen</span>
                                : 
                                    <span>No file chosen...</span>
                                }
                                </span>
                                <label htmlFor="attachment" className="form-control-placeholder">Upload<input type="file" id="attachment" onChange={() => {this.setState({fileSelected: true})}} name="attachment" /></label>
                            </label>
                        </div>
                        <button type="submit" className="btn-theme">Send</button>
                    </form>
                </Container>
            </div>
        );
    }

}
