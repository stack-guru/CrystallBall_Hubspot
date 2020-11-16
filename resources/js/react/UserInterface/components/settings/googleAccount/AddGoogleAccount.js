import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient  from './../../../utils/HttpClient';
export default class AddGoogleAccount extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            isBusy:false,
             }
             // this.addAccount= this.addAccount.bind(this)
                 }


componentDidMount() {

this.setState({isBusy:true})
    HttpClient.get('/settings/google-account').then(resp=>{
        console.log(resp.data)
        this.setState({isBusy:false})
    },(err)=>{
        console.log(err);
        this.setState({isBusy:false})
    }).then(err=>{
        console.log(err)
        this.setState({isBusy:false})
    })
}

//
// }
    render() {
        return (
            <div className="container-xl bg-white  d-flex flex-column justify-content-center component-wrapper" >

                <div className="container p-5">
                    <div className="row ml-0 mr-0 my-5">
                        <div className="col-12 text-right">
                            {/*onClick={this.addAccount}*/}
                            <a href="/settings/google-account/create" className="btn gaa-bg-primary text-white" >
                                 Connect New Account
                            </a>
                        </div>
                    </div>
                    <div className="row ml-0 mr-0">
                        <div className="col-12">
                            <table className="table table-hover table-bordered table-striped">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>zee</td>
                                <td>@gmail.com</td>
                                <td>oh shit</td>
                            </tr>
                            </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

}
