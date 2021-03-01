import React from 'react';
import HttpClient from '../utils/HttpClient';

export default class DSRMDatesSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            retail_marketing_dates: [],
            isBusy: false,
            errors: '',
            searchText: ''
        }

        this.handleClick = this.handleClick.bind(this)
        this.selectAllShowing = this.selectAllShowing.bind(this);
        this.checkSearchText = this.checkSearchText.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true })
            HttpClient.get('retail-marketing-dates').then(resp => {
                this.setState({ isBusy: false, retail_marketing_dates: resp.data.retail_marketing_dates })
            }, (err) => {
                console.log(err);
                this.setState({ isBusy: false, errors: err.response })
            }).catch(err => {
                console.log(err);
                this.setState({ isBusy: false, errors: err })
            })
        }
    }

    handleClick(e) {
        if (e.target.checked) {
            (this.props.onCheckCallback)({ code: 'retail_marketings', name: 'RetailMarketing', country_name: null, retail_marketing_id: e.target.getAttribute('retail_marketing_id') })
        } else {
            (this.props.onUncheckCallback)(e.target.id, 'retail_marketings')
        }
    }

    selectAllShowing(e) {
        let userRMDateIds = this.props.ds_data.map(ds => ds.retail_marketing_id);
        this.state.retail_marketing_dates.map(rmDate => {
            if (rmDate.event_name.toLowerCase().indexOf(this.state.searchText) > -1 || this.state.searchText.length == 0) {
                if (userRMDateIds.indexOf(rmDate.id) == -1) {
                    (this.props.onCheckCallback)({ code: 'retail_marketings', name: 'RetailMarketing', country_name: null, retail_marketing_id: rmDate.id })
                }
            }
        })
    }

    clearAll(e) {
        let userRMDateIds = this.props.ds_data.map(ds => ds.retail_marketing_id);
        let userDSEvents = this.props.ds_data.map(ds => ds.id);
        userRMDateIds.map((rmDate,index) => {
            (this.props.onUncheckCallback)(userDSEvents[index], 'retail_marketings')
        })
    }

    checkSearchText(rmd){
        if (this.state.searchText.length) {
            if (
                rmd.event_name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) > -1
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    render() {
        let retail_marketing_dates = this.state.retail_marketing_dates;
        let userRMDIds = this.props.ds_data.map(ds => parseInt(ds.retail_marketing_id));
        let userDSIds = this.props.ds_data.map(ds => ds.id);

        return (
            <div className="retail_marketing_dates-form">
                <h4 className="gaa-text-primary">
                    Select Dates for Retail Marketing
                </h4>
                <div className="input-group search-input-box mb-3">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search"
                        value={this.state.searchText}
                        name="searchText"
                        onChange={(e) => this.setState({ [e.target.name]: e.target.value })}
                    />
                    <div className="input-group-append">
                        <i className="ti-search"></i>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center border-bottom">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="check-all"
                            onChange={this.selectAllShowing}
                        />
                        <label
                            className="form-check-label font-weight-bold"
                            htmlFor="check-all"
                        >
                            Select All
                        </label>
                    </div>
                    <div>
                        <p className="font-weight-bold cursor m-0" onClick={this.clearAll}>Clear All</p>
                    </div>
                </div>
                <div className="checkbox-box mt-3">
                    {
                        retail_marketing_dates.filter(this.checkSearchText).map(rmd => {
                            return <div className="form-check rmd" key={rmd.id}>
                                <input
                                    className="form-check-input"
                                    checked={userRMDIds.indexOf(rmd.id) !== -1}
                                    type="checkbox"
                                    id={userRMDIds.indexOf(rmd.id) !== -1 ? userDSIds[userRMDIds.indexOf(rmd.id)] : null}
                                    onChange={this.handleClick}
                                    retail_marketing_id={rmd.id}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="defaultCheck1"
                                >
                                    {rmd.show_at} - {rmd.event_name}
                                </label>
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }
}
