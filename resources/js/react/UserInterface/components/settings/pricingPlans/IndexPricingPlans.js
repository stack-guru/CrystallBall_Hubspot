import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import HttpClient from "../../../utils/HttpClient";

export default class indexPricingPlans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pricePlans: [],
            redirectTo: null
        };
        this.freeSubscribe = this.freeSubscribe.bind(this);
    }

    componentDidMount() {
        document.title = 'Price Plan';
        this.setState({ isBusy: true });
        HttpClient.get('/price-plan')
            .then(response => {
                this.setState({ pricePlans: response.data.price_plans });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
    }

    freeSubscribe(id) {
        this.setState({ isBusy: true });
        swal({
            title: "Downgrade!",
            text: "Do you really want to downgrade your current plan after current billing cycle?",
            icon: "warning",
            buttons: ['No', 'Yes'],
            dangerMode: true,
        }).then(value => {
            if (value) {
                HttpClient.post('/settings/price-plan/payment', { 'price_plan_id': id })
                    .then(response => {
                        swal("Plan downgraded", "Your account will be automatically downgraded to $0 plan on next billing cycle.", "success").then(value => {
                            window.location = "/annotation"
                        })
                    }, (err) => {
                        console.log(err);
                        this.setState({ isBusy: false, errors: (err.response).data });
                    }).catch(err => {
                        console.log(err)
                        this.setState({ isBusy: false, errors: err });
                    });

            }
        })

    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        return (
            <div className=" bg-white component-wrapper">
                <section className="pricing bg-white ">
                    <div className="container">
                        {
                            this.props.user.price_plan.price != 0 && this.props.user.is_billing_enabled == 0 ?
                                <div className="alert alert-info" role="alert">
                                    <h4 className="alert-heading"><i className="icon fa fa-info"></i> Downgrade scheduled!</h4>
                                    <p>Your account will be automatically downgraded to $0 plan on next billing cycle.</p>
                                </div>
                                : null
                        }
                        <div className="row ml-0 mr-0 p-2">
                            <div className="col-12 text-center">
                                <h2 className="gaa-title">Choose Your Plan</h2>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 d-flex flex-row justify-content-center pt-3">

                            {this.state.pricePlans.map(pricePlan => {

                                return <div className="col-lg-4" key={pricePlan.id}>

                                    {/*<input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />*/}
                                    {/*<input type="hidden" name="price_plan_id" value={pricePlan.id} />*/}

                                    <div className="card mb-5 mb-lg-0">
                                        <div className="card-body">
                                            <h5 className="card-title  text-uppercase text-center">{pricePlan.name}</h5>

                                            {/* This line break logic is completely rubbish but it works.
                                                If you have some better approach for it, don't hesitate
                                                to comment this one and try yours. */}
                                            {
                                                pricePlan.short_description.length > 35 ? <p className="mb-0 card-text">{pricePlan.short_description}</p> :

                                                    pricePlan.short_description.length == 0 ? <p className="mb-0 card-text">&nbsp;<br />&nbsp;</p> :
                                                        <p className="mb-0 card-text">{pricePlan.short_description}<br />&nbsp;</p>
                                            }
                                            <h6 className="card-price text-center">${pricePlan.price}<span className="period">/month</span></h6>
                                            <hr />
                                            <ul className="fa-ul">

                                                <li><span className="fa-li"><i className="fa fa-asterisk"></i></span> Chrome extension</li>
                                                
                                                {
                                                    pricePlan.ga_account_count == 0 ? <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>Unlimited GA accountS</li>
                                                        :
                                                        pricePlan.ga_account_count == 1 ? <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>single user</li>
                                                            :
                                                            <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>{pricePlan.ga_account_count} GA accounts</li>
                                                }
                                                {
                                                    pricePlan.ga_account_count == 0 ?
                                                        <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>Annotations account filtering</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.user_per_ga_account_count == 0 ?
                                                        <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>Unlimited users</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.has_manual_add ?
                                                        <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>Manual Annotations</li>
                                                        : null
                                                }

                                                {
                                                    pricePlan.has_csv_upload ?
                                                        <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>CSV Upload</li>
                                                        : null
                                                }

                                                {
                                                    pricePlan.has_api ?
                                                        <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>Annotations API</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.has_integrations ?
                                                        <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>Integrations</li>
                                                        : null
                                                }
                                                {
                                                    pricePlan.has_data_sources ?
                                                        <li><span className="fa-li"><i className="fa fa-asterisk"></i></span>Data sources</li>
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
                                                            <button className="btn mx-auto btn-primary pp-c-action text-uppercase mt-auto " onClick={() => { this.freeSubscribe(pricePlan.id) }} >Subscribe</button>
                                                            :
                                                            pricePlan.price < 0 ?
                                                                <button className="btnmx-auto btn-primary pp-c-action text-uppercase mt-auto " type="button" >Coming Soon</button>
                                                                :
                                                                <a href={`/settings/price-plans/payment?price_plan_id=${pricePlan.id}`} className="btn pp-c-action mx-auto btn-primary text-uppercase mt-auto">Subscribe</a>
                                            }
                                        </div>
                                    </div>

                                </div>
                            })}


                        </div>
                    </div>
                </section>
            </div>
        );
    }

}
