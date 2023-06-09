import React from "react";
import HttpClient from "./HttpClient";
import SearchEngineSelect from "./SearchEngineSelect";
import LocationSelect from "./LocationSelect";
import AnnotationCategorySelect from "./AnnotationCategorySelect";
import { saveStateToLocalStorage } from "../helpers/CommonFunctions";

export default class EditKeyword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            keyword_id: '',
            keyword_configuration_id: '',
            url: "",
            search_engine: '',
            keyword: '',
            location: '',
            location_name: '',
            lang: "",
            ranking_direction: "",
            ranking_places: "",
            tracking_of: "",
            is_url_competitors: "",
            show_async_selects: false,
            available_credits: '',
        };

        this.updateKeyword = this.updateKeyword.bind(this);
        this.getKeywordDetails = this.getKeywordDetails.bind(this);
        this.locationChangeCallback = this.locationChangeCallback.bind(this);
        this.searchEngineChangeCallback = this.searchEngineChangeCallback.bind(this);

    }

    componentDidMount() {
        this.getKeywordDetails()
        this.setState({
            available_credits:
                this.props.total_credits - this.props.used_credits,
                total_credits: this.props.total_credits - this.props.used_credits
        });
    }

    getKeywordDetails() {
        let params = {
            keyword_id: this.props.keyword_id,
            keyword_configuration_id: this.props.keyword_configuration_id,
        };

        HttpClient.post("/data-source/get-keyword-details-for-keyword-tracking", params)
        .then(
            (resp) => {
                this.setState({
                    keyword_id: resp.data.keyword_id,
                    keyword_configuration_id: resp.data.keyword_configuration_id,
                    url: resp.data.url,
                    search_engine: resp.data.search_engine,
                    keyword: resp.data.keyword,
                    location: resp.data.location,
                    location_name: resp.data.location_name,
                    lang: resp.data.language,
                    ranking_direction: resp.data.ranking_direction,
                    ranking_places: resp.data.ranking_places_changed,
                    is_url_competitors: resp.data.is_url_competitors,
                });

                if (resp.data.is_url_competitors == 1) {
                    document.getElementById('tracking_of').value = 'true'
                }
                else if(resp.data.is_url_competitors == 0) {
                    document.getElementById('tracking_of').value = 'false'
                }

                document.getElementById('url').value = resp.data.url
                document.getElementById('ranking_direction').value = resp.data.ranking_direction
                document.getElementById('ranking_places').value = resp.data.ranking_places_changed

                // show locations select and search engine select, when data is loaded
                this.setState({
                    show_async_selects: true
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

    updateKeyword() {
        this.setState({ isBusy: true, errors: "" });
        let params = {
            keyword_id: this.props.keyword_id,
            keyword_configuration_id: this.props.keyword_configuration_id,
            url: this.state.url,
            search_engine: this.state.search_engine,
            keyword: this.state.keyword,
            location: this.state.location,
            ranking_direction: this.state.ranking_direction,
            ranking_places: this.state.ranking_places,
            is_url_competitors: this.state.is_url_competitors,
        };
        HttpClient.post("/data-source/update-keyword-tracking-keyword", params)
            .then(
                (resp) => {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener(
                                "mouseenter",
                                Swal.stopTimer
                            );
                            toast.addEventListener(
                                "mouseleave",
                                Swal.resumeTimer
                            );
                        },
                    });

                    Toast.fire({
                        icon: "success",
                        title: "Updated successfully!",
                    });
                    this.props.onAddCallback();
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
            this.props.addKeywordCallback();
    }

    locationChangeCallback(option) {
        this.setState({
            location_name: option.label,
            location: option.value
        })

        return true
        
    }

    searchEngineChangeCallback(option) {
        this.setState({
            search_engine: option.value
        })
        return true;
    }

    render() {
        return (
            <div className="apps-bodyContent switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Manage tracker</h4>
                    <label>Tracking</label>
                    <div className="grid2layout">
                        <div className="themeNewInputGroup themeNewselect flex-column">
                            <select className="form-control" id="tracking_of" 
                                    onChange={(e) => {
                                        this.setState({ is_url_competitors: e.target.value });
                                    }}
                                >
                                <option selected disabled>Select tracking website</option>
                                <option value="false">My website</option>
                                <option value="true">Competitor's website</option>
                            </select>
                        </div>
                        <div className="themeNewInputGroup inputWithIcon position-relative">
                            <input type="text" className="form-control" placeholder="your-company-domain.com" name="url" id="url"  
                                onChange={(e) => {
                                    let val = e.target.value;
                                    val = val.split(" ").join("");
                                    val = val.replace("/", "");
                                    val = val.replace("www.", "");
                                    val = val.replace("https://", "");
                                    val = val.replace("http://", "");
                                    e.target.value = val;
                                    this.setState({ url: val });
                                }}
                            />
                            <i className="fa fa-link"></i>
                        </div>
                        <div className="themeNewInputGroup"> 
                            {
                            this.state.show_async_selects ? 
                                <LocationSelect
                                    className="gray_clr"
                                    name="country"
                                    id="country"
                                    onChangeCallback={ this.locationChangeCallback }
                                    selected={{
                                        label: this.state.location_name,
                                        value: this.state.location
                                    }}
                                    placeholder="Locations"
                                />
                                : null
                            }
                        </div>
                        <div className="themeNewInputGroup themeNewselect">
                            {
                            this.state.show_async_selects ? 
                                <SearchEngineSelect
                                    className="gray_clr"
                                    name="search_engine"
                                    id="search_engine"
                                    selected={{
                                        label: this.state.search_engine.charAt(0).toUpperCase() + this.state.search_engine.slice(1),
                                        value: this.state.search_engine
                                    }}
                                    onChangeCallback={this.searchEngineChangeCallback}
                                    placeholder="Select Search Engine"
                                />
                                : null
                            }
                        </div>
                        <div className="themeNewInputGroup">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Keyword"
                                value=""
                                name="keyword"
                                id="keyword"
                                disabled
                                onChange={(e) => {
                                    this.setState({ keyword: e.target.value });
                                }}
                            />
                            <div className="input-group-append">
                                <i className="ti-plus"></i>
                            </div>
                            {/* {this.state.keywords.length > 0 ?
                                <div className="keywordTags pt-3">
                                    {this.state.keywords.length > 0 ? this.state.keywords.map((keyword, index) => {
                                        return (
                                                <button type="button" className="keywordTag" key={keyword.id != "" ? keyword.id : index} data-keyword={keyword.keyword} data-keyword_id={keyword.id} onClick={(e) => {this.deleteKeyword(e);}}>{keyword.keyword}</button>
                                        );})
                                        : ""
                                    }
                                </div>
                            : null} */}
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <h4>Threashold to create annotation:</h4>
                        <div className="grid2layout">
                            <div className="themeNewInputGroup themeNewselect flex-column">
                                <select
                                    className="form-control"
                                    id="ranking_direction"
                                    onChange={(e) => {
                                        this.setState({ ranking_direction: e.target.value });
                                    }}
                                >
                                    <option value="up">Up</option>
                                    <option value="down" selected>
                                        Down
                                    </option>
                                </select>
                            </div>

                            <div className="themeNewInputGroup">
                                    <input
                                        className="form-control"
                                        id="ranking_places"
                                        placeholder="Places moved in search engine"
                                        type="number"
                                        min="0"
                                        onChange={(e) => {
                                            this.setState({ ranking_places: e.target.value });
                                        }}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="my-1">
                        <strong>
                            Available Credits: {this.state.available_credits}
                        </strong>
                    </div>
                    <div className="mt-4">
                        <button
                            className="btn btn-success"
                            onClick={this.updateKeyword}
                        >
                            Update
                        </button>
                        <button
                            className="btn btn-danger ml-2"
                            onClick={this.props.addKeywordCallback}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
