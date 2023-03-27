import React, { Component } from 'react'
import HttpClient from "../../../utils/HttpClient";
import Toast from "../../../utils/Toast";
import { Redirect } from 'react-router';
import ErrorAlert from '../../../utils/ErrorAlert';
import CCDetector from '../../../utils/CreditCardDetector';
import CountryCodeSelect from "../../../utils/CountryCodeSelect";
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import PhoneInput from 'react-phone-input-2';
import LoaderAnimation from "../../../utils/LoaderAnimation";
import DowngradedPopup from "../../../utils/DowngradedPopup";

export default class CreatePayment extends Component {

    taxableCountries = ['IL'];
    constructor(props) {
        super(props)

        this.state = {
            pricePlan: undefined,
            paymentDetails: {
                company_name: '',
                company_registration_number: '',
                phone_number_prefix: '',
                phone_number: '',

                city: '',
                country: 'Country',
                billing_address: '',
                zip_code: '',

                first_name: '',
                last_name: '',

                cardNumber: '',
                expirationMonth: '',
                expirationYear: '',
                securityCode: '',
            },
            isBusy: false,
            isLoading: false,
            isDirty: false,
            redirectTo: null,
            validation: {},
            errors: '',
            couponCode: '',
            taxPercent: 0,
            cardType: 'Card',
            alerts: [],
            planDuration: 12
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

        // Set Plan Duration
        this.setState({ planDuration: urlSearchParams.get('plan_duration') });
        
        HttpClient.post(`/settings/price-plan/check-extra-apps`, {
            '_token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'price_plan_id': urlSearchParams.get('price_plan_id'),
        })
        .then(response => {
            this.setState({ isBusy: false, errors: undefined }, async () => {
                let arr = response.data.alertText;
                for (let i = 0; i < arr.length; i++) {
                    let r = await swal.fire({
                        text: arr[i],
                        confirmButtonText : 'Got It'
                    });
                }
            });  
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
        // Get price plan
        HttpClient.get('/price-plan/' + urlSearchParams.get('price_plan_id'))
            .then(response => {
                this.setState({ pricePlan: response.data.price_plan, isBusy: false });
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });


        HttpClient.get("https://ipinfo.io/?token=cc0c476b4a3fc7").then(response => {
            let tP = 0;
            if (this.taxableCountries.indexOf(response.data.country) != -1) {
                tP = 17;
            }
            this.setState({ taxPercent: tP, paymentDetails: { ...this.state.paymentDetails, city: response.data.city, country: response.data.country } });
        }).catch(error => {});
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

        if (e.target.name == 'country') {
            if (this.taxableCountries.indexOf(e.target.value) != -1) {
                this.setState({ taxPercent: 17 })
            } else {
                this.setState({ taxPercent: 0 })
            }
        }
        this.setState({ isDirty: true, paymentDetails: { ...this.state.paymentDetails, [e.target.name]: e.target.value } });

    }


    submitHandler(e) {
        // e.preventDefault();


        this.setState({ isBusy: true ,isLoading: true });
        var urlSearchParams = new URLSearchParams(window.location.search);
        let _token = urlSearchParams.get('_token')
        HttpClient.post(`/settings/price-plan/payment`, {
            '_token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            pfToken: _token,
            'price_plan_id': this.state.pricePlan.id,
            expirationMonth: this.state.cardData.exp.split('/')[0],
            expirationYear: this.state.cardData.exp.split('/')[1],
            ccLast4Digits: this.state.cardData.last4Digits,

            company_name: this.state.paymentDetails.company_name,
            company_registration_number: this.state.paymentDetails.company_registration_number,
            phone_number_prefix: this.state.paymentDetails.phone_number_prefix,
            phone_number: this.state.paymentDetails.phone_number,

            first_name: this.state.paymentDetails.first_name,
            last_name: this.state.paymentDetails.last_name,
            billing_address: this.state.paymentDetails.billing_address,
            city: this.state.paymentDetails.city,
            country: this.state.paymentDetails.country,
            zip_code: this.state.paymentDetails.zip_code,
            coupon_id: this.state.coupon ? this.state.coupon.id : null,
            plan_duration: this.state.planDuration,
        })
            .then(response => {
                this.setState({ isBusy: false, errors: undefined,isLoading: false });

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

                swal.fire(`${this.state.pricePlan.name} Plan purchased!`, "You can now enjoy extended functionalities.", "success").then(value => {
                    window.location = "/annotation"
                });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err,isLoading: false });
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
            isLoading: false,
            isDirty: false,
            errors: undefined
        });
    }

    applyCoupon() {
        this.setState({ isBusy: true });
        HttpClient.get('/coupon?coupon_code=' + this.state.couponCode)
            .then(response => {
                this.setState({ coupon: response.data.coupon, paymentDetails: { ...this.state.paymentDetails, coupon_id: response.data.coupon.id }, isBusy: false });
                Toast.fire({
                    icon: 'success',
                    title: "Coupon applied.",
                });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });
    }

    cancelSubscription() {

        swal.fire({
            title: "Cancel Purchase?",
            text: "Do you really want to cancel this subscription purchase?",
            icon: "warning",
            buttons: ['No', 'Yes'],
            dangerMode: true,
        }).then(value => {
            if (value) {
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
        const extra_alerts = this.state.alerts;
        const validation = this.state.validation;
        let totalPrice = 0.00, discountPrice = 0.00, userRegistrationOfferDiscountAmount = 0.00, annualDiscountAmount = 0.00, taxAmount = 0.00, actualPrice = 0.00;

        if (this.state.pricePlan) {
            actualPrice = this.state.pricePlan.price;
            totalPrice += this.state.pricePlan.price;
        }
        totalPrice = actualPrice = parseFloat(actualPrice * this.state.planDuration);

        if (this.props.user.user_registration_offers && this.props.user.user_registration_offers.length) {
            this.props.user.user_registration_offers.forEach(userRegistrationOffer => {
                if (userRegistrationOffer.discount_percent != 0) {
                    userRegistrationOfferDiscountAmount += parseFloat(((userRegistrationOffer.discount_percent / 100) * (this.state.pricePlan.price * this.state.planDuration)));
                }
            });
            totalPrice -= parseFloat(userRegistrationOfferDiscountAmount);
            userRegistrationOfferDiscountAmount = parseFloat(userRegistrationOfferDiscountAmount);
        } else {
            if (this.state.planDuration == 12) {
                annualDiscountAmount = (parseFloat((this.state.pricePlan.price * 12) * (this.state.pricePlan.yearly_discount_percent / 100)));
                totalPrice -= annualDiscountAmount;
            }
        }

        if (this.state.coupon) {
            discountPrice = parseFloat(((this.state.coupon.discount_percent / 100) * (this.state.pricePlan.price * this.state.planDuration)));
            totalPrice -= discountPrice;
        }
        if (this.state.taxPercent) {
            taxAmount = parseFloat(((this.state.taxPercent / 100) * totalPrice));
            totalPrice += taxAmount;
        }


        actualPrice = parseFloat(actualPrice).toFixed(2);
        annualDiscountAmount = parseFloat(annualDiscountAmount).toFixed(2);
        discountPrice = parseFloat(discountPrice).toFixed(2);
        userRegistrationOfferDiscountAmount = parseFloat(userRegistrationOfferDiscountAmount).toFixed(2);
        taxAmount = parseFloat(taxAmount).toFixed(2);
        totalPrice = parseFloat(totalPrice).toFixed(2);

        window.pricePlanTotalPurchasePrice = totalPrice;
        return (
            <>
                <div id="checkoutPage" className="checkoutPage pageWrapper">
                    
                    {/* {extra_alerts.map((extra_alert) => (
                       <DowngradedPopup show={true} text={extra_alert} />
                    ))} */}
                    <Container>
                        <LoaderAnimation show={this.state.isLoading} />
                        <div className="pageHeader checkoutPageHead">
                            <h2 className="pageTitle">Checkout</h2>
                        </div>
                        <form className='paymentDetailsForm' onSubmit={this.preSubmitBlueSnap} id="paymentDetailsForm">
                            <ErrorAlert errors={this.state.errors} />
                            <Row>
                                <Col md={6} className='pr-4'>
                                    <div className='cardBox cardInfo'>
                                        <h3>Billing information</h3>
                                        <div className='grid2layout'>
                                            <div className='themeNewInputStyle'>
                                            <input type="text" className="form-control" placeholder="Company Name" name="company_name" id="company_name" onChange={this.changeHandler} value={this.state.paymentDetails.company_name} />
                                            </div>
                                            <div className='themeNewInputStyle'>
                                                <input type="text" className="form-control" placeholder="Company Number" name="company_registration_number" id="company_registration_number" onChange={this.changeHandler} value={this.state.paymentDetails.company_registration_number} />
                                            </div>
                                        </div>
                                        <div className='themeNewInputStyle pb-3'>
                                            <input type="text" className="form-control " placeholder="Billing address" name="billing_address" id="billingAddress" onChange={this.changeHandler} value={this.state.paymentDetails.billing_address} />
                                        </div>
                                        <div className='grid3layout'>
                                            <div className='themeNewInputStyle'>
                                                <CountryCodeSelect className="form-control" name="country" onChange={this.changeHandler} value={this.state.paymentDetails.country} showBlankOption ></CountryCodeSelect>
                                            </div>
                                            <div className='themeNewInputStyle'>
                                                <input type="text" className="form-control" placeholder="City" name="city" id="city" onChange={this.changeHandler} value={this.state.paymentDetails.city} />
                                            </div>
                                            <div className='themeNewInputStyle'>
                                                <input type="text" className="form-control" placeholder="Zip code" name="zip_code" id="zipCard" onChange={this.changeHandler} value={this.state.paymentDetails.zip_code} />
                                            </div>
                                        </div>
                                        <div className='grid2layout'>
                                            <div className='themeNewInputStyle'>
                                                {/* <input type="text" className="form-control" placeholder="Phone Number" name="phone_number" id="phone_number" onChange={this.changeHandler} value={this.state.paymentDetails.phone_number} /> */}
                                                <PhoneInput className='themeNewInputStyle changePhoneNumber' name="phone_number" id="phone_number"  country={'us'} value={this.state.paymentDetails.phone_number} onChange={(phone) => {this.setState({ isDirty: true, paymentDetails: { ...this.state.paymentDetails, phone_number: phone } });}} inputProps={{ name: 'phone', required: true, autoFocus: true }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cardBox addedcardlist'>
                                        <h3>Card details</h3>
                                        {/* <ul className=''>
                                            <li className='active'>
                                                <span>
                                                    <img src='/images/icon-card.svg' alt='card' />
                                                    <strong>Card ending with 4129</strong>
                                                </span>
                                                <i><img src='/images/icon-selected.svg' alt='selected icon' /></i>
                                            </li>
                                            <li>
                                                <span>
                                                    <img src='/images/icon-card.svg' alt='card' />
                                                    <strong>Card ending with 4129</strong>
                                                </span>
                                                <i><img src='/images/icon-selected.svg' alt='selected icon' /></i>
                                            </li>
                                            <li>
                                                <span>
                                                    <img src='/images/icon-card.svg' alt='card' />
                                                    <strong>Card ending with 4129</strong>
                                                </span>
                                                <i><img src='/images/icon-selected.svg' alt='selected icon' /></i>
                                            </li>
                                            <li>
                                                <span>
                                                    <img src='/images/icon-card.svg' alt='card' />
                                                    <strong>Card ending with 4129</strong>
                                                </span>
                                                <i><img src='/images/icon-selected.svg' alt='selected icon' /></i>
                                            </li>
                                        </ul>                                        <div className=''>
                                            <a className='btn-addAnother' href='#'>
                                                <i><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.14286 12V6.85714H0V5.14286H5.14286V0H6.85714V5.14286H12V6.85714H6.85714V12H5.14286Z" fill="#1976FE"/></svg></i>
                                                Add another
                                            </a>
                                        </div> */}

                                        <div className='grid2layout'>
                                            <div className='themeNewInputStyle'>
                                                <input type="text" className="form-control" placeholder="First Name" name="first_name" id="first_name" onChange={this.changeHandler} value={this.state.paymentDetails.first_name} />
                                            </div>
                                            <div className='themeNewInputStyle'>
                                                <input type="text" className="form-control" placeholder="Last Name" name="last_name" id="last_name" onChange={this.changeHandler} value={this.state.paymentDetails.last_name} />
                                            </div>
                                        </div>
                                        <div className='themeNewInputStyle pb-3'>
                                            <div data-bluesnap="ccn" className="pb-c-inputs form-control"></div>
                                        </div>
                                        <div className='grid2layout'>
                                            <div className='themeNewInputStyle'>
                                                <div data-bluesnap="exp" className="pb-c-inputs form-control"></div>
                                            </div>
                                            <div className='themeNewInputStyle position-relative inputWithIcon'>
                                                <i className='icon fa'><img src="/icon-eye-close.svg" /></i>
                                                <div data-bluesnap="cvv" className="pb-c-inputs form-control"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6} className='pl-4'>
                                    <div className='paymenDetailBox'>
                                        <h3>Details</h3>
                                        <ul className='listOne'>
                                            <li>
                                                <span>Plan</span>
                                                <strong className='planName'>{this.state.pricePlan.name}</strong>
                                            </li>
                                            <li>
                                                <span>Price</span>
                                                <span>${actualPrice}</span>
                                            </li>
                                            {annualDiscountAmount && annualDiscountAmount != "0.00" ?
                                                <li>
                                                    <span>Annual Discount ({Math.round(this.state.pricePlan.yearly_discount_percent * 1)}%)</span>
                                                    <span>${annualDiscountAmount}</span>
                                                </li>
                                            :
                                                null
                                            }
                                        </ul>
                                        <ul className='listTwo'>
                                            {this.state.coupon ?
                                                <li>
                                                    <span>Discount Price</span>
                                                    <span>${discountPrice}</span>
                                                </li>
                                            :
                                                null
                                            }
                                            {userRegistrationOfferDiscountAmount && userRegistrationOfferDiscountAmount != "0.00" ?
                                                <li>
                                                    <span>Limited Time Offer</span>
                                                    <span>${userRegistrationOfferDiscountAmount}</span>
                                                </li>
                                            :
                                                null
                                            }
                                            <li>
                                                <span>Tax ({this.state.taxPercent}%)</span>
                                                <span>${taxAmount}</span>
                                            </li>
                                            <li>
                                                <strong>Total</strong>
                                                <strong>${totalPrice}</strong>
                                            </li>
                                            <li>
                                                <span>Subscription starts at</span>
                                                <span>{moment().format("YYYY-MM-DD")}</span>
                                            </li>
                                            <li>
                                                <span>Next billing date</span>
                                                <span>{moment().add(this.state.planDuration, 'M').format("YYYY-MM-DD")}</span>
                                            </li>
                                        </ul>
                                        <div className="couponBox">
                                            <span className="input-group-text">Coupon</span>
                                            <input name="couponCode" type="text" className="form-control" value={this.state.couponCode} onChange={e => { this.setState({ [e.target.name]: e.target.value }); }} />
                                            <button className="btn-apply" type="button" onClick={this.applyCoupon}>Apply</button>
                                        </div>

                                        <button type="submit" data-bluesnap="submitButton" className={`btn-payNow ${this.state.isBusy ? "disabled" : ''}`}>{this.state.isBusy ? 'Please Wait !! ' : 'Pay now'}</button>
                                        <div className='d-flex justify-content-center'>
                                            {/* <img className='d-block' src='/images/blueSnap.svg'/> */}
                                            <a target="_blank" href="https://home.bluesnap.com/"><img className='d-block' style={{width: 200}} src="/images/blueSnap.png" /></a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </Container>
                </div>
            </>
        )
    }

    preSubmitBlueSnap(e) {
        e.preventDefault();

        if (this.state.isBusy) {
            return;
        }
        this.setState({ isBusy: true ,isLoading: true})

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
                this.setState({ isBusy: false , isLoading: false})
                var errorArray = callback.error;
                let formattedErrors = {};
                errorArray.forEach(e => { formattedErrors[e.tagId ?? e.eventType] = [e.errorDescription] })

                this.setState({
                    errors: {
                        message: 'Error occured while setting up payment process.',
                        errors: formattedErrors
                    }
                })

                // console.log(errorArray);
                // for (i in errorArray) {
                //     console.log("Received error: tagId= " +
                //         errorArray[i].tagId + ", errorCode= " +
                //         errorArray[i].errorCode + ", errorDescription= " +
                //         errorArray[i].errorDescription);
                // }
            }
        }, {
            amount: parseFloat(window.pricePlanTotalPurchasePrice),
            currency: 'USD'
        });
    }
    attachFieldsToBlueSnap() {
        bluesnap.hostedPaymentFieldsCreate(bsObj)
    }
}

// import React, { Component } from 'react'
// import HttpClient from "../../../utils/HttpClient";
// import Toast from "../../../utils/Toast";
// import { Redirect } from 'react-router';
// import ErrorAlert from '../../../utils/ErrorAlert';
// import CCDetector from '../../../utils/CreditCardDetector';
// import CountryCodeSelect from "../../../utils/CountryCodeSelect";
// import { Link } from 'react-router-dom';

// export default class CreatePayment extends Component {

//     taxableCountries = ['IL'];
//     constructor(props) {
//         super(props)

//         this.state = {
//             pricePlan: undefined,
//             paymentDetails: {
//                 company_name: ' ',
//                 company_registration_number: ' ',
//                 phone_number_prefix: ' ',
//                 phone_number: ' ',

//                 city: ' ',
//                 country: 'Country',
//                 billing_address: ' ',
//                 zip_code: ' ',

//                 first_name: ' ',
//                 last_name: ' ',

//                 cardNumber: ' ',
//                 expirationMonth: ' ',
//                 expirationYear: ' ',
//                 securityCode: ' ',
//             },
//             isBusy: false,
//             isDirty: false,
//             redirectTo: null,
//             validation: {},
//             errors: '',
//             couponCode: '',
//             taxPercent: 0,
//             cardType: 'Card',

//             planDuration: 12
//         }
//         this.changeHandler = this.changeHandler.bind(this)
//         this.submitHandler = this.submitHandler.bind(this)
//         this.setDefaultState = this.setDefaultState.bind(this)
//         this.cancelSubscription = this.cancelSubscription.bind(this)
//         this.applyCoupon = this.applyCoupon.bind(this)
//         this.preSubmitBlueSnap = this.preSubmitBlueSnap.bind(this)

//     }

//     componentDidMount() {
//         document.title = "Payment"
//         this.setState({ isBusy: true });
//         var urlSearchParams = new URLSearchParams(window.location.search);

//         // Set Plan Duration
//         this.setState({ planDuration: urlSearchParams.get('plan_duration') });

//         // Get price plan
//         HttpClient.get('/price-plan/' + urlSearchParams.get('price_plan_id'))
//             .then(response => {
//                 this.setState({ pricePlan: response.data.price_plan, isBusy: false });
//             }, (err) => {
//                 this.setState({ isBusy: false, errors: (err.response).data });
//             }).catch(err => {
//                 this.setState({ isBusy: false, errors: err });
//             });


//         HttpClient.get("https://ipinfo.io/?token=cc0c476b4a3fc7").then(response => {
//             let tP = 0;
//             if (this.taxableCountries.indexOf(response.data.country) != -1) {
//                 tP = 17;
//             }
//             this.setState({ taxPercent: tP, paymentDetails: { ...this.state.paymentDetails, city: response.data.city, country: response.data.country } });
//         });

//         setTimeout(this.attachFieldsToBlueSnap, 5000)
//     }


//     changeHandler(e) {
//         if (e.target.name == "cardNumber") {
//             let cardType = CCDetector.getInfo(e.target.value, false, 'Card').type;
//             if (this.state.cardType !== cardType) this.setState({ cardType: cardType });
//             let cn = e.target.value;
//             let x = cn.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4")
//             e.target.value = x;
//         };

//         if (e.target.name == 'country') {
//             if (this.taxableCountries.indexOf(e.target.value) != -1) {
//                 this.setState({ taxPercent: 17 })
//             } else {
//                 this.setState({ taxPercent: 0 })
//             }
//         }
//         this.setState({ isDirty: true, paymentDetails: { ...this.state.paymentDetails, [e.target.name]: e.target.value } });

//     }


//     submitHandler(e) {
//         // e.preventDefault();


//         this.setState({ isBusy: true });
//         var urlSearchParams = new URLSearchParams(window.location.search);
//         let _token = urlSearchParams.get('_token')
//         HttpClient.post(`/settings/price-plan/payment`, {
//             '_token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
//             pfToken: _token,
//             'price_plan_id': this.state.pricePlan.id,
//             expirationMonth: this.state.cardData.exp.split('/')[0],
//             expirationYear: this.state.cardData.exp.split('/')[1],
//             ccLast4Digits: this.state.cardData.last4Digits,

//             company_name: this.state.paymentDetails.company_name,
//             company_registration_number: this.state.paymentDetails.company_registration_number,
//             phone_number_prefix: this.state.paymentDetails.phone_number_prefix,
//             phone_number: this.state.paymentDetails.phone_number,

//             first_name: this.state.paymentDetails.first_name,
//             last_name: this.state.paymentDetails.last_name,
//             billing_address: this.state.paymentDetails.billing_address,
//             city: this.state.paymentDetails.city,
//             country: this.state.paymentDetails.country,
//             zip_code: this.state.paymentDetails.zip_code,
//             coupon_id: this.state.coupon ? this.state.coupon.id : null,
//             plan_duration: this.state.planDuration,
//         })
//             .then(response => {
//                 this.setState({ isBusy: false, errors: undefined });

//                 // gtag('event', 'conversion', {
//                 //     'send_to': 'AW-645973826/pJ_PCIrI0egBEMKOg7QC',
//                 //     'value': 1.0,
//                 //     'currency': 'USD',
//                 //     'transaction_id': ''
//                 // });
//                 // ga('send', {
//                 //     hitType: 'event',
//                 //     eventCategory: 'Purchase',
//                 //     eventAction: 'Purchase',
//                 //     eventLabel: this.state.pricePlan.name,
//                 //     eventValue: this.state.pricePlan.price
//                 // });

//                 swal.fire(`${this.state.pricePlan.name} Plan purchased!`, "You can now enjoy extended functionalities.", "success").then(value => {
//                     window.location = "/annotation"
//                 });
//             }, (err) => {

//                 this.setState({ isBusy: false, errors: (err.response).data });
//             }).catch(err => {

//                 this.setState({ isBusy: false, errors: err });
//             });
//     }



//     validate() {
//         let cardNumber = this.state.paymentDetails.cardNumber;
//         let expirationMonth = this.state.paymentDetails.expirationMonth;
//         let expirationYear = this.state.paymentDetails.expirationYear;
//         let securityCode = this.state.paymentDetails.securityCode;



//         let errors = {};
//         let isValid = true;

//         if (!cardNumber) {
//             isValid = false;
//             errors["cardNumber"] = "Please enter your card number.";

//         }
//         if (cardNumber.length < 12) {
//             isValid = false;
//             errors["cardNumber"] = "card number can't be less then 16 digits.";
//         }


//         if (!expirationMonth) {
//             isValid = false;
//             errors["expirationMonth"] = "Please select your card's expiring month.";
//         }

//         if (!expirationYear) {
//             isValid = false;
//             errors["expirationYear"] = "Please select your card's expiring year.";
//         }
//         if (!securityCode || securityCode.length < 3) {
//             // isValid = false;
//             // errors["securityCode"] = "Please enter your card securityCode.";
//         }

//         this.setState({
//             validation: errors
//         });

//         return isValid;
//     }



//     setDefaultState() {
//         this.setState({
//             paymentDetails: {
//                 cardNumber: '',
//                 expirationMonth: '',
//                 expirationYear: '',
//                 securityCode: '',
//             },
//             validation: {},
//             isBusy: false,
//             isDirty: false,
//             errors: undefined
//         });
//     }

//     applyCoupon() {
//         this.setState({ isBusy: true });
//         HttpClient.get('/coupon?coupon_code=' + this.state.couponCode)
//             .then(response => {
//                 this.setState({ coupon: response.data.coupon, paymentDetails: { ...this.state.paymentDetails, coupon_id: response.data.coupon.id }, isBusy: false });
//                 Toast.fire({
//                     icon: 'success',
//                     title: "Coupon applied.",
//                 });
//             }, (err) => {

//                 this.setState({ isBusy: false, errors: (err.response).data });
//             }).catch(err => {

//                 this.setState({ isBusy: false, errors: err });
//             });
//     }

//     cancelSubscription() {

//         swal.fire({
//             title: "Cancel Purchase?",
//             text: "Do you really want to cancel this subscription purchase?",
//             icon: "warning",
//             buttons: ['No', 'Yes'],
//             dangerMode: true,
//         }).then(value => {
//             if (value) {
//                 ga('send', {
//                     hitType: 'event',
//                     eventCategory: 'Cancellation',
//                     eventAction: 'Cancellation',
//                     eventLabel: this.state.pricePlan.name,
//                     eventValue: this.state.pricePlan.price
//                 });
//                 this.setState({ redirectTo: '/annotation' });
//             }
//         })
//     }

//     render() {
//         if (!this.state.pricePlan) return <h5>Loading...</h5>;
//         if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />

//         const validation = this.state.validation;
//         let totalPrice = 0.00, discountPrice = 0.00, userRegistrationOfferDiscountAmount = 0.00, annualDiscountAmount = 0.00, taxAmount = 0.00, actualPrice = 0.00;

//         if (this.state.pricePlan) {
//             actualPrice = this.state.pricePlan.price;
//             totalPrice += this.state.pricePlan.price;
//         }
//         totalPrice = actualPrice = parseFloat(actualPrice * this.state.planDuration);

//         if (this.props.user.user_registration_offers && this.props.user.user_registration_offers.length) {
//             this.props.user.user_registration_offers.forEach(userRegistrationOffer => {
//                 if (userRegistrationOffer.discount_percent != 0) {
//                     userRegistrationOfferDiscountAmount += parseFloat(((userRegistrationOffer.discount_percent / 100) * (this.state.pricePlan.price * this.state.planDuration)));
//                 }
//             });
//             totalPrice -= parseFloat(userRegistrationOfferDiscountAmount);
//             userRegistrationOfferDiscountAmount = parseFloat(userRegistrationOfferDiscountAmount);
//         } else {
//             if (this.state.planDuration == 12) {
//                 annualDiscountAmount = (parseFloat((this.state.pricePlan.price * 12) * (this.state.pricePlan.yearly_discount_percent / 100)));
//                 totalPrice -= annualDiscountAmount;
//             }
//         }

//         if (this.state.coupon) {
//             discountPrice = parseFloat(((this.state.coupon.discount_percent / 100) * (this.state.pricePlan.price * this.state.planDuration)));
//             totalPrice -= discountPrice;
//         }
//         if (this.state.taxPercent) {
//             taxAmount = parseFloat(((this.state.taxPercent / 100) * totalPrice));
//             totalPrice += taxAmount;
//         }


//         actualPrice = parseFloat(actualPrice).toFixed(2);
//         annualDiscountAmount = parseFloat(annualDiscountAmount).toFixed(2);
//         discountPrice = parseFloat(discountPrice).toFixed(2);
//         userRegistrationOfferDiscountAmount = parseFloat(userRegistrationOfferDiscountAmount).toFixed(2);
//         taxAmount = parseFloat(taxAmount).toFixed(2);
//         totalPrice = parseFloat(totalPrice).toFixed(2);

//         window.pricePlanTotalPurchasePrice = totalPrice;
//         return (
//             <div className="container-xl bg-white component-wrapper" >
//                 <ErrorAlert errors={this.state.errors} />
//                 <div className="masonry-item">
//                     <div className="bgc-white bd">
//                         <div className="mT-30">
//                             <form onSubmit={this.preSubmitBlueSnap} id="paymentDetailsForm">
//                                 <div className="row ml-0 mr-0 seperator">

//                                     {/*firs  column start*/}

//                                     <div className="col-12 col-sm-12 col-md-6 col-lg-6">
//                                         <h4 className="gaa-text-primary">Billing Information</h4>

//                                         <div className="row ml-0 mr-0">
//                                             <div className="col-6  pl-0">
//                                                 <div className="form-group floating-labels">
//                                                     <input type="text" className="form-control" placeholder="Company Name" name="company_name"
//                                                         id="company_name" onChange={this.changeHandler} value={this.state.paymentDetails.company_name} />
//                                                     <label htmlFor="">Company Name</label>
//                                                 </div>
//                                             </div>
//                                             <div className="col-6">
//                                                 <div className="form-group floating-labels">
//                                                     <input type="text" className="form-control" placeholder="Company Number" name="company_registration_number"
//                                                         id="company_registration_number" onChange={this.changeHandler} value={this.state.paymentDetails.company_registration_number} />
//                                                     <label htmlFor="">Company Number</label>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="row ml-0 mr-0">
//                                             <div className="col-12  pl-0">
//                                                 <div className="form-group floating-labels">
//                                                     <input type="text" className="form-control " placeholder="Billing address" name="billing_address"
//                                                         id="billingAddress" onChange={this.changeHandler} value={this.state.paymentDetails.billing_address} />
//                                                     <label htmlFor="">Address</label>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="row ml-0 mr-0">
//                                             <div className="col-4  pl-0">
//                                                 <div className="form-group ">
//                                                     <label htmlFor="">Country</label>
//                                                     <CountryCodeSelect className="form-control" name="country" onChange={this.changeHandler} value={this.state.paymentDetails.country} showBlankOption ></CountryCodeSelect>
//                                                 </div>
//                                             </div>
//                                             <div className="col-4">
//                                                 <div className="form-group floating-labels">
//                                                     <input type="text" className="form-control" placeholder="City" name="city"
//                                                         id="city" onChange={this.changeHandler} value={this.state.paymentDetails.city} />
//                                                     <label htmlFor="">City</label>
//                                                 </div>
//                                             </div>
//                                             <div className="col-4 pr-0">
//                                                 <div className="form-group floating-labels">
//                                                     <input type="text" className="form-control" placeholder="Zip" name="zip_code"
//                                                         id="zipCard" onChange={this.changeHandler} value={this.state.paymentDetails.zip_code} />
//                                                     <label htmlFor="">Zip Code</label>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="row ml-0 mr-0">
//                                             <div className="col-2 pl-0 pr-0">
//                                                 <div className="form-group floating-labels">
//                                                     <input type="text" className="form-control" placeholder="Prefix" name="phone_number_prefix"
//                                                         id="phone_number_prefix" onChange={this.changeHandler} value={this.state.paymentDetails.phone_number_prefix} maxlength="4" />
//                                                     <label htmlFor="">Prefix</label>
//                                                 </div>
//                                             </div>
//                                             <div className="col-5 pl-0">
//                                                 <div className="form-group floating-labels ml-2">
//                                                     <input type="text" className="form-control" placeholder="Phone Number" name="phone_number"
//                                                         id="phone_number" onChange={this.changeHandler} value={this.state.paymentDetails.phone_number} />
//                                                     <label htmlFor="">Phone Number</label>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* second column start*/}
//                                         <div className="mt-2">
//                                             <h4 className="gaa-text-primary">Credit Card</h4>

//                                             <div className="row ml-0 mr-0">
//                                                 <div className="col-6 p-3 pp-cc-pl-r">
//                                                     <div className="form-group floating-labels">
//                                                         <input type="text" className="form-control" placeholder="First Name" name="first_name" id="first_name" onChange={this.changeHandler} value={this.state.paymentDetails.first_name} />
//                                                         <label htmlFor="first_name">First Name</label>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-6 p-3 pp-cc-pr-r">
//                                                     <div className="form-group floating-labels">
//                                                         <input type="text" className="form-control" placeholder="Last Name" name="last_name" id="last_name" onChange={this.changeHandler} value={this.state.paymentDetails.last_name} />
//                                                         <label htmlFor="last_name">Last Name</label>
//                                                     </div>
//                                                 </div>


//                                             </div>

//                                             <div className="row h-30px" >
//                                                 <div className="col-6">
//                                                     <label>Credit Card Number</label>
//                                                     <div data-bluesnap="ccn" className="pb-c-inputs form-control"></div>
//                                                 </div>
//                                                 <div className="col-3">
//                                                     <label>Expiry</label>
//                                                     <div data-bluesnap="exp" className="pb-c-inputs form-control"></div>
//                                                 </div>
//                                                 <div className="col-3">
//                                                     <label>CVV</label>
//                                                     <div data-bluesnap="cvv" className="pb-c-inputs form-control"></div>
//                                                 </div>

//                                             </div>
//                                         </div>

//                                         <div className="row ml-0 mr-0 mt-4">
//                                             <div className="col-4 pl-0">
//                                             </div>
//                                             <div className="col-4 pr-0">
//                                             </div>
//                                         </div>
//                                     </div>
//                                     {/* second column starts main layout col*/}
//                                     <div className="col-12 col-sm-12 col-md-6 col-lg-6">
//                                         <div className="">
//                                             <div className="bgc-white  ">
//                                                 <h4 className="gaa-text-primary">Details</h4>
//                                                 <div className="mT-30">
//                                                     <div className="row">
//                                                         <div className="col-6"><b>Plan</b></div>
//                                                         <div className="col-6 text-right"><b>{this.state.pricePlan.name}</b></div>
//                                                     </div>

//                                                     <br />
//                                                     <div className="row">
//                                                         <div className="col-6">Price</div>
//                                                         <div className="col-6 text-right">${actualPrice}</div>
//                                                     </div>

//                                                     {annualDiscountAmount && annualDiscountAmount != "0.00" ?
//                                                         <React.Fragment>
//                                                             <div className="row">
//                                                                 <div className="col-6">Annual Discount ({this.state.pricePlan.yearly_discount_percent}%)</div>
//                                                                 <div className="col-6 text-right">${annualDiscountAmount}</div>
//                                                             </div>
//                                                             <hr />
//                                                         </React.Fragment>
//                                                         : null}
//                                                     {
//                                                         this.state.coupon ?
//                                                             <React.Fragment>
//                                                                 <div className="row">
//                                                                     <div className="col-6">Discount Price</div>
//                                                                     <div className="col-6 text-right">${discountPrice}</div>
//                                                                 </div>
//                                                                 <hr />
//                                                             </React.Fragment>
//                                                             : null
//                                                     }
//                                                     {
//                                                         userRegistrationOfferDiscountAmount && userRegistrationOfferDiscountAmount != "0.00" ?
//                                                             <React.Fragment>
//                                                                 <div className="row">
//                                                                     <div className="col-6">Limited Time Offer</div>
//                                                                     <div className="col-6 text-right">${userRegistrationOfferDiscountAmount}</div>
//                                                                 </div>
//                                                                 <hr />
//                                                             </React.Fragment>
//                                                             : null
//                                                     }
//                                                     <div className="row">
//                                                         <div className="col-6">Tax ({this.state.taxPercent}%)</div>
//                                                         <div className="col-6 text-right">${taxAmount}</div>
//                                                     </div>

//                                                     <hr />
//                                                     <div className="row">
//                                                         <div className="col-6"> <b>Total</b></div>
//                                                         <div className="col-6 text-right"><b>${totalPrice}</b></div>
//                                                     </div>
//                                                     <br />
//                                                     <div className="row">
//                                                         <div className="col-6">Subscription start at</div>
//                                                         <div className="col-6 text-right">{moment().format("YYYY-MM-DD")}</div>
//                                                     </div>
//                                                     <div className="row">
//                                                         <div className="col-6">Next billing at</div>
//                                                         <div className="col-6 text-right">{moment().add(this.state.planDuration, 'M').format("YYYY-MM-DD")}</div>
//                                                     </div>
//                                                     {/* <div className="form-check mt-3">
//                                                         <input type="checkbox" className="form-check-input" name="remember_card"
//                                                             id="rememberCard" />
//                                                         <label className="form-check-label" htmlFor="exampleCheck1">
//                                                             Remember Card </label>
//                                                     </div>*/}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="row ml-0 mr-0 mt-4">
//                                             <div className="col-12 text-right p-5">
//                                                 <div className="input-group mb-3">
//                                                     <span className="input-group-text">Coupon</span>
//                                                     <input name="couponCode" type="text" className="form-control" value={this.state.couponCode} onChange={e => { this.setState({ [e.target.name]: e.target.value }); }} />
//                                                     <button className="btn btn-outline-secondary" type="button" onClick={this.applyCoupon}>Apply</button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="row ml-0 mr-0 mt-1">
//                                             <div className="col-12 text-right p-5">

//                                                 <button type="submit" data-bluesnap="submitButton" className={"btn gaa-btn-primary btn-md payBtn  " + (this.state.isBusy ? "disabled" : '')}>
//                                                     {
//                                                         this.state.isBusy ?
//                                                             <i className="fa fa-spinner fa-pulse"></i> :
//                                                             "PAY NOW"
//                                                     }

//                                                 </button>
//                                                 {/* <button type="button" className={"btn btn-default btn-md "} onClick={this.cancelSubscription}>Cancel</button> */}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </form>
//                             <div className="row mt-5 ml-0 mr-0 d-flex flex-row justify-content-center align-items-center bg-white">
//                                 <div className="img-col-wrap">
//                                     <div className="col-12 text-right  secure-img">
//                                         <img src="/images/masterCard.jpg" className="img-fluid " alt="mastercard image" />
//                                         <img src="/images/Visa.png" className="img-fluid " alt="visa card image" />
//                                         <img src="/images/safeKey.png" className="img-fluid " alt="safekey image" />
//                                         <img src="/images/PSD2.png" className="img-fluid " alt="psd2 image" />
//                                         <img src="/images/PS.png" className="img-fluid " alt="ps image" />
//                                         <img src="/images/pciDss.png" className="img-fluid " alt="pciDss image" />
//                                     </div>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     preSubmitBlueSnap(e) {
//         e.preventDefault();

//         if (this.state.isBusy) {
//             return;
//         }
//         this.setState({ isBusy: true })

//         bluesnap.hostedPaymentFieldsSubmitData((callback) => {
//             if (null != callback.cardData) {
//                 // console.log('card type: ' + callback.cardData.ccType +
//                 //     ', last 4 digits: ' + callback.cardData.last4Digits +
//                 //     ', exp: ' + callback.cardData.exp +
//                 //     ', issuing Country: ' + callback.cardData.issuingCountry +
//                 //     ', isRegulatedCard: ' + callback.cardData.isRegulatedCard +
//                 //     ', cardSubType: ' + callback.cardData.cardSubType +
//                 //     ', binCategory: ' + callback.cardData.binCategory +
//                 //     ' and ccBin: ' + callback.cardData.ccBin +
//                 //     ', after that I can call final submit');

//                 let cardData = callback.cardData;
//                 this.setState({ cardData });
//                 this.submitHandler(e);

//             } else {
//                 this.setState({ isBusy: false })
//                 var errorArray = callback.error;
//                 let formattedErrors = {};
//                 errorArray.forEach(e => { formattedErrors[e.tagId ?? e.eventType] = [e.errorDescription] })

//                 this.setState({
//                     errors: {
//                         message: 'Error occured while setting up payment process.',
//                         errors: formattedErrors
//                     }
//                 })

//                 // console.log(errorArray);
//                 // for (i in errorArray) {
//                 //     console.log("Received error: tagId= " +
//                 //         errorArray[i].tagId + ", errorCode= " +
//                 //         errorArray[i].errorCode + ", errorDescription= " +
//                 //         errorArray[i].errorDescription);
//                 // }
//             }
//         }, {
//             amount: parseFloat(window.pricePlanTotalPurchasePrice),
//             currency: 'USD'
//         });
//     }
//     attachFieldsToBlueSnap() {
//         bluesnap.hostedPaymentFieldsCreate(bsObj)
//     }
// }
