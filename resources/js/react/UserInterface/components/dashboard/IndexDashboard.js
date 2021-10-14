import React, { Component } from 'react';

export default class IndexDashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="container-xl bg-white anno-container  d-flex flex-column justify-content-center component-wrapper" >
            <section className="ftco-section" id="inputs">
                <div className="container-xl p-0">
                    <div className="row ml-0 mr-0 mb-1">
                        <div className="col-md-12">
                            <h2 className="heading-section gaa-title">Annotations</h2>
                        </div>
                    </div>
                    <div id="annotation-index-container">
                        <div className="row mb-3 ml-0 mr-0">
                            <div className="col-sm-12 col-md-9 col-lg-9 text-center text-sm-center text-md-left text-lg-left mb-3"></div>
                            <div className="col-sm-12 col-md-3 col-lg-3 text-center text-sm-center text-md-right text-lg-right">
                                <Link to="/annotation/create" className="btn btn-sm gaa-btn-primary text-white float-left w-100"><i className=" mr-2 fa fa-plus"></i>Add Manual</Link>
                            </div>
                        </div>
                        <div className="row mb-1 ml-0 mr-0">
                            <div className="col-sm-12 col-md-2 col-lg-2 text-center text-sm-center text-md-left text-lg-left mb-3">
                                <select name="sortBy" id="sort-by" value={this.state.sortBy} className="form-control" onChange={this.sort}>
                                    <option value="Null">Sort By</option>
                                    <option value="added">Added</option>
                                    <option value="date">By Date</option>
                                    <option value="category">By Category</option>
                                    <option value="ga-property">By GA Property</option>
                                    <option value="added-by">By Colour</option>
                                </select>

                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3 text-center text-sm-center text-md-left text-lg-left">
                                {
                                    this.state.sortBy == "ga-property" ?
                                        <GoogleAnalyticsPropertySelect name={'googleAnalyticsProperty'} id={'googleAnalyticsProperty'} value={this.state.googleAnalyticsProperty} onChangeCallback={(e) => { this.sortByProperty(e.target.value) }} />
                                        : null
                                }
                                {
                                    this.state.sortBy == "category" ?
                                        <select name="category" id="category" value={this.state.category} className="form-control" onChange={(e) => { this.sortByCategory(e.target.value) }}>
                                            <option value="select-category">Select Category</option>
                                            {
                                                categories.map(cats => (
                                                    <option value={cats.category} key={cats.category}>{cats.category}</option>
                                                ))
                                            }
                                        </select>
                                        : null
                                }
                            </div>
                            <div className="col-sm-12 col-md-4 col-lg-4  text-center text-sm-center text-md-right text-lg-right"></div>
                            <div className="col-sm-12 col-md-3 col-lg-3  text-center text-sm-center text-md-right text-lg-right">
                                <input name="searchText" value={this.state.searchText} className="form-control float-right m-w-255px" placeholder="Search..." onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="row ml-0 mr-0">
                            <div className="col-12">
                                <div id="annotation-table-container" className="table-responsive">
                                    <table className="table table-hover table-borderless table-striped">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Event Name</th>
                                                <th>Description</th>
                                                <th>Properties</th>
                                                <th>Status</th>
                                                <th style={{ minWidth: '100px' }}>Show At</th>
                                                <th style={{ minWidth: '100px' }}>Added By</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="annotation-table-body">
                                            {

                                                this.state.annotations.filter(this.checkSearchText).map(anno => {
                                                    let borderLeftColor = "rgba(0,0,0,.0625)";
                                                    switch (anno.category) {
                                                        case "Google Updates": borderLeftColor = this.state.userAnnotationColors.google_algorithm_updates; break;
                                                        case "Retail Marketing Dates": borderLeftColor = this.state.userAnnotationColors.retail_marketings; break;
                                                        case "Weather Alert": borderLeftColor = this.state.userAnnotationColors.weather_alerts; break;
                                                        case "Website Monitoring": borderLeftColor = this.state.userAnnotationColors.web_monitors; break;
                                                        case "WordPress Updates": borderLeftColor = this.state.userAnnotationColors.wordpress_updates; break;
                                                        case "News Alert": borderLeftColor = this.state.userAnnotationColors.google_alerts; break;
                                                    }
                                                    switch (anno.added_by) {
                                                        case "manual": borderLeftColor = "#002e60"; break;
                                                        case "csv-upload": borderLeftColor = this.state.userAnnotationColors.csv; break;
                                                        case "api": borderLeftColor = this.state.userAnnotationColors.api; break;
                                                    }
                                                    if (anno.category.indexOf("Holiday") !== -1) borderLeftColor = this.state.userAnnotationColors.holidays;

                                                    const currentDateTime = new Date; const annotationDateTime = new Date(anno.show_at);
                                                    const diffTime = annotationDateTime - currentDateTime;
                                                    let rowId = null;
                                                    if (diffTime < 0 && wasLastAnnotationInFuture == true) rowId = 'scrollable-annotation';
                                                    if (diffTime > 0) { wasLastAnnotationInFuture = true; } else { wasLastAnnotationInFuture = false; }

                                                    return (
                                                        <tr key={anno.id} data-diff-in-milliseconds={diffTime} id={rowId}>
                                                            <td style={{ borderLeft: `${borderLeftColor} solid 20px` }}>{anno.category}</td>
                                                            <td>{anno.event_name}</td>
                                                            <td>
                                                                <div className="desc-wrap">
                                                                    <div className="desc-td">
                                                                        <p>
                                                                            {anno.description}
                                                                            {anno.url ? <a href={anno.url} target="_blank" className="ml-1"><i className="fa fa-link"></i></a> : null}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {anno.google_analytics_property_name ? anno.google_analytics_property_name : 'All Properties'}
                                                            </td>
                                                            <td className="text-center">
                                                                {anno.id ?
                                                                    <button className={"btn btn-sm" + (anno.is_enabled ? " btn-success" : " btn-danger") + (this.state.isBusy ? " disabled" : "")} onClick={() => this.toggleStatus(anno.id)}>
                                                                        {anno.is_enabled ? "On" : "Off"}
                                                                    </button>
                                                                    : null}
                                                            </td>
                                                            <td>{moment(anno.show_at).format(timezoneToDateFormat(this.props.user.timezone))}</td>
                                                            <td>{anno.event_name == 'Sample Annotation' ? 'GAannotations' : anno.user_name}</td>
                                                            <td className="text-center">
                                                                {anno.id ?
                                                                    <React.Fragment>
                                                                        <button type="button" onClick={() => {
                                                                            this.deleteAnnotation(anno.id)

                                                                        }} className="btn btn-sm gaa-btn-danger anno-action-btn text-white m-1">
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                        <Link to={`/annotation/${anno.id}/edit`} className="btn anno-action-btn btn-sm gaa-btn-primary text-white m-1" style={{ width: '28.3667px' }}>
                                                                            <i className="fa fa-edit"></i>
                                                                        </Link>

                                                                    </React.Fragment>
                                                                    : null}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }


                                        </tbody>



                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </section>
        </div >;
    }
}