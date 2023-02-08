import React from "react";
import HttpClient from "../utils/HttpClient";

export default class DSRMDatesSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            retail_marketing_dates: [],
            isBusy: false,
            errors: "",
            searchText: "",
        };

        this.handleClick = this.handleClick.bind(this);
        this.selectAllShowing = this.selectAllShowing.bind(this);
        this.checkSearchText = this.checkSearchText.bind(this);
        this.clearAll = this.clearAll.bind(this);
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get("data-source/retail-marketing-dates")
                .then(
                    (resp) => {
                        this.setState({
                            isBusy: false,
                            retail_marketing_dates:
                                resp.data.retail_marketing_dates,
                        });
                    },
                    (err) => {
                        this.setState({
                            isBusy: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    handleClick(e) {
        if (e.target.checked) {
            this.props.onCheckCallback({
                code: "retail_marketings",
                name: "RetailMarketing",
                country_name: null,
                retail_marketing_id: e.target.getAttribute(
                    "retail_marketing_id"
                ),
            });
        } else {
            this.props.onUncheckCallback(e.target.id, "retail_marketings");
        }
    }

    selectAllShowing(e) {
        let userRMDateIds = this.props.ds_data.map(ds => ds.retail_marketing_id);
        this.state.retail_marketing_dates.forEach(rmDate => {
            if (rmDate.event_name.toLowerCase().indexOf(this.state.searchText) > -1 || this.state.searchText.length == 0) {
                if (userRMDateIds.indexOf(rmDate.id) == -1) {
                    this.props.onCheckCallback({
                        code: "retail_marketings",
                        name: "RetailMarketing",
                        country_name: null,
                        retail_marketing_id: rmDate.id,
                    });
                }
            }
        });
    }

    clearAll(e) {
        let userRMDateIds = this.props.ds_data.map(ds => ds.retail_marketing_id);
        let userDSEvents = this.props.ds_data.map(ds => ds.id);
        userRMDateIds.forEach((rmDate, index) => {
            (this.props.onUncheckCallback)(userDSEvents[index], 'retail_marketings')
        })
    }

    checkSearchText(rmd) {
        if (this.state.searchText.length) {
            if (
                rmd.event_name
                    .toLowerCase()
                    .indexOf(this.state.searchText.toLowerCase()) > -1
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    render() {
        let retail_marketing_dates = this.state.retail_marketing_dates;
        let userRMDIds = this.props.ds_data.map((ds) =>
            parseInt(ds.retail_marketing_id)
        );
        let userDSIds = this.props.ds_data.map((ds) => ds.id);

        return (
            <div className="apps-bodyContent grid2layout">
                <div className="column">
                    <div className="white-box">
                        <h4>Select Dates for Retail Marketing</h4>
                        <div className="input-group search-input-box mb-3">
                            <input type="text" className="form-control search-input" placeholder="Search" value={this.state.searchText} name="searchText" onChange={(e) => this.setState({[e.target.name]: e.target.value,})}/>
                            <div className="input-group-append"><i className="ti-search"></i></div>
                        </div>
                        <div className="boxTitleBtn d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <label className="themeNewCheckbox d-flex align-items-center justify-content-start m-0" htmlFor="check-all">
                                <input type="checkbox" id="check-all" onChange={this.selectAllShowing}/>
                                <span>Select All</span>
                            </label>
                            <span className="btn-clearAll" onClick={this.clearAll}>Clear All</span>
                        </div>
                        <div className="checkBoxList">
                            {retail_marketing_dates
                                .filter(this.checkSearchText)
                                .map((rmd) => {
                                    if (userRMDIds.indexOf(rmd.id) !== -1) {
                                        return null;
                                    }
                                    return (
                                        <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor="defaultCheck1" key={rmd.id}>
                                            <input checked={userRMDIds.indexOf(rmd.id) !== -1} type="checkbox" id={userRMDIds.indexOf(rmd.id) !== -1 ? userDSIds[userRMDIds.indexOf(rmd.id)] : null} onChange={this.handleClick} retail_marketing_id={rmd.id}/>
                                            <span>{rmd.show_at} -{" "}{rmd.event_name}</span>
                                        </label>
                                    );
                                })}
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="gray-box">
                        <div className="boxTitleBtn d-flex justify-content-between border-bottom pb-3 mb-3">
                            <h4 className='mb-0'>Selected Dates{" "}</h4>
                            <span className="btn-clearAll" onClick={this.clearAll}>Clear All</span>
                        </div>
                        <div className="checkBoxList">
                            {retail_marketing_dates
                                .filter(this.checkSearchText)
                                .map((rmd) => {
                                    if (userRMDIds.indexOf(rmd.id) === -1) {
                                        return null;
                                    }
                                    return (
                                        <label className="themeNewCheckbox d-flex align-items-center justify-content-start" htmlFor="defaultCheck1" key={rmd.id}>
                                            <input checked={userRMDIds.indexOf(rmd.id) !== -1} type="checkbox" id={userRMDIds.indexOf(rmd.id) !== -1 ? userDSIds[userRMDIds.indexOf(rmd.    id)] : null} onChange={this.handleClick} retail_marketing_id={rmd.id}/>
                                            <span>{rmd.show_at} - {rmd.event_name}</span>
                                        </label>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
