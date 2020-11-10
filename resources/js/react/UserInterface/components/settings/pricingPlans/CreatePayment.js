import React, { Component } from 'react'
import HttpClient from "../../../utils/HttpClient";
import { toast } from "react-toastify";
import { Redirect } from 'react-router';
import ErrorAlert from '../../../utils/ErrorAlert';
import CCDetector from '../../../utils/CreditCardDetector';
import CountryCodeSelect from "../../../utils/CountryCodeSelect";
require("../../../Main.css");

export default class CreatePayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pricePlan: undefined,
            paymentDetails: {
                cardNumber: '',
                expirationMonth: '',
                expirationYear: '',
                securityCode: '',
            },
            isBusy: false,
            isDirty: false,
            redirectTo: null,
            validation: {},
            errors: '',
            couponCode: '',
            taxPercent: 0,
            cardType: 'Card'

        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.applyCoupon = this.applyCoupon.bind(this)

    }

    componentDidMount() {
document.title="Payment"
        this.setState({ isBusy: true });
        var urlSearchParams = new URLSearchParams(window.location.search);
        HttpClient.get('/price-plan/' + urlSearchParams.get('price_plan_id'))
            .then(response => {
                this.setState({ pricePlan: response.data.price_plan, isBusy: false });
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });


        let taxPercent = 0;
        let xhr = new XMLHttpRequest;
        xhr.open("GET", "https://ipapi.co/json", !1), xhr.send();
        let resp = JSON.parse(xhr.responseText);
        if (['IL'].indexOf(resp.country) != -1) {
            taxPercent = 17;
        }
        this.setState({ taxPercent: taxPercent, paymentDetails: { ...this.state.paymentDetails, city: resp.city, country: resp.country } });

    }


    changeHandler(e) {
        if (e.target.name == "cardNumber") {
            let cardType = CCDetector.getInfo(e.target.value, false, 'Card').type;
            if (this.state.cardType !== cardType) this.setState({ cardType: cardType });
            let cn = e.target.value;
            let x = cn.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4")
            e.target.value = x;
        };

        this.setState({ isDirty: true, paymentDetails: { ...this.state.paymentDetails, [e.target.name]: e.target.value } });

    }


    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.post('/settings/price-plan/payment', { ...this.state.paymentDetails, 'price_plan_id': this.state.pricePlan.id })
                .then(response => {
                    this.setState({ isBusy: false, errors: undefined });
                    swal("Plan purchased", "New plan purchased.", "success").then(value => {
                        window.location = "/annotation"
                    });
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
        let cardNumber = this.state.paymentDetails.cardNumber;
        let expirationMonth = this.state.paymentDetails.expirationMonth;
        let expirationYear = this.state.paymentDetails.expirationYear;
        let securityCode = this.state.paymentDetails.securityCode;



        let errors = {};
        let isValid = true;

        if (!cardNumber) {
            isValid = false;
            errors["cardNumber"] = "Please enter your card number.";

        }
        if (cardNumber.length < 16) {
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
            // isValid = false;
            // errors["securityCode"] = "Please enter your card securityCode.";
        }


        this.setState({
            validation: errors
        });

        return isValid;
    }



    setDefaultState() {
        this.setState({
            paymentDetails: {
                cardNumber: '',
                expirationMonth: '',
                expirationYear: '',
                securityCode: '',
            },
            validation: {},
            isBusy: false,
            isDirty: false,
            errors: undefined
        });
    }




    expiration_years() {
        let date = new Date();
        let current_year = date.getFullYear();
        let max_years = current_year + 20;
        let expiration_years = [];
        for (let i = current_year; i <= max_years; i++) {
            expiration_years.push(i);
        }
        return expiration_years;
    }


    applyCoupon() {
        this.setState({ isBusy: true });
        HttpClient.get('/coupon?coupon_code=' + this.state.couponCode)
            .then(response => {
                this.setState({ coupon: response.data.coupon, paymentDetails: { ...this.state.paymentDetails, coupon_id: response.data.coupon.id }, isBusy: false });
                toast.success("Coupon applied.");
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });
    }

    render() {
        if (!this.state.pricePlan) return <h5>Loading...</h5>;
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

        const expYears = this.expiration_years();
        const validation = this.state.validation;
        let totalPrice = 0.00, discountPrice = 0.00, taxAmount = 0.00;

        if (this.state.pricePlan) totalPrice += this.state.pricePlan.price
        if (this.state.coupon) {
            discountPrice = parseFloat(((this.state.coupon.discount_percent / 100) * this.state.pricePlan.price)).toFixed(2);
        }
        if (this.state.taxPercent) {
            taxAmount = parseFloat(((this.state.taxPercent / 100) * this.state.pricePlan.price)).toFixed(2);
        }
        totalPrice = totalPrice - discountPrice + +taxAmount;
        totalPrice = totalPrice.toFixed(2);

        return (
            <div className="container-xl bg-white component-wrapper">
                <ErrorAlert errors={this.state.errors} />
                <div className="masonry-item">
                    <div className="bgc-white bd">
                        <div className="mT-30">
                            <form onSubmit={this.submitHandler}>
                                <div className="row ml-0 mr-0 seperator">

                                    {/*firs  column start*/}

                                    <div className="col-6">
                                        <h4 className="gaa-text-primary">Billing Information</h4>

                                        <div className="form-group floating-labels">
                                            <input type="text" className="form-control " placeholder="Billing address"  name="billing_address"
                                                id="billingAddress" onChange={this.changeHandler} value={this.state.paymentDetails.billing_address} />
                                            <label htmlFor="">Billing Address</label>
                                        </div>
                                        <div className="row ml-0 mr-0">
                                            <div className="col-4  pl-0">
                                                <div className="form-group ">
                                                    <label htmlFor="">Country</label>
                                                    <CountryCodeSelect class="form-control" name="country" changeHandler={this.changeHandler} value={this.state.paymentDetails.country} ></CountryCodeSelect>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-group floating-labels">
                                                    <input type="text" className="form-control" placeholder="City" name="city"
                                                           id="city" onChange={this.changeHandler} value={this.state.paymentDetails.city} />
                                                    <label htmlFor="">City</label>
                                                </div>
                                            </div>
                                            <div className="col-4 pr-0">
                                                <div className="form-group floating-labels">
                                                    <input type="text" className="form-control" placeholder="Zip" name="zip_code"
                                                           id="zipCard" onChange={this.changeHandler} value={this.state.paymentDetails.zip_code} />
                                                    <label htmlFor="">Zip Code</label>
                                                </div>
                                            </div>



                                        </div>


                                        {/* second column start*/}
                                        <div className="mt-2">
                                            <h4 className="gaa-text-primary">Credit Card</h4>

                                            <div className="row ml-0 mr-0">
                                                <div className="col-6 p-3">
                                                    <div className="form-group floating-labels">
                                                        <input type="text" className="form-control" placeholder="First Name"  name="first_name" id="first_name" onChange={this.changeHandler} value={this.state.paymentDetails.first_name} />
                                                        <label htmlFor="first_name">First Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 p-3">
                                                    <div className="form-group floating-labels">
                                                        <input type="text" className="form-control" placeholder="Last Name" name="last_name" id="last_name" onChange={this.changeHandler} value={this.state.paymentDetails.last_name} />
                                                        <label htmlFor="last_name">Last Name</label>
                                                    </div>
                                                </div>


                                            </div>

                                            <div className="form-group ">
                                                <label htmlFor="cardNumber">Card Number</label>
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text ct" id="basic-addon1">{this.state.cardType}</span>
                                                    </div>
                                                    <input type="text" className="form-control" id="cardNumber" name="cardNumber" onChange={this.changeHandler} placeholder="4242 4242 4242 4242" value={this.state.paymentDetails.cardNumber} />
                                                </div>

                                            </div>
                                            {
                                                validation.cardNumber ?
                                                    <span className="text-danger">{validation.cardNumber}</span> : ''
                                            }
                                        </div>

                                        {/*<div className="form-row">*/}


                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-4 pl-0">
                                                <div className="form-group ">
                                                    <label htmlFor="expirationMonth">Expiry Month</label>
                                                    <select name="expirationMonth"  onChange={this.changeHandler} id="expirationMonth" className="form-control">
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
                                                        validation.expirationMonth ?
                                                            <span className="text-danger">{validation.expirationMonth}</span> : ''
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-4 p-2">
                                                <div className="form-group ">
                                                    <label htmlFor="expirationYear">Year</label>
                                                    <select name="expirationYear" id="expirationYear" onChange={this.changeHandler} className="form-control">
                                                        {
                                                            expYears.map(year => (
                                                                <option value={year} key={year}>{year}</option>
                                                            ))

                                                        }
                                                    </select>
                                                    {
                                                        validation.expirationYear ?
                                                            <span className="text-danger">{validation.expirationYear}</span> : ''
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-4 pr-0">
                                                <div className="form-group  floating-labels">

                                                    <input type="text" className="form-control"  placeholder="CVV" onChange={this.changeHandler} id="securityCode" name="securityCode"  />
                                                    {
                                                        validation.securityCode ?
                                                            <span className="text-danger">{validation.securityCode}</span> : ''
                                                    }
                                                    <label htmlFor="securityCode">CVV</label>
                                                </div>
                                            </div>
                                        </div>

                                        {/*</div>*/}
                                    </div>

                                    <div className="col-6">
                                        <div className="">
                                            <div className="bgc-white  ">
                                                <h4 className="gaa-text-primary">Details</h4>
                                                <div className="mT-30">
                                                    <div className="row">
                                                        <div className="col-6"><b>Plan</b></div>
                                                        <div className="col-6 text-right"><b>{this.state.pricePlan.name}</b></div>
                                                    </div>

                                                    <br/>
                                                    <div className="row">
                                                        <div className="col-6">Price</div>
                                                        <div className="col-6 text-right">${this.state.pricePlan.price}</div>
                                                    </div>

                                                            <div className="row">
                                                                <div className="col-6">Tax ({this.state.taxPercent}%)</div>
                                                                <div className="col-6 text-right">${taxAmount}</div>
                                                            </div>

                                                    <hr />
                                                    {
                                                        this.state.coupon ?
                                                            <React.Fragment>
                                                                <div className="row">
                                                                    <div className="col-6">Discount Price</div>
                                                                    <div className="col-6 text-right">${discountPrice}</div>
                                                                </div>
                                                                <hr />
                                                            </React.Fragment>
                                                            : null
                                                    }
                                                    <div className="row">
                                                        <div className="col-6"> <b>Total</b></div>
                                                        <div className="col-6 text-right"><b>${totalPrice}</b></div>
                                                    </div>
                                                            <br/>
                                                    <div className="row">
                                                        <div className="col-6">Subscription start at</div>
                                                        <div className="col-6 text-right">{moment().format("YYYY-MM-DD")}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-6">Next billing at</div>
                                                        <div className="col-6 text-right">{moment().add(1, 'M').format("YYYY-MM-DD")}</div>
                                                    </div>
                                                    {/* <div className="form-check mt-3">
                                                        <input type="checkbox" className="form-check-input" name="remember_card"
                                                            id="rememberCard" />
                                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                                            Remember Card </label>
                                                    </div>*/}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-12 text-right p-5">
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text">Coupon</span>
                                                    </div>
                                                    <input name="couponCode" type="text" className="form-control"  value={this.state.couponCode} onChange={e => { this.setState({ [e.target.name]: e.target.value }); }} />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-outline-secondary" type="button" onClick={this.applyCoupon}>Apply</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-1">
                                            <div className="col-12 text-right p-5">

                                                <button type="submit" className={"btn btn-primary btn-md payBtn  " + (this.state.isBusy ? "disabled" : '')}>
                                                    {
                                                        this.state.isBusy ?
                                                            <i className="fa fa-spinner fa-pulse"></i> :
                                                            "PAY NOW"
                                                    }

                                                </button>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4 d-flex flex-row justify-content-center align-items-center">
                                           <div className="img-col-wrap">
                                                <div className="col-12 text-right p-5 secure-img">
                                                    <img src="/images/masterCard.jpg" className="img-fluid " alt="mastercard image"/>
                                                    <img src="/images/Visa.png" className="img-fluid " alt="visa card image"/>
                                                    <img src="/images/PS.png"  className="img-fluid " alt="ps image"/>
                                                    <img src="/images/PSD2.png"  className="img-fluid " alt="psd2 image"/>
                                                    <img src="/images/safeKey.png"  className="img-fluid " alt="safekey image"/>
                                                    <img src="/images/pciDss.png" className="img-fluid " alt="pciDss image"/>
                                                </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >


        )
    }
}
