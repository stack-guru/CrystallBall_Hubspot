import React from 'react';
import { toast } from "react-toastify";
import VideoModalBox from '../../utils/VideoModalBox';


import ErrorAlert from '../../utils/ErrorAlert';

export default class AnalyticsAndBusinessIntelligenceIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: undefined,
            isBusy: false,
            isDirty: false
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
    }

    setDefaultState() {
        this.setState({
            error: undefined,
            isBusy: false,
            isDirty: false
        });
    }

    changeHandler(e) {
    }

    submitHandler(e) {
        e.preventDefault();
    }

    componentDidMount() {
        document.title = 'Analytics & BI'
    }

    render() {
        return (
            <div className="container-xl bg-white  component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">
                                    Analytics &amp; BI<br />
                                    <small>Display your annotations on BI and Analytics tools</small>
                                </h2>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-3 col-sm-4">
                                <a target="_blank" href="https://chrome.google.com/webstore/detail/automated-google-analytic/jfkimpgkmamkdhamnhabohpeaplbpmom?hl=en">
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/google-analytics.png" />
                                </a>
                                <br />
                                <a target="_blank" href="https://www.youtube.com/watch?v=YLhIBKcFwFI">See how it works</a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a target="_blank" href="https://datastudio.google.com/data?search=gaannotations">
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/google-data-studio.png" />
                                </a>
                                <br />
                                <a target="_blank" href="https://youtu.be/rIOB3Pc3N5E">See how it works</a>
                            </div>
                            <div className="col-lg-3 col-sm-4">
                                <a className="disabled" href="#" onClick={e => { e.preventDefault(); swal('Coming Soon!', '', 'info'); }}>
                                    <img style={{ width: '90%', height: 'auto' }} src="/images/buttons/microsoft-power-business-intelligence-cs.png" />
                                </a>
                                <br />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

}
