import React, { Component } from "react";
import moment from 'moment'

export default class TimerPromotionPopup extends Component {
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
        if (!this.props.show) return null;

        const hoursDiff = moment(this.state.offerExpiringTime).diff(moment(), 'hours');
        const minutesDiff = moment(this.state.offerExpiringTime).subtract(hoursDiff, 'hours').diff(moment(), 'minutes');
        const secondsDiff = moment(this.state.offerExpiringTime).subtract(hoursDiff, 'hours').subtract(minutesDiff, 'minutes').diff(moment(), 'seconds');

        return <div className="promo-pop-container" onClick={() => { (this.props.togglePopupCallback)(); }}>
            <div className="promo-pop-image-holder" >
                <div >
                    <a href={this.props.promotionLink} target="_blank">
                        <h1 style={{
                            position: 'absolute',
                            top: '390px',
                            left: '660px',
                            zIndex: 9,
                            color: 'white',
                            letterSpacing: '19px'
                        }}>{`${hoursDiff}:${minutesDiff}:${secondsDiff}`}</h1>
                        <img className="promo-pop-image animate__animated animate__tada" src={this.props.promotionImage} />
                    </a>
                </div>
            </div>
        </div >
    }
}