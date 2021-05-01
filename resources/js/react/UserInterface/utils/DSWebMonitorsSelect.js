import React from 'react';
import HttpClient from '../utils/HttpClient'
import ErrorAlert from '../utils/ErrorAlert';

export default class DSWebMonitorsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: undefined,
            webMonitor: { name: '', url: '', email_address: '', sms_phone_number: '' },
            webMonitors: []
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        HttpClient.get('/data-source/web-monitor').then(resp => {
            this.setState({ webMonitors: resp.data.web_monitors, isBusy: false })
        }, (err) => {

            this.setState({ isBusy: false });
        }).catch(err => {

            this.setState({ isBusy: false });
        })
    }

    handleChange(e) {
        this.setState({ webMonitor: { ...this.state.webMonitor, [e.target.name]: e.target.value } });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.post('data-source/web-monitor', this.state.webMonitor).then(response => {
                let webMonitors = this.state.webMonitors;
                webMonitors.push(response.data.web_monitor);
                this.setState({ isBusy: false, webMonitors, errors: undefined });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            })
        }
    }

    render() {
        return (
            <div className="switch-wrapper">

                <div className="web_monitors-form">
                    <h4 className="gaa-text-primary">Manage Web Monitors</h4>
                    <ErrorAlert errors={this.state.errors} />
                    <form onSubmit={this.handleSubmit}>
                        <div className="input-group search-input-box mb-3">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Name"
                                value={this.state.webMonitor.name}
                                name="name"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="input-group search-input-box mb-3">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="URL"
                                value={this.state.webMonitor.url}
                                name="url"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="input-group search-input-box mb-3">
                            <button className="btn btn-primary" type="submit">Create</button>
                        </div>
                    </form>
                    <div className="checkbox-box mt-3">
                        {
                            this.state.webMonitors.map(wM => {
                                return (
                                    <div className="form-check wac mb-2" key={wM.id}>
                                        <button className="btn btn-sm btn-danger"><i className="fa fa-times"></i></button>
                                        <label
                                            className="form-check-label ml-1"
                                            htmlFor="defaultCheck1"
                                        >
                                            {wM.name}
                                        </label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
