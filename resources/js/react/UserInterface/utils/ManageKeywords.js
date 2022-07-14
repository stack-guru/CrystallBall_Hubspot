import React from 'react';
import HttpClient from "./HttpClient";

export default class ManageKeywords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: '',
            keywords: []
        }

        this.deleteKeyword = this.deleteKeyword.bind(this)
        this.editKeyword = this.editKeyword.bind(this)
        this.closePopup = this.closePopup.bind(this)

    }

    componentDidMount() {
        document.getElementById('manage_modal_btn').click();
    }

    deleteKeyword(e) {
        let keyword_configuration_id = e.target.dataset.configuration_id;
        let keyword_id = e.target.dataset.keyword_id;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if (id) {
            let params = {
                keyword_configuration_id: keyword_configuration_id,
                keyword_id: keyword_id
            }
            HttpClient.post('/data-source/delete-keyword-tracking-keyword', params).then(resp => {
                Toast.fire({
                    icon: 'success',
                    title: 'Deleted successfully!'
                })
                this.props.loadKeywordsCallback();
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
        }
    }

    editKeyword(e) {
        let keyword_id = e.target.dataset.keyword_id;
        let keyword_configuration_id = e.target.dataset.configuration_id;
        document.getElementById('close_popup').click();

        this.props.editKeywordCallback(keyword_id, keyword_configuration_id);
    }

    closePopup(){
        this.props.closeManageKeywordPopup()
    }

    render() {
        const keywords = this.props.keywords.map(function(keyword_instance, index){
            return keyword_instance.configurations.map(function(configuration_instance){
                return <tr className='border-bottom border-top py-2'>
                    <td className='text-left'>
                        <span className=''>{ keyword_instance.keyword }</span>
                    </td>
                    <td className='text-left'>
                        <span className=''>{ configuration_instance.url }</span>
                    </td>
                    <td className='text-left'>
                        <span className=''>{ configuration_instance.search_engine }</span>
                    </td>
                    <td className='text-left'>
                        <span className=''>{ configuration_instance.location_code }</span>
                    </td>
                    <td className='text-left'>
                        <span className=''>{ configuration_instance.language }</span>
                    </td>
                    <td className='text-right'>
                        <a href='#' onClick={this.editKeyword} data-configuration_id={configuration_instance.id} data-keyword_id={keyword_instance.id} className='btn btn-sm btn-primary text-white mr-1'>Edit</a>
                        <a href='#' onClick={this.deleteKeyword} data-configuration_id={configuration_instance.id} data-keyword_id={keyword_instance.id} className='btn btn-sm btn-danger text-white'>Delete</a>
                    </td>
                </tr>; 
            }, this)
            
        }, this);
        return (
            <div>
                <button id='manage_modal_btn' style={{ display: "none"}} type="button" class="btn btn-primary" data-toggle="modal" data-target="#manage_modal"></button>
                <div class="modal fade" id="manage_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog modal-lg modal-dialog-centered"  role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Manage Keywords</h5>
                                <button type="button" id='close_popup' class="close" data-dismiss="modal" aria-label="Close" onClick={this.closePopup}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body" style={{ overflow: 'scroll' }}>
                                <h6 className="">
                                    Edit or Delete Keywords
                                </h6>
                                <div className="p-4" >
                                    <table className='table table-responsive'>
                                        <thead>
                                            <tr>
                                                <th width="10%" className='text-left'>Keyword</th>
                                                <th width="35%" className='text-left'>URL</th>
                                                <th width="15%" className='text-left'>Search Engine</th>
                                                <th width="10%" className='text-left'>Location</th>
                                                <th width="10%" className='text-left'>Language</th>
                                                <th width="20%" className='text-right'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { keywords }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal" aria-label="Close" onClick={this.closePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        );
    }
}
