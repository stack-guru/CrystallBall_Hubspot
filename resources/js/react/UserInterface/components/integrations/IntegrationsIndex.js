import React from 'react';
import { Link } from 'react-router-dom'
import VideoModalBox from '../../utils/VideoModalBox';

export default class IntegrationsIndex extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "Integrations";
    }

    render() {
        return (
            <div className="container-xl bg-white d-flex flex-column justify-content-center component-wrapper data-source-container pt-0">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="heading-section gaa-title">
                            Integrations
                            <Link to="/my-integrations" className="btn gaa-btn-primary float-right">My Integrations</Link>
                        </h2>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-0" id="integration-page-container">
                    <div className="col-12">
                        <div id="integration-page-top-options">
                            <zapier-app-directory
                                app="crystal-ball"
                                link-target="same-tab"
                                theme="light"
                                introcopy="hide"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
