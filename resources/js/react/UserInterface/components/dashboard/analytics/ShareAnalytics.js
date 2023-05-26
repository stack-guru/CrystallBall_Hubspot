import React, {Component} from 'react'
import Toast from "../../../utils/Toast";
import {Redirect} from 'react-router-dom'

import ErrorAlert from '../../../utils/ErrorAlert'
import HttpClient from '../../../utils/HttpClient'
import UserTeamNameSelect from "../../../utils/UserTeamNameSelect";
import SpinningLoader from '../../../utils/SpinningLoader'
import {Button} from 'reactstrap';
import CreatableSelect from "react-select/creatable";
import GoogleAnalyticsPropertySelect from "../../../utils/GoogleAnalyticsPropertySelect";
import {Modal, Popover, PopoverBody, PopoverHeader} from 'reactstrap';



export function CustomTooltip({ children, tooltipText, maxLength }) {
    const lines = splitDisplayString(tooltipText, maxLength);
    const formattedTooltipText = lines.join("<br>");
    return (
        <>
            {children}
            <div
                className="dd-tooltip-text"
                dangerouslySetInnerHTML={{ __html: formattedTooltipText }}
            />
        </>
    );
}
function splitDisplayString(displayString, maxLength = 300) {
    const items = displayString.split(",");
    let lines = [];
    let currentLine = items[0];

    for (let i = 1; i < items.length; i++) {
        if (currentLine.length + items[i].length + 1 <= maxLength) {
            currentLine += "," + items[i];
        } else {
            lines.push(currentLine);
            currentLine = items[i];
        }
    }

    lines.push(currentLine);
    return lines;
}


export default class ShareAnalytics extends Component {
    constructor(props) {
        super(props)

        this.state = {
            form_data: {
                ga_property_id: this.props.ga_property_id,
                user_id: null,
                dashboard_id: null,
                recurrence: null,
                emails: [],
                statistics_padding_days: this.props.statisticsPaddingDays,
                // start_date: this.props.start_date,
                // end_date: this.props.end_date,
            },
            users: [],
            errors: undefined,
            redirectTo: null,
            price_plan: this.props.user.price_plan,
            total_credits : this.props.user.price_plan.external_email == -1 ? 0 : this.props.user.price_plan.external_email,

            popoverOpen: false,
            selectedUsers: [],

        }
        this.toggle = this.toggle.bind(this);
        this.changeHandler = this.changeHandler.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.setDefaultState = this.setDefaultState.bind(this)
        this.getUsers = this.getUsers.bind(this)
        this.addEmail = this.addEmail.bind(this);
        this.deleteEmail = this.deleteEmail.bind(this);
        this.handleImageClick = this.handleImageClick.bind(this);
    }

    toggle() {
        this.setState({
          popoverOpen: !this.state.popoverOpen
        });
      }

    componentDidMount() {
        document.title = 'User Accounts';
        if(this.props.user.price_plan.external_email == 0)
        {
            this.setState({total_credits: 9999});
        }
        this.getUsers();

    }

    setDefaultState() {
        this.setState({
            errors: undefined,
            redirectTo: null,
            loading: false
        });
    }


    changeHandler(e) {
        console.log(e.target);
        this.setState({form_data: {...this.state.form_data, [e.target.name]: e.target.value}});
        console.log("change handler function   ===== ",e.target.value)

    }
    handleImageClick = (user) => {
        const { selectedUsers } = this.state;
        const isSelected = selectedUsers.includes(user);
    
        if (isSelected) {
          // User is already selected, so remove from the selection
          this.setState({
            selectedUsers: selectedUsers.filter((selectedUser) => selectedUser !== user),
          });
        } else {
          // User is not selected, so add to the selection
          this.setState({
            selectedUsers: [...selectedUsers, user],
          });
        }
      };

