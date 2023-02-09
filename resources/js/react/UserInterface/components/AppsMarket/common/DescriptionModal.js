import React from "react";

class DescrptionModal extends React.Component {
    constructor(props) {
        super(props);
    }

    showConfirm = () => {

        if( this.props.userAccountsExists ) {
            this.props.changeModal()
            return;
        }

        const _this = this;
        this.props.closeModal();
        swal.fire({
            iconHtml: `<img src="/${ this.props.serviceName }-small.svg">`,
            showCloseButton: true,
            title: `Connect with ${ this.props.serviceName }`,
            text: `Connect your ${ this.props.serviceName } account to create automatic annotations for commits`,
            confirmButtonClass: "rounded-pill btn btn-primary bg-primary px-4 font-weight-bold",
            confirmButtonText: `<span class='text-white'><i class='mr-2 fa fa-${ this.props.serviceName.toLowerCase() }'> </i>Connect Github Account</span>`,
            customClass: {
                htmlContainer: "py-3",
            },
            customClass: {
                popup: "popupAlert",
                closeButton: "closeButtonTwitterAlert",
            },
        }).then( result => {
            if( result.isConfirmed ) {
                location.href = `/socialite/${ this.props.serviceName.toLowerCase() }`;
                localStorage.setItem("repo", this.props.serviceName);
            }
        });
    }

    render() {
        return (
            <>
                <div className="apps-modalHead d-flex justify-content-between align-items-center flex-row">
                    <h2><span style={{'color': '#096db7'}}>{this.props.serviceName} Tracking:</span> &nbsp; How it works?</h2>
                    <span onClick={this.props.closeModal} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon"/></span>
                </div>

                <div className="apps-bodyContent overflow-hidden mb-0" style={{'color': '#666'}}><p className="mb-0">{this.props.description}</p></div>

                <div className="apps-modalFoot d-flex flex-column">
                    <span onClick={ this.showConfirm.bind(this) }>
                        <span>Automate {this.props.serviceName}</span>
                        <img className="ml-2 inject-me" src="/icon-green.svg" width="26" height="26" alt="icon"/>
                    </span>
                </div>
            </>
        );
    }
}

export default DescrptionModal;
