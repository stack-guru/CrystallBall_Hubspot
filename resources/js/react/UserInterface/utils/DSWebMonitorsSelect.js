import React from "react";
import HttpClient from "../utils/HttpClient";
import ErrorAlert from "../utils/ErrorAlert";
import GoogleAnalyticsPropertySelect from "./GoogleAnalyticsPropertySelect";
import {CustomTooltip} from "../components/annotations/IndexAnnotation";
import {
    Button,
    Popover,
    UncontrolledPopover,
    PopoverHeader,
    PopoverBody,
} from "reactstrap";

export default class DSWebMonitorsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: undefined,
            webMonitor: {
                name: "",
                url: "",
                email_address: "",
                sms_phone_number: "",
                ga_property_id: "",
            },
            webMonitors: [],
            activeDeletePopover: null,
        };

        this.setDefaultState = this.setDefaultState.bind(this);
        this.reloadWebMonitors = this.reloadWebMonitors.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    setDefaultState() {
        this.setState({
            isBusy: false,
            errors: undefined,
            webMonitor: {
                name: "",
                url: "",
                email_address: "",
                sms_phone_number: "",
            },
        });
    }

    componentDidMount() {
        this.reloadWebMonitors();
    }

    reloadWebMonitors() {
        HttpClient.get(
            `/data-source/web-monitor?ga_property_id=${this.props.ga_property_id}`
        )
            .then(
                (resp) => {
                    this.setState({
                        webMonitors: resp.data.web_monitors,
                        isBusy: false,
                    });

                    setTimeout(() => {
                        $(function () {
                            $('.miniPreview').miniPreview({ prefetch: 'pageload' });
                        })
                    }, 2000);
                },
                (err) => {
                    this.setState({ isBusy: false });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false });
            });
    }

    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            this.setState({
                webMonitor: {
                    ...this.state.webMonitor,
                    ga_property_id: this.props.ga_property_id,
                },
            });
        }
    }

    handleChange(e) {
        this.setState({
            webMonitor: {
                ...this.state.webMonitor,
                [e.target.name]: e.target.value,
            },
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.post("data-source/web-monitor", this.state.webMonitor)
                .then(
                    (response) => {
                        let webMonitors = this.state.webMonitors;
                        webMonitors.push(response.data.web_monitor);
                        this.setState({
                            isBusy: false,
                            webMonitors,
                            errors: undefined,
                            webMonitor: {
                                name: "",
                                url: "",
                                email_address: "",
                                sms_phone_number: "",
                            },
                        });
                        this.props.reloadWebMonitors(this.props.ga_property_id);
                        this.props.updateTrackingStatus(true)
                        this.props.updateUserService({ target: {
                                name: "is_ds_web_monitors_enabled",
                                checked: true,
                            }, 
                        });
                    },
                    (err) => {
                        this.setState({
                            isBusy: false,
                            errors: err.response.data,
                        });

                        if (err.response.status === 422) {
                            this.props.upgradePopup('website-monitoring-limit')
                        }

                    }
                )
                .catch((err) => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    handleDelete(id) {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.delete(`data-source/web-monitor/${id}`)
                .then(
                    (response) => {
                        let webMonitors = this.state.webMonitors.filter(
                            (wM) => wM.id !== id
                        );
                        this.setState({
                            isBusy: false,
                            webMonitors,
                            errors: undefined,
                        });
                        this.props.reloadWebMonitors(this.props.ga_property_id);
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

    render() {

        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="web_monitors-form">
                    <div className="white-box">
                        <h4>Add Monitors</h4>
                        <ErrorAlert errors={this.state.errors} />
                        <form onSubmit={this.handleSubmit}>
                            <div className="grid2layout">
                                <div className="themeNewInputGroup">
                                    <input
                                        type="text"
                                        className="form-control search-input"
                                        placeholder="Name"
                                        value={this.state.webMonitor.name}
                                        name="name"
                                        required
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="themeNewInputGroup">
                                    <input
                                        type="url"
                                        className="form-control search-input"
                                        placeholder="https://www.your-domain.com/"
                                        value={this.state.webMonitor.url}
                                        name="url"
                                        required
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid2layout">
                                <GoogleAnalyticsPropertySelect
                                    className="themeNewselect themeNewInputGroup"
                                    name="ga_property_id"
                                    id="ga_property_id"
                                    currentPricePlan={
                                        this.props.user.price_plan
                                    }
                                    value={this.props.ga_property_id}
                                    onChangeCallback={(gAP) => {
                                        this.props.updateGAPropertyId(gAP.target.value || null);
                                    }}
                                    components={{
                                        DropdownIndicator: () => null,
                                        IndicatorSeparator: () => null,
                                    }}
                                    placeholder="Select GA Properties"
                                    isClearable={true}
                                    onDeleteCallback={this.props.onUncheckCallback}
                                />
                            </div>
                            <div className="mt-4">
                                <button className="btn-theme" type="submit">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* <div className="checkbox-box mt-4">
                        {this.state.webMonitors.map((wM) => {
                            return (
                                <div
                                    className="form-check wac mb-2 ml-0 pl-0 mt-3"
                                    key={wM.id}
                                >
                                    <button
                                        id={"wM-" + wM.id}
                                        type="button"
                                        onClick={() =>
                                            this.setState({
                                                activeDeletePopover: wM.id,
                                            })
                                        }
                                    >
                                        X
                                    </button>
                                    <Popover
                                        target={"wM-" + wM.id}
                                        isOpen={
                                            this.state.activeDeletePopover ===
                                            wM.id
                                        }
                                    >
                                        <PopoverBody web_monitor_id={wM.id}>
                                            Are you sure you want to remove "
                                            {wM.name}"?.
                                        </PopoverBody>
                                        <button
                                            onClick={() =>
                                                this.handleDelete(wM.id)
                                            }
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={() =>
                                                this.setState({
                                                    activeDeletePopover: null,
                                                })
                                            }
                                        >
                                            No
                                        </button>
                                    </Popover>
                                    <label
                                        className="form-check-label ml-1"
                                        htmlFor="defaultCheck1"
                                    >
                                        {wM.name}
                                    </label>
                                    <label className="float-right">
                                        {wM.google_analytics_property
                                            ? wM.google_analytics_property.name
                                            : "All Properties"}
                                    </label>
                                </div>
                            );
                        })}
                    </div> */}

                    <div className="gray-box">
                        <h4>
                            Active Monitors: <span>(Click to remove)</span>
                        </h4>
                        <div className="d-flex keywordTags">
                            {this.state.webMonitors?.map((wM) => {
                                return (
                                    <>
                                        <button
                                            type="button"
                                            className="keywordTag dd-tooltip d-flex"
                                            key={wM.id}
                                            id={"wM-" + wM.id}
                                            user_data_source_id={wM.id}
                                            onClick={() =>
                                                this.setState({
                                                    activeDeletePopover: wM.id,
                                                })
                                            }
                                        >
                                            <span
                                                style={{
                                                    background: "#2d9cdb",
                                                }}
                                                className="dot"
                                            ></span>
                                            <a href={wM.url} target="_blank" className="ml-1 miniPreview">
                                                <i className="icon"><img src={'/icon-chain.svg'} /></i>
                                            </a>
                                            &nbsp;
                                            <CustomTooltip tooltipText={wM.google_analytics_property?.name || "All Properties"}
                                                            maxLength={50}>
                                                {wM.name}
                                            </CustomTooltip>
                                        </button>

                                        <Popover
                                            placement="top"
                                            target={"wM-" + wM.id}
                                            isOpen={
                                                this.state
                                                    .activeDeletePopover ===
                                                wM.id
                                            }
                                        >
                                            <PopoverBody web_monitor_id={wM.id}>
                                                Are you sure you want to remove
                                                "{wM.name}"?.
                                            </PopoverBody>
                                            <button
                                                onClick={() =>
                                                    this.handleDelete(wM.id)
                                                }
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() =>
                                                    this.setState({
                                                        activeDeletePopover:
                                                            null,
                                                    })
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
                </div>
            </div>
        );
    }
}
