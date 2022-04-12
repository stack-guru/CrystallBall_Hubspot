import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';
import { calculatePricePlanPrice } from '../../../helpers/CommonFunctions';

import HttpClient from "../../../utils/HttpClient";

export default class IndexPricingPlans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pricePlans: [],
            redirectTo: null,
            planDuration: '12', // [1, 12]
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
        if (this.state.planDuration == '1') {
            this.setState({ planDuration: '12' });
        } else if (this.state.planDuration == '12') {
            this.setState({ planDuration: '1' });
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        let userSpecificCoupon = undefined;
        if (this.props.user.user_specific_coupons) if (this.props.user.user_specific_coupons.length) userSpecificCoupon = this.props.user.user_specific_coupons[0];

        return (
            <div className=" bg-white component-wrapper">
                <section className="pricing bg-white ">
                    <div className="container">
                        <div className="row ml-0 mr-0 p-2">
                            <div className="col-3">
                            </div>
                            <div className="col-5 text-center">
                            </div>
                            <div className="col-4 text-right" style={{ color: '#1a98f0', paddingTop: '12px' }}>
                                {userSpecificCoupon ? 'You already have a 20% off coupon active' : null}
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 p-2">
                            <div className="col-3">
                            </div>
                            <div className="col-6 text-center">
                                <h2 className="gaa-title">Choose Your Plan</h2>
                            </div>
                            <div className="col-2 text-right" style={{ color: '#1a98f0', paddingTop: '12px' }}>
                                Yearly SAVE 30%
                            </div>
                            <div className="col-1" style={{ paddingTop: '10px' }}>
                                <label className="trigger switch">
                                    <input
                                        type="checkbox"
                                        onChange={this.togglePricingMode}
                                        checked={this.state.planDuration == '12'}
                                    />
                                    <span className="slider round" />
                                </label>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 d-flex flex-row justify-content-center pt-3">

                            {this.state.pricePlans.map(pricePlan => {

                                return <div className="col-lg-4" key={pricePlan.id}>

                                    {/*<input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />*/}
                                    {/*<input type="hidden" name="price_plan_id" value={pricePlan.id} />*/}

                                    <div className={"card mb-5 mb-lg-0 " + (pricePlan.badge_text ? 'with-badge' : '')}>
                                        <div className="card-body">
                                            {pricePlan.badge_text ?
                                                <span className="badge" style={{ position: 'absolute', right: '12px' }}>{pricePlan.badge_text}</span>
                                                : null}
                                            <h2 className="card-title w-100 text-center">
                                                {pricePlan.name}
                                            </h2>

                                            {/* This line break logic is completely rubbish but it works.
                                                If you have some better approach for it, don't hesitate
                                                to comment this one and try yours. */}
                                            {
                                                pricePlan.short_description.length > 35 ? <p className="mb-0 card-text w-100 text-center">{pricePlan.short_description}</p> :
                                                    pricePlan.short_description.length == 0 ? <p className="mb-0 card-text w-100 text-center">&nbsp;<br />&nbsp;</p> :
                                                        <p className="mb-0 card-text w-100 text-center">{pricePlan.short_description}<br />&nbsp;</p>
                                            }
                                            {/* Constants for 1 and Annual values should have been used. But 
                                                it might have caused some compilation errors that's why I avoided
                                                them. If you can do it without any errors feel free to do it. */}
                                            <h6 className="card-price text-center w-100">
                                                ${calculatePricePlanPrice(pricePlan.price, this.state.planDuration, pricePlan.yearly_discount_percent, userSpecificCoupon)}
                                                <span className="period">/per month</span>
                                            </h6>
                                            {this.state.planDuration == '12' ? <sub className="mt-2 w-100 text-center">Billed Annually</sub> : <sub className="mt-2 w-100 text-center">Billed Monthly</sub>}
                                            {
                                                pricePlan.google_analytics_property_count == 1 ?
                                                    <p className="mt-3 w-100 ml-2" style={{ color: '#1a98f0' }}><i className="fa fa-check-circle-o" style={{ marginRight: '5px' }}></i> One Property/Website</p>
                                                    :
                                                    pricePlan.google_analytics_property_count > 0 ?
                                                        <p className="mt-3 w-100 ml-2" style={{ color: '#1a98f0' }}><i className="fa fa-check-circle-o" style={{ marginRight: '5px' }}></i> Up to {pricePlan.google_analytics_property_count} Properties</p>
                                                        :
                                                        (pricePlan.google_analytics_property_count == -1 ?
                                                            <p className="mt-3 text-danger w-100 ml-2"><i className="fa fa-times-circle-o" style={{ marginRight: '5px' }}></i> No Property Filters</p>
                                                            :
                                                            <p className="mt-3 text-success w-100 ml-2"><i className="fa fa-check-circle-o" style={{ marginRight: '5px' }}></i> Unlimited Property Filters</p>)
                                            }
                                            <hr />
                                            <ul className="fa-ul">
                                                {
                                                    pricePlan.annotations_count > 0 ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span> {pricePlan.annotations_count} Annotations</li>
                                                        :
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span> Unlimited Annotations</li>
                                                }
                                                {
                                                    pricePlan.has_chrome_extension == 1 ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span> Chrome extension</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.has_google_data_studio == 1 ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Data Studio Connector</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.user_per_ga_account_count == 0 ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Unlimited Users</li>
                                                        : (pricePlan.user_per_ga_account_count == 1 ?
                                                            <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Up to 1 User</li>
                                                            : <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Up to {pricePlan.user_per_ga_account_count} Users</li>)
                                                }
                                                {
                                                    pricePlan.ga_account_count == 0 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Unlimited GA accounts</li>
                                                        :
                                                        pricePlan.ga_account_count == 1 ? <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Single User</li>
                                                            :
                                                            <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>{pricePlan.ga_account_count} GA accounts</li>
                                                }
                                                {/* {
                                                    pricePlan.ga_account_count == 0 ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Annotations Properties Filtering</li>
                                                        : null
                                                } */}
                                                {
                                                    pricePlan.has_manual_add ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Manual Annotations</li>
                                                        : null
                                                }

                                                {
                                                    pricePlan.has_csv_upload ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>CSV Upload</li>
                                                        : null
                                                }

                                                {
                                                    pricePlan.has_api ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Annotations API</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.has_integrations ?
                                                        <li><span className="fa-li"><i className="fa fa-check-circle-o"></i></span>Integrations</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.has_data_sources ?
                                                        <li>
                                                            <span className="fa-li"><i className="fa fa-check-circle-o"></i></span>
                                                            Automations
                                                            <img id={"automation-feature-hint-" + pricePlan.id} className="hint-button" src="/images/info-logo-grey.png" onClick={() => { this.setState({ showHintFor: 'automation-hint-' + pricePlan.id }) }} />
                                                            <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'automation-hint-' + pricePlan.id} target={"automation-feature-hint-" + pricePlan.id} toggle={() => { this.setState({ showHintFor: null }) }} onClick={() => { this.changeShownHint(null) }}>
                                                                <PopoverHeader>{pricePlan.name}</PopoverHeader>
                                                                <PopoverBody>
                                                                    Website Monitoring: {pricePlan.web_monitor_count} URLs<br />
                                                                    Weather Alerts: {pricePlan.owm_city_count == 0 ? 'unlimited' : pricePlan.owm_city_count} cities<br />
                                                                    News Alerts: {pricePlan.google_alert_keyword_count == 0 ? 'unlimited' : pricePlan.google_alert_keyword_count} keywords<br />
                                                                    Retail Marketing Dates<br />
                                                                    Google Updates<br />
                                                                    WordPress Updates<br />
                                                                    Holidays
                                                                </PopoverBody>
                                                            </UncontrolledPopover>
                                                        </li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.has_notifications ?
                                                        <li>
                                                            <span className="fa-li"><i className="fa fa-check-circle-o"></i></span>
                                                            Notifications
                                                            {/* <img id={"automation-feature-hint-" + pricePlan.id} className="hint-button" src="/images/info-logo-grey.png" onClick={() => { this.setState({ showHintFor: 'automation-hint-' + pricePlan.id }) }} />
                                                            <UncontrolledPopover trigger="legacy" placement="right" isOpen={this.state.showHintFor == 'automation-hint-' + pricePlan.id} target={"automation-feature-hint-" + pricePlan.id} toggle={() => { this.setState({ showHintFor: null }) }} onClick={() => { this.changeShownHint(null) }}>
                                                                <PopoverHeader>{pricePlan.name}</PopoverHeader>
                                                                <PopoverBody>
                                                                    Website Monitoring: {pricePlan.web_monitor_count} URLs<br />
                                                                    Weather Alerts: {pricePlan.owm_city_count == 0 ? 'unlimited' : pricePlan.owm_city_count} cities<br />
                                                                    News Alerts: {pricePlan.google_alert_keyword_count == 0 ? 'unlimited' : pricePlan.google_alert_keyword_count} keywords<br />
                                                                    Retail Marketing Dates<br />
                                                                    Google Updates<br />
                                                                    WordPress Updates<br />
                                                                    Holidays
                                                                </PopoverBody>
                                                            </UncontrolledPopover> */}
                                                        </li>
                                                        : null
                                                }
                                            </ul>

                                            {
                                                this.props.user.price_plan.name == 'Trial' && pricePlan.price == 0 ?
                                                    <span value="subscribed" className="btn mx-auto pp-c-action btn-success text-uppercase mt-auto disabled">Disabled</span>
                                                    : this.props.user.price_plan.id == pricePlan.id ?
                                                        <span value="subscribed" className="btn mx-auto pp-c-action btn-success text-uppercase mt-auto">Subscribed</span>
                                                        :
                                                        pricePlan.price == 0 ?
                                                            <button className="btn mx-auto gaa-btn-primary pp-c-action text-uppercase mt-auto " onClick={() => { this.changePricePlan(pricePlan); }} >Subscribe</button>
                                                            :
                                                            pricePlan.is_available == false ?
                                                                <a href="#" className="btn pp-c-action mx-auto gaa-btn-primary text-uppercase mt-auto disabled">Coming Soon</a>
                                                                :
                                                                <a href="#" className="btn pp-c-action mx-auto gaa-btn-primary text-uppercase mt-auto" onClick={() => { this.changePricePlan(pricePlan); }}>Subscribe</a>
                                            }
                                        </div>
                                    </div>

                                </div>
                            })}
                        </div>

                        {/* {
                            this.props.user.price_plan.name != "Free" && this.props.user.is_billing_enabled == 0 ?
                                <div className="p-5 text-center">
                                    <p>Your account will be automatically downgraded to the Free plan at {this.props.user.price_plan_expiry_date}.<br />
                                        So to keep enjoying all the features, upgrade your account.</p>
                                </div>
                                : null
                        } */}
                    </div>
                </section>
            </div>
        );
    }

}
