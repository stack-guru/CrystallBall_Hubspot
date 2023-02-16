import React from "react";
import Select from 'react-select';
import { Redirect } from "react-router-dom";

import HttpClient from "./HttpClient";
import { Popover, PopoverBody } from "reactstrap";

export default class GoogleAnalyticsAccountSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            aAccounts: [],
            selectedProperties: [],
            isBusy: false,
            errors: '',
            redirectTo: null,
            activeDeletePopover: ''
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.deleteKeyword = this.deleteKeyword.bind(this);

    }

    deleteKeyword(propertyId) {
        const filteredProperty = this.state.selectedProperties.filter(itm => itm.id != propertyId);
        this.setState({ selectedProperties: filteredProperty });

        if (filteredProperty.length === 0) {
            this.props.onChangeCallback({ target: { name: this.props.name, value: [""] } });
        } else {
            this.props.onChangeCallback({ target: { name: this.props.name, value: this.props.multiple ? filteredProperty.map(sO => sO.id) : filteredProperty?.[0]?.id } });
        }
    }

    componentDidMount() {
        this.setState({ isBusy: true })
        HttpClient.get(`/settings/google-analytics-account`)
            .then(response => {
                let gaas = response.data.google_analytics_accounts;

                let options = gaas.map(gap => {
                    return {
                        ...gap,
                        labelText: gap.name,
                        label: (
                            <div className="d-flex propertyLabel">
                                <span style={{ background: "#2d9cdb" }} className="dot"></span>
                                <span className="text-truncate" style={{ maxWidth: 150 }}>{gap.name}</span>
                            </div>
                        )
                    };
                });

                this.setState({ isBusy: false, aAccounts: options });
            }, (err) => {

                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {

                this.setState({ isBusy: false, errors: err });
            });
    }

    onChangeHandler(sOption) {
        if (sOption.value === '') {
            return ''
        }

        // if (sOption == null) {
        //     this.props.onChangeCallback({ target: { name: this.props.name, value: [""] } });
        // } else
        let finalValues = {};
        if (this.props.multiple) {
            const selectedVal = sOption;
            finalValues = [...this.state.selectedProperties, ...selectedVal.map(itm => ({ ...itm, value: itm.value, label: itm.labelText }))];
            this.setState({ selectedProperties: finalValues })
        } else {
            const selectedVal = sOption[0];
            finalValues = [{ ...selectedVal, value: selectedVal.value, label: selectedVal.labelText }]
            this.setState({ selectedProperties: finalValues })
        }

        if (!this.props.multiple && sOption.value == 'new-google-account') {
            this.setState({ redirectTo: '/accounts' });
        } else {
            this.props.onChangeCallback({ target: { name: this.props.name, value: this.props.multiple ? finalValues?.map(sO => sO.id) : sOption?.[0]?.id } });
        }
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo} />
        let aAccounts = this.state.aAccounts;

        let allOptions = [
            // { value: "", label: "All Accounts" }
        ];
        allOptions = allOptions.concat(aAccounts.map(acc => { return { value: acc.id, label: acc.name } }));
        // allOptions.push({ value: "new-google-account", label: "Connect new Google Account" })

        let selectedOptions;
        if (this.props.multiple) {
            selectedOptions = allOptions.filter(aO => this.props.value.indexOf(aO.value) !== -1);
        } else {
            selectedOptions = this.props.value;
        }
        return (
            <>
                <div className="selectGoogleAccount themeNewInputStyle position-relative inputWithIcon">
                    <i className="icon fa"><img src='/icon-plus.svg' /></i>
                    <Select
                        name={this.props.name}
                        disabled={this.props.disabled}
                        // value={selectedOptions}
                        value={[]}
                        id={this.props.id}
                        className="gray_clr"
                        isMulti={this.props.multiple}
                        onChange={this.onChangeHandler}
                        options={this.state.aAccounts}
                        isSearchable={this.state.aAccounts.length > 3}
                        placeholder={this.props.placeholder}>
                    </Select>
                </div>


                <div className='ga-analytics-property-selected'>
                    {this.state.selectedProperties.length ? <h4>
                        Selected accounts: <span>(Click to remove)</span>
                    </h4> : null}
                    <div className="d-flex keywordTags mt-3">
                        {this.state.selectedProperties.map((itm, index) => {
                            return (<>
                                <button
                                    onClick={() =>
                                        this.setState({
                                            activeDeletePopover: itm.id,
                                        })
                                    }
                                    id={"gAK-" + itm.id}
                                    type="button"
                                    className="keywordTag"
                                    key={itm.id}
                                    user_data_source_id={itm.id}
                                >
                                    <span
                                        style={{ background: "#2d9cdb" }}
                                        className="dot"
                                    ></span>
                                    <span className="text-truncate ga-selected-label" style={{ maxWidth: 150 }}>{itm.labelText}</span>
                                </button>

                                <Popover
                                    placement="top"
                                    target={"gAK-" + itm.id}
                                    isOpen={
                                        this.state.activeDeletePopover ===
                                        itm.id
                                    }
                                >
                                    <PopoverBody web_monitor_id={itm.id}>
                                        Are you sure you want to remove "{itm.labelText || itm.label}"?.
                                    </PopoverBody>
                                    <button
                                        onClick={() => this.deleteKeyword(itm.id)}
                                        key={itm.id}
                                        user_data_source_id={itm.id}
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
                            </>)
                        })}
                    </div>
                </div>
            </>

        )
    }


}
