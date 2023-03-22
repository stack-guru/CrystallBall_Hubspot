import React from 'react'
import HttpClient from '../utils/HttpClient'
import Toast from "../utils/Toast";
import ErrorAlert from '../utils/ErrorAlert';
import {
    loadStateFromLocalStorage,
    saveStateToLocalStorage,
    removeStateFromLocalStorage
} from '../helpers/CommonFunctions';
import {Redirect} from 'react-router';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input} from 'reactstrap';


function isValidUrl(url) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // Protocol (both http and https)
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR an IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
        '(\\#[-a-z\\d_]*)?$',
        'i'
    );
    return !!pattern.test(url);
}
export default class AddWebsiteModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                password: '',
                password_confirmation: '',
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false,
            redirectTo: null,
        };
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.changeHandler = this.changeHandler.bind(this)

    }

    componentDidMount() {
        document.title = 'Add New Password'
        setTimeout(() => {
            this.setState(loadStateFromLocalStorage("AddNewPasswordModal"));
        }, 1000);
    }

    setDefaultState() {
        this.setState({
            user: {
                name: '',
                password: '',
                password_confirmation: '',
            },
            validation: {},
            resp: '',
            error: '',
            isBusy: false,
            isDirty: false,
            errors: undefined
        });
    }

    submitHandler(e) {
        e.preventDefault();

        if (this.validate() && !this.state.isBusy) {
            this.setState({isBusy: true, errors: ''});
            HttpClient.put('/settings/update-user', {
                ...this.props.user, website: this.state.user.website, timezone: this.props.user.timezone || 'America/New_York'
            }).then(resp => {
                this.props.reloadUser();
            }, (err) => {

                this.setState({isBusy: false, errors: (err.response).data});
            }).catch(err => {
                this.setState({isBusy: false, errors: err});
            })
        }

    }

    changeHandler(e) {
        switch (e.target.name) {
            default:
                this.setState({isDirty: true, user: {...this.state.user, [e.target.name]: e.target.value}},
                    () => {
                        setTimeout(() => {
                            saveStateToLocalStorage("AddNewPasswordModal", {user: this.state.user});
                        }, 500);
                    });
                break;
        }
    }

    validate() {
        let website = this.state.user.website;
        let errors = {};
        let isValid = true;

        if (!website) {
            isValid = false;
            errors["website"] = "Please enter your website.";
        }

        if (!errors["website"] && !isValidUrl(website)) {
            isValid = false;
            errors["website"] = "Please enter valid website.";
        }

        this.setState({
            validation: errors
        });

        return isValid;
    }

    render() {
        if (!this.props.show) return null;
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>

        const validation = this.state.validation;

        return (
            <Modal className={`apps-modal md`} isOpen={this.props.show}>
                <ModalBody>
                    <div className="popupContent modal-setupNewPassword mx-5">
                        <div className='mt-4 text-center'>
                            <h3 style={{color: "#2A74E7", fontWeight: "bolder"}}>Welcome to Crystal Ball</h3>
                            <p className='mt-4'>To provide the best user experience, please let us know the
                                URL of you business or organization:</p>
                        </div>
                        <form onSubmit={this.submitHandler} id="add-new-password-form">
                            <ErrorAlert errors={this.state.errors}/>
                            <div className="themeNewInputStyle mb-4 pb-2">
                                <div className="themeNewInputStyle position-relative inputWithIcon mb-3">
                                    <i className='fa'><img src='/icon-chain-gray.svg'/></i>
                                    <Input type='url' className="form-control" name='website'
                                           placeholder='https://your-company.com' onChange={this.changeHandler}
                                           value={this.state.website}/>
                                </div>
                                {validation.website ? <span
                                    className="bmd-help text-danger"> &nbsp; &nbsp;{validation.website}</span> : ''}
                            </div>

                            <div className='mt-4 text-center'>
                                <button type="submit" className="btn-theme" title="submit">Continue</button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}
