import React, { Component } from 'react'
import HttpClient from "../../../utils/HttpClient";
import { toast } from "react-toastify";
import { Redirect } from 'react-router';
import ErrorAlert from '../../../utils/ErrorAlert';
import CCDetector from '../../../utils/CreditCardDetector';
import CountryCodeSelect from "../../../utils/CountryCodeSelect";
import { Link } from 'react-router-dom';

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
        this.cancelSubscription = this.cancelSubscription.bind(this)
        this.applyCoupon = this.applyCoupon.bind(this)
        this.preSubmitBlueSnap = this.preSubmitBlueSnap.bind(this)

    }

    componentDidMount() {
        document.title = "Payment"
        this.setState({ isBusy: true });
        var urlSearchParams = new URLSearchParams(window.location.search);
        HttpClient.get('/price-plan/' + urlSearchParams.get('price_plan_id'))
            .then(response => {
                this.setState({ pricePlan: response.data.price_plan, isBusy: false });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });


        HttpClient.get("https://ipinfo.io/?token=cc0c476b4a3fc7").then(response => {
            let taxPercent = 0;
            if (['IL'].indexOf(response.data.country) != -1) {
                taxPercent = 17;
            }
            this.setState({ taxPercent: taxPercent, paymentDetails: { ...this.state.paymentDetails, city: response.data.city, country: response.data.country } });
        });

        setTimeout(this.attachFieldsToBlueSnap, 5000)
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
        // e.preventDefault();


        this.setState({ isBusy: true });
        var urlSearchParams = new URLSearchParams(window.location.search);
        let _token = urlSearchParams.get('_token')
        HttpClient.post(`/settings/price-plan/payment`, {
            '_token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            pfToken: _token,
            'price_plan_id': this.state.pricePlan.id,
            expirationMonth: this.state.cardData.exp.split('/')[0],
            expirationYear: this.state.cardData.exp.split('/')[1],
            ccLast4Digits: this.state.cardData.last4Digits,
            first_name: this.state.paymentDetails.first_name,
            last_name: this.state.paymentDetails.last_name,
            billing_address: this.state.paymentDetails.billing_address,
            city: this.state.paymentDetails.city,
            country: this.state.paymentDetails.country,
            zip_code: this.state.paymentDetails.zip_code,
            coupon_id: this.state.coupon ? this.state.coupon.id : null,
        })
            .then(response => {
                this.setState({ isBusy: false, errors: undefined });

                fbq('track', 'Purchase', { value: 0.00, currency: 'USD' });


                // gtag('event', 'conversion', {
                //     'send_to': 'AW-645973826/pJ_PCIrI0egBEMKOg7QC',
                //     'value': 1.0,
                //     'currency': 'USD',
                //     'transaction_id': ''
                // });
                // ga('send', {
                //     hitType: 'event',
                //     eventCategory: 'Purchase',
                //     eventAction: 'Purchase',
                //     eventLabel: this.state.pricePlan.name,
                //     eventValue: this.state.pricePlan.price
                // });

                swal(`${this.state.pricePlan.name} Plan purchased!`, "You can now enjoy extended functionalities.", "success").then(value => {
                    window.location = "/annotation"
                });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });
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
        if (cardNumber.length < 12) {
            isValid = false;
            errors["cardNumber"] = "card number can't be less then 16 digits.";
        }


        if (!expirationMonth) {
            isValid = false;
            errors["expirationMonth"] = "Please select your card's expiring month.";
        }

        if (!expirationYear) {
            isValid = false;
            errors["expirationYear"] = "Please select your card's expiring year.";
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

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });
    }

    cancelSubscription() {

        swal({
            title: "Cancel Purchase?",
            text: "Do you really want to cancel this subscription purchase?",
            icon: "warning",
            buttons: ['No', 'Yes'],
            dangerMode: true,
        }).then(value => {
            if (value) {
                fbq('track', 'Cancellation');
                ga('send', {
                    hitType: 'event',
                    eventCategory: 'Cancellation',
                    eventAction: 'Cancellation',
                    eventLabel: this.state.pricePlan.name,
                    eventValue: this.state.pricePlan.price
                });
                this.setState({ redirectTo: '/annotation' });
            }
        })
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
            totalPrice -= discountPrice;
        }
        if (this.state.taxPercent) {
            taxAmount = parseFloat(((this.state.taxPercent / 100) * totalPrice)).toFixed(2);
            totalPrice += +taxAmount
        }
        totalPrice = totalPrice.toFixed(2);

        return (
            <div className="container-xl bg-white component-wrapper">
                <ErrorAlert errors={this.state.errors} />
                <div className="masonry-item">
                    <div className="bgc-white bd">
                        <div className="mT-30">
                            <form onSubmit={this.preSubmitBlueSnap} id="paymentDetailsForm">
                                <div className="row ml-0 mr-0 seperator">

                                    {/*firs  column start*/}

                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                        <h4 className="gaa-text-primary">Billing Information</h4>

                                        <div className="form-group floating-labels">
                                            <input type="text" className="form-control " placeholder="Billing address" name="billing_address"
                                                id="billingAddress" onChange={this.changeHandler} value={this.state.paymentDetails.billing_address} />
                                            <label htmlFor="">Billing Address</label>
                                        </div>
                                        <div className="row ml-0 mr-0">
                                            <div className="col-4  pl-0">
                                                <div className="form-group ">
                                                    <label htmlFor="">Country</label>
                                                    <CountryCodeSelect className="form-control" name="country" onChange={this.changeHandler} value={this.state.paymentDetails.country} ></CountryCodeSelect>
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
                                                <div className="col-6 p-3 pp-cc-pl-r">
                                                    <div className="form-group floating-labels">
                                                        <input type="text" className="form-control" placeholder="First Name" name="first_name" id="first_name" onChange={this.changeHandler} value={this.state.paymentDetails.first_name} />
                                                        <label htmlFor="first_name">First Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 p-3 pp-cc-pr-r">
                                                    <div className="form-group floating-labels">
                                                        <input type="text" className="form-control" placeholder="Last Name" name="last_name" id="last_name" onChange={this.changeHandler} value={this.state.paymentDetails.last_name} />
                                                        <label htmlFor="last_name">Last Name</label>
                                                    </div>
                                                </div>


                                            </div>

                                            <div className="row h-30px" >
                                                <div className="col-6">
                                                    <label>Credit Card Number</label>
                                                    <div data-bluesnap="ccn" className="pb-c-inputs form-control"></div>
                                                </div>
                                                <div className="col-3">
                                                    <label>Expiry</label>
                                                    <div data-bluesnap="exp" className="pb-c-inputs form-control"></div>
                                                </div>
                                                <div className="col-3">
                                                    <label>CVV</label>
                                                    <div data-bluesnap="cvv" className="pb-c-inputs form-control"></div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="row ml-0 mr-0 mt-4">
                                            <div className="col-4 pl-0">
                                            </div>
                                            <div className="col-4 pr-0">
                                            </div>
                                        </div>
                                    </div>
                                    {/* second column starts main layout col*/}
                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                        <div className="">
                                            <div className="bgc-white  ">
                                                <h4 className="gaa-text-primary">Details</h4>
                                                <div className="mT-30">
                                                    <div className="row">
                                                        <div className="col-6"><b>Plan</b></div>
                                                        <div className="col-6 text-right"><b>{this.state.pricePlan.name}</b></div>
                                                    </div>

                                                    <br />
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
                                                    <br />
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
                                                    <span className="input-group-text">Coupon</span>
                                                    <input name="couponCode" type="text" className="form-control" value={this.state.couponCode} onChange={e => { this.setState({ [e.target.name]: e.target.value }); }} />
                                                    <button className="btn btn-outline-secondary" type="button" onClick={this.applyCoupon}>Apply</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ml-0 mr-0 mt-1">
                                            <div className="col-12 text-right p-5">

                                                <button type="submit" className={"btn gaa-btn-primary btn-md payBtn  " + (this.state.isBusy ? "disabled" : '')}>
                                                    {
                                                        this.state.isBusy ?
                                                            <i className="fa fa-spinner fa-pulse"></i> :
                                                            "PAY NOW"
                                                    }

                                                </button>
                                                {/* <button type="button" className={"btn btn-default btn-md "} onClick={this.cancelSubscription}>Cancel</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="row mt-5 ml-0 mr-0 d-flex flex-row justify-content-center align-items-center bg-white">
                                <div className="img-col-wrap">
                                    <div className="col-12 text-right  secure-img">
                                        <img src="/images/masterCard.jpg" className="img-fluid " alt="mastercard image" />
                                        <img src="/images/Visa.png" className="img-fluid " alt="visa card image" />
                                        <img src="/images/safeKey.png" className="img-fluid " alt="safekey image" />
                                        <img src="/images/PSD2.png" className="img-fluid " alt="psd2 image" />
                                        <img src="/images/PS.png" className="img-fluid " alt="ps image" />
                                        <img src="/images/pciDss.png" className="img-fluid " alt="pciDss image" />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-1 ml-0 mr-0 d-flex flex-row justify-content-center align-items-center bg-white">
                                <div className="img-col-wrap">
                                    <div className="col-12 text-right  secure-img">
                                        <Link className="gaa-text-primary" to="/settings/support">Are you having problems with the payment? Want to pay with <strong className="text-primary">PayPal</strong>? <strong className="text-primary">Contact us</strong>, and we will send you a link</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    preSubmitBlueSnap(e) {
        e.preventDefault();

        if (this.state.isBusy) {
            return;
        }
        this.setState({ isBusy: true })

        bluesnap.hostedPaymentFieldsSubmitData((callback) => {
            if (null != callback.cardData) {
                // console.log('card type: ' + callback.cardData.ccType +
                //     ', last 4 digits: ' + callback.cardData.last4Digits +
                //     ', exp: ' + callback.cardData.exp +
                //     ', issuing Country: ' + callback.cardData.issuingCountry +
                //     ', isRegulatedCard: ' + callback.cardData.isRegulatedCard +
                //     ', cardSubType: ' + callback.cardData.cardSubType +
                //     ', binCategory: ' + callback.cardData.binCategory +
                //     ' and ccBin: ' + callback.cardData.ccBin +
                //     ', after that I can call final submit');

                let cardData = callback.cardData;
                this.setState({ cardData });
                this.submitHandler(e);

            } else {
                this.setState({ isBusy: false })
                var errorArray = callback.error;
                for (i in errorArray) {
                    console.log("Received error: tagId= " +
                        errorArray[i].tagId + ", errorCode= " +
                        errorArray[i].errorCode + ", errorDescription= " +
                        errorArray[i].errorDescription);
                }
            }
        });
    }
    attachFieldsToBlueSnap() {
        bluesnap.hostedPaymentFieldsCreate(bsObj)
    }
}
