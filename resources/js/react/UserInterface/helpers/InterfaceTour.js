import React, { Component } from 'react'
import Tour from 'reactour'
import { Redirect } from "react-router-dom";

const steps = [
    // 1
    {
        position: 'top',
        content: 'Welcome! Take this quick tour',
        redirectRoute: null,
        style: {
            padding: '60px'
        }
    },
    // 2
    {
        position: 'top',
        selector: '#chrome-extension-download-button',
        content: <div>Make sure to add the extension, pin it and to log in.<br />
            <img src="/images/walkthrough_step6.gif" width="100%" height="auto" />
        </div>,
        redirectRoute: null,
        style: {
            width: '75%', height: 'auto', maxWidth: '677px', top: '25px'
        }
    },
    // 3
    {
        position: 'top',
        content: <div>We added a Sample Annotation to show you how it looks like, once you go to <a href="https://analytics.google.com/analytics/web/#/" target="_blank">Google Analytics</a>
            <img src="/images/walkthrough_step7.gif" width="100%" height="auto" />
        </div>,
        redirectRoute: null,
        style: {
            width: '50%', height: 'auto', maxWidth: '677px', top: '25px'
        }
    },
    // 4
    {
        position: 'bottom',
        selector: '#annotation-index-container',
        content: 'Here you can see and manage all your annotations',
        redirectRoute: '/annotation'
    },
    // 5
    {
        position: 'right',
        selector: '#data-source-page-container',
        content: 'Automate annotations for Weather Alerts, Holidays, Google Updates, WordPress Updates, Website Monitoring, News Alerts, and Retail Marketing Dates.',
        redirectRoute: '/data-source'
    },
    // 6
    {
        position: 'bottom',
        selector: '#integration-page-top-options',
        content: "Automate annotations from your Ad Platforms, Newsletters, Slack and more",
        redirectRoute: '/integrations'
    },
    // 7
    {
        position: 'bottom',
        selector: '#csv-upload-form-container',
        content: 'If you already have a list of annotations, you can bulk upload them here',
        redirectRoute: '/annotation/upload'
    },
];

export default class InterfaceTour extends Component {
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
            let bodyElement = document.getElementsByTagName('body')[0];
            if (!bodyElement.classList.contains('is-collapsed')) {
                bodyElement.classList.add('is-collapsed')
            }
        }
    }

    handleRedirecter() {
        if (this.state.redirectTo !== null) {
            let rL = this.state.redirectTo
            // this.setState({ redirectTo: null })
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
                    onRequestClose={() => this.props.toggleShowTour(false)}
                    closeWithMask={false}
                    lastStepNextButton={<button className="btn gaa-btn-primary" onClick={(e) => { this.setState({ redirectTo: '/annotation' }); (this.props.toggleShowTour)(false); }}>Finish</button>}
                />
            </>
        )
    }

}

