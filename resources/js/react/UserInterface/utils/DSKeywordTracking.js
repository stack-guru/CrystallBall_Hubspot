import React from 'react';
import HttpClient from "./HttpClient";

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
            position_changed_places: ''
        }

        this.addKeyword = this.addKeyword.bind(this)
        this.deleteKeyword = this.deleteKeyword.bind(this)
        this.saveKeywords = this.saveKeywords.bind(this)

        this.loadDFSKeywords = this.loadDFSKeywords.bind(this)

    }

    componentDidMount() {
        this.loadDFSKeywords();
    }

    loadDFSKeywords() {
        this.setState({ isBusy: true, errors: '' });
        HttpClient.get(`/data-source/get-dfs-keywords`).then(resp => {
            this.setState({
                isLoading: false,
                url: resp.data.meta.url,
                search_engine: resp.data.meta.search_engine,
                keywords: resp.data.meta.keywords,
                country: resp.data.meta.country,
                lang: resp.data.meta.lang,
                ranking_direction: resp.data.meta.ranking_direction,
                position_changed_places: resp.data.meta.position_changed_places,
            });
            document.getElementById('url').value = resp.data.meta.url;
            document.getElementById('search_engine').value = resp.data.meta.search_engine;
            document.getElementById('country').value = resp.data.meta.country;
            document.getElementById('lang').value = resp.data.meta.lang;
            document.getElementById('ranking_direction').value = resp.data.meta.ranking_direction;
            document.getElementById('position_changed_places').value = resp.data.meta.position_changed_places;
        }, (err) => {
            this.setState({ isLoading: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isLoading: false, errors: err });
        })
    }

    addKeyword(e) {
        if (e.keyCode == 13) {
            let keywords_existing = this.state.keywords;
            if (keywords_existing.length <= 9) {
                // if a keyword already exists than do not add it
                if (!keywords_existing.includes(e.target.value)) {
                    keywords_existing.push(e.target.value); // existing plus new
                    this.setState({
                        keywords: keywords_existing
                    });
                }
            }
            else {
                swal.fire('Maximum keywords limit is 10!', '', 'warning');
            }
            document.getElementById('tracking_keywords').value = '';
        }
    }

    saveKeywords() {
        this.setState({ isBusy: true, errors: '' });
        HttpClient.post('/data-source/save-dfs-keywords', this.state).then(resp => {
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    deleteKeyword(e) {
        let keywords_existing = this.state.keywords;
        if (keywords_existing.includes(e.target.dataset.keyword)) {
            let index = keywords_existing.indexOf(e.target.dataset.keyword);
            if (index > -1) {
                keywords_existing.splice(index, 1); // 2nd parameter means remove one item only
            }
            this.setState({
                keywords: keywords_existing
            });
        }
    }

    render() {

        return (
            <div className="switch-wrapper">

                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">
                        Manage keywords
                    </h4>
                    <div className="input-group  mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="https://your-company-domain"
                            name="url"
                            id="url"
                            onChange={(e) => this.setState({ url: e.target.value })}
                        />
                    </div>
                    <div className="input-group mb-1">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add keywords"
                            name="keywords"
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
                                    return <h5 style={{ display: 'inline-block' }}><span key={index} class="badge badge-pill badge-primary m-1 h5">{keyword} <i className='fa fa-times' data-keyword={keyword} onClick={(e) => { this.deleteKeyword(e) }}></i></span></h5>
                                })
                                : ''
                        }
                    </div>
                    <div className="input-group mb-3">
                        <select className='form-control' id="search_engine" onChange={(e) => { this.setState({ search_engine: e.target.options[e.target.selectedIndex].value}) }}>
                            <option selected disabled>Select Search Engine</option>
                            <option value='google'>Google</option>
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <select className='form-control' id="country" onChange={(e) => { this.setState({ country: e.target.options[e.target.selectedIndex].value }) }}>
                            <option selected disabled>Select Country</option>
                            <option value='usa'>USA</option>
                        </select>
                    </div>
                    <div className="input-group mb-3">
                        <select className='form-control' id="lang" onChange={(e) => { this.setState({ lang: e.target.options[e.target.selectedIndex].value }) }}>
                            <option selected disabled>Select Language</option>
                            <option value='en'>English</option>
                        </select>
                    </div>
                    <div className='mt-3'>
                        <label className='font-weight-bold'>Threashold to create annotation:</label>
                        <br />
                        If ranking change:
                        <select className='form-control' id="ranking_direction" onChange={(e) => { this.setState({ ranking_direction: e.target.options[e.target.selectedIndex].value }) }}>
                            <option value="up">Up</option>
                            <option value="down" selected>Down</option>
                        </select>
                        Places:
                        <input className='form-control' id="position_changed_places" placeholder='Places' type='number' min='0' onChange={(e) => { this.setState({ position_changed_places: e.target.value }) }} />
                        in search result, create annotation
                    </div>
                    <div className='mt-2'>
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
