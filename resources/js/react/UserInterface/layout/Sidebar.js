import React from "react";
import { Link } from "react-router-dom";
import * as $ from "jquery";
import CompanyLogo from "../utils/CompanyLogo";
import CompanyHeading from "../utils/CompanyHeading";
import AppsModal from "../components/AppsMarket/AppsModal";
import AnnotationsCreate from "../components/annotations/CreateAnnotation";
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            isCollapsed: false
        };
        this.toggleSidebar = this.toggleSidebar.bind(this);
    }

    componentDidMount() {
        $(".sidebar").hover(function () {
            if ($(".setting-menu-item.dropdown").hasClass("open")) {
                $(".setting-menu-item.dropdown").removeClass("open");
                $(".arrow .t").removeClass("ti-angle-down");
            }
        });
        $(".setting-menu-item").click(function () {
            $(".setting-menu-item.dropdown").toggleClass("open");
            $(".arrow .t").toggleClass("ti-angle-down");
        });

        $(".td-n").click(function (e) {
            $("body").toggleClass("is-collapsed");
        });

        const { SVGInjector } = window.SVGInjector;
        SVGInjector(document.getElementsByClassName("inject-me"), {
            cacheRequests: false,
            evalScripts: "once",
            httpRequestWithCredentials: false,
            renumerateIRIElements: false,
        });

        let body = document.getElementsByTagName("body")[0];
        if (body.classList.contains("is-collapsed")) {
            this.setState({ isCollapsed: true });
        } else {
            this.setState({ isCollapsed: false });
        }
    }

    showBetaAlert(ev) {
        ev.preventDefault();
        let alreadyDisplayed =
            localStorage.getItem("analytics_popup_showed") === "true";
        if (!alreadyDisplayed) {
            swal.fire({
                title: "",
                text: "This page is still on Beta, would you like to access anyway?",
                icon: "warning",
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                dangerMode: true,
            }).then((value) => {
                // save state
                localStorage.setItem("analytics_popup_showed", "true");
                if (value.isConfirmed) {
                    window.location.href = "/analytics";
                }
            });
        } else {
            window.location.href = "/analytics";
        }
    }

    toggleSidebar(e) {
        e.preventDefault();
        let body = document.getElementsByTagName("body")[0];
        if (body.classList.contains("is-collapsed")) {
            body.classList.remove("is-collapsed");
            this.setState({ isCollapsed: false });
        } else {
            body.classList.add("is-collapsed");
            this.setState({ isCollapsed: true });
        }
    }

    render() {
        return (
            <div className="sidebar-inner OSXscroll d-flex flex-column">
                <a
                    id="sidebar-toggle"
                    className="desktop-toggle sidebar-toggle text-center d-block btn btn-sm"
                    href="#"
                    onClick={this.toggleSidebar}
                >
                    {this.state.isCollapsed ? (
                        <i className="ti-angle-right"></i>
                    ) : (
                        <i className="ti-angle-left"></i>
                    )}
                </a>
                {/* <div className="sidebar-logo bg-white">
                    <div className="peers ai-c fxw-nw">
                        <div className="peer peer-greed">
                            <a className="sidebar-link td-n" href="/">
                                <div className="peers ai-c fxw-nw">
                                    <div className="peer">
                                        <div
                                            className="logo d-flex justify-content-center align-items-center"
                                            style={{ minHeight: 65 }}
                                        >
                                            <CompanyLogo
                                                width="40px"
                                                height="40px"
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <div className="peer peer-greed ">
                                        <CompanyHeading className="lh-1 logo-text m-0" />
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="peer">
                            <div className="mobile-toggle sidebar-toggle"><a href={null} className="td-n" type="button"><i className="ti-arrow-circle-left"></i></a></div>
                        </div>
                    </div>
                </div> */}
                <nav className="flex-grow-1 overflow-auto">
                    <ul className="sidebar-menu scrollable pos-r border-0">
                        <li className="nav-item gaa-menu-item">
                            <Link to="/annotation">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span>
                                        <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M8 14h7a.968.968 0 00.713-.288A.967.967 0 0016 13a.97.97 0 00-.287-.713A.97.97 0 0015 12H8a.97.97 0 00-.713.287A.97.97 0 007 13c0 .283.096.52.287.712.192.192.43.288.713.288zm0-3h7a.968.968 0 00.713-.288A.967.967 0 0016 10a.97.97 0 00-.287-.713A.97.97 0 0015 9H8a.97.97 0 00-.713.287A.97.97 0 007 10c0 .283.096.52.287.712.192.192.43.288.713.288zM5 21c-.55 0-1.02-.196-1.412-.587A1.927 1.927 0 013 19V7c0-.55.196-1.02.588-1.412A1.923 1.923 0 015 5h16c.55 0 1.021.196 1.413.588.391.391.587.862.587 1.412v12c0 .55-.196 1.021-.587 1.413A1.928 1.928 0 0121 21H5zm0-2V7v12zm0 0h16V7H5v12z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </span>
                                    <span className="title flex-grow-1">
                                        Annotations
                                    </span>
                                </span>
                            </Link>
                        </li>
                        {this.props.user.user_level == "admin" ||
                            this.props.user.user_level == "team" ? (
                            <li className="nav-item gaa-menu-item">
                                <a href="javascript:void(0);"
                                    onClick={() => this.props.openAnnotationPopup('manual')}>
                                    <span className="sidebar-link d-flex align-items-center justify-content-start">
                                        <span>
                                            <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
                                                <path
                                                    d="M13 18a.968.968 0 00.713-.288A.967.967 0 0014 17v-3h3.025a.926.926 0 00.7-.288A.99.99 0 0018 13a.968.968 0 00-.288-.713A.967.967 0 0017 12h-3V8.975a.928.928 0 00-.287-.7A.993.993 0 0013 8a.967.967 0 00-.712.287A.968.968 0 0012 9v3H8.975a.928.928 0 00-.7.287A.993.993 0 008 13c0 .283.096.52.287.712.192.192.43.288.713.288h3v3.025c0 .283.096.517.288.7A.99.99 0 0013 18zm0 5a9.733 9.733 0 01-3.9-.788 10.092 10.092 0 01-3.175-2.137c-.9-.9-1.612-1.958-2.137-3.175A9.733 9.733 0 013 13c0-1.383.263-2.683.788-3.9a10.092 10.092 0 012.137-3.175c.9-.9 1.958-1.613 3.175-2.138A9.743 9.743 0 0113 3c1.383 0 2.683.262 3.9.787a10.105 10.105 0 013.175 2.138c.9.9 1.612 1.958 2.137 3.175A9.733 9.733 0 0123 13a9.733 9.733 0 01-.788 3.9 10.092 10.092 0 01-2.137 3.175c-.9.9-1.958 1.612-3.175 2.137A9.733 9.733 0 0113 23zm0-2c2.217 0 4.104-.779 5.663-2.337C20.221 17.104 21 15.217 21 13s-.779-4.104-2.337-5.663C17.104 5.779 15.217 5 13 5s-4.104.779-5.662 2.337C5.779 8.896 5 10.783 5 13s.78 4.104 2.338 5.663C8.896 20.221 10.783 21 13 21z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        </span>
                                        <span className="title flex-grow-1">
                                            Add Annotation
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ) : null}
                        {/* {this.props.user.user_level == "admin" ||
                        this.props.user.user_level == "team" ? (
                            <li className="nav-item gaa-menu-item">
                                <Link to="/annotation/upload">
                                    <span className="sidebar-link d-flex align-items-center justify-content-start">
                                        <span><img className='inject-me' src='/csvUpload.svg' width='26' height='26' alt='menu icon'/></span>
                                        <span className="title flex-grow-1">CSV Upload</span>
                                    </span>
                                </Link>
                            </li>
                        ) : null} */}
                        <li className="nav-item gaa-menu-item">
                            <Link to="/data-source">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span>
                                        <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M9.57 14.953a1.02 1.02 0 011.02 1.02v5.05a1.02 1.02 0 01-1.02 1.02H4.52a1.02 1.02 0 01-1.02-1.02v-5.05a1.02 1.02 0 011.02-1.02h5.05zm10.91 0a1.02 1.02 0 011.02 1.02v5.05a1.02 1.02 0 01-1.02 1.02h-5.05a1.02 1.02 0 01-1.02-1.02v-5.05a1.02 1.02 0 011.02-1.02h5.05zm1.793-6.824l.736.677-.736-.677-3.418 3.717a1.02 1.02 0 01-1.441.06l-3.717-3.418a1.02 1.02 0 01-.06-1.442l3.418-3.717a1.02 1.02 0 011.441-.06l3.717 3.419a1.02 1.02 0 01.06 1.441zM9.57 4.043a1.02 1.02 0 011.02 1.02v5.05a1.02 1.02 0 01-1.02 1.02H4.52a1.02 1.02 0 01-1.02-1.02v-5.05a1.02 1.02 0 011.02-1.02h5.05z"
                                                stroke="url(#paint0_linear_153_1266)"
                                                strokeWidth={2}
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_153_1266"
                                                    x1={13.0214}
                                                    y1={2}
                                                    x2={13.0214}
                                                    y2={23.0427}
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop offset={0.275742} stopColor="currentColor" />
                                                    <stop offset={1} stopColor="currentColor" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="title flex-grow-1">
                                        Apps Market
                                    </span>
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item gaa-menu-item">
                            <Link to="/settings/user">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span>
                                        <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
                                            <path
                                                d="M16.555 12.672h0a1.01 1.01 0 01.505-.85 2.632 2.632 0 001.316-2.27l-1.821 3.12zm0 0a1.01 1.01 0 00.455.868l.354.237h0m-.81-1.105l.81 1.105m0 0l.008.005m-.008-.005l.008.005m0 0l.119.063h0m-.119-.063l.118.063m0 0l.005.003m-.005-.003l.005.003m0 0a6.271 6.271 0 013.584 5.716v.001m-3.584-5.717l3.584 5.717m0 0a1.01 1.01 0 002.02 0m-2.02 0l-1.778-7.013m0 0A4.652 4.652 0 0015.745 4.9l3.556 7.652zm0 0a8.292 8.292 0 013.799 7.013m0 0s0 0 0 0H23h.1s0 0 0 0zm-9.634-6.654a4.578 4.578 0 001.468-3.36 4.651 4.651 0 00-9.303 0 4.578 4.578 0 001.468 3.36A7.382 7.382 0 002.9 19.565v0a1.01 1.01 0 102.02 0 5.362 5.362 0 1110.725 0 1.01 1.01 0 102.02 0v0a7.382 7.382 0 00-4.199-6.654zm-3.183-.728a2.63 2.63 0 110-5.262 2.63 2.63 0 010 5.262zM15.745 4.9a1.01 1.01 0 100 2.02 2.631 2.631 0 012.63 2.631L15.746 4.9z"
                                                fill="currentColor"
                                                stroke="currentColor"
                                                strokeWidth={0.2}
                                            />
                                        </svg>
                                    </span>
                                    <span className="title flex-grow-1">
                                        Manage Team
                                    </span>
                                </span>
                            </Link>
                        </li>

                        {/* <li className="nav-item gaa-menu-item">
                            <Link to="/integrations">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/integrations.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Integrations</span>
                                </span>
                            </Link>
                        </li> */}
                        {/* <li className="nav-item gaa-menu-item">
                            <Link to="/settings/google-account">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/addProperties.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1">Add Properties</span>
                                </span>
                            </Link>
                        </li> */}

                        <li className="nav-item gaa-menu-item">
                            {/* <Link to="/analytics-and-business-intelligence"> */}
                            <Link to="/accounts">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><svg width={26} height={26} viewBox="0 0 26 26" fill="none">
                                        <path
                                            d="M8 21h10m-8-4v4m6-4v4m-7-8l3-3 2 2 3-3M5 5h16a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                                            stroke="currentColor"
                                            strokeWidth={2.3}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg></span>
                                    <span className="title flex-grow-1">Accounts</span>
                                </span>
                            </Link>
                        </li>
                        {/* <li className="nav-item gaa-menu-item">
                            <Link to="/api-key">
                                <span className="sidebar-link d-flex align-items-center justify-content-start">
                                    <span><img className='inject-me' src='/apiKeys.svg' width='26' height='26' alt='menu icon'/></span>
                                    <span className="title flex-grow-1 ">API Keys</span>
                                </span>
                            </Link>
                        </li> */}

                        <li className="nav-item gaa-menu-item setting-menu-item dropdown">
                            <a
                                aria-expanded="false"
                                data-target="#settings"
                                aria-controls="settings"
                                data-toggle="collapse collapsed"
                                className="dropdown-toggle"
                            >
                                <div className="wrapper sidebar-link d-flex align-items-center justify-content-start">
                                    <span>
                                        <svg width={26} height={26} viewBox="0 0 26 26" fill="none">
                                            <mask
                                                id="a"
                                                maskUnits="userSpaceOnUse"
                                                x={2}
                                                y={2}
                                                width={22}
                                                height={22}
                                                fill="#000"
                                            >
                                                <path fill="#fff" d="M2 2H24V24H2z" />
                                                <path d="M13 7.834a5.166 5.166 0 100 10.332 5.166 5.166 0 000-10.332zm0 8.856a3.69 3.69 0 110-7.38 3.69 3.69 0 010 7.38zm9.852-1.624l-1.375-1.826c.01-.166 0-.341 0-.47l1.375-1.836a.72.72 0 00.12-.637c-.233-.85-.57-1.668-1.006-2.435a.758.758 0 00-.535-.37l-2.26-.322-.341-.341-.323-2.26a.757.757 0 00-.369-.535 10.588 10.588 0 00-2.435-1.006.72.72 0 00-.637.12L13.24 4.513h-.48l-1.826-1.365a.72.72 0 00-.637-.12c-.85.233-1.668.57-2.435 1.006a.756.756 0 00-.37.535l-.322 2.26-.341.341-2.26.323a.756.756 0 00-.535.369 10.59 10.59 0 00-1.006 2.435.72.72 0 00.12.637l1.375 1.826v.47l-1.375 1.836a.72.72 0 00-.12.637c.233.85.57 1.668 1.006 2.435a.756.756 0 00.535.37l2.26.322.341.341.323 2.26a.757.757 0 00.369.535c.767.436 1.585.773 2.435 1.006a.71.71 0 00.636-.12l1.827-1.365h.48l1.826 1.365a.72.72 0 00.637.12 10.59 10.59 0 002.435-1.006.757.757 0 00.37-.535l.322-2.269c.11-.11.24-.23.332-.332l2.27-.323a.758.758 0 00.534-.369 10.59 10.59 0 001.006-2.435.72.72 0 00-.12-.637zm-2.002 2.03l-2.15.304a.765.765 0 00-.433.23c-.11.12-.452.471-.618.619a.738.738 0 00-.249.452l-.304 2.15c-.46.244-.942.445-1.44.599l-1.743-1.31a.71.71 0 00-.489-.139h-.848a.71.71 0 00-.49.139l-1.743 1.31a8.181 8.181 0 01-1.439-.6L8.6 18.7a.738.738 0 00-.25-.451 6.131 6.131 0 01-.599-.6.738.738 0 00-.452-.249l-2.15-.304a8.938 8.938 0 01-.599-1.44l1.31-1.743a.811.811 0 00.148-.461c-.01-.166-.019-.646-.01-.876a.71.71 0 00-.138-.49l-1.31-1.743c.158-.496.358-.977.6-1.439L7.3 8.6a.738.738 0 00.451-.25c.186-.213.386-.413.6-.599A.738.738 0 008.6 7.3l.304-2.15a8.938 8.938 0 011.44-.599l1.743 1.31a.71.71 0 00.489.138c.276-.009.572-.009.848 0a.71.71 0 00.49-.138l1.743-1.31c.497.154.98.355 1.439.6L17.4 7.3a.738.738 0 00.25.451c.213.186.413.386.599.6a.738.738 0 00.452.249l2.15.304c.244.46.445.942.599 1.44l-1.31 1.743a.811.811 0 00-.148.461c.01.166.019.646.01.876a.71.71 0 00.138.49l1.31 1.743c-.154.497-.355.98-.6 1.439z" />
                                            </mask>
                                            <path
                                                d="M13 7.834a5.166 5.166 0 100 10.332 5.166 5.166 0 000-10.332zm0 8.856a3.69 3.69 0 110-7.38 3.69 3.69 0 010 7.38zm9.852-1.624l-1.375-1.826c.01-.166 0-.341 0-.47l1.375-1.836a.72.72 0 00.12-.637c-.233-.85-.57-1.668-1.006-2.435a.758.758 0 00-.535-.37l-2.26-.322-.341-.341-.323-2.26a.757.757 0 00-.369-.535 10.588 10.588 0 00-2.435-1.006.72.72 0 00-.637.12L13.24 4.513h-.48l-1.826-1.365a.72.72 0 00-.637-.12c-.85.233-1.668.57-2.435 1.006a.756.756 0 00-.37.535l-.322 2.26-.341.341-2.26.323a.756.756 0 00-.535.369 10.59 10.59 0 00-1.006 2.435.72.72 0 00.12.637l1.375 1.826v.47l-1.375 1.836a.72.72 0 00-.12.637c.233.85.57 1.668 1.006 2.435a.756.756 0 00.535.37l2.26.322.341.341.323 2.26a.757.757 0 00.369.535c.767.436 1.585.773 2.435 1.006a.71.71 0 00.636-.12l1.827-1.365h.48l1.826 1.365a.72.72 0 00.637.12 10.59 10.59 0 002.435-1.006.757.757 0 00.37-.535l.322-2.269c.11-.11.24-.23.332-.332l2.27-.323a.758.758 0 00.534-.369 10.59 10.59 0 001.006-2.435.72.72 0 00-.12-.637zm-2.002 2.03l-2.15.304a.765.765 0 00-.433.23c-.11.12-.452.471-.618.619a.738.738 0 00-.249.452l-.304 2.15c-.46.244-.942.445-1.44.599l-1.743-1.31a.71.71 0 00-.489-.139h-.848a.71.71 0 00-.49.139l-1.743 1.31a8.181 8.181 0 01-1.439-.6L8.6 18.7a.738.738 0 00-.25-.451 6.131 6.131 0 01-.599-.6.738.738 0 00-.452-.249l-2.15-.304a8.938 8.938 0 01-.599-1.44l1.31-1.743a.811.811 0 00.148-.461c-.01-.166-.019-.646-.01-.876a.71.71 0 00-.138-.49l-1.31-1.743c.158-.496.358-.977.6-1.439L7.3 8.6a.738.738 0 00.451-.25c.186-.213.386-.413.6-.599A.738.738 0 008.6 7.3l.304-2.15a8.938 8.938 0 011.44-.599l1.743 1.31a.71.71 0 00.489.138c.276-.009.572-.009.848 0a.71.71 0 00.49-.138l1.743-1.31c.497.154.98.355 1.439.6L17.4 7.3a.738.738 0 00.25.451c.213.186.413.386.599.6a.738.738 0 00.452.249l2.15.304c.244.46.445.942.599 1.44l-1.31 1.743a.811.811 0 00-.148.461c.01.166.019.646.01.876a.71.71 0 00.138.49l1.31 1.743c-.154.497-.355.98-.6 1.439z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M13 7.834a5.166 5.166 0 100 10.332 5.166 5.166 0 000-10.332zm0 8.856a3.69 3.69 0 110-7.38 3.69 3.69 0 010 7.38zm9.852-1.624l-1.375-1.826c.01-.166 0-.341 0-.47l1.375-1.836a.72.72 0 00.12-.637c-.233-.85-.57-1.668-1.006-2.435a.758.758 0 00-.535-.37l-2.26-.322-.341-.341-.323-2.26a.757.757 0 00-.369-.535 10.588 10.588 0 00-2.435-1.006.72.72 0 00-.637.12L13.24 4.513h-.48l-1.826-1.365a.72.72 0 00-.637-.12c-.85.233-1.668.57-2.435 1.006a.756.756 0 00-.37.535l-.322 2.26-.341.341-2.26.323a.756.756 0 00-.535.369 10.59 10.59 0 00-1.006 2.435.72.72 0 00.12.637l1.375 1.826v.47l-1.375 1.836a.72.72 0 00-.12.637c.233.85.57 1.668 1.006 2.435a.756.756 0 00.535.37l2.26.322.341.341.323 2.26a.757.757 0 00.369.535c.767.436 1.585.773 2.435 1.006a.71.71 0 00.636-.12l1.827-1.365h.48l1.826 1.365a.72.72 0 00.637.12 10.59 10.59 0 002.435-1.006.757.757 0 00.37-.535l.322-2.269c.11-.11.24-.23.332-.332l2.27-.323a.758.758 0 00.534-.369 10.59 10.59 0 001.006-2.435.72.72 0 00-.12-.637zm-2.002 2.03l-2.15.304a.765.765 0 00-.433.23c-.11.12-.452.471-.618.619a.738.738 0 00-.249.452l-.304 2.15c-.46.244-.942.445-1.44.599l-1.743-1.31a.71.71 0 00-.489-.139h-.848a.71.71 0 00-.49.139l-1.743 1.31a8.181 8.181 0 01-1.439-.6L8.6 18.7a.738.738 0 00-.25-.451 6.131 6.131 0 01-.599-.6.738.738 0 00-.452-.249l-2.15-.304a8.938 8.938 0 01-.599-1.44l1.31-1.743a.811.811 0 00.148-.461c-.01-.166-.019-.646-.01-.876a.71.71 0 00-.138-.49l-1.31-1.743c.158-.496.358-.977.6-1.439L7.3 8.6a.738.738 0 00.451-.25c.186-.213.386-.413.6-.599A.738.738 0 008.6 7.3l.304-2.15a8.938 8.938 0 011.44-.599l1.743 1.31a.71.71 0 00.489.138c.276-.009.572-.009.848 0a.71.71 0 00.49-.138l1.743-1.31c.497.154.98.355 1.439.6L17.4 7.3a.738.738 0 00.25.451c.213.186.413.386.599.6a.738.738 0 00.452.249l2.15.304c.244.46.445.942.599 1.44l-1.31 1.743a.811.811 0 00-.148.461c.01.166.019.646.01.876a.71.71 0 00.138.49l1.31 1.743c-.154.497-.355.98-.6 1.439z"
                                                stroke="currentColor"
                                                strokeWidth={0.6}
                                                mask="url(#a)"
                                            />
                                        </svg>
                                    </span>
                                    <span className="title flex-grow-1">
                                        Settings
                                    </span>
                                    <span className="arrow">
                                        <i className="t ti-angle-right"></i>
                                    </span>
                                </div>
                            </a>
                            <div
                                className="collapse dropdown-menu setting-menu-content"
                                id="settings"
                            >
                                <ul className="list-unstyled">
                                    {this.props.user.user_level == "admin" ||
                                        this.props.user.user_level == "team" ? (
                                        <React.Fragment>
                                            {/* <li className="nav-item dropdown"><Link to="/settings/google-account" className="sidebar-link"><span className="nav-link">Add Properties/Accounts</span></Link></li> */}
                                            {/* <li className="nav-item dropdown"><Link to="/settings/user" className="sidebar-link"><span className="nav-link">Manage Users</span></Link></li> */}
                                            <li className="nav-item dropdown">
                                                <Link to="/settings/price-plans">
                                                    Plans
                                                </Link>
                                            </li>
                                            {/* <li className="nav-item dropdown"><Link to="/settings/payment-history" className="sidebar-link"><span className="nav-link">Payment History</span></Link></li> */}
                                            {/* <li className="nav-item dropdown"><div className="sidebar-link nav-link"><a href="/documentation" target="_blank">API Documentation</a></div></li> */}
                                        </React.Fragment>
                                    ) : null}
                                    <li className="nav-item dropdown">
                                        <Link to="/settings/profile">
                                            My Profile
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link to="/notifications">Notifications</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link to="/api-key">API Keys</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link to="/settings/support">
                                            Support
                                        </Link>
                                    </li>
                                    {/* <li className="nav-item dropdown">
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.props.toggleInterfaceTour(
                                                    true
                                                );
                                            }}
                                        >
                                            Take a Tour
                                        </Link>
                                    </li> */}
                                </ul>
                            </div>
                        </li>
                    </ul>
                </nav>
                <div className="btn-holder dropdown-holder">
                    <div className="btn-group dropup">
                        <button
                            type="button"
                            className="btn-addAnnotation btn btn-primary d-flex align-items-center justify-content-center dropdown-toggle"
                            data-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                src="/plus-new.svg"
                                width="16"
                                height="17"
                                alt="plus icon"
                            />
                            <span>Add Annotation</span>
                        </button>
                        <div className="dropdown-menu">
                            <h4 className="mb-0">Add Annotation</h4>
                            <div className="dropdown-divider"></div>
                            <div className="ropdown-links">
                                <a
                                    className="dropdown-item"
                                    href="javascript:void(0);"
                                    onClick={() => this.props.openAnnotationPopup('manual')}
                                >
                                    <span>
                                    <img className='inject-me' src='/images/plus-icon.svg' onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = "/images/plus-icon.svg"; }} width='16' height='16' alt='menu icon' />
                                    </span>
                                    <span className="pl-2">Manual</span>
                                </a>
                                <a className="dropdown-item" href="/data-source">
                                    <span>
                                        <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                                            <path
                                                d="M5.704 9.652a.644.644 0 01.644.644v3.36a.644.644 0 01-.644.644h-3.36a.644.644 0 01-.644-.644v-3.36a.644.644 0 01.644-.644h3.36zm8.388-5.508l.474-.515-.474.515a.644.644 0 01.038.91l-2.274 2.473a.644.644 0 01-.91.038L8.473 5.291a.644.644 0 01-.038-.91l2.274-2.473a.644.644 0 01.91-.038l2.473 2.274zm-1.13 5.508a.644.644 0 01.644.644v3.36a.644.644 0 01-.644.644h-3.36a.644.644 0 01-.643-.644v-3.36a.644.644 0 01.643-.644h3.36zM5.704 2.394a.644.644 0 01.644.644v3.36a.644.644 0 01-.644.643h-3.36a.644.644 0 01-.644-.643v-3.36a.644.644 0 01.644-.644h3.36z"
                                                stroke="#666"
                                                strokeWidth={1.4}
                                            />
                                        </svg>
                                    </span>
                                    <span className="pl-2">Apps Market</span>
                                </a>
                                {this.props.user.user_level == "admin" ||
                                    this.props.user.user_level == "team" ? (
                                    <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                        onClick={() => this.props.openAnnotationPopup('upload')}
                                    >
                                        <span>
                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                                                <path
                                                    d="M12.875 10.438v2.437h-9.75v-2.438H1.5v2.438A1.63 1.63 0 003.125 14.5h9.75a1.63 1.63 0 001.625-1.625v-2.438h-1.625zM3.937 5.561l1.146 1.146 2.104-2.096v6.638h1.625V4.612l2.105 2.096 1.146-1.146L8 1.5 3.937 5.563z"
                                                    fill="#666"
                                                />
                                            </svg>
                                        </span>
                                        <span className="pl-2">CSV Upload</span>
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Sidebar;
