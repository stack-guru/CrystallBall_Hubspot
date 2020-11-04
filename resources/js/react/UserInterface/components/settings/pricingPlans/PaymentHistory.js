import React from 'react';
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
        this.setState({ isBusy: true });
        HttpClient.get('/settings/price-plan-subscription')
            .then(response => {
                this.setState({ pricePlanSubscriptions: response.data.price_plan_subscriptions, isBusy: false });
                console.log(response.data.pricePlanSubscriptions);
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                console.log(err)
                this.setState({ isBusy: false, errors: err });
            });

    }


    render() {
        const pricePlanSubscriptions = this.state.pricePlanSubscriptions;
        return (
            <div className="bg-white component-wrapper">
                <h3>Payment History</h3>

                <table className="table table-hover table-bordered mt-4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Transaction Id</th>
                            <th>Amount</th>
                            <th>Paid At</th>
                            <th>Card end with</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pricePlanSubscriptions.map(pricePlanSubscription => (
                                <tr key={pricePlanSubscription.id}>
                                    <td>{pricePlanSubscription.id}</td>
                                    <td>{pricePlanSubscription.transaction_id}</td>
                                    <td>amount </td>
                                    <td>{moment(pricePlanSubscription.created_at).format("YYYY-MM-DD")}</td>
                                    <td>digits</td>

                                </tr>
                            ))
                        }

                    </tbody>
                </table>

            </div>
        );
    }


}
