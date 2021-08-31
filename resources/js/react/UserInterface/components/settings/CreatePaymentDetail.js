import React, { Component } from "react";
import CountryCodeSelect from '../../utils/CountryCodeSelect';
import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient"

export default class CreatePaymentDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: undefined,
            paymentDetail: {
                'first_name': '', card_number: '', 'expiry_month': '', expiry_year: '', 'security_code': '',
                'billing_address': '', city: '', zip_code: '', country: ''
            },
            isBusy: false
        };

        this.setDefaultState = this.setDefaultState.bind(this);

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    componentDidMount() {
        document.title = 'Create Payment Detail'
    }

    setDefaultState() {
        this.setState({
            errors: undefined,
            paymentDetail: {
                'first_name': '', card_number: '', 'expiry_month': '', expiry_year: '', 'security_code': '',
                'billing_address': '', city: '', zip_code: '', country: ''
            },
            isBusy: false
        });
    }

    changeHandler(e) {
        this.setState({ isDirty: true, paymentDetail: { ...this.state.paymentDetail, [e.target.name]: e.target.value } });
    }

    submitHandler(e) {
        e.preventDefault();

        if (!this.state.isBusy) {
            this.setState({ isBusy: true });

            HttpClient.post('/settings/payment-detail', this.state.paymentDetail)
                .then(response => {
                    toast.success("Card Added");
                    this.setDefaultState();
                }, (err) => {
                    this.setState({ isBusy: false, errors: (err.response).data });
                }).catch(err => {
                    this.setState({ isBusy: false, errors: err });
                });
        }

    }

    render() {
        return (
            <div className="container-xl bg-white  component-wrapper" >
                <section className="ftco-section" id="buttons">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section gaa-title">
                                    Add Card<br />
                                </h2>
                            </div>
                            <div className="col-md-12">
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <ErrorAlert errors={this.state.errors} />
                            </div>
                        </div>

                        <form onSubmit={this.submitHandler}>
                            <div className="row">
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="firstName" className="form-control-placeholder">First name</label>
                                        <input type="text" value={this.state.paymentDetail.first_name} onChange={this.changeHandler} className="form-control" id="firstName" name="first_name" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="lastName" className="form-control-placeholder">Last name</label>
                                        <input type="text" value={this.state.paymentDetail.last_name} onChange={this.changeHandler} className="form-control" id="lastName" name="last_name" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="billingAddress" className="form-control-placeholder">Billing Address</label>
                                        <input type="text" value={this.state.paymentDetail.billing_address} onChange={this.changeHandler} className="form-control" id="billingAddress" name="billing_address" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="city" className="form-control-placeholder">City</label>
                                        <input type="text" value={this.state.paymentDetail.city} onChange={this.changeHandler} className="form-control" id="city" name="city" />
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-4">
                                    <div className="form-group">
                                        <label htmlFor="zipCode" className="form-control-placeholder">Zip Code</label>
                                        <input type="text" value={this.state.paymentDetail.zip_code} onChange={this.changeHandler} className="form-control" id="zipCode" name="zip_code" />
                                    </div>
                                </div>
                                <div className="col-4  pl-0">
                                    <div className="form-group ">
                                        <label htmlFor="">Country</label>
                                        <CountryCodeSelect className="form-control" name="country" onChange={this.changeHandler} value={this.state.paymentDetail.country} ></CountryCodeSelect>
                                    </div>
                                </div>
                                <div className="col-4  pl-0">
                                    <div className="form-group ">
                                        <label htmlFor="cardNumber">Card Number</label>
                                        <input type="text" value={this.state.paymentDetail.card_number} onChange={this.changeHandler} className="form-control" id="cardNumber" name="card_number" />
                                    </div>
                                </div>
                                <div className="col-4  pl-0">
                                    <div className="form-group ">
                                        <label htmlFor="expiryMonth">Expiry Month</label>
                                        <input type="text" value={this.state.paymentDetail.expiry_month} onChange={this.changeHandler} className="form-control" id="expiryMonth" name="expiry_month" />
                                    </div>
                                </div>
                                <div className="col-4  pl-0">
                                    <div className="form-group ">
                                        <label htmlFor="expiryYear">Expiry Year</label>
                                        <input type="text" value={this.state.paymentDetail.expiry_year} onChange={this.changeHandler} className="form-control" id="expiryYear" name="expiry_year" />
                                    </div>
                                </div>
                                <div className="col-4  pl-0">
                                    <div className="form-group ">
                                        <label htmlFor="securityCode">Security Code</label>
                                        <input type="text" value={this.state.paymentDetail.security_code} onChange={this.changeHandler} className="form-control" id="securityCode" name="security_code" />
                                    </div>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 mt-3 mt-sm-3 mt-md-1 mt-lg-1">
                                <div className="col-12 text-right pr-0">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round" title="submit">
                                        <i className="fa fa-plus mr-1"></i>Add
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </section>
            </div>
        )
    }
}