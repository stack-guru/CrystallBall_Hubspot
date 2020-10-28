import React from 'react';

import HttpClient from "../../../utils/HttpClient";


export default class indexPricingPlans extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pricePlans: []

        };
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

    subscribeHandler(id){

        HttpClient.post(`/payment/${id}`,).then(resp=>{
          console.log(resp.data)
            window.location=resp.data.location;
        }).catch(err=>{
            console.log(err);
        })

    }

    render() {
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
                                    <div className="card mb-5 mb-lg-0">
                                        <div className="card-body">
                                            <h5 className="card-title text-white  text-uppercase text-center">{pricePlan.name}</h5>
                                            {pricePlan.price == 0 ?
                                                <h6 className="card-price text-center">Free<span className="period">forever</span></h6>
                                                :
                                                <h6 className="card-price text-center">${pricePlan.price}<span className="period">/month</span></h6>
                                            }
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
                                                <span onClick={(e)=>{e.target.innerText!=='SUBSCRIBED'?(this.subscribeHandler(pricePlan.id)):''}} value="subscribed" className="btn btn-block btn-success text-uppercase">Subscribed</span>
                                                :
                                                <span onClick={(e)=>{e.target.innerText!=='SUBSCRIBED'?(this.subscribeHandler(pricePlan.id)):''}} className="btn btn-block btn-primary text-uppercase">Subscribe</span>
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
