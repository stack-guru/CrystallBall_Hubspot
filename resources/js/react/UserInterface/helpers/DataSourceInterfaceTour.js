import React, { Component } from 'react'
import Tour from 'reactour'
import { Redirect } from "react-router-dom";
import HttpClient from "../utils/HttpClient";

const steps = [
    {
        position: 'top',
        content: 'Welcome! Take this quick tour to understand automation',
        redirectRoute: null,
        style: {
            padding: '60px'
        }
    },
    {
        position: 'right',
        selector: '#web-monitoring-data-source-section',
        content: 'Downtime happens even to the best of us. But it’s important to know it before customers are affected and also keep annotations on your reports. Add your website URL; we will monitor it every 1 minute.',
        redirectRoute: null
    },
    {
        position: 'right',
        selector: '#news-alerts-data-source-section',
        content: <p><strong>News Alerts</strong> Is a content change detection on the web. GAannotations add annotations that match the user's search terms, such as web pages, newspaper articles, blogs, or scientific research. Add keywords like https://www.your-domain.com/, Company Name. The system will search for news once a day at midnight. Annotations for News Alerts will start showing after 48 hours the automation is activated.</p>,
        redirectRoute: null
    },
    {
        position: 'bottom',
        selector: '#google-updates-data-source-section',
        content: "Most of these Google updates are so slight that they go completely unnoticed. However, on occasion, the search engine rolls out major algorithmic updates that significantly impact the Search Engine Results Pages",
        redirectRoute: null
    },
    {
        position: 'right',
        selector: '#retail-marketing-dates-data-source-section',
        content: "If you run an ecommerce business, you know the drill: Having a promotional calendar for marketing and shopping events is key to deliver on your sales targets. Add automated annotations to see how affected your site.",
        redirectRoute: null
    },
    {
        position: 'right',
        selector: '#holidays-data-source-section',
        content: "How Christmas Day affect your sells? Add automatic annotations for the Holidays of any country",
        redirectRoute: null
    },
    {
        position: 'right',
        selector: '#weather-alerts-data-source-section',
        content: <p><strong>Weather</strong> disrupts the operating and financial performance of 70% of businesses worldwide. Add automated annotations for the location you operate</p>,
        redirectRoute: null,
        style: {
            width: '50%', height: 'auto', maxWidth: '677px', top: '25px'
        }
    },
    {
        position: 'right',
        selector: '#wordpress-updates-data-source-section',
        content: <p><strong>WordPress Core Updates</strong> Our automated annotation feature will inform you when a new version, Security, or Maintenance Release of WordPress is available.</p>,
        redirectRoute: null
    }

];

export default class DataSourceInterfaceTour extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentStep: 0,
            redirectTo: null
        }

        this.handleRedirecter = this.handleRedirecter.bind(this)
    }

    componentDidMount() {
        if (this.props.isOpen) {
            HttpClient.put(`/data-source/mark-data-source-tour`, { data_source_tour_showed_at: true })
                .then(response => {
                }, (err) => {
                }).catch(err => {
                });
        }
    }

    handleRedirecter() {
        if (this.state.redirectTo !== null) {
            let rL = this.state.redirectTo
            this.setState({ redirectTo: null })
            return <Redirect to={rL} />
        }
    }

    render() {
        return (
            <>
                {this.handleRedirecter()}
                <Tour
                    getCurrentStep={cS => { if (this.state.currentStep !== cS) this.setState({ currentStep: cS, redirectTo: steps[cS].redirectRoute }) }}
                    steps={steps}
                    isOpen={this.props.isOpen}
                    onRequestClose={this.props.toggleShowTour}
                    closeWithMask={false}
                    lastStepNextButton={<button className="btn btn-primary" onClick={(e) => { this.props.toggleShowTour(); }}>Finish</button>}
                />
            </>
        )
    }

}

