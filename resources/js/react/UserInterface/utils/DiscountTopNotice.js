import React, { Component } from "react";
import moment from 'moment'

import TopNoticeBar from './TopNoticeBar';

export default class DiscountTopNotice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'offerExpiringTime': moment().add(2, 'days').format("YYYY-MM-DDTHH:mm:ss")

        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                offerExpiringTime: moment(this.state.offerExpiringTime).format("YYYY-MM-DDTHH:mm:ss")
            });
        }, 1 * 1000);
    }

    render() {
        const hoursDiff = moment(this.state.offerExpiringTime).diff(moment(), 'hours');
        const minutesDiff = moment(this.state.offerExpiringTime).subtract(hoursDiff, 'hours').diff(moment(), 'minutes');
        const secondsDiff = moment(this.state.offerExpiringTime).subtract(hoursDiff, 'hours').subtract(minutesDiff, 'minutes').diff(moment(), 'seconds');

        return (
            <TopNoticeBar show={true} backgroundColor="linear-gradient(90deg, #FF8534 33.33%, #FF630C 100%)"
                content={<p className="text-white" style={{ marginBottom: '0px' }}>50% off for next 48 hours.
                    {hoursDiff}:
                    {minutesDiff}:
                    {secondsDiff}
                </p>}
            />
        )
    }
}
