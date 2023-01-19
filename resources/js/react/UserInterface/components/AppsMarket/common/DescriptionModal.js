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
                <div className="apps-modalHead">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <h2><span style={{color: '#096DB7'}}>{this.props.serviceName} Tracking:</span> &nbsp; How it works?</h2>
                        </div>
                    </div>
                    <span onClick={this.props.closeModal} style={{position: "absolute", top: "40px", right: "30px"}} className="btn-close"><img className="inject-me" src="/close-icon.svg" width="26" height="26" alt="menu icon"/></span>
                </div>
                <div className="apps-bodyContent">
                    <div className='white-box'>
                        <span className="text-credits">{this.props.description}</span>
                    </div>
                    <div className="text-center">
                        <span className="text-credits text-info" style={{cursor: 'pointer'}} onClick={ this.showConfirm.bind(this) } >Automate {this.props.serviceName}</span>
                    </div>
                </div>
            </>
        );
    }
}

export default DescrptionModal;