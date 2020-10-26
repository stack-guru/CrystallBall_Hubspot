import React from 'react';

export  default class indexPricingPlans extends React.Component{

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className=" bg-white">
                <section className="pricing py-5 bg-white ">
                    <div className="container">
                        <div className="row ml-0 mr-0 p-4">
                            <div className="col-12 text-center">
                                <h2>Choose Your Plan</h2>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 d-flex flex-row justify-content-center pt-5">

                            <div className="col-lg-4">
                                <div className="card mb-5 mb-lg-0">
                                    <div className="card-body">
                                        <h5 className="card-title text-white  text-uppercase text-center">Free</h5>
                                        <h6 className="card-price text-center">$0<span className="period">/month</span>
                                        </h6>
                                        <hr/>
                                            <ul className="fa-ul">
                                                <li><span className="fa-li"><i className="fa fa-check"></i></span>Single
                                                    User
                                                </li>
                                                <li><span className="fa-li"><i className="fa fa-check"></i></span>5GB
                                                    Storage
                                                </li>
                                                <li><span className="fa-li"><i className="fa fa-check"></i></span>Unlimited
                                                    Public Projects
                                                </li>
                                                <li><span className="fa-li"><i className="fa fa-check"></i></span>Community
                                                    Access
                                                </li>
                                                <li className="text-white"><span className="fa-li"><i
                                                    className="fa fa-times"></i></span>Unlimited Private Projects
                                                </li>
                                                <li className="text-white"><span className="fa-li"><i
                                                    className="fa fa-times"></i></span>Dedicated Phone Support
                                                </li>
                                                <li className="text-white"><span className="fa-li"><i
                                                    className="fa fa-times"></i></span>Free Subdomain
                                                </li>
                                                <li className="text-white"><span className="fa-li"><i
                                                    className="fa fa-times"></i></span>Monthly Status Reports
                                                </li>
                                            </ul>
                                            <a href="#" className="btn btn-block btn-primary text-uppercase">Subscribe</a>
                                    </div>
                                </div>
                            </div>
                        {/*    card 2 start*/}

                            <div className="col-lg-4">
                                <div className="card mb-5 mb-lg-0">
                                    <div className="card-body">
                                        <h5 className="card-title text-white text-uppercase text-center">Free</h5>
                                        <h6 className="card-price text-center">$0<span className="period">/month</span>
                                        </h6>
                                        <hr/>
                                        <ul className="fa-ul">
                                            <li><span className="fa-li"><i className="fa fa-check"></i></span>Single
                                                User
                                            </li>
                                            <li><span className="fa-li"><i className="fa fa-check"></i></span>5GB
                                                Storage
                                            </li>
                                            <li><span className="fa-li"><i className="fa fa-check"></i></span>Unlimited
                                                Public Projects
                                            </li>
                                            <li><span className="fa-li"><i className="fa fa-check"></i></span>Community
                                                Access
                                            </li>
                                            <li className=" text-white"><span className="fa-li"><i
                                                className="fa fa-times"></i></span>Unlimited Private Projects
                                            </li>
                                            <li className="text-white"><span className="fa-li"><i
                                                className="fa fa-times"></i></span>Dedicated Phone Support
                                            </li>
                                            <li className="text-white"><span className="fa-li"><i
                                                className="fa fa-times"></i></span>Free Subdomain
                                            </li>
                                            <li className="text-white"><span className="fa-li"><i
                                                className="fa fa-times"></i></span>Monthly Status Reports
                                            </li>
                                        </ul>
                                        <a href="#" className="btn btn-block btn-primary text-uppercase">Subscribe</a>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </section>
            </div>
        );
    }

}
