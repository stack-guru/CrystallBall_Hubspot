import React from "react";
import Creatable, { makeCreatableSelect } from 'react-select/creatable';
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable';

import HttpClient from "./HttpClient";

export default class LocationSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            locations: [],
            selected_option: {
                label: '',
                value: ''
            }
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.loadOptions = this.loadOptions.bind(this)
        this.filterLocations = this.filterLocations.bind(this)
    }

    componentDidMount() {
        this.setState({isBusy: true})
        HttpClient.get(`/get-locations-list`)
            .then(response => {
                this.setState({isBusy: false, locations: response.data.locations});
                this.setState({
                    'selected_option': response.data.selected_location
                });
            }, (err) => {
                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {

            this.setState({isBusy: false, errors: err});
        });
    }

    onChangeHandler(sOption) {
        // update in the parent component state
        this.props.onChangeCallback(sOption);
        // // update in the selected ui
        this.setState({
            selected_option: sOption
        })
    }

    filterLocations(inputValue) {
        return this.state.locations.filter((i) =>
            i.label.toLowerCase().includes(inputValue.toLowerCase())
        );    
        
    };

    loadOptions(input, loadCallback) {
        if (input.length > 2) {

            HttpClient.get(`/search-locations-list?search_str=` + input)
                .then(response => {
                    this.setState({
                        locations: response.data.locations
                    });
                    loadCallback(this.filterLocations(input));
                }, (err) => {
                    this.setState({ errors: (err.response).data });
                }).catch(err => {
                    this.setState({ errors: err });
                });
        }
        
        // setTimeout(() => {
        //     // search options
        //     loadCallback(this.filterLocations(input));
        // }, 1500);
        // if input size is minimum of 3 characters
        // if (input.length >= 3) {
        //     setTimeout(() => {
        //         // search options
        //         loadCallback(this.filterLocations(input));
        //     }, 1500);
        // }

        // else {
        //     return this.state.locations.filter((i) =>
        //         i.label.toLowerCase().includes(input.toLowerCase())
        //     );    
        // }
        
    }
    
    render() {
        return (
            <AsyncSelect
                cacheOptions
                defaultOptions={this.state.locations}
                value={this.state.selected_option}
                className="gray_clr w-100"
                loadOptions={this.loadOptions}
                isMulti={this.props.multiple}
                onChange={this.onChangeHandler}
            />
            // <CreatableSelect
            //     name={this.props.name}
            //     disabled={this.props.disabled}
            //     value={this.state.selected_option}
            //     id={this.props.id}
            //     isMulti={this.props.multiple}
            //     onChange={this.onChangeHandler}
            //     className="gray_clr w-100"
            //     options={this.state.locations}
            //     placeholder={this.props.placeholder}
            // >
            // </CreatableSelect>
        )
    }


}
