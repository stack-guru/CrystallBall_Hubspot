import React from 'react';
import {Link, Redirect} from 'react-router-dom';
import {UncontrolledPopover, PopoverHeader, PopoverBody, Row, Container, Col, Button} from 'reactstrap';
import {calculatePricePlanPrice, manipulateRegistrationOfferText} from '../../../helpers/CommonFunctions';
import HttpClient from "../../../utils/HttpClient";

export default class IndexPricingPlans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pricePlans: [],
            redirectTo: null,
            planDuration: 12, // [1, 12]
            shownSeconds: 0,
        };
        this.freeSubscribe = this.freeSubscribe.bind(this);
        this.changePricePlan = this.changePricePlan.bind(this);
        this.togglePricingMode = this.togglePricingMode.bind(this);
    }

    componentDidMount() {
        document.title = 'Price Plan';
        this.setState({isBusy: true});
        HttpClient.get('/price-plan')
            .then(response => {
                this.setState({pricePlans: response.data.price_plans});
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
        if (this.props.user.user_registration_offers) {
            if (this.props.user.user_registration_offers.length) {
                setInterval(() => {
                    this.setState({
                        shownSeconds: this.state.shownSeconds++
                    });
                }, 1 * 1000);
            }
        }

        // swal.fire({
        //     html: `<ga-plan-downgrade-upgrade-popup heading="<h1>Upgrade today to add more  <span>Ads Trackers</span></h1>"
        //     subHeading=${`<p>and get access to all amazing features</p>`}
        //     bannerImg="/images/trackers-ads.svg"></ga-plan-downgrade-upgrade-popup>`,
        //     width: 600,
        //     showCancelButton: true,
        //     showCloseButton: false,
        //     showConfirmButton: false,
        //     customClass: {
        //         popup: "gaErrorPopup",
        //     },
        //     cancelButtonClass: "btn-close",
        //     cancelButtonText: "Close",
        // })

        // swal.fire({
        //     html: `<ga-plan-downgrade-upgrade-popup heading="<h1 class='color-blue'>Congratulations!</h1>"
        //     subHeading="<p>Your account has been upgraded to <span>Pro</span>.</p>"
        //     bannerImg="/images/upgrade-congrats.svg"></ga-plan-downgrade-upgrade-popup>`,
        //     width: 1000,
        //     showCancelButton: false,
        //     showCloseButton: false,
        //     showConfirmButton: false,
        //     customClass: {
        //         popup: "gaUpgradePopup",
        //     },
        // })
    }

    changePricePlan(pricePlan) {
        if (this.props.user.user_id) {
            swal.fire("Unauthorized", "Only the Admin of your team can change the plan", "error");
        } else {
            if (pricePlan.price == 0) {
                this.freeSubscribe(pricePlan.id)
            } else if (pricePlan.is_available == false) {
            } else {
                window.location.href = `/settings/price-plans/payment?price_plan_id=${pricePlan.id}&plan_duration=${this.state.planDuration}`;
            }
        }
    }

    freeSubscribe(id) {
        this.setState({isBusy: true});
        swal.fire({
            title: "Downgrade!",
            text: "Do you really want to downgrade your current plan after current billing cycle?",
            icon: "warning",
            buttons: ['No', 'Yes'],
            dangerMode: true,
        }).then(value => {
            if (value) {
                HttpClient.post('/settings/price-plan/payment', {
                    'price_plan_id': id,
                    plan_duration: this.state.planDuration
                })
                    .then(response => {
                        swal.fire("Plan downgraded", "Your account will be automatically downgraded to $0 plan on next billing cycle.", "success").then(value => {
                            window.location = "/annotation"
                        })
                    }, (err) => {
                        this.setState({isBusy: false, errors: (err.response).data});
                    }).catch(err => {
                    this.setState({isBusy: false, errors: err});
                });
            }
        })
    }

    togglePricingMode() {
        if (this.state.planDuration == 1) {
            this.setState({planDuration: 12});
        } else if (this.state.planDuration == 12) {
            this.setState({planDuration: 1});
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>
        let userRegistrationOffer = undefined;
        if (this.props.user.user_registration_offers) if (this.props.user.user_registration_offers.length) userRegistrationOffer = this.props.user.user_registration_offers[0];

        return (
            <>
                <div id="planPage" className="planPage pageWrapper">
                    <Container>
                        <div className="pageHeader planPageHead">
                            <h2 className="pageTitle">Manage plan</h2>
                            {this.props.user.price_plan.name == "Trial" ?
                                <p className='mb-0'>Trial ends
                                    at {moment(this.props.user.price_plan_expiry_date || new Date()).format('ll')}.
                                    Upgrade your account to keep enjoying all the features.</p>
                                : null}
                        </div>

                        {userRegistrationOffer ? <div className="row ml-0 mr-0 p-2">
                            <div className="col-12 text-center"><h2
                                className="gaa-title">{manipulateRegistrationOfferText(userRegistrationOffer.description, userRegistrationOffer)}</h2>
                            </div>
                        </div> : null}


                        <Row>
                            <Col xs={12} className='d-flex justify-content-center'>
                                <div className='plansType d-flex'>
                                    <Button onClick={() => this.setState({planDuration: 1})}
                                            className={`${this.state.planDuration == 1 ? 'currentPlan' : null}`}>Monthly</Button>
                                    <Button onClick={() => this.setState({planDuration: 12})}
                                            className={`${this.state.planDuration == 12 ? 'currentPlan' : null}`}>Yearly</Button>
                                </div>
                            </Col>


                            {this.state.pricePlans.map(pricePlan => {
                                return <Col md={Math.round(Math.max((12 / this.state.pricePlans.length), 3))}
                                            className='d-flex flex-column my-3' key={pricePlan.id}>
                                    <div
                                        className={`plan d-flex flex-column flex-grow-1 ${pricePlan.badge_text && 'bestplan'}`}>
                                        {pricePlan.badge_text ?
                                            <Button className='btn-bestplan'>{pricePlan.badge_text}</Button> : null}

                                        <div className='planhead d-flex flex-column text-center'>
                                            <h3>{pricePlan.name}</h3>
                                            <p>{pricePlan.short_description.length > 35 ? <>{pricePlan.short_description}</> : pricePlan.short_description.length == 0 ? <></> : <>{pricePlan.short_description}</>}</p>
                                            {pricePlan.yearly_discount_percent ?
                                                <div className="price-plan-discount-text">
                                                    <label className="px-3">{this.state.planDuration == 12 && pricePlan.short_description !== "For Freelancers" ?
                                                        <>{Number(pricePlan.yearly_discount_percent)}% OFF</> :
                                                        pricePlan.short_description === "For Freelancers" ? <>Limited
                                                            time offer</> : null
                                                    }</label></div> : null}
                                            {pricePlan.short_description === "For Freelancers" ? <div>
                                                <h3 className="price-plan-discount-strick">
                                                    <label><sup>$</sup> 29/m</label>
                                                </h3>
                                            </div> : null}
                                            <h3>{userRegistrationOffer ? <><sup>$</sup>{pricePlan.price}</> : <>
                                                <sup>$</sup>{calculatePricePlanPrice(pricePlan.price, this.state.planDuration, pricePlan.yearly_discount_percent, userRegistrationOffer)} /m</>}</h3>
                                            {this.state.planDuration == 12 ? <span>Billed Annually</span> :
                                                <span>Billed Monthly</span>}

                                            {<>
                                                {this.props.user.price_plan.name == 'Trial' && pricePlan.price == 0 ?
                                                    <Button className='btn-plan disabled'>Disabled</Button>
                                                    :
                                                    this.props.user.price_plan.id == pricePlan.id ?
                                                        <Button className='btn-currentPlan'>Current plan</Button>
                                                        :
                                                        pricePlan.price == 0 ?
                                                            <Button className='btn-plan' onClick={() => {
                                                                this.changePricePlan(pricePlan);
                                                            }}>Subscribe</Button>
                                                            :
                                                            pricePlan.is_available == false ?
                                                                <Button className='btn-plan disabled'>Coming
                                                                    Soon</Button>
                                                                :
                                                                <Button className='btn-plan' onClick={() => {
                                                                    this.changePricePlan(pricePlan);
                                                                }}>Subscribe</Button>}
                                            </>}
                                        </div>
                                        <div className='planbody'>
                                            <ul>
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'}/></i>
                                                    <span>{pricePlan.annotations_count > 0 ? <> Up
                                                        to {pricePlan.annotations_count} Annotations</> : <> Unlimited
                                                        Annotations</>}</span>
                                                </li>
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'}/></i>
                                                    <span>
                                                        {pricePlan.google_analytics_property_count == 1 ?
                                                            <> One Property/Website</>
                                                            :
                                                            pricePlan.google_analytics_property_count > 0 ? <> Up
                                                                to {pricePlan.google_analytics_property_count} Properties</> : (pricePlan.google_analytics_property_count == -1 ? <> No
                                                                Property Filters</> : <> Unlimited Property
                                                                Filters</>)}</span>
                                                </li>

                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'}/></i>
                                                    <span>Chrome extension</span>
                                                </li>
                                                {pricePlan.has_google_data_studio ?
                                                    <li className='d-flex align-items-center'>
                                                        <i><img
                                                            src={'/tick-green.svg'}/></i><span>Data Studio Connector</span>
                                                    </li> : null}
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'}/></i>
                                                    <span>{pricePlan.user_per_ga_account_count == 0 ? <>Unlimited
                                                        Users</> : (pricePlan.user_per_ga_account_count == -1 ? <>Up to
                                                        1 Users</> : (pricePlan.user_per_ga_account_count >= 1 ? <>Up
                                                        to {pricePlan.user_per_ga_account_count + 1} Users</> : (<></>)))}</span>
                                                </li>

                                                {/*<li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i>
                                                    <span>Unlimited GA accounts</span>
                                                </li>*/}
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'}/></i>
                                                    <span>Manual annotations</span>
                                                </li>
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'}/></i>
                                                    <span>CSV upload</span>
                                                </li>


                                                {pricePlan.has_api ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'}/></i><span>Annotations API</span>
                                                </li> : null}
                                                {/* {pricePlan.has_integrations ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Zapier Integrations</span></li> : null} */}
                                                {pricePlan.has_notifications ?
                                                    <li className='d-flex align-items-center'>
                                                        <i><img src={'/tick-green.svg'}/></i><span>Notifications</span>
                                                    </li> : null}
                                            </ul>
                                        </div>

                                        {(pricePlan.keyword_tracking_count == -1 || pricePlan.keyword_tracking_count == null) &&
                                        (pricePlan.web_monitor_count == -1 || pricePlan.web_monitor_count == null) &&
                                        (pricePlan.owm_city_count == -1 || pricePlan.owm_city_count) &&
                                        (pricePlan.owm_city_count == -1 || pricePlan.owm_city_count == null) &&
                                        (pricePlan.google_alert_keyword_count == -1 || pricePlan.google_alert_keyword_count == null) &&
                                        (pricePlan.apple_podcast_monitor_count == -1 || pricePlan.apple_podcast_monitor_count == null) &&
                                        (pricePlan.bitbucket_credits_count == -1 || pricePlan.bitbucket_credits_count == null) &&
                                        (pricePlan.aws_credits_count == -1 || pricePlan.aws_credits_count == null) &&
                                        (pricePlan.github_credits_count == -1 || pricePlan.github_credits_count == null) &&
                                        (pricePlan.linkedin_credits_count == -1 || pricePlan.linkedin_credits_count == null) &&
                                        (pricePlan.shopify_monitor_count == -1 || pricePlan.shopify_monitor_count == null) &&
                                        (pricePlan.twitter_credits_count == -1 || pricePlan.twitter_credits_count == null) ? null :
                                            <div className='planfoot'>
                                                <h4>Automated Annotations Credits</h4>
                                                <ul>
                                                    {pricePlan.keyword_tracking_count == -1 || pricePlan.keyword_tracking_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Rank Tracking: {pricePlan.keyword_tracking_count == 0 ? 'Unlimited' : pricePlan.keyword_tracking_count} API Calls/m</span>
                                                        </li>}
                                                    {pricePlan.web_monitor_count == -1 || pricePlan.web_monitor_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Website Monitoring: {pricePlan.web_monitor_count == 0 ? 'Unlimited' : pricePlan.web_monitor_count}</span>
                                                        </li>}
                                                    {pricePlan.owm_city_count == -1 || pricePlan.owm_city_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Weather Alerts: {pricePlan.owm_city_count == 0 ? 'Unlimited' : pricePlan.owm_city_count}</span>
                                                        </li>}
                                                    {pricePlan.google_alert_keyword_count == -1 || pricePlan.google_alert_keyword_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>News Alerts: {pricePlan.google_alert_keyword_count == 0 ? 'Unlimited' : pricePlan.google_alert_keyword_count}</span>
                                                        </li>}
                                                    {pricePlan.apple_podcast_monitor_count == -1 || pricePlan.apple_podcast_monitor_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Apple Poadcast: {pricePlan.apple_podcast_monitor_count == 0 ? 'Unlimited' : pricePlan.apple_podcast_monitor_count}</span>
                                                        </li>}
                                                    {pricePlan.bitbucket_credits_count == -1 || pricePlan.bitbucket_credits_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Bitbucket: {pricePlan.bitbucket_credits_count == 0 ? 'Unlimited' : pricePlan.bitbucket_credits_count}</span>
                                                        </li>}
                                                    {pricePlan.aws_credits_count == -1 || pricePlan.aws_credits_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Aws: {pricePlan.aws_credits_count == 0 ? 'Unlimited' : pricePlan.aws_credits_count}</span>
                                                        </li>}
                                                    {pricePlan.github_credits_count == -1 || pricePlan.github_credits_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Github: {pricePlan.github_credits_count == 0 ? 'Unlimited' : pricePlan.github_credits_count}</span>
                                                        </li>}
                                                    {pricePlan.linkedin_credits_count == -1 || pricePlan.linkedin_credits_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Linkedin: {pricePlan.linkedin_credits_count == 0 ? 'Unlimited' : pricePlan.linkedin_credits_count}</span>
                                                        </li>}
                                                    {pricePlan.shopify_monitor_count == -1 || pricePlan.shopify_monitor_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Shopify: {pricePlan.shopify_monitor_count == 0 ? 'Unlimited' : pricePlan.shopify_monitor_count}</span>
                                                        </li>}
                                                    {pricePlan.twitter_credits_count == -1 || pricePlan.twitter_credits_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Twitter: {pricePlan.twitter_credits_count == 0 ? 'Unlimited' : pricePlan.twitter_credits_count}</span>
                                                        </li>}
                                                    {pricePlan.holiday_credits_count == -1 || pricePlan.holiday_credits_count == null ? null :
                                                        <li className='d-flex align-items-center'><i><img
                                                            src={'/tick-green.svg'}/></i>
                                                            <span>Holidays: {pricePlan.holiday_credits_count == 0 ? 'Unlimited' : pricePlan.holiday_credits_count}</span>
                                                        </li>}
                                                </ul>
                                            </div>}
                                    </div>
                                </Col>
                            })}
                        </Row>

                        {/* <div className='planDetail'>
                            <h4>All packages include:</h4>
                            <ul>
                                <li><i><img src={'/tick-green.svg'} /></i><span>Chrome extension</span></li>
                                <li><i><img src={'/tick-green.svg'} /></i><span>Unlimited GA accounts</span></li>
                                <li><i><img src={'/tick-green.svg'} /></i><span>Manual annotations</span></li>
                                <li><i><img src={'/tick-green.svg'} /></i><span>CSV upload</span></li>
                            </ul>
                        </div> */}
                    </Container>
                </div>
            </>
        );
    }

}
