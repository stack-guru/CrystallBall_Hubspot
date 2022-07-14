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
        };

        this.updateKeyword = this.updateKeyword.bind(this);
        this.getKeywordDetails = this.getKeywordDetails.bind(this);

    }

    componentDidMount() {
        this.getKeywordDetails()
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
                    ranking_places: resp.data.ranking_places,
                    is_url_competitors: resp.data.is_url_competitors,
                });

                console.log(resp.data.is_url_competitors);

                if (resp.data.is_url_competitors == 1) {
                    document.getElementById('tracking_of').options[select.selectedIndex].value = 'true'
                }
                else if(resp.data.is_url_competitors == 0) {
                    document.getElementById('tracking_of').options[select.selectedIndex].value = 'false'
                }


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
            lang: this.state.lang,
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
                    </div>
                    <label>Keywords</label>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Keyword"
                            value=""
                            name="keyword"
                            id="keyword"
                            disabled
                        />
                        <div className="input-group-append">
                            <i className="ti-plus"></i>
                        </div>
                    </div>
                    <label>Search Engine</label>
                    <div className="input-group mb-3">
                        <SearchEngineSelect
                            className="gray_clr"
                            name="search_engine"
                            id="search_engine"
                            onChangeCallback={{}}
                            placeholder="Select Search Engine"
                        />
                    </div>
                    <label>Location</label>
                    <div className="input-group mb-3">
                        <LocationSelect
                            className="gray_clr"
                            name="country"
                            id="country"
                            onChangeCallback={{}}
                            placeholder="Select Location"
                        />
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
                            onClick={this.updateKeyword}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
