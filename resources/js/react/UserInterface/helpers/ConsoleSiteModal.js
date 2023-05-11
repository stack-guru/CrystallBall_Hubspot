import React, {Component} from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Toast from "../utils/Toast";


import HttpClient from '../utils/HttpClient';



export default class ConsoleSiteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            googleAnalyticsProperties: [],
            googleSearchConsoleSites: [],
            user: props.user,
            isPermissionPopupOpened: false,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.getGAProperties = this.getGAProperties.bind(this);
        this.getGSCSites = this.getGSCSites.bind(this);
    }

    componentDidMount() {
        this.getGAProperties();
        this.getGSCSites();
    }


    toggleModal() {
        removeStateFromLocalStorage("ConsoleSiteModal");
        this.props.togglePopup('');
    }


    getGAProperties() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-analytics-property`).then(response => {
            this.setState({isBusy: false, googleAnalyticsProperties: response.data.google_analytics_properties})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }
    getGSCSites() {
        this.setState({isBusy: true});
        return HttpClient.get(`/settings/google-search-console-site`).then(response => {
            this.setState({isBusy: false, googleSearchConsoleSites: response.data.google_search_console_sites})
            return true;
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
            return false;
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
            return false;
        });
    }
    
    handleGAPUpdate(gAP, data) {
        this.setState({isBusy: true});
        HttpClient.put(`/settings/google-analytics-property/${gAP.id}`, data).then(resp => {
            const updatedGAP = resp.data.google_analytics_property;
            Toast.fire({
                icon: 'success',
                title: "Google Analytics Property updated."
            });
            this.setState({
                isBusy: false,
                googleAnalyticsProperties: this.state.googleAnalyticsProperties.map(g => g.id == updatedGAP.id ? updatedGAP : g)
            });
        }, (err) => {
            this.setState({isBusy: false, errors: (err.response).data});
        }).catch(err => {
            this.setState({isBusy: false, errors: err});
        });
    }
    render() {
        // let modalBodyFooter = [<div className="d-flex">
        //     <ModalBody className='p-6 contentArea GAandSearchConsole flex-grow-1'>
        //         <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
        //             <h2>Connect GA & Search Console</h2>
        //         </div>
        //         <div className='connectGAandSearchConsole d-flex flex-column'>
        //             <p className='m-0'>Please select URLs for each property</p>
        //             <div className='dataTableAnalyticsAccount'>
        //                 {this.state.googleAnalyticsProperties.map(gAP => {
        //                     return (
        //                         <div className='d-flex flex-column' key={gAP.id}>
        //                             <div className='d-flex justify-content-start analyticTopBar'>
        //                                 <div className='d-flex align-items-center pr-3'>
        //                                     <span className='pr-2'><img src="/icon-g.svg"/></span>
        //                                     <span>{
        //                                                 (gAP.google_analytics_account) ?
        //                                                     gAP.google_analytics_account.name :
        //                                                     ''
        //                                             }
        //                                     </span>
        //                                     {
        //                                         gAP.is_in_use ?
        //                                             <em className='tag-inuse'><i className='fa fa-check'></i><i>In
        //                                                 use</i></em> :
        //                                             null
        //                                     }
        //                                 </div>
        //                                 <div className='d-flex align-items-center'>
        //                                     <span className='pr-2'><img src="/icon-bars.svg"/></span>
        //                                     <span>{
        //                                         gAP.google_account ?
        //                                             gAP.google_account.name :
        //                                             null
        //                                     }</span>
        //                                 </div>
        //                             </div>
        //                             <div className='grid2layout'>
        //                                 <div className='w-100 d-flex justify-content-between align-items-center'>
        //                                     <span>{gAP.name}</span>
        //                                     <span>{gAP.google_search_console_site_id ?<img src={'/icon-link-green.svg'} /> :  <img src={'/icon-unlink-red.svg'} />}</span>
        //                                 </div>
        //                                 <div className="singleCol text-left d-flex flex-column">
        //                                     <div className="themeNewInputStyle position-relative w-100">
        //                                         <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
        //                                         <select name=""  value={gAP.google_search_console_site_id} className={`form-control ${gAP.google_search_console_site_id ? 'selected' : null}`} onChange={(event) => this.handleGAPUpdate(gAP, { google_search_console_site_id: event.target.value })}>
        //                                             <option value="">Select website</option>
        //                                             {
        //                                                 this.state.googleSearchConsoleSites.map(gSCS => <option value={gSCS.id} key={gSCS.id}>{gSCS.site_url} from {gSCS.google_account.name}</option>)
        //                                             }
        //                                         </select>
        //                                         <i className="btn-searchIcon left-0 fa fa-check-circle"></i>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     )
        //                 })}
        //             </div>
        //         </div>
        //         <div className='popupBtnBox d-flex justify-content-between align-items-center'>
        //             <Button onClick={() => {
        //                 this.toggleModal()
        //             }} className="btn-cancel">Close</Button>
        //         </div>
        //     </ModalBody>
        // </div>];
        return (
            <Modal className={`apps-modal lg`} isOpen={this.props.isOpen} >
                <ModalBody>
                    <div className='titleAndCloseButton d-flex justify-content-between align-items-center'>
                        <h2>Connect GA & Search Console</h2>
                    </div>
                    <div className='connectGAandSearchConsole d-flex flex-column'>
                        <p className='m-0'>Please select URLs for each property</p>
                        <div className='dataTableAnalyticsAccount'>
                            {this.state.googleAnalyticsProperties.map(gAP => {
                                return (
                                    <div className='d-flex flex-column' key={gAP.id}>
                                        <div className='d-flex justify-content-start analyticTopBar'>
                                            <div className='d-flex align-items-center pr-3'>
                                                <span className='pr-2'><img src="/icon-g.svg"/></span>
                                                <span>{
                                                            (gAP.google_analytics_account) ?
                                                                gAP.google_analytics_account.name :
                                                                ''
                                                        }
                                                </span>
                                                {
                                                    gAP.is_in_use ?
                                                        <em className='tag-inuse'><i className='fa fa-check'></i><i>In
                                                            use</i></em> :
                                                        null
                                                }
                                            </div>
                                            <div className='d-flex align-items-center'>
                                                <span className='pr-2'><img src="/icon-bars.svg"/></span>
                                                <span>{
                                                    gAP.google_account ?
                                                        gAP.google_account.name :
                                                        null
                                                }</span>
                                            </div>
                                        </div>
                                        <div className='grid2layout'>
                                            <div className='w-100 d-flex justify-content-between align-items-center'>
                                                <span>{gAP.name}</span>
                                                <span>{gAP.google_search_console_site_id ?<img src={'/icon-link-green.svg'} /> :  <img src={'/icon-unlink-red.svg'} />}</span>
                                            </div>
                                            <div className="singleCol text-left d-flex flex-column">
                                                <div className="themeNewInputStyle position-relative w-100">
                                                    <i className="btn-searchIcon right-0 fa fa-angle-down"></i>
                                                    <select name=""  value={gAP.google_search_console_site_id} className={`form-control ${gAP.google_search_console_site_id ? 'selected' : null}`} onChange={(event) => this.handleGAPUpdate(gAP, { google_search_console_site_id: event.target.value })}>
                                                        <option value="">Select website</option>
                                                        {
                                                            this.state.googleSearchConsoleSites.map(gSCS => <option value={gSCS.id} key={gSCS.id}>{gSCS.site_url} from {gSCS.google_account.name}</option>)
                                                        }
                                                    </select>
                                                    <i className="btn-searchIcon left-0 fa fa-check-circle"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='popupBtnBox d-flex justify-content-between align-items-center'>
                        <Button onClick={() => {
                            this.toggleModal()
                        }} className="btn-cancel">Close</Button>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}
