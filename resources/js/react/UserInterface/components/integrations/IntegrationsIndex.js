import React from 'react';
import VideoModalBox from '../../utils/VideoModalBox';

export default class integrationsIndex extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "Integrations";
    }

    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper data-source-container">
                <div className="row ml-0 mr-0">
                    <div className="col-12">
                        <h2 className="heading-section gaa-title">Integrations</h2>
                    </div>
                </div>
                <div className="row ml-0 mr-0 mt-5" id="integration-page-container">
                    <div className="col-12">
                        <div id="integration-page-top-options">
                            <zapier-app-directory
                                app="crystal-ball"
                                link-target="new-tab"
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
