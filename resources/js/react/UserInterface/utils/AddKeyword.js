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
        if (document.getElementById("tracking_keywords").value) {
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
                    keyword: document.getElementById("tracking_keywords").value,
                });
                this.setState({
                    keywords: keywords_new,
                });
                this.updateAvailableCredits(keywords_new.length, this.state.locations.length, this.state.search_engines.length);
                document.getElementById("tracking_keywords").value = "";
            }
            else {
                this.props.upgradePopupForRankingTracking();
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
        this.addKeyword();
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
                    this.props.updateTrackingStatus(true);
                    this.props.updateUserService({ target: {
                            name: "is_ds_keyword_tracking_enabled",
                            checked: true,
                        }, 
                    });
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
                },
                (err) => {
                    this.setState({ isBusy: false, errors: err.response.data });
                }
            )
            .catch((err) => {
                this.setState({ isBusy: false, errors: err });
            });
        this.props.onAddCallback();
        this.props.loadKeywordsCallback();
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
            this.props.upgradePopupForRankingTracking();
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
            this.props.upgradePopupForRankingTracking();
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
            <>
                <h4>Add tracker</h4>
                <div className="grid2layout">
                    {/* <div className="my-1"><strong>Available Credits: {this.state.available_credits}</strong></div> */}
                    <div className="themeNewInputGroup themeNewselect flex-column">
                        <select className="form-control" id="tracking_of" onChange={(e) => {this.setState({is_url_competitors:e.target.options[e.target.selectedIndex].value,});}}>
                            <option selected disabled>Select tracking website</option>
                            <option value="false">My website</option>
                            <option value="true">Competitor's website</option>
                        </select>
                    </div>

                    <div className="themeNewInputGroup inputWithIcon position-relative">
                        <input type="text" className="form-control" placeholder="your-company-domain.com" name="url" id="url" onChange={(e) => {this.setState({ url: e.target.value });}}/>
                        <i className="fa fa-link"></i>
                    </div>
                    <div className="themeNewInputGroup">
                        <LocationSelect className="gray_clr" name="country" id="country" selected={{label: '', value: ''}} onChangeCallback={this.changeLocationHandler} placeholder="Locations" multiple="true"/>

                        {/* <select className='form-control' id="country" onChange={(e) => { this.setState({ country: e.target.options[e.target.selectedIndex].value }) }}>
                            <option selected disabled>Select Country</option>
                            <option value='2840'>USA</option>
                        </select> */}
                    </div>


                    <div className="themeNewInputGroup themeNewselect">
                        <SearchEngineSelect className="gray_clr" name="search_engine" id="search_engine" selected={{label: '', value: ''}} onChangeCallback={this.changeSearchEngineHandler} placeholder="Select search engines" multiple="true"/>
                    </div>
                    <div className="themeNewInputGroup">
                        <input type="text" className="form-control" placeholder="Add keywords" name="keywords" id="tracking_keywords"/>
                        <div className="input-group-append"><a onClick={(e) => {this.addKeyword(e);}} href="#"><i className="ti-plus"></i></a></div>

                        {this.state.keywords.length > 0 ?
                            <div className="keywordTags pt-3">
                                {this.state.keywords.length > 0 ? this.state.keywords.map((keyword, index) => {
                                    return (
                                            <button type="button" className="keywordTag" key={keyword.id != "" ? keyword.id : index} data-keyword={keyword.keyword} data-keyword_id={keyword.id} onClick={(e) => {this.deleteKeyword(e);}}>{keyword.keyword}</button>
                                    );})
                                    : ""
                                }
                            </div>
                        : null}
                    </div>

                </div>
                <div className="d-flex flex-column">
                    <h4>Threashold to create annotation:</h4>
                    <div className="grid2layout">
                        <div className="themeNewInputGroup themeNewselect flex-column">
                            <select className="form-control" id="ranking_direction" onChange={(e) => {this.setState({ranking_direction:e.target.options[e.target.selectedIndex].value,});}}>
                                <option value="" selected disabled>Ranking direction</option>
                                <option value="up">Up</option>
                                <option value="down">Down</option>
                            </select>
                        </div>

                        <div className="themeNewInputGroup">
                            <input className="form-control" id="ranking_places" placeholder="Places moved in search engine" type="number" min="0" onChange={(e) => {this.setState({ranking_places: e.target.value,});}}/>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <button className="btn-theme" onClick={this.saveKeywords}>Save</button>
                </div>
            </>
        );
    }
}
