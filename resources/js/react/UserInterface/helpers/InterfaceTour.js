import React, { Component } from 'react'
import Tour from 'reactour'
import { Redirect } from "react-router-dom";

const steps = [
    // 1
    {
        position: 'top',
        content: <div className="tourPopupContent d-flex flex-column text-center firstPopUpContent"><h2>Take a small tour</h2><p>This way you can get basic understanding of Crystal Ball</p></div>,
        redirectRoute: null,
    },
    // 2
    {
        position: 'top',
        // selector: '#chrome-extension-download-button',
        content: <div className="tourPopupContent d-flex flex-column secoundPopUpContent"><h2>Make sure to add the extension, <a href='#'>pin it</a> and <a href='#'>log in</a> to get best experience</h2><figure><img src="/images/walkthrough_step6.gif"/></figure></div>,
        redirectRoute: null,
    },
    // 3
    {
        position: 'top',
        content: <div className="tourPopupContent d-flex flex-column thirdPopUpContent"><h2>We added a sample annotation to show you how it looks like once you go to <a href="https://analytics.google.com/analytics/web/#/" target="_blank">Google Analytics</a></h2><figure><img src="/images/walkthrough_step7.gif"/></figure></div>,
        redirectRoute: null,
    },
    // 4
    {
        position: 'bottom',
        selector: '#annotationPage',
        content: <div className="tourPopupContent d-flex flex-column fourthPopUpContent"><h2>On this page, you can manage all of your annotations.</h2></div>,
        redirectRoute: '/annotation'
    },
    // 5
    {
        position: 'right',
        selector: '#appMarket',
        content: <div className="tourPopupContent d-flex flex-column fifthPopUpContent"><p>Automate annotations for Weather Alerts, Holidays, Google Updates, WordPress Updates, Website Monitoring, News Alerts, and Retail Marketing Dates.</p></div>,
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
                    className='tourPopup'
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

