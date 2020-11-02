import React, { Component } from 'react'
import HttpClient from "../../../utils/HttpClient";
import {toast} from "react-toastify";

export default class CreatePayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pricePlan: undefined,
            cardDetails:{
                cardNumber:'',
                expirationMonth:'',
                expirationYear:'',
                securityCode:'',
            },
            isBusy:false,
            isDirty:false,
            validation:{},
            errors:'',
        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
    }

    componentDidMount() {
        this.setState({ isBusy: true });
        var urlSearchParams = new URLSearchParams(window.location.search);
        HttpClient.get('/price-plan/' + urlSearchParams.get('price_plan_id'))
            .then(response => {
                this.setState({ pricePlan: response.data.price_plan, isBusy:false });
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


    changeHandler(e) {
        this.setState({ isDirty: true, cardDetails: { ...this.state.cardDetails, [e.target.name]: e.target.value } });
    }


    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            console.log(e);
            HttpClient.post('/settings/price-plan/payment', this.state.cardDetails)
                .then(response => {
                    // toast.success("Anno added.");
                    console.log(response)
                    this.setDefaultState();

                }, (err) => {
                    console.log(err);
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
        }

    }


    validate() {
        let cardNumber = this.state.cardDetails.cardNumber;
        let expirationMonth = this.state.cardDetails.expirationMonth;
        let expirationYear = this.state.cardDetails.expirationYear;
        let securityCode = this.state.cardDetails.securityCode;


        let errors = {};
        let isValid = true;

        if (!cardNumber ) {
            isValid = false;
            errors["cardNumber"] = "Please enter your card number.";

        }
        if (cardNumber.length < 16 ) {
            isValid = false;
            errors["cardNumber"] = "card number can't be less then 16 digits.";
        }


        if (!expirationMonth) {
            isValid = false;
            errors["expirationMonth"] = "Please select your expirationMonth.";
        }

        if (!expirationYear) {
            isValid = false;
            errors["expirationYear"] = "Please select your expirationYear.";
        }
        if (!securityCode || securityCode.length < 3) {
            isValid = false;
            errors["securityCode"] = "Please enter your card securityCode.";
        }


        this.setState({
            validation: errors
        });

        return isValid;
    }



    setDefaultState() {
        this.setState({
            cardDetails: {
                cardNumber:'',
                expirationMonth:'',
                expirationYear:'',
                securityCode:'',
            },
            validation: {},
            isBusy: false,
            isDirty: false,
            errors: undefined
        });
    }




    expiration_years() {
        let date=new Date();
        let current_year = date.getFullYear();
        let max_years = current_year + 20;
        let expiration_years = [];
        for (let i = current_year; i <= max_years; i++) {
            expiration_years.push(i);
        }
        return expiration_years;
    }

    render() {
        if(!this.state.pricePlan) return <h5>Loading...</h5>;
        const expYears= this.expiration_years();
        const validation= this.state.validation;
        return (
            <div className="container-xl bg-white component-wrapper">
                <div className="row ml-0 mr-0">
                    <div className="masonry-item col-md-6">
                        <div className="bgc-white p-20 bd">
                            <h6 className="c-grey-900">Card Details</h6>
                            <div className="mT-30">
                                <form  onSubmit={this.submitHandler}>
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').getAttribute('content')} />
                                    <input type="hidden" name="price_plan_id" value={this.state.pricePlan.id} />
                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <input type="text" className="form-control" id="cardNumber" name="cardNumber" onChange={this.changeHandler} placeholder="4242 4242 4242 4242" />
                                        {
                                            validation.cardNumber?
                                                <span className="text-danger">{validation.cardNumber}</span>:''
                                        }
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="expirationMonth">Expiry Month</label>
                                           <select name="expirationMonth"  placeholder="MM" onChange={this.changeHandler} id="expirationMonth" className="form-control">
                                                <option value="1">01</option>
                                                <option value="2">02</option>
                                                <option value="3">03</option>
                                                <option value="4">04</option>
                                                <option value="5">05</option>
                                                <option value="6">06</option>
                                                <option value="7">07</option>
                                                <option value="8">08</option>
                                                <option value="9">09</option>
                                                <option value="10">10</option>
                                                <option value="11">11</option>
                                                <option value="12">12</option>
                                            </select>
                                            {
                                                validation.expirationMonth?
                                                    <span className="text-danger">{validation.expirationMonth}</span>:''
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="expirationYear">Year</label>
                                            <select name="expirationYear" id="expirationYear" onChange={this.changeHandler} className="form-control">
                                                {
                                                    expYears.map(year=>(
                                                        <option value={year} key={year}>{year}</option>
                                                    ))

                                                }
                                            </select>
                                            {
                                                validation.expirationYear?
                                                    <span className="text-danger">{validation.expirationYear}</span>:''
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="securityCode">CVV</label>
                                            <input type="number" className="form-control" onChange={this.changeHandler} id="securityCode" name="securityCode" placeholder="---" />
                                            {
                                                validation.securityCode?
                                                    <span className="text-danger">{validation.securityCode}</span>:''
                                            }
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
