import React from 'react';

export default class DSOWMEventsSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weather_alert_events: [
                'Clear',
                'Clouds',
                'Drizzle',
                'Dust',
                'Fog',
                'Haze',
                'Mist',
                'Rain',
                'Sand',
                'Smoke',
                'Snow',
            ],
            isBusy: false,
            errors: '',
        }

        this.handleClick = this.handleClick.bind(this)
        this.selectAllShowing = this.selectAllShowing.bind(this);
        this.clearAll = this.clearAll.bind(this);

    }

    handleClick(e) {
        if (e.target.checked) {
            (this.props.onCheckCallback)({ code: 'open_weather_map_events', name: 'OpenWeatherMapEvent', country_name: null, retail_marketing_id: null, open_weather_map_event: e.target.getAttribute('open_weather_map_event') })
        } else {
            (this.props.onUncheckCallback)(e.target.id, 'open_weather_map_events')
        }
    }

    selectAllShowing(e) {
        let userOWMEvents = this.props.ds_data.map(ds => ds.open_weather_map_events);
        this.state.weather_alert_events.map(owmEvent => {
            if (userOWMEvents.indexOf(owmEvent) == -1) {
                (this.props.onCheckCallback)({ code: 'open_weather_map_events', name: 'OpenWeatherMapEvent', country_name: null, open_weather_map_event: owmEvent })
            }
        })
    }

    clearAll(e) {
        let userOWMEvents = this.props.ds_data.map(ds => ds.open_weather_map_event);
        let userDSEvents = this.props.ds_data.map(ds => ds.id);
        userOWMEvents.map((owmEvent,index) => {
            (this.props.onUncheckCallback)(userDSEvents[index], 'open_weather_map_events')
        })
    }

    render() {
        let userOWMEvents = this.props.ds_data.map(ds => ds.open_weather_map_event);
        let userDSEvents = this.props.ds_data.map(ds => ds.id);

        return (
            <div className="weather_alert_cities-form">
                <h4 className="gaa-text-primary">
                    Select Weather Events
                </h4>
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
                        this.state.weather_alert_events.map(wAE => {
                            return <div className="form-check wAE" key={wAE}>
                                <input
                                    className="form-check-input"
                                    checked={userOWMEvents.indexOf(wAE) !== -1}
                                    type="checkbox"
                                    id={userOWMEvents.indexOf(wAE) !== -1 ? userDSEvents[userOWMEvents.indexOf(wAE)] : null}
                                    onChange={this.handleClick}
                                    open_weather_map_event={wAE}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="defaultCheck1"
                                >
                                    {wAE}
                                </label>
                            </div>
                        })
                    }
                </div>
            </div>
        );
    }
}
