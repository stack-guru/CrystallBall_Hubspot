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
                        <p className='mb-0'>You’re on a Free Trial now - that will end on “10 Nov, 2022”</p>
                    </div>

                    <Row>
                        <Col xs={12} className='d-flex justify-content-center'>
                            <div className='plansType d-flex'>
                                <Button className='currentPlan'>Monthly</Button>
                                <Button>Yearly</Button>
                            </div>
                        </Col>

                        <Col md={3} className='d-flex flex-column'>
                            <div className='plan d-flex flex-column flex-grow-1'>
                                <div className='planhead d-flex flex-column text-center'>
                                    <h3>Basic</h3>
                                    <p>For starter</p>
                                    <h3><sup>$</sup>0 /m</h3>
                                    <span>billed annually</span>
                                    <Button className='btn-currentPlan'>Current plan</Button>
                                </div>
                                <div className='planbody flex-grow-1'>
                                    <ul>
                                        <li className='d-flex align-items-center'>
                                            <i><img  src={'/tick-green.svg'}/></i>
                                            <span>One property/wesbite</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 25 Annotations</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 1 user</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className='planfoot'>
                                    <h4>Credits</h4>
                                    <ul>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Rank Tracking: <strong>Unlimited</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>News Alerts: <strong>5 keywords</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Website Monitoring: <strong>5 URLs</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Weather Alerts: <strong>3 cities</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Col>

                        <Col md={3} className='d-flex flex-column'>
                            <div className='plan d-flex flex-column flex-grow-1'>
                                <div className='planhead d-flex flex-column text-center'>
                                    <h3>Basic</h3>
                                    <p>For freelancers</p>
                                    <h3><sup>$</sup>7 /m</h3>
                                    <span>billed annually</span>
                                    <Button className='btn-plan'>Subscribe</Button>
                                </div>
                                <div className='planbody flex-grow-1'>
                                    <ul>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 3 properties</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Unlimited Annotations</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 1 user</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Integrations</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Notifications</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className='planfoot'>
                                    <h4>Credits</h4>
                                    <ul>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Rank Tracking: <strong>Unlimited</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>News Alerts: <strong>5 keywords</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Website Monitoring: <strong>5 URLs</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Weather Alerts: <strong>3 cities</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Col>

                        <Col md={3} className='d-flex flex-column'>
                            <div className='plan d-flex flex-column flex-grow-1 bestplan'>
                                <Button className='btn-bestplan'>Best value</Button>
                                <div className='planhead d-flex flex-column text-center'>
                                    <h3>Business</h3>
                                    <p>For small businesses</p>
                                    <h3><sup>$</sup>39 /m</h3>
                                    <span>billed annually</span>
                                    <Button className='btn-plan'>Subscribe</Button>
                                </div>
                                <div className='planbody flex-grow-1'>
                                    <ul>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 10 properties</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Unlimited Annotations</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 11 users</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Integrations</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Notifications</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className='planfoot'>
                                    <h4>Credits</h4>
                                    <ul>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Rank Tracking: <strong>Unlimited</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>News Alerts: <strong>5 keywords</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Website Monitoring: <strong>5 URLs</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Weather Alerts: <strong>3 cities</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Col>

                        <Col md={3} className='d-flex flex-column'>
                            <div className='plan d-flex flex-column flex-grow-1'>
                                <div className='planhead d-flex flex-column text-center'>
                                    <h3>Pro</h3>
                                    <p>For professional marketers</p>
                                    <h3><sup>$</sup>79 /m</h3>
                                    <span>billed annually</span>
                                    <Button className='btn-plan'>Subscribe</Button>
                                </div>
                                <div className='planbody flex-grow-1'>
                                    <ul>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 25 properties</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Unlimited Annotations</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Up to 26 users</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Integrations</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Notifications</span>
                                        </li>
                                        <li className='d-flex align-items-center'>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Annotations API</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className='planfoot'>
                                    <h4>Credits</h4>
                                    <ul>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Rank Tracking: <strong>Unlimited</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>News Alerts: <strong>5 keywords</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Website Monitoring: <strong>5 URLs</strong></span>
                                        </li>
                                        <li>
                                            <i><img src={'/tick-green.svg'}/></i>
                                            <span>Weather Alerts: <strong>3 cities</strong></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div className='planDetail'>
                        <h4>All packages include:</h4>
                        <ul>
                            <li><i><img src={'/tick-green.svg'}/></i><span>Chrome extension</span></li>
                            <li><i><img src={'/tick-green.svg'}/></i><span>Data Studio connector</span></li>
                            <li><i><img src={'/tick-green.svg'}/></i><span>Unlimited GA accounts</span></li>
                            <li><i><img src={'/tick-green.svg'}/></i><span>Manual annotations</span></li>
                            <li><i><img src={'/tick-green.svg'}/></i><span>CSV upload</span></li>
                        </ul>
                    </div>
                </Container>
            </div>

            {/* This is old code and will be removed once we have IMPLEMENTED */}
            <div className=" bg-white component-wrapper">
                <section className="pricing bg-white ">
                    <div className="container" style={{ maxWidth: 'none' }}>
                        <div className="row ml-0 mr-0 p-2">
                            <div className="col-3">
                            </div>
                            <div className="col-6 text-center">
                                <h2 className="gaa-title">{userRegistrationOffer ? 'Limited Time Offer' : 'Choose Your Plan'}</h2>
                            </div>
                            <div className="col-2 text-right" style={{ color: '#1a98f0', paddingTop: '12px' }}>
                                Yearly - SAVE 20%
                                {/*
                                    {this.state.pricePlans.length ? (userRegistrationOffer ? 'Yearly' : 'Yearly - SAVE ' + parseFloat(this.state.pricePlans[0].yearly_discount_percent).toFixed(0) + '%') : null}
                                */}
                            </div>
                            <div className="col-1" style={{ paddingTop: '10px' }}>
                                <label className="trigger switch">
                                    <input
                                        autocomplete="off"
                                        type="checkbox"
                                        onChange={this.togglePricingMode}
                                        checked={this.state.planDuration == 12}
                                    />
                                    <span className="slider round" />
                                </label>
                            </div>
                        </div>
                        {userRegistrationOffer ? <div className="row ml-0 mr-0 p-2"><div className="col-12 text-center"><h2 className="gaa-title">{manipulateRegistrationOfferText(userRegistrationOffer.description, userRegistrationOffer)}</h2></div></div> : null}
                        <div className="row ml-0 mr-0 d-flex flex-row justify-content-center pt-3">
                            {this.state.pricePlans.map(pricePlan => {
                                return <div className={"col-lg-" + (12 / this.state.pricePlans.length)} key={pricePlan.id}>
                                    <div className={"card mb-5 mb-lg-0 " + (pricePlan.badge_text ? 'with-badge' : '')}>
                                        <div className="card-body">
                                            {pricePlan.badge_text ? <span className="badge" style={{ position: 'absolute', right: '12px' }}>{pricePlan.badge_text}</span> : null}
                                            <h2 className="card-title w-100 text-center">{pricePlan.name}</h2>
                                            {pricePlan.short_description.length > 35 ? <p className="mb-0 card-text w-100 text-center minh-92px">{pricePlan.short_description}</p> : pricePlan.short_description.length == 0 ? <p className="mb-0 card-text w-100 text-center minh-92px"></p> : <p className="mb-0 card-text w-100 text-center minh-92px">{pricePlan.short_description}</p>}
                                            <h6 className="card-price text-center w-100">{userRegistrationOffer ? <span className="real-price" style={{ textDecoration: 'line-through' }}>${pricePlan.price}</span> : null} ${calculatePricePlanPrice(pricePlan.price, this.state.planDuration, pricePlan.yearly_discount_percent, userRegistrationOffer)}<span className="period">/per month</span></h6>
                                            {this.state.planDuration == 12 ? <sub className="mt-2 w-100 text-center">Billed Annually</sub> : <sub className="mt-2 w-100 text-center">Billed Monthly</sub>}
                                            {pricePlan.google_analytics_property_count == 1 ?
                                                <p className="mt-3 w-100 ml-2" style={{ color: '#1a98f0' }}><i className="fa fa-check-circle-o" style={{ marginRight: '5px' }}></i> One Property/Website</p>
                                            :
                                            pricePlan.google_analytics_property_count > 0 ? <p className="mt-3 w-100 ml-2" style={{ color: '#1a98f0' }}><i className="fa fa-check-circle-o" style={{ marginRight: '5px' }}></i> Up to {pricePlan.google_analytics_property_count} Properties</p> : (pricePlan.google_analytics_property_count == -1 ? <p className="mt-3 text-danger w-100 ml-2"><i className="fa fa-times-circle-o" style={{ marginRight: '5px' }}></i> No Property Filters</p> : <p className="mt-3 text-success w-100 ml-2"><i className="fa fa-check-circle-o" style={{ marginRight: '5px' }}></i> Unlimited Property Filters</p>)}

                                            <hr />

                                            <ul className="fa-ul">
                                                {pricePlan.annotations_count > 0 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span> Up to {pricePlan.annotations_count} Annotations</li> : <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span> Unlimited Annotations</li>}
                                                {pricePlan.has_chrome_extension == 1 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span> Chrome extension</li> : null}
                                                {pricePlan.has_google_data_studio == 1 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Data Studio Connector</li> : null}
                                                {pricePlan.user_per_ga_account_count == 0 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Unlimited Users</li> : (pricePlan.user_per_ga_account_count == -1  ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Up to 1 User</li> : (pricePlan.user_per_ga_account_count >= 1 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Up to {pricePlan.user_per_ga_account_count+1} User</li> : (<span></span>)))}
                                                {pricePlan.ga_account_count == 0 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Unlimited GA accounts</li> : pricePlan.ga_account_count >= 1 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Up to { pricePlan.ga_account_count == 1 ? <span>{pricePlan.ga_account_count} GA account</span> : <span>{pricePlan.ga_account_count} GA accounts</span> }</li> : ''}
                                                {pricePlan.has_manual_add ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Manual Annotations</li> : null}

                                                {pricePlan.has_csv_upload ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>CSV Upload</li> : null}

                                                {pricePlan.has_api ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Annotations API</li> : null}
                                                {pricePlan.has_integrations ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Integrations</li> : null}
                                                {pricePlan.has_data_sources ? <li>
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
                                                </li> : null }
                                                { pricePlan.has_notifications ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Notifications</li> : null }
                                            </ul>

                                            {<>
                                                {this.props.user.price_plan.name == 'Trial' && pricePlan.price == 0 ?
                                                    <span value="subscribed" className="btn mx-auto pp-c-action btn-success text-uppercase mt-auto disabled">Disabled</span>
                                                :
                                                    this.props.user.price_plan.id == pricePlan.id ? <span value="subscribed" className="btn mx-auto pp-c-action btn-success text-uppercase mt-auto">Subscribed</span>
                                                :
                                                    pricePlan.price == 0 ? <button className="btn mx-auto gaa-btn-primary pp-c-action text-uppercase mt-auto " onClick={() => { this.changePricePlan(pricePlan); }} >Subscribe</button>
                                                :
                                                    pricePlan.is_available == false ? <a href="#" className="btn pp-c-action mx-auto gaa-btn-primary text-uppercase mt-auto disabled">Coming Soon</a>
                                                :
                                                    <a href="#" className="btn pp-c-action mx-auto gaa-btn-primary text-uppercase mt-auto" onClick={() => { this.changePricePlan(pricePlan); }}>Subscribe</a>}
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>

                        { this.props.user.price_plan.name != "Free" && this.props.user.is_billing_enabled == 0 ?
                            <div className="p-5 mt-4 text-center">
                                <p>Your account will be automatically downgraded to the Free plan at {(new Date(this.props.user.price_plan_expiry_date)).getDay() + '-' + (new Date(this.props.user.price_plan_expiry_date)).getMonth() + '-' + (new Date(this.props.user.price_plan_expiry_date)).getFullYear()}.<br />Upgrade your account to keep enjoying all the features.</p>
                            </div>
                        : null }
                    </div>
                </section>
            </div>
            </>
        );
    }

}
