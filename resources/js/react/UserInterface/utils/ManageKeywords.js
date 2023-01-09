import React from "react";
import HttpClient from "./HttpClient";

export default class ManageKeywords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            errors: "",
            keywords: [],
        };

        this.deleteKeyword = this.deleteKeyword.bind(this);
        this.editKeyword = this.editKeyword.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }

    componentDidMount() {
        // document.getElementById("manage_modal_btn").click();
    }

    deleteKeyword(e) {
        let keyword_configuration_id = e.target.dataset.configuration_id;
        let keyword_id = e.target.dataset.keyword_id;
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });
        if (keyword_id) {
            let params = {
                keyword_configuration_id: keyword_configuration_id,
                keyword_id: keyword_id,
            };
            HttpClient.post(
                "/data-source/delete-keyword-tracking-keyword",
                params
            )
                .then(
                    (resp) => {
                        Toast.fire({
                            icon: "success",
                            title: "Deleted successfully!",
                        });
                        this.props.loadKeywordsCallback();
                    },
                    (err) => {
                        this.setState({
                            isBusy: false,
                            errors: err.response.data,
                        });
                    }
                )
                .catch((err) => {
                    this.setState({ isBusy: false, errors: err });
                });
        }
    }

    editKeyword(e) {
        let keyword_id = e.target.dataset.keyword_id;
        let keyword_configuration_id = e.target.dataset.configuration_id;
        // document.getElementById("close_popup").click();

        this.props.editKeywordCallback(keyword_id, keyword_configuration_id);
    }

    closePopup() {
        this.props.closeManageKeywordPopup();
    }

    render() {
        let keywords = this.props.keywords.map(function (
            keyword_instance,
            index
        ) {
            return keyword_instance.configurations.map(function (
                configuration_instance
            ) {
                return (<div className="singleRow">
                    <div className="singleCol colKeyword text-left"><span>{keyword_instance.keyword}</span></div>
                    <div className="singleCol colUrl text-left"><a href="https://{configuration_instance.url}" className="fa fa-link"></a></div>
                    <div className="singleCol colSearchEngine text-left"><span>{configuration_instance.search_engine.charAt(0).toUpperCase() + configuration_instance.search_engine.slice(1)}</span></div>
                    <div className="singleCol colLocation text-left"><span>{configuration_instance.location_name}</span></div>
                    <div className="singleCol colAction text-right">
                        <a href="#" onClick={this.editKeyword} data-configuration_id={ configuration_instance.id } data-keyword_id={keyword_instance.id}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.35976 19.2701C3.91707 19.2701 3.53798 19.1124 3.22246 18.7969C2.90749 18.4819 2.75 18.103 2.75 17.6604V6.39207C2.75 5.94939 2.90749 5.57029 3.22246 5.25478C3.53798 4.93981 3.91707 4.78232 4.35976 4.78232H11.5433L9.93354 6.39207H4.35976V17.6604H15.628V12.0665L17.2378 10.4567V17.6604C17.2378 18.103 17.0803 18.4819 16.7653 18.7969C16.4498 19.1124 16.0707 19.2701 15.628 19.2701H4.35976ZM13.3543 5.24512L14.5012 6.37195L9.18902 11.6841V12.8311H10.3159L15.6482 7.49878L16.7951 8.62561L11 14.4409H7.57927V11.0201L13.3543 5.24512ZM16.7951 8.62561L13.3543 5.24512L15.3665 3.23293C15.6884 2.91098 16.0742 2.75 16.5239 2.75C16.973 2.75 17.3518 2.91098 17.6604 3.23293L18.7872 4.37988C19.0957 4.68841 19.25 5.06402 19.25 5.50671C19.25 5.94939 19.0957 6.325 18.7872 6.63354L16.7951 8.62561Z" fill="#666666"/>
                            </svg>
                        </a>
                        <a href="#" onClick={this.deleteKeyword} data-configuration_id={ configuration_instance.id } data-keyword_id={keyword_instance.id}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.70312 18.2188C6.23047 18.2188 5.82599 18.0506 5.48969 17.7143C5.15281 17.3774 4.98438 16.9727 4.98438 16.5V5.32812H4.125V3.60938H8.42188V2.75H13.5781V3.60938H17.875V5.32812H17.0156V16.5C17.0156 16.9727 16.8475 17.3774 16.5112 17.7143C16.1743 18.0506 15.7695 18.2188 15.2969 18.2188H6.70312ZM15.2969 5.32812H6.70312V16.5H15.2969V5.32812ZM8.42188 14.7812H10.1406V7.04688H8.42188V14.7812ZM11.8594 14.7812H13.5781V7.04688H11.8594V14.7812ZM6.70312 5.32812V16.5V5.32812Z" fill="#F44C3D"/>
                            </svg>
                        </a>
                    </div>
                </div>);
            },
            this);
        },
        this);

        return (
            <div className='dataTable d-flex flex-column'>
                <h4>Manage trackers</h4>
                <div className="dataTableHolder">
                    <div className="tableHead singleRow">
                        <div className="singleCol colKeyword text-left">Keyword</div>
                        <div className="singleCol colUrl text-left">URL</div>
                        <div className="singleCol colSearchEngine text-left">Search Engine</div>
                        <div className="singleCol colLocation text-left">Location</div>
                        <div className="singleCol colAction text-right">Action</div>
                    </div>
                    <div className="tableBody">
                        {keywords}
                    </div>
                </div>
            </div>
        );
    }
}
