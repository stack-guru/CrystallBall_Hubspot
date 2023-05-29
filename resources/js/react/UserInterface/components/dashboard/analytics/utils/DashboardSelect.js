import React from "react";
import Creatable, {makeCreatableSelect} from 'react-select/creatable';
import CreatableSelect from 'react-select/creatable';


export default class DashboardSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            creatableValue: ''
        }

        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.handleCreateOption = this.handleCreateOption.bind(this)
    }


    componentDidMount() {

    }

    onChangeHandler(sOption) {
        this.props.onChangeCallback({target: {name: this.props.name, value: sOption.value}});
    }

    handleCreateOption() {
        if (this.state.creatableValue) {
            this.props.onChangeCallback({target: {name: this.props.name, value: this.state.creatableValue}});
        }
    }

    render() {
        return (
            <CreatableSelect
                name={this.props.name}
                disabled={this.props.disabled}
                value={this.props.value ? {label: this.props.value, value: this.props.value} : []}
                id={this.props.id}
                onChange={this.onChangeHandler}
                className="gray_clr"
                options={[...this.props.dashboard_activities, ...(this.state.creatableValue ? [{
                    label: `${this.state.creatableValue}`,
                    value: this.state.creatableValue
                }] : [])]}
                placeholder={this.props.placeholder || 'Dashboard *'}
                onInputChange={(newValue) => this.setState({creatableValue: newValue})}
                onBlur={this.handleCreateOption}
            >
            </CreatableSelect>
        )
    }


}
