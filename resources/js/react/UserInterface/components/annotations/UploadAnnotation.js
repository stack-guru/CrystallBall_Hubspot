import React from 'react';

export default class UploadAnnotation extends React.Component{

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="container-xl bg-white component-wrapper" style={{ minHeight: '100vh' }}>
                <section className="ftco-section" id="buttons">
                    <div className="container p-5">
                        <div className="row mb-5">
                            <div className="col-md-12">
                                <h2 className="heading-section">Upload Annotations <br/>
                                    <small>Upload all your annotations using CSV</small>
                                </h2>
                            </div>
                        </div>

                        <form method="POST" action="{{ route('annotation.upload') }}" encType="multipart/form-data">
                            <div className="row">
                                {/*@csrf*/}
                                <div className="col-lg-12 col-sm-12">
                                    <div className="form-group @if($errors->has('csv')) has-danger @endif">
                                        <label htmlFor="csv" className="form-control-placeholder">CSV</label>
                                        <input type="file" className="form-control" id="csv" name="csv" />
                                            {/*@if($errors->has('csv'))*/}
                                            {/*<span className="bmd-help">{{$errors->first('csv')}}</span>*/}
                                            {/*@endif*/}
                                    </div>
                                </div>
                            </div>
                            <div className="row ml-0 mr-0 pr-4">
                                <div className="col-12 offset-11">
                                    <button type="submit" className="btn btn-primary btn-fab btn-round">
                                        <i className="ti-upload mr-3"></i>
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </section>

            </div>
        );
    }

}

