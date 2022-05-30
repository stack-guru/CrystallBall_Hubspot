import React from 'react';

export default class DSKeywordTracking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            url: '',
            keywords: [],
            country: '',
            lang: '',
            browser: '',
        }

        this.addKeyword = this.addKeyword.bind(this)
        this.deleteKeyword = this.deleteKeyword.bind(this)

    }

    addKeyword(e) {
        // this.setState({ keyword: '' });
        // (this.props.onCheckCallback)({ code: 'keyword_tracking', name: 'TrackingKeywords', country_name: null, retail_marketing_id: null, open_weather_map_event: null, value: e.target.getAttribute('value') })
    }

    deleteKeyword(e) {
        // (this.props.onUncheckCallback)(e.target.getAttribute('user_data_source_id'), 'google_alert_keywords')
    }

    render() {

        return (
            <div className="switch-wrapper">

                <div className="weather_alert_cities-form">
                    <h4 className="gaa-text-primary">
                        Manage keywords
                    </h4>
                    <div className="input-group search-input-box mb-3">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="https://your-company-domain"
                            value=""
                            name="url"
                        />
                    </div>
                    <div className="input-group search-input-box mb-3">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Add keywords"
                            value=""
                            name="keywords"
                        // onChange={(e) => this.setState({ [e.target.name]: e.target.value.toLowerCase() })}
                        // onKeyUp={(e) => { if (e.keyCode === 13) { e.persist(); this.addKeyword(e); } }}
                        />
                        <div className="input-group-append">
                            <i className="ti-plus"></i>
                        </div>
                    </div>
                    <div className="input-group search-input-box mb-3">
                        <select className='form-control'>
                            <option selected disabled>Select Country</option>
                            <option value='usa'>USA</option>
                            <option value='uk'>UK</option>
                            <option value='canda'>Canada</option>
                        </select>
                    </div>
                    <div className="input-group search-input-box mb-3">
                        <select className='form-control'>
                            <option selected disabled>Select Language</option>
                            <option value='en'>English</option>
                            <option value='french'>French</option>
                        </select>
                    </div>
                    <div className='mt-3'>
                        <label className='font-weight-bold'>Threashold to create annotation:</label>
                        <br />
                        If ranking change:
                        <select className='form-control'>
                            <option value="up">Up</option>
                            <option value="down" selected>Down</option>
                        </select>
                        Places:
                        <input className='form-control' placeholder='places' />
                        in search result, create annotation
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
