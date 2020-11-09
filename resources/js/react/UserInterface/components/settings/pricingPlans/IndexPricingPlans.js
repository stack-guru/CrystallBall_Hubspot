import React from 'react';

import HttpClient from "../../../utils/HttpClient";
import { Link, Redirect } from 'react-router-dom';


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
        HttpClient.post('/settings/price-plan/payment', { 'price_plan_id': id })
            .then(response => {
                swal("Plan downgraded", "Plan downgraded successfully.", "success").then(value => {
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

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        console.log(this.state.pricePlans);
        return (
            <div className=" bg-white component-wrapper">
                <section className="pricing bg-white ">
                    <div className="container">
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
                                            <h5 className="card-title text-white  text-uppercase text-center">{pricePlan.name}</h5>
                                            <h6 className="card-price text-center">${pricePlan.price}<span className="period">/month</span></h6>
                                            <hr />
                                            <ul className="fa-ul">
                                                {
                                                    pricePlan.has_manual_add ?
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>Manual Add</li>
                                                        :
                                                        <li className="text-white"><span className="fa-li"><i className="fa fa-times"></i></span>Manual Add</li>
                                                }

                                                {
                                                    pricePlan.has_csv_upload ?
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>CSV Upload</li>
                                                        :
                                                        <li className="text-white"><span className="fa-li"><i className="fa fa-times"></i></span>CSV Upload</li>
                                                }

                                                {
                                                    pricePlan.has_api ?
                                                        <li><span className="fa-li"><i className="fa fa-check"></i></span>Annotations API</li>
                                                        :
                                                        <li className="text-white"><span className="fa-li"><i className="fa fa-times"></i></span>Annotations API</li>
                                                }
                                            </ul>

                                            {this.props.currentPricePlan.id == pricePlan.id ?
                                                <span value="subscribed" className="btn btn-block btn-success text-uppercase">Subscribed</span>
                                                :
                                                pricePlan.price == 0 ?
                                                    <button className="btn btn-block btn-primary text-uppercase " onClick={() => { this.freeSubscribe(pricePlan.id) }} >Subscribe</button>
                                                    :
                                                    pricePlan.price < 0 ?
                                                        <button className="btn btn-block btn-primary text-uppercase " type="button" >Coming Soon</button>
                                                        :
                                                        <Link to={`/settings/price-plans/payment?price_plan_id=${pricePlan.id}`} className="btn btn-block btn-primary text-uppercase">Subscribe</Link>
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
