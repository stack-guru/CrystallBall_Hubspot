import React, { Component } from 'react';
import UsersDaysGraph from './graphs/usersDaysGraph';
import HttpClient from '../../utils/HttpClient';
import AnnotationsTable from './tables/annotationsTable';

export default class IndexDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            usersDaysStatistics: [],
            annotations: [],
            startDate: '2005-01-02',
            endDate: '2021-10-15'
        };

        this.fetchStatistics = this.fetchStatistics.bind(this);
    }

    componentDidMount() {
        this.fetchStatistics();
    }

    fetchStatistics() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get(`/dashboard/users-days?start_date=${this.state.startDate}&end_date=${this.state.endDate}`)
                .then(response => {
                    this.setState({ isBusy: false, usersDaysStatistics: response.data.statistics });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
            HttpClient.get(`/dashboard/annotations-metrics-dimensions?start_date=${this.state.startDate}&end_date=${this.state.endDate}`)
                .then(response => {
                    this.setState({ isBusy: false, annotations: response.data.annotations });
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    render() {
        return <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
            <section className="ftco-section" id="inputs">
                <div className="container-xl p-0">
                    <div className="row ml-0 mr-0 mb-1">
                        <div className="col-md-12">
                            <h2 className="heading-section gaa-title">Dashboard</h2>
                        </div>
                    </div>
                    <div id="dashboard-index-container">
                        <div>
                            <UsersDaysGraph statistics={this.state.usersDaysStatistics} />
                        </div>
                    </div>
                    <AnnotationsTable user={this.props.user} annotations={this.state.annotations} />
                </div>

            </section>
        </div >;
    }
}