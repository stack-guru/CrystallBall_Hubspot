import React from "react";

class DescrptionModalNormal extends React.Component {

    render() {
        return (
            <>
                <div className="apps-modalHead d-flex justify-content-between align-items-center flex-row">
                    <h2><span style={{'color': '#096db7'}}>{this.props.serviceName}:</span> &nbsp; How it works?</h2>
                    <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon"/></span>
                </div>

                <div className="apps-bodyContent overflow-hidden mb-0" style={{'color': '#666'}}><p className="mb-0">{this.props.description}</p></div>

                <div className="apps-modalFoot d-flex flex-column">
                    <span onClick={  this.props.changeModal}>
                        <span>Automate {this.props.serviceName}</span>
                        <img className="ml-2 inject-me" src="/icon-green.svg" width="26" height="26" alt="icon"/>
                    </span>
                </div>
            </>
        );
    }
}

export default DescrptionModalNormal;
