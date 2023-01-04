import React from "react";
import UserAnnotationColorPicker from "../../../helpers/UserAnnotationColorPickerComponent";

class ModalHeader extends React.Component {
    render() {
        return (
            <div className="apps-modalHead">
                <div className="d-flex justify-content-start align-items-center">
                    <h2>{this.props.serviceName}</h2>
                    <UserAnnotationColorPicker
                        name={this.props.colorKeyName}
                        value={
                            this.props.userAnnotationColors[
                                this.props.colorKeyName
                            ]
                        }
                        updateCallback={this.props.updateUserAnnotationColors}
                    />
                    <label className="trigger switch">
                        <input
                            type="checkbox"
                            name={this.props.dsKeyName}
                            onChange={this.props.serviceStatusHandler}
                            checked={
                                this.props.userServices[this.props.dsKeyName]
                            }
                        />
                        <span className={`slider round`} />
                    </label>

                    {this.props.creditString ? (
                        <span className="text-credits">
                            Credits: <span>{this.props.creditString}</span>
                        </span>
                    ) : null}
                </div>
                <span onClick={this.props.closeModal} className="btn-close">
                    <img
                        className="inject-me"
                        src="/close-icon.svg"
                        width="26"
                        height="26"
                        alt="menu icon"
                    />
                </span>
            </div>
        );
    }
}

export default ModalHeader;
