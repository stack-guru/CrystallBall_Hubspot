import React from 'react';
import { Link } from 'react-router-dom';
import HttpClient from '../../utils/HttpClient';
import EditAnnotation from "./EditAnnotation";
import {toast} from "react-toastify";

class index extends React.Component {

    constructor() {
        super();
        this.state = {
            annotations: [],
            error: '',
        }
        this.deleteAnnotation=this.deleteAnnotation.bind(this)
    }
    componentDidMount() {
        document.title = 'Annotation';
        HttpClient.get('/annotation').then(resp => {
            this.setState({ annotations: resp.data.annotations })
            // console.log(resp.data)
        }).catch(err => {
            console.log(err);
        })

    }

    deleteAnnotation(id){

        HttpClient.delete(`/annotation/${id}`).then(resp => {
            toast.success("Annotation deleted.");
            console.log(resp);
            this.state.annotations.filter(an=>{
                if(resp.data.success==true){
//// remove data which have provided id
                }

            })
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const annotations = this.state.annotations;
        return (
            <div className="container-xl bg-white p-5 d-flex flex-column justify-content-center" style={{ minHeight: '100vh' }}>
                <section className="ftco-section  p-3 " id="inputs" style={{ minHeight: '100vh' }}>
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section">Annotations</h2>
                            </div>
                        </div>
                        <div className="row ml-0 mr-0 p-5">
                            <div className="col-12 text-right p-5">
                                <Link to="/annotation/create">
                                    <span type="button" className="btn btn-sm btn-primary">Add Annotation</span>
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Show At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {
                                            annotations ?
                                                annotations.map(anno => (
                                                    <tr key={anno.id}>
                                                        <td>{anno.title}</td>
                                                        <td>{anno.description}</td>
                                                        <td>{anno.show_at}</td>
                                                        <td>

                                                            <button type="button" onClick={()=> {
                                                                this.deleteAnnotation(anno.id)
                                                            }} className="btn btn-danger">
                                                                <i className="ion-ios-trash"></i>
                                                                Delete
                                                            </button>
                                                            <Link to={`/annotation/${anno.id}/edit`} >
                                                            <span type="button" className="btn btn-primary" >
                                                                <i className="ion-ios-trash"></i>
                                                                Edit
                                                            </span>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )) : <tr><td colSpan="9">No Annotation found</td></tr>
                                        }


                                    </tbody>



                                </table>
                            </div>
                            <div className="col-12">pagination</div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

}

export default index;
