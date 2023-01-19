import React from "react";

class DescrptionModalNormal extends React.Component {

    render() {
        return (
            <>
                <div className="apps-modalHead">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <h2><span style={{color: '#096DB7'}}>{this.props.serviceName}:</span> &nbsp; How it works?</h2>
                        </div>
                    </div>
                    <span onClick={this.props.closeModal} style={{position: "absolute", top: "40px", right: "30px"}} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon"/></span>
                </div>
                <div className="apps-bodyContent">
                    <div className='white-box'>
                        <span className="text-credits">{this.props.description}</span>
                    </div>
                    <div className="text-center">
                        <span className="text-credits text-info" style={{cursor: 'pointer'}} onClick={  this.props.changeModal} >Automate {this.props.serviceName}</span>
                    </div>
                </div>
            </>
        );
    }
}

export default DescrptionModalNormal;
