import React, { Component } from 'react'

import HttpClient from './HttpClient'

import Select from 'react-select/async';

export default class GoogleAnalyticsPropertySelect extends Component {

    constructor(props) {
        super(props)
        this.searchSelectRef = React.createRef();
        this.searchSaleInvoice = this.searchSaleInvoice.bind(this);
    }

    componentDidMount(){
        this.searchSelectRef.current.focus();
    }

    searchSaleInvoice(keyword, callback) {
        if (keyword.length > 3) {
            HttpClient.get('/api/search/sale-invoice?keyword=' + keyword)
                .then((response) => {
                    let sis = response.data.data;
                    let options = sis.map(si => { return { value: si.id, label: 'Comp. # ' + si.id + ' Inv. # ' + si.company_v_no + ' @ ' + si.sale_date }; });
                    callback(options);
                });
        } else { callback([]); }
    }

    render() {
        let sVal = {};
        if (this.props.value !== undefined) {
            sVal = this.props.value;
        } else {
            sVal = null;
        }


        return (
            <Select
            ref={this.searchSelectRef}
                onChange={(si, action) => {

                    (this.props.callback)(si);
                }}
                isSearchable={true}
                placeholder={this.props.placeholder}
                loadOptions={this.searchSaleInvoice}
                noOptionsMessage={() => { return "4+ chars to search" }}
                value={sVal}
                isClearable={this.props.isClearable}
            />
        )
    }
}
