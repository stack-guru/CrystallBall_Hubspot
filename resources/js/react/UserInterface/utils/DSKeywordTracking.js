import React from 'react';
import HttpClient from "./HttpClient";
import SearchEngineSelect from "./SearchEngineSelect";
import LocationSelect from "./LocationSelect";
import AnnotationCategorySelect from "./AnnotationCategorySelect";
import {saveStateToLocalStorage} from "../helpers/CommonFunctions";

export default class DSKeywordTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            url: '',
            search_engine: '',
            keywords: [],
            country: '',
            lang: '',
            ranking_direction: '',
            ranking_places: '',
            tracking_of: ''
        }

        this.addKeyword = this.addKeyword.bind(this)
        this.deleteKeyword = this.deleteKeyword.bind(this)
        this.saveKeywords = this.saveKeywords.bind(this)

        this.loadDFSKeywords = this.loadDFSKeywords.bind(this)
        this.changeSearchEngineHandler = this.changeSearchEngineHandler.bind(this)
        this.changeLocationHandler = this.changeLocationHandler.bind(this)

    }

    componentDidMount() {
        // this.loadDFSKeywords();
    }

    loadDFSKeywords() {
        this.setState({ isBusy: true, errors: '' });
        HttpClient.get(`/data-source/get-keyword-tracking-keywords`).then(resp => {
            this.setState({
                isLoading: false,
                url: resp.data.url,
                search_engine: resp.data.search_engine,
                keywords: resp.data.keywords ? resp.data.keywords : [],
                country: resp.data.location,
                lang: resp.data.lang,
                ranking_direction: resp.data.ranking_direction,
                ranking_places: resp.data.ranking_places,
                tracking_of: resp.data.is_competitor_url
            });
            this.state.tracking_of ? document.getElementById('tracking_of').value = this.state.tracking_of : '';
            this.state.url ? document.getElementById('url').value = this.state.url : '';
            this.state.lang ? document.getElementById('lang').value = this.state.lang : '';
            this.state.ranking_direction ? document.getElementById('ranking_direction').value = this.state.ranking_direction : '';
            this.state.ranking_places ? document.getElementById('ranking_places').value = this.state.ranking_places : '';
        }, (err) => {
            this.setState({ isLoading: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isLoading: false, errors: err });
        })
    }

    addKeyword(e) {
        if (e.keyCode == 13) {
            let keywords = this.state.keywords;
            if (keywords.length <= 9) {
                keywords.push({
                    id: '',
                    keyword: e.target.value,
                });
                this.setState({
                    keywords: keywords
                });
            }
            else {
                swal.fire('Maximum keywords limit is 10!', '', 'warning');
            }
            document.getElementById('tracking_keywords').value = '';
        }
    }

    saveKeywords() {
        this.setState({ isBusy: true, errors: '' });
        let params = {
            url: this.state.url,
            search_engine: this.state.search_engine,
            keywords: this.state.keywords,
            location: this.state.country,
            lang: this.state.lang,
            ranking_direction: this.state.ranking_direction,
            ranking_places: this.state.ranking_places
        };
        HttpClient.post('/data-source/save-keyword-tracking-keywords', params).then(resp => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            Toast.fire({
                icon: 'success',
                title: 'Stored successfully!'
            })
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    changeSearchEngineHandler(val) {
        this.setState({
            search_engine: val
        })
    }

    changeLocationHandler(val) {
        this.setState({
            country: val
        })
    }

    deleteKeyword(e) {
        let keywords_existing = this.state.keywords;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if (e.target.dataset.keyword_id) {
            let params = {
                keyword_id: e.target.dataset.keyword_id
            }
            HttpClient.post('/data-source/delete-keyword-tracking-keyword', params).then(resp => {
                Toast.fire({
                    icon: 'success',
                    title: 'Deleted successfully!'
                })
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
            let new_keywords_array = keywords_existing.filter(keyword => keyword.id != e.target.dataset.keyword_id);
            this.setState({
                keywords: new_keywords_array
            })
        }
        else {
            let new_keywords_array = keywords_existing.filter(keyword => keyword.keyword != e.target.dataset.keyword);
            this.setState({
                keywords: new_keywords_array
            })
            Toast.fire({
                icon: 'success',
                title: 'Deleted successfully!'
            })
        }
    }

    render() {

        return (
            <div className="switch-wrapper">

                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">
                        Manage keywords
                    </h4>
                    <label>Tracking</label>
                    <div className="input-group mb-3">
                        <select className='form-control' id="tracking_of">
                            <option selected disabled>--Select--</option>
                            <option value='true'>My website</option>
                            <option value='false'>Competitor's website</option>
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
                                val = val.split(' ').join('');
                                val = val.replace('/', '');
                                val = val.replace('www.', '');
                                val = val.replace('https://', '');
                                val = val.replace('http://', '');
                                e.target.value = val;
                                this.setState({ url: val });
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
                            id='tracking_keywords'
                            onKeyUp={(e) => { this.addKeyword(e) }}
                        />
                        <div className="input-group-append">
                            <i className="ti-plus"></i>
                        </div>
                    </div>
                    <div className='mb-3'>
                        {
                            (this.state.keywords.length > 0) ?
                                this.state.keywords.map((keyword, index) => {
                                    return <h5 style={{ display: 'inline-block' }} key={(keyword.id != '') ? keyword.id : index}><span class="badge badge-pill badge-primary m-1 h5">{keyword.keyword} <i className='fa fa-times' data-keyword={keyword.keyword} data-keyword_id={keyword.id} onClick={(e) => { this.deleteKeyword(e) }}></i></span></h5>
                                })
                                : ''
                        }
                    </div>
                    <label>Search Engine</label>
                    <div className="input-group mb-3">
                        <SearchEngineSelect className="gray_clr" name="search_engine" id="search_engine" value={this.state.search_engine} onChangeCallback={this.changeSearchEngineHandler} placeholder="Select Search Engine" />
                    </div>
                    <label>Location</label>
                    <div className="input-group mb-3">
                        <LocationSelect className="gray_clr" name="country" id="country" value={this.state.country} onChangeCallback={this.changeLocationHandler} placeholder="Select Location" />

                        {/* <select className='form-control' id="country" onChange={(e) => { this.setState({ country: e.target.options[e.target.selectedIndex].value }) }}>
                            <option selected disabled>Select Country</option>
                            <option value='2840'>USA</option>
                        </select> */}
                    </div>
                    <label>Language</label>
                    <div className="input-group mb-3">
                        <select className='form-control' id="lang" onChange={(e) => { this.setState({ lang: e.target.options[e.target.selectedIndex].value }) }}>
                            <option selected disabled>Select Language</option>
                            <option value='en'>English</option>
                        </select>
                    </div>
                    <div className='mt-3'>
                        <label className='font-weight-bold'>Threashold to create annotation:</label>
                        <br />
                        If ranking change
                        <select className='form-control my-2' id="ranking_direction" onChange={(e) => { this.setState({ ranking_direction: e.target.options[e.target.selectedIndex].value }) }}>
                            <option value="up">Up</option>
                            <option value="down" selected>Down</option>
                        </select>
                        Places
                        <input className='form-control' id="ranking_places" placeholder='Places' type='number' min='0' onChange={(e) => { this.setState({ ranking_places: e.target.value }) }} />
                        in search result, create annotation
                    </div>
                    <div className='mt-4'>
                        <button className='btn btn-success' onClick={this.saveKeywords}>Save</button>
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
