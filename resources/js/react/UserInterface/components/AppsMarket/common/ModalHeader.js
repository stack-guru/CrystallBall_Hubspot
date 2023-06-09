import React from "react";
import UserAnnotationColorPicker from "../../../helpers/UserAnnotationColorPickerComponent";

class ModalHeader extends React.Component {
    render() {
        return (
            <div className="apps-modalHead">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex justify-content-start align-items-center">
                        <h2>{this.props.serviceName}</h2>
                        {this.props.userAnnotationColors ? <UserAnnotationColorPicker
                            name={this.props.colorKeyName}
                            value={
                                this.props.userAnnotationColors[
                                this.props.colorKeyName
                                ]
                            }
                            updateCallback={this.props.updateUserAnnotationColors}
                        /> : null}
                        {this.props.dsKeyName ? <label className="trigger switch">
                            <input
                                type="checkbox"
                                name={this.props.dsKeyName}
                                onChange={this.props.serviceStatusHandler}
                                checked={
                                    this.props.userServices[this.props.dsKeyName] || this.props.isActiveTracking || this.props.userServices?.user?.[this.props.dsKeyName]
                                }
                            />
                            <span className={`slider round`} />
                        </label> : null}

                        {this.props.creditString ? (
                            <span className="text-credits">
                                Credits: <span>{this.props.creditString}</span>
                            </span>
                        ) : null}
                    </div>
                    {this.props.downloadButton ?
                        <div className="d-flex align-items-center">
                            <a href="/csv/upload_sample.csv" target="_blank" download={true} className="btn-cancel mr-5">
                                <i className="mr-2"><img src="/icon-download.svg"/></i>
                                <span>Download Sample</span>
                            </a>
                            {this.props.closeModal ? <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" /></span> : null}
                        </div>
                    :
                        <>
                            {this.props.closeModal ? <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon" /></span> : null}
                        </>
                    }
                </div>
                {this.props.description ? <p className="mb-0 pt-3">{this.props.description}</p> : null}
            </div>
        );
    }
}

export default ModalHeader;
