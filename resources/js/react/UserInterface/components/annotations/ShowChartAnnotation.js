import React from 'react';
export default class ShowChartAnnotation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }


    }

    render() {
        return (
            <div className="popupContent modal-showChart">
                <div className="apps-modalHead"></div>
                <div className="apps-bodyContent"></div>
            </div>
        );
    }
}
