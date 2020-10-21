import React from 'react';

class index extends React.Component{

    constructor() {
        super();
    }

    render() {
        return (
            <div className="container-xl bg-white p-5 d-flex flex-column justify-content-center" style={{minHeight:'100vh'}}>
                <section className="ftco-section  p-3 " id="inputs" style={{minHeight:'100vh'}}>
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section">Annotations</h2>
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

                                    <tr>
                                        <td>titles</td>
                                        <td>descriptions</td>
                                        <td>show at</td>
                                        <td>

                                            <button type="button"
                                                    onClick="document.getElementById('an-del-form-{{$annotation->id}}').submit();"
                                                    className="btn btn-danger">
                                                <i className="ion-ios-trash"></i>
                                            </button>
                                        </td>
                                    </tr>

                                    </tbody>

                                    <tfoot>
                                    <tr>
                                        <td>Title</td>
                                        <td>Description</td>
                                        <td>Show At</td>
                                        <td>Actions</td>
                                    </tr>
                                    </tfoot>

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