    getUsers() {
        HttpClient.get(`/settings/user`)
            // HttpClient.get('/ui/settings/google-analytics-property?keyword=')
            .then(
                (response) => {
                    this.setState({users: response.data.users});
                },
                (err) => {
                    this.setState({errors: err.response.data});
                }
            )
            .catch((err) => {
                this.setState({errors: err});
            });
    }
    addEmail(e) {
        if (document.getElementById("tracking_emails").value) {
            if (
                this.state.total_credits >=  this.state.form_data.emails.length
            ) {
                let emails_new = this.state.form_data.emails;
                emails_new.push({
                    id: "",
                    email: document.getElementById("tracking_emails").value,
                });
                this.setState({form_data: {...this.state.form_data, emails: emails_new}});            
                document.getElementById("tracking_emails").value = "";
            }
            else {
                    this.props.upgradePopup('increase-limits');
                }
        }
    }
    deleteEmail(e) {
        this.setState({popoverOpen:false})
        let emails_existing = this.state.form_data.emails;
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
        let new_emails_array = emails_existing.filter(
            (email) => email.email != e.target.dataset.email
        );
        this.setState({form_data: {...this.state.form_data, emails: new_emails_array}});
        Toast.fire({
            icon: "success",
            title: "Deleted successfully!",
        });

    }
    

