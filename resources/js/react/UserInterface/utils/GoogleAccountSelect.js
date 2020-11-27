import React from "react";
import HttpClient from "./HttpClient";
import {Link} from "react-router-dom";

export default class GoogleAccountSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            isBusy: false,
            errors: '',
        }
    }


    componentDidMount() {
        this.setState({ isBusy: true })
        HttpClient.get(`/settings/google-account`)
            .then(response => {
                this.setState({ isBusy: false, accounts: response.data.google_accounts });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });


    }

    render() {
        let accounts = this.state.accounts;
        return (
            <select
                name={this.props.name}
                disabled={this.props.disabled}
                value={this.props.value}
                id={this.props.id}
                onChange={this.props.onChangeCallback}
                className="form-control">

                <option value=" " >Select Google account</option>

                {
                    accounts ?
                        accounts.map(acc => (
                            <React.Fragment key={acc.id}>
                            <option value={acc.id}>{acc.email}</option>

                            </React.Fragment>
                        ))

                        : <option aria-readonly={true}>No account found</option>

                }
            </select>
        )
    }


}
