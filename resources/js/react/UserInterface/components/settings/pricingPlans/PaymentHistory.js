import React from 'react';
import HttpClient from '../../../utils/HttpClient';

export default class PaymentHistory extends React.Component{

    constructor(props) {
        super(props);
        this.state={
                history:[],
            isBusy:false,
            errors:'',
        }

    }

componentDidMount() {
    this.setState({ isBusy: true });
        HttpClient.get('/paymentHistory')
            .then(response=>{
            this.setState({history:response.data.history,isBusy:false});
                console.log(response.data.history);
        },(err)=> {
        console.log(err);
        this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
        console.log(err)
        this.setState({ isBusy: false, errors: err });
        });

}


    render() {
        const history=this.state.history;
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
                        history?
                            history.map(history=>(
                            <tr key={history.id}>
                                <td>{history.id}</td>
                                <td>{history.transaction_id}</td>
                                <td>amount </td>
                                <td>{history.created_at}</td>
                                <td>digits</td>
                            </tr>
                            ))
                            :
                            <tr><td colSpan="5">No history found</td></tr>
                    }

                    </tbody>
                </table>

            </div>
        );
    }


}
