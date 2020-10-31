import React, { Component } from 'react'
import HttpClient from "../../../utils/HttpClient";

export default class CreatePayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pricePlan: undefined
        }
    }

    componentDidMount() {
        this.setState({ isBusy: true });
        var urlSearchParams = new URLSearchParams(window.location.search);
        HttpClient.get('/price-plan/' + urlSearchParams.get('price_plan_id'))
            .then(response => {
                this.setState({ pricePlan: response.data.price_plan });

                var urlSearchParams = new URLSearchParams(window.location.search);
                if(urlSearchParams.get('error')) swal("Error!", urlSearchParams.get('error'), "error");

            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
    }

    render() {
        if(!this.state.pricePlan) return <h5>Loading...</h5>;
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="masonry-item col-md-6">
                        <div className="bgc-white p-20 bd">
                            <h6 className="c-grey-900">Card Details</h6>
                            <div className="mT-30">
                                <form method="post" action="/settings/price-plan/payment">
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                                    <input type="hidden" name="price_plan_id" value={this.state.pricePlan.id} />

                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <input type="text" className="form-control" id="cardNumber" name="cardNumber" placeholder="4242 4242 4242 4242" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="expirationMonth">Expiry Month</label>
                                            <input type="number" className="form-control" id="expirationMonth" name="expirationMonth" placeholder="MM" />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="expirationYear">Year</label>
                                            <input type="number" className="form-control" id="expirationYear" name="expirationYear" placeholder="YYYY" />
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="securityCode">CVV</label>
                                            <input type="number" className="form-control" id="securityCode" name="securityCode" placeholder="---" />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Pay</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="masonry-item col-md-6">
                        <div className="bgc-white p-20 bd">
                            <h6 className="c-grey-900">Details</h6>
                            <div className="mT-30">
                                <div className="row">
                                    <div className="col-6">Name</div>
                                    <div className="col-6 text-right">{this.state.pricePlan.name}</div>
                                </div>
                                <div className="row">
                                    <div className="col-6">Price</div>
                                    <div className="col-6 text-right">${this.state.pricePlan.price}</div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-6">Total</div>
                                    <div className="col-6 text-right">${this.state.pricePlan.price}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >


        )
    }
}
