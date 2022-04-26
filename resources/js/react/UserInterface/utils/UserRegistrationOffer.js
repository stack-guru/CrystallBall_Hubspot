import React, { Component } from "react";
import moment from 'moment'

import TopNoticeBar from './TopNoticeBar';
import { manipulateRegistrationOfferText } from "../helpers/CommonFunctions";

export default class UserRegistrationOffer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'shownSeconds': 0
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                shownSeconds: this.state.shownSeconds++
            });
        }, 1 * 1000);
    }

    render() {

        if (!this.props.userRegistrationOffer) return null;
        if (!this.props.show) return null;

        return <TopNoticeBar show={true} backgroundColor="linear-gradient(#0074E7, #0074E7)"
            content={<a href={this.props.userRegistrationOffer.on_click_url}><p className="text-white" style={{ marginBottom: '0px' }}>
                {manipulateRegistrationOfferText(this.props.userRegistrationOffer.heading, this.props.userRegistrationOffer)}
            </p></a>}
        />
    }
}
