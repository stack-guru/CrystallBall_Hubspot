import React from "react";
import HttpClient from "./HttpClient";
import SearchEngineSelect from "./SearchEngineSelect";
import LocationSelect from "./LocationSelect";
import AnnotationCategorySelect from "./AnnotationCategorySelect";
import { saveStateToLocalStorage } from "../helpers/CommonFunctions";

export default class AddKeyword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            url: "",
            search_engines: [],
            keywords: [],
            locations: [],
            lang: "en",
            ranking_direction: "",
            ranking_places: "",
            tracking_of: "",
            is_url_competitors: "",
            available_credits: 0,
            total_credits: 0,
        };

        this.addKeyword = this.addKeyword.bind(this);
        this.deleteKeyword = this.deleteKeyword.bind(this);
        this.saveKeywords = this.saveKeywords.bind(this);

        this.changeSearchEngineHandler =
            this.changeSearchEngineHandler.bind(this);
        this.changeLocationHandler = this.changeLocationHandler.bind(this);

        this.canAddMoreConfigurations =
            this.canAddMoreConfigurations.bind(this);

        this.updateAvailableCredits = this.updateAvailableCredits.bind(this);
    }

    componentDidMount() {
        this.setState({
            available_credits:
                this.props.total_credits - this.props.used_credits,
                total_credits: this.props.total_credits - this.props.used_credits
        });
    }

    addKeyword(e) {
        if (e.keyCode == 13) {
            if (
                this.canAddMoreConfigurations(
                    this.state.keywords.length,
                    this.state.locations.length,
                    this.state.search_engines.length
                )
            ) {
                let keywords_new = this.state.keywords;
                keywords_new.push({
                    id: "",
                    keyword: e.target.value,
                });
                this.setState({
                    keywords: keywords_new,
                });
                this.updateAvailableCredits(keywords_new.length, this.state.locations.length, this.state.search_engines.length);
                document.getElementById("tracking_keywords").value = "";
            }
            else {
                alert("credit limit reached");
            }
        }
    }

    canAddMoreConfigurations(
        total_keywords,
        total_locations,
        total_search_engines
    ) {
        if (total_keywords == 0) {
            total_keywords = 1;
        }

        if (total_locations == 0) {
            total_locations = 1;
        }

        if (total_search_engines == 0) {
            total_search_engines = 1;
        }

        if (
            this.state.total_credits >
            total_keywords * total_locations * total_search_engines
        ) {
            return true;
        } else {
            return false;
        }
    }

    updateAvailableCredits(total_keywords, total_locations, total_search_engines) {

        if (total_keywords == 0) {
            total_keywords = 1;
        }

        if (total_locations == 0) {
            total_locations = 1;
        }

        if (total_search_engines == 0) {
            total_search_engines = 1;
        }

        let new_available_credits = this.state.total_credits - (total_keywords * total_locations * total_search_engines);

        this.setState({
            available_credits: new_available_credits,
        });

    }

    saveKeywords() {
        this.setState({ isBusy: true, errors: "" });
        let params = {
            url: this.state.url,
            search_engine: this.state.search_engines,
            keywords: this.state.keywords,
            location: this.state.locations,
            lang: this.state.lang,
            ranking_direction: this.state.ranking_direction,
            ranking_places: this.state.ranking_places,
            is_url_competitors: this.state.is_url_competitors,
        };
        HttpClient.post("/data-source/save-keyword-tracking-keywords", params)
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
                        title: "Stored successfully!",
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
    }

    changeSearchEngineHandler(search_engines) {
        if (
            this.canAddMoreConfigurations(
                this.state.keywords.length,
                this.state.locations.length,
                search_engines.length
            )
        ) {
            this.setState({
                search_engines: search_engines,
            });
            this.updateAvailableCredits(this.state.keywords.length, this.state.locations.length, search_engines.length);
            return true;
        } else {
            alert("limit reached");
            return false;
        }
    }

    changeLocationHandler(selectedLocations) {
        if (
            this.canAddMoreConfigurations(
                this.state.keywords.length,
                selectedLocations.length,
                this.state.search_engines.length
            )
        ) {
            this.setState({
                locations: selectedLocations,
            });
            this.updateAvailableCredits(this.state.keywords.length, selectedLocations.length, this.state.search_engines.length);
            return true;
        } else {
            alert("limit reached");
            return false;
        }
    }

    deleteKeyword(e) {
        let keywords_existing = this.state.keywords;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        let new_keywords_array = keywords_existing.filter(
            (keyword) => keyword.keyword != e.target.dataset.keyword
        );
        this.setState({
            keywords: new_keywords_array,
        });
        Toast.fire({
            icon: "success",
            title: "Deleted successfully!",
        });

        this.updateAvailableCredits(new_keywords_array.length, this.state.locations.length, this.state.search_engines.length);
    }

    render() {
        return (
            <div className="switch-wrapper">
                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">Manage keywords</h4>
                    <label>Tracking</label>
                    <div className="input-group mb-3">
                        <select
                            className="form-control"
                            id="tracking_of"
                            onChange={(e) => {
                                this.setState({
                                    is_url_competitors:
                                        e.target.options[e.target.selectedIndex]
                                            .value,
                                });
                            }}
                        >
                            <option selected disabled>
                                --Select--
                            </option>
                            <option value="false">My website</option>
                            <option value="true">Competitor's website</option>
                        </select>
                    </div>
                    <label>Website URL</label>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="your-company-domain.com"
                            name="url"
                            id="url"
                            onChange={(e) => {
                                this.setState({ url: e.target.value });
                            }}
                        />
                    </div>
                    <label>Keywords</label>
                    <div className="input-group mb-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add keywords"
                            name="keywords"
                            id="tracking_keywords"
                            onKeyUp={(e) => {
                                this.addKeyword(e);
                            }}
                        />
                        <div className="input-group-append">
                            <i className="ti-plus"></i>
                        </div>
                    </div>
                    <div className="mb-3">
                        {this.state.keywords.length > 0
                            ? this.state.keywords.map((keyword, index) => {
                                  return (
                                      <h5
                                          style={{ display: "inline-block" }}
                                          key={
                                              keyword.id != ""
                                                  ? keyword.id
                                                  : index
                                          }
                                      >
                                          <span class="badge badge-pill badge-primary m-1 h5">
                                              {keyword.keyword}{" "}
                                              <i
                                                  className="fa fa-times"
                                                  data-keyword={keyword.keyword}
                                                  data-keyword_id={keyword.id}
                                                  onClick={(e) => {
                                                      this.deleteKeyword(e);
                                                  }}
                                              ></i>
                                          </span>
                                      </h5>
                                  );
                              })
                            : ""}
                    </div>
                    <label>Search Engine</label>
                    <div className="input-group mb-3">
                        <SearchEngineSelect
                            className="gray_clr"
                            name="search_engine"
                            id="search_engine"
                            selected={{
                                label: '',
                                value: ''
                            }}
                            onChangeCallback={this.changeSearchEngineHandler}
                            placeholder="Select Search Engine"
                            multiple="true"
                        />
                    </div>
                    <label>Location</label>
                    <div className="input-group mb-3">
                        <LocationSelect
                            className="gray_clr"
                            name="country"
                            id="country"
                            selected={{
                                label: '',
                                value: ''
                            }}
                            onChangeCallback={this.changeLocationHandler}
                            placeholder="Select Location"
                            multiple="true"
                        />

                        {/* <select className='form-control' id="country" onChange={(e) => { this.setState({ country: e.target.options[e.target.selectedIndex].value }) }}>
                            <option selected disabled>Select Country</option>
                            <option value='2840'>USA</option>
                        </select> */}
                    </div>
                    <div className="mt-3">
                        <label className="font-weight-bold">
                            Threashold to create annotation:
                        </label>
                        <br />
                        If ranking change
                        <select
                            className="form-control my-2"
                            id="ranking_direction"
                            onChange={(e) => {
                                this.setState({
                                    ranking_direction:
                                        e.target.options[e.target.selectedIndex]
                                            .value,
                                });
                            }}
                        >
                            <option value="up">Up</option>
                            <option value="down" selected>
                                Down
                            </option>
                        </select>
                        Places
                        <input
                            className="form-control"
                            id="ranking_places"
                            placeholder="Places"
                            type="number"
                            min="0"
                            onChange={(e) => {
                                this.setState({
                                    ranking_places: e.target.value,
                                });
                            }}
                        />
                        in search result, create annotation
                    </div>
                    <div className="my-1">
                        <strong>
                            Available Credits: {this.state.available_credits}
                        </strong>
                    </div>
                    <div className="mt-4">
                        <button
                            className="btn btn-success"
                            onClick={this.saveKeywords}
                        >
                            Save
                        </button>
                    </div>
                    <div className="checkbox-box mt-3">
                        {/* {
                            this.props.ds_data.map(gAK => {
                                return (
                                    <button type="button" className="btn gaa-btn-primary m-2" key={gAK.id}
                                        user_data_source_id={gAK.id}
                                        onClick={this.deleteKeyword}
                                    >
                                        {gAK.value} <span className="badge badge-light" user_data_source_id={gAK.id}>&times;</span>
                                    </button>
                                )
                            })
                        } */}
                    </div>
                </div>
            </div>
        );
    }
}
