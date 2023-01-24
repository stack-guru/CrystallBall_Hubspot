import React, { Component } from "react";
import CountryCodeSelect from '../../utils/CountryCodeSelect';
import ErrorAlert from "../../utils/ErrorAlert";
import HttpClient from "../../utils/HttpClient"
import { toast } from "react-toastify";
import ModalHeader from "../AppsMarket/common/ModalHeader";

export default class CreatePaymentDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: undefined,
            paymentDetail: {
                'first_name': '', 'last_name': '', card_number: '', 'expiry_month': '', expiry_year: '', 'security_code': '',
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
                'first_name': '', 'last_name': '', card_number: '', 'expiry_month': '', expiry_year: '', 'security_code': '',
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
            <div className="modal-addCard">
                <div className="apps-bodyContent">
                    <h2>Add payment card</h2>
                    <form onSubmit={this.submitHandler} id="addCardForm" className="addCardForm">
                        <ErrorAlert errors={this.state.errors} />
                        <div className='grid2layout'>
                            <div className="themeNewInputStyle">
                                <input placeholder="First name" type="text" value={this.state.paymentDetail.first_name} onChange={this.changeHandler} className="form-control" id="firstName" name="first_name" />
                            </div>
                            <div className="themeNewInputStyle">
                                <input placeholder="Last name" type="text" value={this.state.paymentDetail.last_name} onChange={this.changeHandler} className="form-control" id="lastName" name="last_name" />
                            </div>
                        </div>
                        <div className="themeNewInputStyle mb-3">
                            <input placeholder="Card number" type="text" value={this.state.paymentDetail.card_number} onChange={this.changeHandler} className="form-control" id="cardNumber" name="card_number" />
                        </div>
                        <div className='grid2layout'>
                            <div className="themeNewInputStyle">
                                {/* <input placeholder="" type="text" value={this.state.paymentDetail.expiry_month} onChange={this.changeHandler} className="form-control" id="expiryMonth" name="expiry_month" /> */}
                                <input placeholder="Expiry date (mm/yy)" type="text" value={this.state.paymentDetail.expiry_year} onChange={this.changeHandler} className="form-control" id="expiryYear" name="expiry_year" />
                            </div>
                            <div className="themeNewInputStyle">
                                <input placeholder="CVV" type="text" value={this.state.paymentDetail.security_code} onChange={this.changeHandler} className="form-control" id="securityCode" name="security_code" />
                            </div>
                        </div>

                        <div className='d-flex pt-3 d-flex justify-content-center'>
                            <button onClick={() => this.props.closePopup('')} type="button" className="btn-cancel" title="submit">Cancel</button>
                            <button type="submit" className="btn-theme ml-4" title="submit">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
