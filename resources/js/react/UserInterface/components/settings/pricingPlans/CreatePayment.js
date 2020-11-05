import React, { Component } from 'react'
import HttpClient from "../../../utils/HttpClient";
import { toast } from "react-toastify";
import { Redirect } from 'react-router';
import ErrorAlert from '../../../utils/ErrorAlert';
import CCDetector from '../../../utils/CreditCardDetector';
import CountryCodeSelect from "../../../utils/CountryCodeSelect";

export default class CreatePayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            pricePlan: undefined,
            paymentDetails: {
                cardHolderName: '',
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
            cardType: 'card'

        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.applyCoupon = this.applyCoupon.bind(this)

    }

    componentDidMount() {

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
        if (['Pakistan', 'Israel'].indexOf(resp.country_name) != -1) {
            taxPercent = 17;
        }
        this.setState({ taxPercent: taxPercent, paymentDetails: { ...this.state.paymentDetails, city: resp.city, country: resp.country_name } });

    }


    changeHandler(e) {
        if (e.target.name == "cardNumber") {
            let cardType = CCDetector.getInfo(e.target.value, false, 'card').type;
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
        let cardHolderName = this.state.paymentDetails.cardHolderName;
        let cardNumber = this.state.paymentDetails.cardNumber;
        let expirationMonth = this.state.paymentDetails.expirationMonth;
        let expirationYear = this.state.paymentDetails.expirationYear;
        let securityCode = this.state.paymentDetails.securityCode;



        let errors = {};
        let isValid = true;

        if (!cardHolderName) {
            isValid = false;
            errors["cardHolderName"] = "Please enter card holder name.";

        }
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
                cardHolderName: '',
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
                    <div className="bgc-white p-20 bd">
                        <div className="mT-30">
                            <form onSubmit={this.submitHandler}>
                                <div className="row ml-0 mr-0">

                                    {/*firs  column start*/}

                                    <div className="col-6">
                                        <h4>Billing Info</h4>
                                        <div className="form-group">
                                            <label htmlFor="first_name">First Name</label>
                                            <input type="text" className="form-control" placeholder="First Name" name="first_name" id="first_name" onChange={this.changeHandler} value={this.state.paymentDetails.first_name} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">Last Name</label>
                                            <input type="text" className="form-control" placeholder="Last Name" name="last_name" id="last_name" onChange={this.changeHandler} value={this.state.paymentDetails.last_name} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="">Billing Address</label>
                                            <input type="text" className="form-control" placeholder="Your Billing Address " name="billing_address"
                                                id="billingAddress" onChange={this.changeHandler} value={this.state.paymentDetails.billing_address} />
                                        </div>
                                        <div className="row ml-0 mr-0">
                                            <div className="form-group col-6 p-3">
                                                <label htmlFor="">City</label>
                                                <input type="text" className="form-control" placeholder="City" name="city"
                                                    id="city" onChange={this.changeHandler} value={this.state.paymentDetails.city} />
                                            </div>
                                            <div className="form-group col-6 p-3">
                                                <label htmlFor="">Zip Code</label>
                                                <input type="text" className="form-control" placeholder="12300" name="zip_code"
                                                    id="zipCard" onChange={this.changeHandler} value={this.state.paymentDetails.zip_code} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="">Country</label>
                                            <CountryCodeSelect class="form-control" name="country" changeHandler={this.changeHandler} value={this.state.paymentDetails.country} ></CountryCodeSelect>
                                        </div>

                                        {/* second column start*/}
                                        <div className="mt-4">
                                            <h4>Credit Card Info</h4>

                                            <div className="form-group ">
                                                <label htmlFor="cardHolderName">Card Holder Name</label>
                                                <input type="text" className="form-control" onChange={this.changeHandler} id="cardHolderName" name="cardHolderName" placeholder="Card Holder Name" />
                                                {
                                                    validation.cardHolderName ?
                                                        <span className="text-danger">{validation.cardHolderName}</span> : ''
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="cardNumber">Card Number</label>
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text ct" id="basic-addon1">{this.state.cardType}</span>
                                                    </div>
                                                    <input type="text" className="form-control" id="cardNumber" name="cardNumber" onChange={this.changeHandler} placeholder="4242 4242 4242 4242" value={this.state.paymentDetails.cardNumber} />
                                                </div>

                                            </div>
                                            {/*<input type="text" className="form-control" id="cardNumber" name="cardNumber" onChange={this.changeHandler} onChange={this.cardDetector} placeholder="4242 4242 4242 4242" />*/}
                                            {
                                                validation.cardNumber ?
                                                    <span className="text-danger">{validation.cardNumber}</span> : ''
                                            }
                                        </div>

                                        {/*<div className="form-row">*/}


                                        <div className="row ml-0 mr-0">
                                            <div className="form-group  col pl-0">
                                                <label htmlFor="expirationMonth">Expiry Month</label>
                                                <select name="expirationMonth" placeholder="MM" onChange={this.changeHandler} id="expirationMonth" className="form-control">
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
                                            <div className="form-group col pr-0">
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
                                        <div className="form-group ">
                                            <label htmlFor="securityCode">CVV</label>
                                            <input type="number" className="form-control" onChange={this.changeHandler} id="securityCode" name="securityCode" placeholder="---" />
                                            {
                                                validation.securityCode ?
                                                    <span className="text-danger">{validation.securityCode}</span> : ''
                                            }
                                        </div>
                                        {/*</div>*/}
                                    </div>
                                    <div className="col-6">
                                        <div className="">
                                            <div className="bgc-white  ">
                                                <h4 >Details</h4>
                                                <div className="mT-30">
                                                    <div className="row">
                                                        <div className="col-6">Name</div>
                                                        <div className="col-6 text-right">{this.state.pricePlan.name}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-6">Subscription Date</div>
                                                        <div className="col-6 text-right">{moment().format("YYYY-MM-DD")}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-6">Expiry Date</div>
                                                        <div className="col-6 text-right">{moment().add(1, 'M').format("YYYY-MM-DD")}</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-6">Price</div>
                                                        <div className="col-6 text-right">${this.state.pricePlan.price}</div>
                                                    </div>
                                                    {
                                                        this.state.taxPercent ?
                                                            <div className="row">
                                                                <div className="col-6">Value Added Tax (%{this.state.taxPercent})</div>
                                                                <div className="col-6 text-right">${taxAmount}</div>
                                                            </div> :
                                                            null
                                                    }
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
                                                        <div className="col-6">Total</div>
                                                        <div className="col-6 text-right">${totalPrice}</div>
                                                    </div>


                                                    <div className="form-check mt-3">
                                                        <input type="checkbox" className="form-check-input" name="remember_card"
                                                            id="rememberCard" />
                                                        <label className="form-check-label" htmlFor="exampleCheck1">
                                                            Remember Card </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-12 text-right p-5">
                                                <div className="input-group mb-3">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text">Coupon</span>
                                                    </div>
                                                    <input name="couponCode" type="text" className="form-control" placeholder="AXJ1243" value={this.state.couponCode} onChange={e => { this.setState({ [e.target.name]: e.target.value }); }} />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-outline-secondary" type="button" onClick={this.applyCoupon}>Apply</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-1">
                                            <div className="col-12 text-right p-5">
                                                <button type="submit" className={"btn btn-primary btn-lg" + (this.state.isBusy ? "disabled" : '')}>
                                                    {
                                                        this.state.isBusy ?
                                                            <i className="fa fa-spinner fa-pulse"></i> :
                                                            'Pay'
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-12 text-right p-5">
                                                <img src="/images/bluesnap_secured_payment.png" />
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
