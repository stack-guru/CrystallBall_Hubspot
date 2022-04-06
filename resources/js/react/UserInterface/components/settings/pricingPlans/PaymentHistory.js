import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient from '../../../utils/HttpClient';

export default class PaymentHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pricePlanSubscriptions: [],
            isBusy: false,
            errors: '',
        }

    }

    componentDidMount() {
        document.title = 'Payment History';
        this.setState({ isBusy: true });
        HttpClient.get('/settings/price-plan-subscription')
            .then(response => {
                this.setState({ pricePlanSubscriptions: response.data.price_plan_subscriptions, isBusy: false });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });

    }


    render() {
        const pricePlanSubscriptions = this.state.pricePlanSubscriptions;

        return (
            <div className="bg-white component-wrapper">
                <h2 className="heading-section gaa-title">
                    Payment History<br />
                    <small></small>
                </h2>
                <div className="row">
                    <div className="col-12 text-right">
                        <Link to="/settings/payment-detail/create">Add a new Card</Link>
                    </div>
                </div>
                <div className="table-responsive">

                    <table className="table table-hover gaa-hover table-bordered mt-4">
                        <thead>
                            <tr>
                                <th>S#</th>
                                <th>Transaction Id</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Paid At</th>
                                <th>Card end with</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pricePlanSubscriptions.map((pricePlanSubscription, index) => (
                                    <tr key={pricePlanSubscription.id}>
                                        <td>{index + 1}</td>
                                        <td>{pricePlanSubscription.transaction_id}</td>
                                        <td>{pricePlanSubscription.price_plan ? pricePlanSubscription.price_plan.name : null}</td>
                                        <td>${pricePlanSubscription.payment_detail ? parseFloat(pricePlanSubscription.charged_price).toFixed(2) : '0'}</td>
                                        <td>
                                            {moment(pricePlanSubscription.created_at).format("YYYY-MM-DD")}&nbsp;&nbsp;&nbsp;{moment(pricePlanSubscription.created_at).format("hh:mm")}
                                        </td>
                                        <td>****-****-****-{pricePlanSubscription.payment_detail ? pricePlanSubscription.payment_detail.card_number : '****'}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }


}
