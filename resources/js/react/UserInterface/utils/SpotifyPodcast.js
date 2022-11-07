import React from "react";
import HttpClient from "../utils/HttpClient";

export default class SpotifyPodcast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spotify_category_list: [],
            spotify_eventName_list: [],
            spotify_event_description: [],
            spotify_url: [],
            isBusy: false,
            errors: "",
            searchCategory: "",
            searchEvent: "",
            searchDescription: "",
            spotifyUrl: "",
        };

        this.handleDateTime = this.handleDateTime.bind(this);
        this.selectedCategoryChanged = this.selectedCategoryChanged.bind(this);
        this.selectedDescriptionChange = this.selectedDescriptionChange.bind(this);
        this.selectedEventChaged = this.selectedEventChaged.bind(this);
        this.handleClick = this.handleClick.bind(this);
}

    componentDidMount() {
        if (!this.state.isBusy) {
            this.setState({ isBusy: true });
            HttpClient.get("data-source/spotify-podcast/")
                .then(
                    (resp) => {
                        this.setState({
                            isBusy: false,
                            spotify_eventName_list: resp.data.countries,
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

    // Data and Time Handler
    handleDateTime(e) {
        e.target.value;
        const datePicker = document.getElementById("datePicker");
        datePicker.datetimepicker();
    }

    //Category Change
    selectedCategoryChanged(e) {
        this.setState({ [e.target.name]: e.target.value });
        HttpClient.get(`data-source/spotify-podcast/category`)
            .then(
                (res) => {
                    this.setState({
                        isBusy: false,
                        spotify_category_list: res.data.state,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    //Event Change
    selectedEventChaged(e) {
        this.setState({ [e.target.name]: e.target.value });
        HttpClient.get(``)
            .then(
                (res) => {
                    this.setState({
                        isBusy: false,
                        spotify_eventName_list: res.data.state,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
    }

    //Description Change
    selectedDescriptionChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        HttpClient.get(``)
            .then(
                (res) => {
                    this.setState({
                        isBack: false,
                        spotify_event_description: res.data.state,
                    });
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, erros: err });
            });
    }

//Toggle Change Handler
handleClick(e) {
    if (e.target.checked) {
        this.props.onCheckCallback({
            code: "spotify_podcast_event",
            name: "OpenSpotifyPodcast",
            country_name: null,
            retail_marketing_id: null,
            open_weather_map_city_id: e.target.getAttribute(
                "spotify_podcast_event"
            ),
        });
    } else {
        this.props.onUncheckCallback(
            e.target.id,
            "spotify_podcast_event"
        );
    }
}


    render() {
        let userOWMCIds = this.props.ds_data.map((ds) =>
            parseInt(ds.open_weather_map_city_id)
        );
        let userDSIds = this.props.ds_data.map((ds) => ds.id);

        return (
            <div className="switch-wrapper">
                <div className="spotify_event_form">
                    <h4 className="gaa-text-primary">Select Spotify Events</h4>

                    {/* Spotify Category Select Start */}
                    <div className="input-group mb-3">
                        <select
                            className="form-control"
                            placeholder="Search"
                            value={this.state.searchCategory}
                            name="searchCategory"
                            defaultValue={"default"}
                            onChange={this.selectedCategoryChanged}
                        >
                            <option value={"default"}></option>
                        </select>
                    </div>
                    {/* Spotify Category Select END */}

                    {/* Spotify Event Name Start */}

                    <div className="input-group mb-3">
                        <select
                            className="form-control"
                            placeholder="Please select event name"
                            value={this.state.searchEvent}
                            name="searchEvent"
                            defaultValue={"default"}
                            onChange={this.selectedEventChaged}
                        >
                          <option value={"default"}></option>
                        </select>
                    </div>

                    {/* Spotify Event Name End */}

                    {/* Spotify Event Descripion Start */}
                    <div className="input-group mb-3">
                        <select
                            className="form-control"
                            placeholder="Please select description"
                            value={this.state.searchDescription}
                            name="searchDescription"
                            defaultValue={"default"}
                            onChange={this.selectedDescriptionChange}
                        >
                            <option value={"default"}>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                        </select>
                    </div>
                    {/* Spotify Event Description End */}

                    {/* Spotify Event URL Start */}
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="https://www.your-domain.com/"
                            name="spotifyUrl"
                            id="url"
                            onChange={(e) => {
                                let val = e.target.value;
                                val = val.split(" ").join("");
                                val = val.replace("/", "");
                                val = val.replace("www.", "");
                                val = val.replace("https://", "");
                                val = val.replace("http://", "");
                                e.target.value = val;
                                this.setState({ spotifyUrl: val });
                            }}
                        />
                    </div>
                    {/* Spotify Event URL End */}

                    {/* Spotify Event Data and Time Start */}

                    <div className="input-group" id="datePicker">
                        <input
                            type="date"
                            className="form-control search-input"
                            onChange={this.handleDateTime}
                        />
                    </div>
                    {/* Spotify Event Data and Time End */}
                    
                    <div className="checkbox-box mt-3">
                        {
                            this.state.spotify_category_list.filter(this.checkSearchText).map(wAC => {
                                return <div className="form-check wac" key={wAC.id}>
                                    <input
                                        className="form-check-input"
                                        checked={userOWMCIds.indexOf(wAC.id) !== -1}
                                        type="checkbox"
                                        id={userOWMCIds.indexOf(wAC.id) !== -1 ? userDSIds[userOWMCIds.indexOf(wAC.id)] : null}
                                        onChange={this.handleClick}
                                        open_weather_map_city_id={wAC.id}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="defaultCheck1"
                                    >
                                        {wAC.name}
                                    </label>
                                </div>
                            })
                        }
                    </div>

                    {/* <div className="d-flex justify-content-between align-items-center border-bottom">
                        <div>
                            <p
                                className="font-weight-bold cursor m-0"
                                onClick={this.clearAll}
                            >
                                Clear All
                            </p>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}


// selectAllShowing(e) {
//     let userOWMCityIds = this.props.ds_data.map(
//         (ds) => ds.open_weather_map_city_id
//     );
//     this.state.weather_alerts_cities.map((owmCity) => {
//         if (userOWMCityIds.indexOf(owmCity.id) == -1) {
//             this.props.onCheckCallback({
//                 code: "open_weather_map_cities",
//                 name: "OpenWeatherMapCity",
//                 country_name: null,
//                 open_weather_map_city_id: owmCity.id,
//             });
//         }
//     });
// }

// selectedCountryChanged(e) {
//     this.setState({ [e.target.name]: e.target.value });
//     HttpClient.get(
//         `data-source/weather-alert/city?country_code=${e.target.value}`
//     )
//         .then(
//             (resp) => {
//                 this.setState({
//                     isBusy: false,
//                     weather_alerts_cities: resp.data.cities,
//                 });
//             },
//             (err) => {
//                 this.setState({ isBusy: false, errors: err.response.data });
//             }
//         )
//         .catch((err) => {
//             this.setState({ isBusy: false, errors: err });
//         });
// }

// checkSearchText(city) {
//     if (this.state.searchText.length) {
//         if (
//             city.name
//                 .toLowerCase()
//                 .indexOf(this.state.searchText.toLowerCase()) > -1
//         ) {
//             return true;
//         }
//         return false;
//     }
//     return true;
// }

// clearAll(e) {
//     let userOWMCityIds = this.props.ds_data.map(
//         (ds) => ds.open_weather_map_city_id
//     );
//     let userDSEvents = this.props.ds_data.map((ds) => ds.id);
//     userOWMCityIds.map((owmEvent, index) => {
//         this.props.onUncheckCallback(
//             userDSEvents[index],
//             "open_weather_map_cities"
//         );
//     });
// }
