import React from 'react';
import { Link } from 'react-router-dom';
import { Container, FormGroup, Input, Label } from 'reactstrap';
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
            <div id="paymentHistoryPage" className="paymentHistoryPage pageWrapper">
                <Container>
                    <div className="pageHeader paymentHistoryPageHead">
                        <div className="d-flex justify-content-between">
                            <h2 className="pageTitle mb-0">Payments</h2>
                            <Link to="/settings/payment-detail/create" className='btn-theme-outline bg-white'>
                                <i><img src={'/icon-cc.svg'} /></i>
                                <span>Update card</span>
                            </Link>
                        </div>

                        <form className="pageFilters d-flex justify-content-between align-items-center">
                            <FormGroup className="filter-sort position-relative">
                                <Label className="sr-only" for="dropdownFilters">sort by filter</Label>
                                <i className="btn-searchIcon left-0">
                                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 10V8.33333H4V10H0ZM0 5.83333V4.16667H8V5.83333H0ZM0 1.66667V0H12V1.66667H0Z" fill="#666666" />
                                    </svg>
                                </i>
                                <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                <select name="sortBy" id="sort-by" className="form-control">
                                    <option value="Null">Sort By</option>
                                    <option value="added">Added</option>
                                    <option value="date">By Date</option>
                                    <option value="category">By Category</option>
                                    <option value="ga-property">By GA Property</option>
                                </select>
                            </FormGroup>

                            <FormGroup className="filter-search position-relative">
                                <Label className="sr-only" for="search">search</Label>
                                <Input name="searchText" value={''} placeholder="Search..." onChange={''} />
                                <button className="btn-searchIcon"><img className="d-block" src="/search-new.svg" width="16" height="16" alt="Search" /></button>
                            </FormGroup>
                        </form>
                    </div>

                    <div className="dataTable dataTablePaymentHistory d-flex flex-column">
                        <div className="dataTableHolder">
                            <div className="tableHead singleRow align-items-center">
                                <div className="singleCol text-left">&nbsp;</div>
                                <div className="singleCol text-left">Transaction Id</div>
                                <div className="singleCol text-left">Plan</div>
                                <div className="singleCol text-left">Amount</div>
                                <div className="singleCol text-left">Credit date</div>
                                <div className="singleCol text-left">Paid by</div>
                                <div className="singleCol text-right">&nbsp;</div>
                            </div>
                            <div className="tableBody">
                                <div className="singleRow align-items-center">
                                    <div className="singleCol text-left"><span>#4</span></div>
                                    <div className="singleCol text-left"><span>44125</span></div>
                                    <div className="singleCol text-left"><span>Pro (Yearly)</span></div>
                                    <div className="singleCol text-left"><span>79.00 USD</span></div>
                                    <div className="singleCol text-left"><span>1/7/2022</span></div>
                                    <div className="singleCol text-left"><span>Card ending with 3124</span></div>
                                    <div className="singleCol text-right">
                                        <Link to={`#`} className='d-flex align-items-center'>
                                            <img src={`/icon-getInvoice.svg`} />
                                            <span className='pl-2'>Get Invoice</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="singleRow align-items-center">
                                    <div className="singleCol text-left"><span>#4</span></div>
                                    <div className="singleCol text-left"><span>44125</span></div>
                                    <div className="singleCol text-left"><span>Pro (Yearly)</span></div>
                                    <div className="singleCol text-left"><span>79.00 USD</span></div>
                                    <div className="singleCol text-left"><span>1/7/2022</span></div>
                                    <div className="singleCol text-left"><span>Card ending with 3124</span></div>
                                    <div className="singleCol text-right">
                                        <Link to={`#`} className='d-flex align-items-center'>
                                            <img src={`/icon-getInvoice.svg`} />
                                            <span className='pl-2'>Get Invoice</span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="singleRow align-items-center">
                                    <div className="singleCol text-left"><span>#4</span></div>
                                    <div className="singleCol text-left"><span>44125</span></div>
                                    <div className="singleCol text-left"><span>Pro (Yearly)</span></div>
                                    <div className="singleCol text-left"><span>79.00 USD</span></div>
                                    <div className="singleCol text-left"><span>1/7/2022</span></div>
                                    <div className="singleCol text-left"><span>Card ending with 3124</span></div>
                                    <div className="singleCol text-right">
                                        <Link to={`#`} className='d-flex align-items-center'>
                                            <img src={`/icon-getInvoice.svg`} />
                                            <span className='pl-2'>Get Invoice</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='noPaymentHistory'>
                        <div className='alert alert-success border-0'>
                            <i><img src={'/icon-check-success.svg'} alt={'icon'} className="svg-inject" /></i>
                            <span>Card ending with “3124” is added successfully.</span>
                        </div>
                        <p>No payment history</p>
                        <i><img src='/card.svg'/></i>
                        <span>Add a credit/debit card to get seamless subscription experience</span>
                        <div className='d-flex justify-content-center'>
                            <Link to="/settings/payment-detail/create" className='btn-theme-outline bg-white'>
                                <i><img src={'/icon-cc.svg'}/></i>
                                <span>Add a card</span>
                            </Link>
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
                </Container>
            </div>
        );
    }
}
