import React, { Component } from 'react'
import HttpClient from "../../../utils/HttpClient";
import { toast } from "react-toastify";
import { Redirect } from 'react-router';
import ErrorAlert from '../../../utils/ErrorAlert';
import Cleave from '../../../../../../../public/js/cleave/Cleave';

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


        }
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.cardDetector = this.cardDetector.bind(this)
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
        this.setState({ isDirty: true, paymentDetails: { ...this.state.paymentDetails, [e.target.name]: e.target.value } });

    }


    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({ isBusy: true });
            console.log(e);
            HttpClient.post('/settings/price-plan/payment', { ...this.state.paymentDetails, 'price_plan_id': this.state.pricePlan.id })
                .then(response => {
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

    cardDetector() {

        var cleave = new Cleave("#cardNumber", {
            creditCard: true,
            delimiter: '-',
            onCreditCardTypeChanged: function (type) {
                if (type == '') {
                    document.querySelector('.ct').innerText = 'card';
                } else if (type == 'unknown') {
                    document.querySelector('.ct').innerText = 'card';
                } else {
                    document.querySelector('.ct').innerText = type;
                }
            }
        });

    }

    applyCoupon() {
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
                                            <label htmlFor="">Name</label>
                                            <input type="text" className="form-control" placeholder="First Name" name="first_name" id="first_name" onChange={this.changeHandler} value={this.state.paymentDetails.first_name} />
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
                                            <select name="country" className="form-control" onChange={this.changeHandler} value={this.state.paymentDetails.country}>
                                                <option value="Afghanistan">Afghanistan</option>
                                                <option value="Albania">Albania</option>
                                                <option value="Algeria">Algeria</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="Angola">Angola</option>
                                                <option value="Anguilla">Anguilla</option>
                                                <option value="Antigua">Antigua</option>
                                                <option value="Argentina">Argentina</option>
                                                <option value="Armenia">Armenia</option>
                                                <option value="Aruba">Aruba</option>
                                                <option value="Ascension Island">Ascension Island</option>
                                                <option value="Australia">Australia</option>
                                                <option value="Australian External Territories">Australian External Territories</option>
                                                <option value="Austria">Austria</option>
                                                <option value="Azerbaijan">Azerbaijan</option>
                                                <option value="Bahamas">Bahamas</option>
                                                <option value="Bahrain">Bahrain</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                                <option value="Barbados">Barbados</option>
                                                <option value="Belarus">Belarus</option>
                                                <option value="Belgium">Belgium</option>
                                                <option value="Belize">Belize</option>
                                                <option value="Benin">Benin</option>
                                                <option value="Bermuda">Bermuda</option>
                                                <option value="Bhutan">Bhutan</option>
                                                <option value="Bolivia">Bolivia</option>
                                                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                                <option value="Botswana">Botswana</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="British Virgin Islands">British Virgin Islands</option>
                                                <option value="Brunei">Brunei</option>
                                                <option value="Bulgaria">Bulgaria</option>
                                                <option value="Burkina Faso">Burkina Faso</option>
                                                <option value="Burundi">Burundi</option>
                                                <option value="Cambodia">Cambodia</option>
                                                <option value="Cameroon">Cameroon</option>
                                                <option value="Cape Verde">Cape Verde</option>
                                                <option value="Cayman Islands">Cayman Islands</option>
                                                <option value="Central African Republic">Central African Republic</option>
                                                <option value="Chad">Chad</option>
                                                <option value="Chile">Chile</option>
                                                <option value="China">China</option>
                                                <option value="Colombia">Colombia</option>
                                                <option value="Comoros">Comoros</option>
                                                <option value="Congo">Congo</option>
                                                <option value="Cook Islands">Cook Islands</option>
                                                <option value="Costa Rica">Costa Rica</option>
                                                <option value="Croatia">Croatia</option>
                                                <option value="Cuba">Cuba</option>
                                                <option value="Cyprus">Cyprus</option>
                                                <option value="Czech Republic">Czech Republic</option>
                                                <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                                                <option value="Denmark">Denmark</option>
                                                <option value="Diego Garcia">Diego Garcia</option>
                                                <option value="Djibouti">Djibouti</option>
                                                <option value="Dominica">Dominica</option>
                                                <option value="Dominican Republic">Dominican Republic</option>
                                                <option value="East Timor">East Timor</option>
                                                <option value="Ecuador">Ecuador</option>
                                                <option value="Egypt">Egypt</option>
                                                <option value="El Salvador">El Salvador</option>
                                                <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                <option value="Eritrea">Eritrea</option>
                                                <option value="Estonia">Estonia</option>
                                                <option value="Ethiopia">Ethiopia</option>
                                                <option value="Falkland Islands">Falkland Islands</option>
                                                <option value="Faroe Islands">Faroe Islands</option>
                                                <option value="Fiji">Fiji</option>
                                                <option value="Finland">Finland</option>
                                                <option value="France">France</option>
                                                <option value="French Antilles">French Antilles</option>
                                                <option value="French Guiana">French Guiana</option>
                                                <option value="French Polynesia">French Polynesia</option>
                                                <option value="Gabon">Gabon</option>
                                                <option value="Gambia">Gambia</option>
                                                <option value="Georgia">Georgia</option>
                                                <option value="Germany">Germany</option>
                                                <option value="Ghana">Ghana</option>
                                                <option value="Gibraltar">Gibraltar</option>
                                                <option value="Greece">Greece</option>
                                                <option value="Greenland">Greenland</option>
                                                <option value="Grenada">Grenada</option>
                                                <option value="Guadeloupe">Guadeloupe</option>
                                                <option value="Guatemala">Guatemala</option>
                                                <option value="Guinea">Guinea</option>
                                                <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                <option value="Guyana">Guyana</option>
                                                <option value="Haiti">Haiti</option>
                                                <option value="Honduras">Honduras</option>
                                                <option value="Hong Kong">Hong Kong</option>
                                                <option value="Hungary">Hungary</option>
                                                <option value="Iceland">Iceland</option>
                                                <option value="India">India</option>
                                                <option value="Indonesia">Indonesia</option>
                                                <option value="Iran">Iran</option>
                                                <option value="Iraq">Iraq</option>
                                                <option value="Ireland">Ireland</option>
                                                <option value="Israel">Israel</option>
                                                <option value="Italy">Italy</option>
                                                <option value="Ivory Coast">Ivory Coast</option>
                                                <option value="Jamaica">Jamaica</option>
                                                <option value="Japan">Japan</option>
                                                <option value="Jordan">Jordan</option>
                                                <option value="Kazakhstan">Kazakhstan</option>
                                                <option value="Kenya">Kenya</option>
                                                <option value="Kiribati">Kiribati</option>
                                                <option value="Kosovo">Kosovo</option>
                                                <option value="Kuwait">Kuwait</option>
                                                <option value="Kyrgyzstan">Kyrgyzstan</option>
                                                <option value="Laos">Laos</option>
                                                <option value="Latvia">Latvia</option>
                                                <option value="Lebanon">Lebanon</option>
                                                <option value="Lesotho">Lesotho</option>
                                                <option value="Liberia">Liberia</option>
                                                <option value="Libya">Libya</option>
                                                <option value="Liechtenstein">Liechtenstein</option>
                                                <option value="Lithuania">Lithuania</option>
                                                <option value="Luxembourg">Luxembourg</option>
                                                <option value="Macau">Macau</option>
                                                <option value="Macedonia">Macedonia</option>
                                                <option value="Madagascar">Madagascar</option>
                                                <option value="Malawi">Malawi</option>
                                                <option value="Malaysia">Malaysia</option>
                                                <option value="Maldives">Maldives</option>
                                                <option value="Mali">Mali</option>
                                                <option value="Malta">Malta</option>
                                                <option value="Marshall Islands">Marshall Islands</option>
                                                <option value="Mauritania">Mauritania</option>
                                                <option value="Mauritius">Mauritius</option>
                                                <option value="Mayotte">Mayotte</option>
                                                <option value="Mexico">Mexico</option>
                                                <option value="Micronesia">Micronesia</option>
                                                <option value="Moldova">Moldova</option>
                                                <option value="Monaco">Monaco</option>
                                                <option value="Mongolia">Mongolia</option>
                                                <option value="Montenegro">Montenegro</option>
                                                <option value="Montserrat">Montserrat</option>
                                                <option value="Morocco">Morocco</option>
                                                <option value="Mozambique">Mozambique</option>
                                                <option value="Myanmar">Myanmar</option>
                                                <option value="Namibia">Namibia</option>
                                                <option value="Nauru">Nauru</option>
                                                <option value="Nepal">Nepal</option>
                                                <option value="Netherlands">Netherlands</option>
                                                <option value="Netherlands Antilles">Netherlands Antilles</option>
                                                <option value="New Caledonia">New Caledonia</option>
                                                <option value="New Zealand">New Zealand</option>
                                                <option value="Nicaragua">Nicaragua</option>
                                                <option value="Niger">Niger</option>
                                                <option value="Nigeria">Nigeria</option>
                                                <option value="Niue">Niue</option>
                                                <option value="North Korea">North Korea</option>
                                                <option value="Norway">Norway</option>
                                                <option value="Oman">Oman</option>
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="Palau">Palau</option>
                                                <option value="Palestinin Authority">Palestinin Authority</option>
                                                <option value="Panama">Panama</option>
                                                <option value="Papua New Guinea">Papua New Guinea</option>
                                                <option value="Paraguay">Paraguay</option>
                                                <option value="Peru">Peru</option>
                                                <option value="Philippines">Philippines</option>
                                                <option value="Poland">Poland</option>
                                                <option value="Portugal">Portugal</option>
                                                <option value="Qatar">Qatar</option>
                                                <option value="Reunion Island">Reunion Island</option>
                                                <option value="Romania">Romania</option>
                                                <option value="Russia">Russia</option>
                                                <option value="Rwanda">Rwanda</option>
                                                <option value="Saint Helena">Saint Helena</option>
                                                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                                <option value="Saint Lucia">Saint Lucia</option>
                                                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                                <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                                                <option value="San Marino">San Marino</option>
                                                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Senegal">Senegal</option>
                                                <option value="Serbia">Serbia</option>
                                                <option value="Seychelles">Seychelles</option>
                                                <option value="Sierra Leone">Sierra Leone</option>
                                                <option value="Singapore">Singapore</option>
                                                <option value="Slovakia">Slovakia</option>
                                                <option value="Slovenia">Slovenia</option>
                                                <option value="Solomon Islands">Solomon Islands</option>
                                                <option value="Somalia">Somalia</option>
                                                <option value="South Africa">South Africa</option>
                                                <option value="South Korea">South Korea</option>
                                                <option value="South Sudan">South Sudan</option>
                                                <option value="Spain">Spain</option>
                                                <option value="Sri Lanka">Sri Lanka</option>
                                                <option value="St. Maarten">St. Maarten</option>
                                                <option value="Sudan">Sudan</option>
                                                <option value="Suriname">Suriname</option>
                                                <option value="Swaziland">Swaziland</option>
                                                <option value="Sweden">Sweden</option>
                                                <option value="Switzerland">Switzerland</option>
                                                <option value="Syria">Syria</option>
                                                <option value="Taiwan">Taiwan</option>
                                                <option value="Tajikistan">Tajikistan</option>
                                                <option value="Tanzania">Tanzania</option>
                                                <option value="Thailand">Thailand</option>
                                                <option value="Togo">Togo</option>
                                                <option value="Tokelau">Tokelau</option>
                                                <option value="Tonga">Tonga</option>
                                                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                                <option value="Tunisia">Tunisia</option>
                                                <option value="Turkey">Turkey</option>
                                                <option value="Turkmenistan">Turkmenistan</option>
                                                <option value="Turks and Caicos">Turks and Caicos</option>
                                                <option value="Tuvalu">Tuvalu</option>
                                                <option value="Uganda">Uganda</option>
                                                <option value="Ukraine">Ukraine</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="United States of America">United States of America</option>
                                                <option value="Uruguay">Uruguay</option>
                                                <option value="Uzbekistan">Uzbekistan</option>
                                                <option value="Vanuatu">Vanuatu</option>
                                                <option value="Venezuela">Venezuela</option>
                                                <option value="Vietnam">Vietnam</option>
                                                <option value="Wallis and Futuna">Wallis and Futuna</option>
                                                <option value="Western Samoa">Western Samoa</option>
                                                <option value="Yemen">Yemen</option>
                                                <option value="Zambia">Zambia</option>
                                                <option value="Zimbabwe">Zimbabwe</option>
                                            </select>
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
                                                        <span className="input-group-text ct" id="basic-addon1">card</span>
                                                    </div>
                                                    <input type="text" className="form-control" id="cardNumber" name="cardNumber" onChange={this.changeHandler} placeholder="4242 4242 4242 4242"
                                                        onFocus={() => this.cardDetector()} />
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
                                                <button type="submit" className="btn btn-primary btn-lg">Pay</button>
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
