import React, { Component } from 'react'
import HttpClient from "../utils/HttpClient";

import './StartupChecklist.css';

export default class StartupChecklist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
            userChecklistItems: []
        };

        this.toggleView = this.toggleView.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.loadUserChecklistItems = this.loadUserChecklistItems.bind(this);
    }

    toggleView() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    componentDidMount() {
        this.loadUserChecklistItems();
    }

    loadUserChecklistItems() {
        HttpClient.get('/user-checklist-item').then(resp => {
            this.setState({ userChecklistItems: resp.data.user_checklist_items });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    handleUpdate(userChecklistItemId, newValuesObject) {
        HttpClient.put('/user-checklist-item/' + userChecklistItemId, newValuesObject).then(resp => {
            this.setState({ userChecklistItems: this.state.userChecklistItems.map(uCI => (uCI.id == userChecklistItemId ? resp.data.user_checklist_item : uCI)) });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }


    handleDelete(userChecklistItemId) {
        HttpClient.delete('/user-checklist-item/' + userChecklistItemId).then(resp => {
            this.setState({ userChecklistItems: resp.data.user_checklist_items.filter(uCI => uCI.id !== userChecklistItemId) });
        }, (err) => {
            this.setState({ isBusy: false, errors: (err.response).data });
        }).catch(err => {
            this.setState({ isBusy: false, errors: err });
        });
    }

    render() {
        const { userChecklistItems, isExpanded } = this.state;
        let incompleteCount = 0;
        userChecklistItems.forEach(uCI => {
            if (uCI.completed_at == null) incompleteCount++;
        })

        if (!incompleteCount) return null;

        if (!isExpanded) {
            return (
                <button onClick={this.toggleView} className="btn gaa-btn-primary btn-rounded floating-checklist-button">
                    <span className="incomplete-checklist-items-count">{incompleteCount}</span>
                    <i className="fa fa-check-square-o"></i>
                </button>
            )
        }
        return (
            <div className="right-checklist-pane">
                <div className="top-area">
                    <div className="text-right">
                        <i className="fa fa-times" onClick={this.toggleView}></i>
                    </div>
                    <h4>Complete your Onboarding</h4>
                </div>
                <div className="body-area">
                    <ul>
                        {userChecklistItems.map(uCI => {
                            return <li key={uCI.id} className={(uCI.completed_at !== null ? " completed" : "") + (uCI.last_viewed_at !== null ? " read" : "")}>
                                <img src={uCI.completed_at !== null ? "/images/icons/green-tick-round.png" : "/images/icons/gray-circle.png"} onClick={() => { this.handleUpdate(uCI.id, { completed_at: "just now" }); }} />
                                <span onClick={() => { this.handleUpdate(uCI.id, {}); window.open(uCI.checklist_item.url); }} title={uCI.checklist_item.description}>{uCI.checklist_item.label}</span>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}