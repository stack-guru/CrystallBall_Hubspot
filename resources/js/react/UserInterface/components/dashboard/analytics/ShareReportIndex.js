import React, {Component} from 'react'
import Toast from "../../../utils/Toast";
import {Redirect} from 'react-router-dom'

import ErrorAlert from '../../../utils/ErrorAlert'
import HttpClient from '../../../utils/HttpClient'
import UserTeamNameSelect from "../../../utils/UserTeamNameSelect";
import SpinningLoader from '../../../utils/SpinningLoader'


export default class ShareReportIndex extends Component {
    constructor(props) {
        super(props)

        this.state = {
            shared_reports: [],
            errors: undefined,
            redirectTo: null,

        }
        this.getReports = this.getReports.bind(this)
        this.downloadExcel = this.downloadExcel.bind(this)
    }

    componentDidMount() {
        document.title = 'Shared Report Send';
        this.getReports();

    }

    setDefaultState() {
        this.setState({
            errors: undefined,
            redirectTo: null,
            loading: false
        });
    }
    downloadExcel(id) {
        // HttpClient.get(`/dashboard/analytics/get-shared-reports`)
        // .then(
        //     (response) => {
        //         this.setState({shared_reports: response.data.shared_reports});
        //     },
        //     (err) => {
        //         this.setState({errors: err.response.data});
        //     }
        // )
        // .catch((err) => {
        //     this.setState({errors: err});
        // });
    }

    getReports() {
        HttpClient.get(`/dashboard/analytics/get-shared-reports`)
            .then(
                (response) => {
                    this.setState({shared_reports: response.data.shared_reports});
                },
                (err) => {
                    this.setState({errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({errors: err});
            });
    }
    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>
        return (
            <div className="apps-bodyContent">
                <div className='dataTable d-flex flex-column'>
                    <div className="dataTableHolder">
                        <div className="tableHead singleRow">
                            <div className="singleCol text-left">Send Date</div>
                            <div className="singleCol text-left">Start Date</div>
                            <div className="singleCol text-left">End Date</div>
                            <div className="singleCol text-left">Property</div>
                            <div className="singleCol text-left">Action</div>
                        </div>
                        <div className="tableBody">
                        {this.state.shared_reports.length > 0 ? this.state.shared_reports.map((shared_report, index) => {
                             return (
                                <div className="singleRow">
                                    <div className="singleCol text-left"><span>{moment(shared_report.created_at).format('YYYY-MM-DD HH:mm:ss')}</span></div>
                                    <div className="singleCol text-left"><span>{shared_report.start_date}</span></div>
                                    <div className="singleCol text-left"><span>{shared_report.end_date}</span></div>
                                    <div className="singleCol text-left"><span>{shared_report.property.name}</span></div>
                                    <div className="singleCol text-left">
                                        <a href="javascript:void(0);" onClick={() => this.downloadExcel(shared_report.id)} className="">Download</a>
                                    </div>
                                </div>
                            );})
                        : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