    submitHandler(e) {
        e.preventDefault();
        this.setState({loading: true});
        HttpClient.get(`/dashboard/analytics/share-report?dashboard_id=${this.state.form_data.dashboard_id}&recurrence=${this.state.form_data.recurrence}&ga_property_id=${this.state.form_data.ga_property_id}&statistics_padding_days=${this.state.form_data.statistics_padding_days}&user_id=${this.state.form_data.user_id}&emails[]=${this.state.form_data.emails}`)
            .then(response => {
                Toast.fire({
                    icon: 'success',
                    title: "Shared Successfully!",
                });

                this.setState({loading: false}, () => {
                    this.setDefaultState();
                });
                Toast.fire({
                    icon: "success",
                    title: "Report Send Successfully!",
                });
            }, (err) => {
                this.setState({loading: false});
                this.setState({errors: (err.response).data});
            }).catch(err => {
            this.setState({loading: false});
            this.setState({errors: err});
        });
    }


   
    render() {
        if (this.state.redirectTo) return <Redirect to={this.state.redirectTo}/>
            const { users } = this.props;
            const { selectedUsers } = this.state;
        return (
            <div className="apps-bodyContent">
                <form onSubmit={this.submitHandler} id="create-user-form">
                    <ErrorAlert errors={this.state.errors}/>

                    
                    <div className='grid2layout fieldsPlusLogo'>
                        <div className="themeNewInputStyle">
                            <GoogleAnalyticsPropertySelect
                                name="ga_property_id"
                                value={this.state.form_data.ga_property_id}
                                onChangeCallback={this.changeHandler}
                                currentPricePlan={this.state.price_plan}
                                components={{ IndicatorSeparator: () => null }}
                            />
                        </div>
                        </div>


                    


                        <div className="modalContentArea mb-4 mt-4">
                            <h5 className='mb-4 team-members'>
                                Team members {selectedUsers.length} selected
                                {/* <span>(2selected)</span> */}
                            </h5>
                            <div   className='d-flex'>
                              
                                    {/* <ul className={`d-flex mb-2 mt-2  dd-tooltip p-1 list-styles ${
                                        selectedUsers.includes(gSCS) ? 'list-stylesselectesUser' : ''}`} key={gSCS.id}> */}
                                        <ul className='d-flex mb-2 mt-2  dd-tooltip p-1 list-styles'>
                                              {
                                    this.state.users.map((gSCS, index,) =>
                                    
                                        <li className={`${
                                            selectedUsers.includes(gSCS) ? 'list-stylesselectesUser' : ''}`}>
                                            <>
                                            <span className="properties dd-tooltip m-0 p-0">{gSCS.name ? <CustomTooltip tooltipText={gSCS.name} maxLength={50}></CustomTooltip> : "Name not found"}</span>
                                            </>
                                                {
                                                    gSCS.profile_image ?
                                                    <div className='addPhoto m-0 p-0' id='acronym-holder' style={{ backgroundPosition: 'center', backgroundSize: 'contain', backgroundImage: `url(/${gSCS.profile_image})` }}>
                                                        <span onClick={()=>{this.handleImageClick(gSCS)}}></span>
                                                    </div>
                                                    :
                                                    <span className="w-2r bdrs-50p text-center gaa-bg-color m-0" id="acronym-holder" 
                                                    alt="" onClick={()=>{this.handleImageClick(gSCS)}}>{gSCS != undefined ? gSCS.name.split(' ').map(n => n.substring(0, 1)).join('').toUpperCase() : null}
                                                    
                                                    </span>
                                                }
                                        </li>
                                    
                                    )
                                }
                                </ul>
                            </div>
                            
                            {/* <ul className='d-flex mb-2 mt-2 gap-5 list-styles'>
                                <li > <img src="/images/svg/6.svg" alt="share icon" /></li>
                                <li> <img src="/images/svg/2.svg" alt="share icon" /></li>
                                <li> <img src="/images/svg/5.svg" alt="share icon" /></li>
                                <li> <img src="/images/svg/4.svg" alt="share icon" /></li>
                                <li> <img src="/images/svg/5.svg" alt="share icon" />{" "}</li>
                            </ul> */}
                        </div>
                    <div className="grid2layout">
                        
                        <div className="themeNewInputGroup">
                            {/* <label>Add via email</label> */}

                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Add Email" 
                                name="emails" 
                                id="tracking_emails"
                                onKeyUp={(e) => { if (e.key === "Enter") this.addEmail(e) }}
                                />
                            <div className="input-group-append">
                                <a onClick={(e) => {this.addEmail(e);}} href="#"><i className="ti-plus"></i></a>
                            </div>
                            
                            
                        </div>
                        
                        
                    </div>
                    <div className='tagsHolder'>
                                <h5 className='clickTo-remove'>
                                    Selected <span className='clickTo-remove-small'>(Click to remove)</span>
                                </h5>

                                    {this.state.form_data.emails.length > 0 ?
                                        <div className="keywordTags pt-3 tags" style={{background:"#FCFCFC",borderRadius:"16px"}}>
                                            
                                            {this.state.form_data.emails.length > 0 ? this.state.form_data.emails.map((email, index) => {
                                                return (
                                                <>
                                                        
                                                            <button type="button" className="keywordTag tag" 
                                                                id="Popover1"
                                                                key={email.id != "" ? email.id : index} 
                                                                data-email={email.email} 
                                                                data-email_id={email.id} 
                                                                onClick={(e) => {
                                                                    
                                                                    // this.deleteEmail(e);
                                                                    this.toggle
                                                                }}>
                                                                    {email.email}
                                                            </button>                                                           

                                                            <Popover placement="top"
                                                                    target="Popover1"
                                                                    isOpen={ this.state.popoverOpen}
                                                                    toggle={this.toggle}
                                                                >
                                                                    <PopoverBody>
                                                                        Are you sure you want to remove .
                                                                    </PopoverBody>
                                                                    <button onClick={(e) => this.deleteEmail(e)} 
                                                                    key={email.id != "" ? email.id : index} 
                                                                    data-email={email.email} 
                                                                    data-email_id={email.id} 
                                                                    > Yes</button>
                                                                    <button onClick={() => this.setState({ popoverOpen: null})}
                                                                    >No</button>
                                                                </Popover>


                                                        </> );})
                                                : ""
                                            }
                                        </div>
                                    : null}
                        </div>
                    
                    <div
                        className={`d-flex ${this.props.userStartupConfig ? 'justify-content-between align-items-center' : 'pt-3'}`}>
                        <button type="submit" disabled={this.state.loading} className="btn-theme"
                                title="submit">{this.state.loading ?
                            <SpinningLoader/> : "Share Report"}</button>
                    </div>
                </form>
            </div>
        )
    }

}
