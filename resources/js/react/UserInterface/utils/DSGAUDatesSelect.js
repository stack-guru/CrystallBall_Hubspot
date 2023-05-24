import React from 'react';
import HttpClient from '../utils/HttpClient';
import GoogleAnalyticsPropertySelect from "../utils/GoogleAnalyticsPropertySelect";
import Toast from "./Toast";
import {CustomTooltip} from "../components/annotations/IndexAnnotation";
import {Popover, PopoverBody} from "reactstrap";

export default class DSGAUDatesSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            google_algorithm_updates: [],
            isBusy: false,
            errors: '',
            activeDeletePopover: ''
        }

        this.selectedStatusChanged = this.selectedStatusChanged.bind(this);
        this.fetchUpdatesList = this.fetchUpdatesList.bind(this);
    }

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({isBusy: true})
            this.fetchUpdatesList("");
        }
    }

    fetchUpdatesList(status) {
        let getUrl = 'data-source/google-algorithm-updates/date';
        if (status) if (status !== "") getUrl += '?status=' + status
        HttpClient.get(getUrl).then(resp => {
            this.setState({isBusy: false, google_algorithm_updates: resp.data.google_algorithm_updates})
        }, (err) => {

            this.setState({isBusy: false, errors: err.response.data})
        }).catch(err => {

            this.setState({isBusy: false, errors: err})
        })
    }

    selectedStatusChanged(e) {
        this.setState({[e.target.name]: e.target.value});
        this.fetchUpdatesList(e.target.value);
    }

    render() {

        return (
            <div className="apps-bodyContent">
                <h4 className='themeNewTitle'>Select mode:</h4>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="input-group themeNewInputGroup">
                        <select className="form-control" placeholder="Search"
                            // value={this.props.ds_data.length ? (this.props.ds_data[0].status ? this.props.ds_data[0].status : "") : ""}
                                name="searchStatus"
                                onChange={this.selectedStatusChanged}>
                            <option value="">Both</option>
                            <option value="unconfirmed">Unconfirmed</option>
                            <option value="confirmed">Confirmed</option>
                        </select>
                    </div>

                    <span className="betweentext">for</span>
                    <GoogleAnalyticsPropertySelect
                        className="themeNewselect hide-icon"
                        name="ga_property_id"
                        id="ga_property_id"
                        currentPricePlan={this.props.user.price_plan}
                        value={this.props.gaPropertyId}
                        onChangeCallback={(gAP) => {
                            this.props.updateGAPropertyId(gAP.target.value || null)


                            // const currentValue = this.props.ds_data.length ? (this.props.ds_data[0].status ? this.props.ds_data[0].status : "") : ""
                            // if (currentValue) {
                            //     this.selectedStatusChanged({
                            //         target: {
                            //             name: 'searchStatus',
                            //             value: currentValue,
                            //             gaPropertyId: gAP.target.value
                            //         }
                            //     });
                            // } else {
                            //     // Toast.fire({
                            //     //     icon: 'success',
                            //     //     title: "Successfully saved google update settings.",
                            //     // });
                            // }
                        }}
                        placeholder="Select GA Properties"
                        isClearable={true}
                    />
                </div>

                <div className='d-flex justify-content-end pt-3'>
                    <button onClick={(e) => {
                        if (!this.props.ds_data.length) {
                            this.props.serviceStatusHandler({ target: { name: 'is_ds_google_algorithm_updates_enabled', value: true, checked: true }})
                        }
                        (this.props.onCheckCallback)({
                            code: 'google_algorithm_update_dates',
                            name: 'GoogleAlgorithmUpdateDate',
                            country_name: null,
                            status: this.state.searchStatus
                        }, this.props.gaPropertyId)
                    }} className="btn-theme">Add
                    </button>
                </div>

                <div className="gray-box mt-3">
                    {/*{this.props.ds_data.length ?
                        <h4 className='text-capitalize'>
                            {this.props.ds_data[0].status ? this.props.ds_data[0].status : 'Both'}
                            <span>{this.props.ds_data[0].ga_property_name}</span>
                        </h4>
                        :
                        ""
                    }
*/}

                    <h4>
                        Active Google Updates: <span>(Click to remove)</span>
                    </h4>
                    <div className="d-flex keywordTags">
                        {this.props.ds_data?.map((gAK, index) => {
                            return (
                                <>
                                    <button
                                        onClick={() => {
                                            this.setState({activeDeletePopover: gAK})
                                        }}
                                        id={"gAK-" + gAK.id}
                                        type="button"
                                        className="keywordTag dd-tooltip d-flex"
                                        key={gAK.id}
                                        user_data_source_id={gAK.id}
                                    >
                                        <CustomTooltip
                                            tooltipText={`${gAK.status || 'Both'}`}
                                            maxLength={50}>
                                        <span
                                            style={{background: "#2d9cdb"}}
                                            className="dot"
                                        ></span>
                                            {gAK.ga_property_name || "All Properties"}
                                        </CustomTooltip>
                                    </button>

                                    <Popover
                                        placement="top"
                                        target={"gAK-" + gAK.id}
                                        isOpen={
                                            this.state.activeDeletePopover?.id ===
                                            gAK.id
                                        }
                                    >
                                        <PopoverBody web_monitor_id={gAK.id}>
                                            Are you sure you want to remove "
                                            {gAK.status || 'Both'}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={() => {
                                                this.props.userDataSourceDeleteHandler(gAK.id, 'google_algorithm_update_dates');
                                                if (this.props.ds_data.length === 1) {
                                                    this.props.serviceStatusHandler({ target: { name: 'is_ds_google_algorithm_updates_enabled', value: false, checked: false }})
                                                }
                                            }}
                                            key={gAK.id}
                                            user_data_source_id={gAK.id}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() =>
                                                this.setState({activeDeletePopover: ''})
                                            }
                                        >
                                            No
                                        </button>
                                    </Popover>
                                </>
                            );
                        })}
                    </div>
                </div>

                <div className="checkBoxList d-flex flex-column">
                    {
                        this.state.google_algorithm_updates.map(gAU => {
                            return (
                                <label className="themeNewCheckbox d-flex align-items-center justify-content-start"
                                       htmlFor="defaultCheck1" key={gAU.id}>
                                    <span>{moment(gAU.update_date).format('YYYY-MM-DD')} - {gAU.event_name}</span>
                                </label>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}
