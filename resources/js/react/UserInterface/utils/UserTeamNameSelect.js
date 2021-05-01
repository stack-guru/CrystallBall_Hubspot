import React from "react";
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';

import HttpClient from "./HttpClient";

export default class GoogleAccountSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            teamNames: [],
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
    }


    componentDidMount() {
        this.setState({ isBusy: true })
        HttpClient.get(`/team-name`)
            .then(response => {
                this.setState({ isBusy: false, teamNames: response.data.team_names.map(tN => { return { label: tN.team_name, value: tN.team_name } }) });
            }, (err) => {
                
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                
                this.setState({ isBusy: false, errors: err });
            });
    }

    onChangeHandler(sOption) {
        this.props.onChangeCallback({ target: { name: this.props.name, value: sOption.value } });
    }

    render() {
        return (
            <CreatableSelect
                name={this.props.name}
                disabled={this.props.disabled}
                value={{ label: this.props.value, value: this.props.value }}
                id={this.props.id}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
                options={this.state.teamNames}
                placeholder={this.props.placeholder}
            >
            </CreatableSelect>
        )
    }


}
