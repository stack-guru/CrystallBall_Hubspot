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

        this.loadDFSKeywords = this.loadDFSKeywords.bind(this)
        this.deleteKeyword = this.deleteKeyword.bind(this)
        this.closePopup = this.closePopup.bind(this)

    }

    componentDidMount() {
        document.getElementById('manage_modal_btn').click();
        this.loadDFSKeywords();
    }

    loadDFSKeywords() {
        this.setState({ isBusy: true, errors: '' });
        HttpClient.get(`/data-source/get-dfs-keywords`).then(resp => {
            this.setState({
                isLoading: false,
                keywords: resp.data.keywords ? resp.data.keywords : [],
            });
        }, (err) => {
            this.setState({ isLoading: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isLoading: false, errors: err });
        })
    }

    deleteKeyword(e) {
        let keywords_existing = this.state.keywords;
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
        if (e.target.dataset.keyword_id) {
            let params = {
                keyword_id: e.target.dataset.keyword_id
            }
            HttpClient.post('/data-source/delete-dfs-keyword', params).then(resp => {
                Toast.fire({
                    icon: 'success',
                    title: 'Deleted successfully!'
                })
            }, (err) => {
                this.setState({ isBusy: false, errors: (err.response).data });
            }).catch(err => {
                this.setState({ isBusy: false, errors: err });
            });
            let new_keywords_array = keywords_existing.filter(keyword => keyword.id != e.target.dataset.keyword_id);
            this.setState({
                keywords: new_keywords_array
            })
        }
        else {
            let new_keywords_array = keywords_existing.filter(keyword => keyword.keyword != e.target.dataset.keyword);
            this.setState({
                keywords: new_keywords_array
            })
            Toast.fire({
                icon: 'success',
                title: 'Deleted successfully!'
            })
        }
    }

    closePopup(){
        this.props.closeManageKeywordPopup()
    }

    render() {
        const keywords = this.state.keywords.map(function(keyword_instance, index){
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
                        <a href='#' className=' btn btn-sm btn-primary text-white  mr-1'>Edit</a>
                        <a href='#' className='  btn btn-sm btn-danger  text-white'>Delete</a>
                    </td>
                </tr>; 
            })
            
        });
        return (
            <div>
                <button id='manage_modal_btn' style={{ display: "none"}} type="button" class="btn btn-primary" data-toggle="modal" data-target="#manage_modal"></button>
                <div class="modal fade" id="manage_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                    <div class="modal-dialog modal-lg modal-dialog-centered"  role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Manage Keywords</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.closePopup}>
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
                                                <th className='text-left'>Keyword</th>
                                                <th className='text-left'>URL</th>
                                                <th className='text-left'>Search Engine</th>
                                                <th className='text-left'>Location</th>
                                                <th className='text-left'>Language</th>
                                                <th className='text-right'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { keywords }
                                            {/* {
                                                this.state.keywords.each(function(el){
                                                    return (
                                                        <tr className='border-bottom border-top py-2'>
                                                            <td className='text-left'>
                                                                <span className=''>Test keyword</span>
                                                            </td>
                                                            <td className='text-left'>
                                                                <span className=''>https://www.test.com</span>
                                                            </td>
                                                            <td className='text-left'>
                                                                <span className=''>Google</span>
                                                            </td>
                                                            <td className='text-left'>
                                                                <span className=''>United States of America</span>
                                                            </td>
                                                            <td className='text-left'>
                                                                <span className=''>English</span>
                                                            </td>
                                                            <td className='text-right'>
                                                                <a href='#' className='text-primary mr-1'>Edit</a>
                                                                <a href='#' className='text-danger '>Delete</a>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            } */}
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
