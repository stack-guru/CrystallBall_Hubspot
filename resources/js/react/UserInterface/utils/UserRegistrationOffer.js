import React, { Component } from "react";
import moment from 'moment'

import TopNoticeBar from './TopNoticeBar';

export default class UserRegistrationOffer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'offerExpiringTime': moment(this.props.coupon.expires_at ?? undefined).format("YYYY-MM-DDTHH:mm:ssZ")
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.offerExpiringTime = moment(this.props.coupon.expires_at).format("YYYY-MM-DDTHH:mm:ssZ");
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                offerExpiringTime: moment(this.state.offerExpiringTime).format("YYYY-MM-DDTHH:mm:ssZ")
            });
        }, 1 * 1000);
    }


    render() {

        if (!this.props.coupon) return null;

        const hoursDiff = (moment(this.state.offerExpiringTime).diff(moment(), 'days') * 24) + moment(this.state.offerExpiringTime).diff(moment(), 'hours');
        const minutesDiff = moment(this.state.offerExpiringTime).subtract(hoursDiff, 'hours').diff(moment(), 'minutes');
        const secondsDiff = moment(this.state.offerExpiringTime).subtract(hoursDiff, 'hours').subtract(minutesDiff, 'minutes').diff(moment(), 'seconds');

        return <TopNoticeBar show={true} backgroundColor="linear-gradient(#0074E7, #0074E7)"
            content={<a href={this.props.coupon.on_click_url}><p className="text-white" style={{ marginBottom: '0px' }}>
                {this.props.coupon.heading.replace('[{expires_at}]', `${hoursDiff}:${minutesDiff}:${secondsDiff}`)}
            </p></a>}
        />
    }
}
