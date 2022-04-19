import React, { Component } from "react";
import moment from 'moment'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

export default class TimerPromotionPopup extends Component {
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

        let offerExpiringDate = moment(this.props.userRegistrationOffer.expires_at);

        const daysDiff = offerExpiringDate.diff(moment(), 'days');
        offerExpiringDate = offerExpiringDate.subtract(daysDiff, 'days');
        const hoursDiff = offerExpiringDate.diff(moment(), 'hours');
        offerExpiringDate = offerExpiringDate.subtract(hoursDiff, 'hours')
        const minutesDiff = offerExpiringDate.diff(moment(), 'minutes');
        offerExpiringDate = offerExpiringDate.subtract(minutesDiff, 'minutes');
        const secondsDiff = offerExpiringDate.diff(moment(), 'seconds');

        const circleStyles = {
            // Customize the root svg element
            root: {},
            // Customize the path, i.e. the "completed progress"
            path: {
                // Path color
                stroke: '#001d6d',
                strokeWidth: 4,
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'round',
                // Customize transition animation
                transition: 'stroke-dashoffset 0.5s ease 0s',
                // Rotate the path
                // transform: 'rotate(0.25turn)',
                transformOrigin: 'center center',
            },
            // Customize the circle behind the path, i.e. the "total progress"
            trail: {
                // Trail color
                stroke: '#ffc126',
                strokeWidth: 4,
                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: 'round',
                // Rotate the trail
                // transform: 'rotate(0.25turn)',
                transformOrigin: 'center center',
            },
            // Customize the text
            text: {
                wordWrap: 'break-word',
                fontWeight: 'bold',
                // Text color
                fill: '#fff',
                // Text size
                fontSize: '14px',
            },
            // Customize background - only used when the `background` prop is true
            background: {
                fill: '#3e98c7',
            },
        };

        return <div className="promo-pop-container" onClick={() => { (this.props.togglePopupCallback)(); }}>
            <div className="promo-pop-image-holder" >
                <div >
                    <a href={this.props.promotionLink}>

                        <div style={{
                            position: 'absolute',
                            top: 'calc(40px + 42%)',
                            left: 'calc(0px + 39%)',
                            zIndex: 9,
                            color: 'white',
                            width: '350px',
                            height: '200px'
                        }}>
                            <div style={{ "display": "inline-flex" }} className="animate__animated animate__bounceIn animate__delay-1s">
                                <div style={{ "width": "33%", "display": "inline-block", paddingLeft: '10px', paddingRight: '10px' }}>
                                    <CircularProgressbar value={hoursDiff + (daysDiff * 24)} maxValue={24} text={`${hoursDiff + (daysDiff * 24)} Hours`} styles={circleStyles} />
                                </div>
                                <div style={{ "width": "33%", "display": "inline-block", paddingLeft: '10px', paddingRight: '10px' }}>
                                    <CircularProgressbar value={minutesDiff} maxValue={60} text={`${minutesDiff} Minutes`} styles={circleStyles} />
                                </div>
                                <div style={{ "width": "33%", "display": "inline-block", paddingLeft: '10px', paddingRight: '10px' }}>
                                    <CircularProgressbar value={secondsDiff} maxValue={60} text={`${secondsDiff} Seconds`} styles={circleStyles} />
                                </div>
                                {/* {`${hoursDiff}:${minutesDiff}:${secondsDiff}`} */}
                            </div>
                        </div>
                        <img className="promo-pop-image animate__animated animate__tada" src={this.props.promotionImage} />
                    </a>
                </div>
            </div>
        </div >
    }
}