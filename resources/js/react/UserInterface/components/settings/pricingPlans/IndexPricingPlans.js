import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { UncontrolledPopover, PopoverHeader, PopoverBody, Row, Container, Col, Button } from 'reactstrap';
import { calculatePricePlanPrice, manipulateRegistrationOfferText } from '../../../helpers/CommonFunctions';
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
        this.setState({ isBusy: true });
        HttpClient.get('/price-plan')
            .then(response => {
                this.setState({ pricePlans: response.data.price_plans });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
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
        this.setState({ isBusy: true });
        swal.fire({
            title: "Downgrade!",
            text: "Do you really want to downgrade your current plan after current billing cycle?",
            icon: "warning",
            buttons: ['No', 'Yes'],
            dangerMode: true,
        }).then(value => {
            if (value) {
                HttpClient.post('/settings/price-plan/payment', { 'price_plan_id': id, plan_duration: this.state.planDuration })
                    .then(response => {
                        swal.fire("Plan downgraded", "Your account will be automatically downgraded to $0 plan on next billing cycle.", "success").then(value => {
                            window.location = "/annotation"
                        })
                    }, (err) => {
                        this.setState({ isBusy: false, errors: (err.response).data });
                    }).catch(err => {
                        this.setState({ isBusy: false, errors: err });
                    });
            }
        })
    }

    togglePricingMode() {
        if (this.state.planDuration == 1) {
            this.setState({ planDuration: 12 });
        } else if (this.state.planDuration == 12) {
            this.setState({ planDuration: 1 });
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        let userRegistrationOffer = undefined;
        if (this.props.user.user_registration_offers) if (this.props.user.user_registration_offers.length) userRegistrationOffer = this.props.user.user_registration_offers[0];

        return (
            <>
                <div id="planPage" className="planPage pageWrapper">
                    <Container>
                        <div className="pageHeader planPageHead">
                            <h2 className="pageTitle">Manage plan</h2>
                            {this.props.user.price_plan.name != "Free" && this.props.user.is_billing_enabled == 0 ?
                                <p className='mb-0'>Your account will be automatically downgraded to the Free plan at {(new Date(this.props.user.price_plan_expiry_date)).getDay() + '-' + (new Date(this.props.user.price_plan_expiry_date)).getMonth() + '-' + (new Date(this.props.user.price_plan_expiry_date)).getFullYear()}. Upgrade your account to keep enjoying all the features.</p>
                                : null}
                        </div>

                        {userRegistrationOffer ? <div className="row ml-0 mr-0 p-2"><div className="col-12 text-center"><h2 className="gaa-title">{manipulateRegistrationOfferText(userRegistrationOffer.description, userRegistrationOffer)}</h2></div></div> : null}


                        <Row>
                            <Col xs={12} className='d-flex justify-content-center'>
                                <div className='plansType d-flex'>
                                    <Button onClick={() => this.setState({ planDuration: 1 })} className={`${this.state.planDuration == 1 ? 'currentPlan': null}`}>Monthly</Button>
                                    <Button onClick={() => this.setState({ planDuration: 12 })} className={`${this.state.planDuration == 12 ? 'currentPlan': null}`}>Yearly</Button>
                                </div>
                            </Col>


                            {this.state.pricePlans.map(pricePlan => {
                                return <Col md={(12 / this.state.pricePlans.length)} className='d-flex flex-column' key={pricePlan.id}>
                                    <div className={`plan d-flex flex-column flex-grow-1 ${pricePlan.badge_text && 'bestplan'}`}>
                                        {pricePlan.badge_text ? <Button className='btn-bestplan'>{pricePlan.badge_text}</Button> : null}

                                        <div className='planhead d-flex flex-column text-center'>
                                            <h3>{pricePlan.name}</h3>
                                            <p>{pricePlan.short_description.length > 35 ? <>{pricePlan.short_description}</> : pricePlan.short_description.length == 0 ? <></> : <>{pricePlan.short_description}</>}</p>
                                            <h3>{userRegistrationOffer ? <><sup>$</sup>{pricePlan.price}</> : null} <sup>$</sup>{calculatePricePlanPrice(pricePlan.price, this.state.planDuration, pricePlan.yearly_discount_percent, userRegistrationOffer)} /m</h3>
                                            {this.state.planDuration == 12 ? <span>Billed Annually</span> : <span>Billed Monthly</span>}

                                            {<>
                                                {this.props.user.price_plan.name == 'Trial' && pricePlan.price == 0 ?
                                                    <Button className='btn-plan disabled'>Disabled</Button>
                                                    :
                                                    this.props.user.price_plan.id == pricePlan.id ? <Button className='btn-currentPlan'>Current plan</Button>
                                                        :
                                                        pricePlan.price == 0 ? <Button className='btn-plan' onClick={() => { this.changePricePlan(pricePlan); }} >Subscribe</Button>
                                                            :
                                                            pricePlan.is_available == false ? <Button className='btn-plan disabled'>Coming Soon</Button>
                                                                :
                                                                <Button className='btn-plan' onClick={() => { this.changePricePlan(pricePlan); }}>Subscribe</Button>}
                                            </>}
                                        </div>
                                        <div className='planbody flex-grow-1'>
                                            <ul>
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i>
                                                    <span>
                                                        {pricePlan.google_analytics_property_count == 1 ?
                                                            <> One Property/Website</>
                                                            :
                                                            pricePlan.google_analytics_property_count > 0 ? <> Up to {pricePlan.google_analytics_property_count} Properties</> : (pricePlan.google_analytics_property_count == -1 ? <> No Property Filters</> : <> Unlimited Property Filters</>)}</span>
                                                </li>
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i>
                                                    <span>{pricePlan.annotations_count > 0 ? <> Up to {pricePlan.annotations_count} Annotations</> : <> Unlimited Annotations</>}</span>
                                                </li>
                                                <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i>
                                                    <span>{pricePlan.user_per_ga_account_count == 0 ? <>Unlimited Users</> : (pricePlan.user_per_ga_account_count == -1 ? <>Up to 1 User</> : (pricePlan.user_per_ga_account_count >= 1 ? <>Up to {pricePlan.user_per_ga_account_count + 1} User</> : (<></>)))}</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className='planfoot'>
                                            <h4>Credits</h4>
                                            <ul>
                                                {pricePlan.has_chrome_extension == 1 ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span> Chrome extension</span></li> : null}
                                                {pricePlan.has_google_data_studio == 1 ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Data Studio Connector</span></li> : null}
                                                {pricePlan.user_per_ga_account_count == 0 ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Unlimited Users</span></li> : (pricePlan.user_per_ga_account_count == -1 ? <li className='d-flex align-items-center'>
                                                        <i><img src={'/tick-green.svg'} /></i><span>Up to 1 User</span></li> : (pricePlan.user_per_ga_account_count >= 1 ? <li className='d-flex align-items-center'>
                                                            <i><img src={'/tick-green.svg'} /></i><span>Up to {pricePlan.user_per_ga_account_count + 1} User</span></li> : (<span></span>)))}
                                                {pricePlan.ga_account_count == 0 ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Unlimited GA accounts</span></li> : pricePlan.ga_account_count >= 1 ? <li className='d-flex align-items-center'>
                                                        <i><img src={'/tick-green.svg'} /></i><span>Up to {pricePlan.ga_account_count == 1 ? <span>{pricePlan.ga_account_count} GA account</span> : <span>{pricePlan.ga_account_count} GA accounts</span>}</span></li> : ''}
                                                {pricePlan.has_manual_add ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Manual Annotations</span></li> : null}

                                                {pricePlan.has_csv_upload ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>CSV Upload</span></li> : null}

                                                {pricePlan.has_api ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Annotations API</span></li> : null}
                                                {pricePlan.has_integrations ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Integrations</span></li> : null}
                                                {/* {pricePlan.has_data_sources ? <li>
                                                    <span className="fa-li"><i className="fa fa-check-circle-o"></i></span>
                                                    Automations
                                                    <img id={"automation-feature-hint-" + pricePlan.id} className="hint-button" src="/images/info-logo-grey.png" onClick={() => { this.setState({ showHintFor: 'automation-hint-' + pricePlan.id }) }} />
                                                    <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'automation-hint-' + pricePlan.id} target={"automation-feature-hint-" + pricePlan.id} toggle={() => { this.setState({ showHintFor: null }) }} onClick={() => { this.changeShownHint(null) }}>
                                                        <PopoverHeader>{pricePlan.name}</PopoverHeader>
                                                        <PopoverBody>
                                                            {pricePlan.keyword_tracking_count == -1 ? null : <span>Rank Tracking: {pricePlan.keyword_tracking_count == 0 ? 'Unlimited' : pricePlan.keyword_tracking_count} Credits<br /></span>}
                                                            Website Monitoring: {pricePlan.web_monitor_count} URLs<br />
                                                            Weather Alerts: {pricePlan.owm_city_count == 0 ? 'Unlimited' : (pricePlan.owm_city_count > 0 ? pricePlan.owm_city_count : 0)} cities<br />
                                                            News Alerts: {pricePlan.google_alert_keyword_count == 0 ? 'Unlimited' : (pricePlan.google_alert_keyword_count > 0 ? pricePlan.google_alert_keyword_count : 0)} keywords<br />
                                                            Retail Marketing Dates<br />
                                                            Google Updates<br />
                                                            WordPress Updates<br />
                                                            Holidays<br />
                                                        </PopoverBody>
                                                    </UncontrolledPopover>
                                                </li> : null} */}
                                                {pricePlan.has_notifications ? <li className='d-flex align-items-center'>
                                                    <i><img src={'/tick-green.svg'} /></i><span>Notifications</span></li> : null}
                                            </ul>
                                        </div>
                                    </div>
                                </Col>
                            })}
                        </Row>

                        <div className='planDetail'>
                            <h4>All packages include:</h4>
                            <ul>
                                <li><i><img src={'/tick-green.svg'} /></i><span>Chrome extension</span></li>
                                <li><i><img src={'/tick-green.svg'} /></i><span>Data Studio connector</span></li>
                                <li><i><img src={'/tick-green.svg'} /></i><span>Unlimited GA accounts</span></li>
                                <li><i><img src={'/tick-green.svg'} /></i><span>Manual annotations</span></li>
                                <li><i><img src={'/tick-green.svg'} /></i><span>CSV upload</span></li>
                            </ul>
                        </div>
                    </Container>
                </div>
            </>
        );
    }

}
