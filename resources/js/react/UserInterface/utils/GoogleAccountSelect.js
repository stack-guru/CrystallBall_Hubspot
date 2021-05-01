import React from "react";
import HttpClient from "./HttpClient";
import { Redirect } from "react-router-dom";

export default class GoogleAccountSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            isBusy: false,
            errors: '',
            redirectTo: null,
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
    }


    componentDidMount() {
        this.setState({ isBusy: true })
        HttpClient.get(`/settings/google-account`)
            .then(response => {
                this.setState({ isBusy: false, accounts: response.data.google_accounts });
            }, (err) => {
                
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                
                this.setState({ isBusy: false, errors: err });
            });
    }

    onChangeHandler(e) {
        if (e.target.value == 'new-google-account') {
            this.setState({ redirectTo: '/settings/google-account' });
        } else {
            this.props.onChangeCallback(e);
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        let accounts = this.state.accounts;
        return (
            <select
                name={this.props.name}
                disabled={this.props.disabled}
                value={this.props.value}
                id={this.props.id}
                onChange={this.onChangeHandler}
                className="form-control">

                <option value="select-ga-account" >Select Google account</option>
                <option value="" >All Properties</option>
                {
                    accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.email}</option>
                    ))
                }
                <option value="new-google-account" >Connect new Google Account</option>
            </select>
        )
    }


}
