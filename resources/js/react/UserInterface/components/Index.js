import React from 'react';


class Index extends React.Component{

    constructor() {
        super();
    }
    render() {
        return(
            <div id="mainContent">
                <div className="row gap-20 masonry pos-r">
                    <div className="masonry-sizer col-md-6"></div>
                    <div className="masonry-item w-100">
                        <div className="row gap-20">
                            <div className="col-md-3">
                                <div className="layers bd bgc-white p-20">
                                    <div className="layer w-100 mB-10"><h6 className="lh-1">Total Visits</h6></div>
                                    <div className="layer w-100">
                                        <div className="peers ai-sb fxw-nw">
                                            <div className="peer peer-greed"><span id="sparklinedash"></span></div>
                                            <div className="peer"><span
                                                className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-green-50 c-green-500">+10%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="layers bd bgc-white p-20">
                                    <div className="layer w-100 mB-10"><h6 className="lh-1">Total Page Views</h6></div>
                                    <div className="layer w-100">
                                        <div className="peers ai-sb fxw-nw">
                                            <div className="peer peer-greed"><span id="sparklinedash2"></span></div>
                                            <div className="peer"><span
                                                className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-red-50 c-red-500">-7%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="layers bd bgc-white p-20">
                                    <div className="layer w-100 mB-10"><h6 className="lh-1">Unique Visitor</h6></div>
                                    <div className="layer w-100">
                                        <div className="peers ai-sb fxw-nw">
                                            <div className="peer peer-greed"><span id="sparklinedash3"></span></div>
                                            <div className="peer"><span
                                                className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-purple-50 c-purple-500">~12%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="layers bd bgc-white p-20">
                                    <div className="layer w-100 mB-10"><h6 className="lh-1">Bounce Rate</h6></div>
                                    <div className="layer w-100">
                                        <div className="peers ai-sb fxw-nw">
                                            <div className="peer peer-greed"><span id="sparklinedash4"></span></div>
                                            <div className="peer"><span
                                                className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-blue-50 c-blue-500">33%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="masonry-item col-12">
                        <div className="bd bgc-white">
                            <div className="peers fxw-nw@lg+ ai-s">
                                <div className="peer peer-greed w-70p@lg+ w-100@lg- p-20">
                                    <div className="layers">
                                        <div className="layer w-100 mB-10"><h6 className="lh-1">Site Visits</h6></div>
                                        <div className="layer w-100">
                                            <div id="world-map-marker"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="peer bdL p-20 w-30p@lg+ w-100p@lg-">
                                    <div className="layers">
                                        <div className="layer w-100">
                                            <div className="layers">
                                                <div className="layer w-100"><h5 className="mB-5">100k</h5><small
                                                    className="fw-600 c-grey-700">Visitors From USA</small> <span
                                                    className="pull-right c-grey-600 fsz-sm">50%</span>
                                                    <div className="progress mT-10">
                                                        <div className="progress-bar bgc-deep-purple-500"
                                                             role="progressbar"
                                                             aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: 50 +'%'}}><span
                                                            className="sr-only">50% Complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="layer w-100 mT-15"><h5 className="mB-5">1M</h5><small
                                                    className="fw-600 c-grey-700">Visitors From Europe</small> <span
                                                    className="pull-right c-grey-600 fsz-sm">80%</span>
                                                    <div className="progress mT-10">
                                                        <div className="progress-bar bgc-green-500" role="progressbar"
                                                             aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
                                                             style={{width:80+'%'}}><span
                                                            className="sr-only">80% Complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="layer w-100 mT-15"><h5 className="mB-5">450k</h5><small
                                                    className="fw-600 c-grey-700">Visitors From Australia</small> <span
                                                    className="pull-right c-grey-600 fsz-sm">40%</span>
                                                    <div className="progress mT-10">
                                                        <div className="progress-bar bgc-light-blue-500"
                                                             role="progressbar"
                                                             aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
                                                             style={{width:40+"%"}}><span
                                                            className="sr-only">40% Complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="layer w-100 mT-15"><h5 className="mB-5">1B</h5><small
                                                    className="fw-600 c-grey-700">Visitors From India</small> <span
                                                    className="pull-right c-grey-600 fsz-sm">90%</span>
                                                    <div className="progress mT-10">
                                                        <div className="progress-bar bgc-blue-grey-500"
                                                             role="progressbar"
                                                             aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
                                                             style={{width: 90 +'%'}}><span
                                                            className="sr-only">90% Complete</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="peers pT-20 mT-20 bdT fxw-nw@lg+ jc-sb ta-c gap-10">
                                                <div className="peer">
                                                    <div className="easy-pie-chart" data-size="80" data-percent="75"
                                                         data-bar-color="#f44336"><span></span></div>
                                                    <h6 className="fsz-sm">New Users</h6></div>
                                                <div className="peer">
                                                    <div className="easy-pie-chart" data-size="80" data-percent="50"
                                                         data-bar-color="#2196f3"><span></span></div>
                                                    <h6 className="fsz-sm">New Purchases</h6></div>
                                                <div className="peer">
                                                    <div className="easy-pie-chart" data-size="80" data-percent="90"
                                                         data-bar-color="#ff9800"><span></span></div>
                                                    <h6 className="fsz-sm">Bounce Rate</h6></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="masonry-item col-md-6">
                        <div className="bd bgc-white">
                            <div className="layers">
                                <div className="layer w-100 pX-20 pT-20"><h6 className="lh-1">Monthly Stats</h6></div>
                                <div className="layer w-100 p-20">
                                    <canvas id="line-chart" height="220"></canvas>
                                </div>
                                <div className="layer bdT p-20 w-100">
                                    <div className="peers ai-c jc-c gapX-20">
                                        <div className="peer"><span className="fsz-def fw-600 mR-10 c-grey-800">10% <i
                                            className="fa fa-level-up c-green-500"></i></span> <small
                                            className="c-grey-500 fw-600">APPL</small></div>
                                        <div className="peer fw-600"><span
                                            className="fsz-def fw-600 mR-10 c-grey-800">2% <i
                                            className="fa fa-level-down c-red-500"></i></span> <small
                                            className="c-grey-500 fw-600">Average</small></div>
                                        <div className="peer fw-600"><span
                                            className="fsz-def fw-600 mR-10 c-grey-800">15% <i
                                            className="fa fa-level-up c-green-500"></i></span> <small
                                            className="c-grey-500 fw-600">Sales</small></div>
                                        <div className="peer fw-600"><span
                                            className="fsz-def fw-600 mR-10 c-grey-800">8% <i
                                            className="fa fa-level-down c-red-500"></i></span> <small
                                            className="c-grey-500 fw-600">Profit</small></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="masonry-item col-md-6">
                        <div className="bd bgc-white p-20">
                            <div className="layers">
                                <div className="layer w-100 mB-10"><h6 className="lh-1">Todo List</h6></div>
                                <div className="layer w-100">
                                    <ul className="list-task list-group" data-role="tasklist">
                                        <li className="list-group-item bdw-0" data-role="task">
                                            <div className="checkbox checkbox-circle checkbox-info peers ai-c"><input
                                                type="checkbox" id="inputCall1" name="inputCheckboxesCall"
                                                className="peer"/> <label htmlFor="inputCall1"
                                                                         className="peers peer-greed js-sb ai-c"><span
                                                className="peer peer-greed">Call John for Dinner</span></label>
                                            </div>
                                        </li>
                                        <li className="list-group-item bdw-0" data-role="task">
                                            <div className="checkbox checkbox-circle checkbox-info peers ai-c"><input
                                                type="checkbox" id="inputCall2" name="inputCheckboxesCall"
                                                className="peer"/> <label htmlFor="inputCall2"
                                                                         className="peers peer-greed js-sb ai-c"><span
                                                className="peer peer-greed">Book Boss Flight</span> <span
                                                className="peer"><span
                                                className="badge badge-pill fl-r badge-success lh-0 p-10">2 Days</span></span></label>
                                            </div>
                                        </li>
                                        <li className="list-group-item bdw-0" data-role="task">
                                            <div className="checkbox checkbox-circle checkbox-info peers ai-c"><input
                                                type="checkbox" id="inputCall3" name="inputCheckboxesCall"
                                                className="peer"/> <label htmlFor="inputCall3"
                                                                         className="peers peer-greed js-sb ai-c"><span
                                                className="peer peer-greed">Hit the Gym</span> <span
                                                className="peer"><span
                                                className="badge badge-pill fl-r badge-danger lh-0 p-10">3 Minutes</span></span></label>
                                            </div>
                                        </li>
                                        <li className="list-group-item bdw-0" data-role="task">
                                            <div className="checkbox checkbox-circle checkbox-info peers ai-c"><input
                                                type="checkbox" id="inputCall4" name="inputCheckboxesCall"
                                                className="peer"/> <label htmlFor="inputCall4"
                                                                         className="peers peer-greed js-sb ai-c"><span
                                                className="peer peer-greed">Give Purchase Report</span> <span
                                                className="peer"><span
                                                className="badge badge-pill fl-r badge-warning lh-0 p-10">not important</span></span></label>
                                            </div>
                                        </li>
                                        <li className="list-group-item bdw-0" data-role="task">
                                            <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                                                <input type="checkbox" id="inputCall5" name="inputCheckboxesCall" className="peer"/>
                                                <label htmlFor="inputCall5" className="peers peer-greed js-sb ai-c">
                                                    <span className="peer peer-greed">Watch Game of Thrones Episode</span>
                                                <span className="peer"><span
                                                    className="badge badge-pill fl-r badge-info lh-0 p-10">Tomorrow</span></span></label>
                                            </div>
                                        </li>
                                        <li className="list-group-item bdw-0" data-role="task">
                                            <div className="checkbox checkbox-circle checkbox-info peers ai-c"><input
                                                type="checkbox" id="inputCall6" name="inputCheckboxesCall"
                                                className="peer"/> <label htmlFor="inputCall6"
                                                                         className="peers peer-greed js-sb ai-c"><span
                                                className="peer peer-greed">Give Purchase report</span> <span
                                                className="peer"><span
                                                className="badge badge-pill fl-r badge-success lh-0 p-10">Done</span></span></label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="masonry-item col-md-6">
                        <div className="bd bgc-white">
                            <div className="layers">
                                <div className="layer w-100 p-20"><h6 className="lh-1">Sales Report</h6></div>
                                <div className="layer w-100">
                                    <div className="bgc-light-blue-500 c-white p-20">
                                        <div className="peers ai-c jc-sb gap-40">
                                            <div className="peer peer-greed"><h5>November 2017</h5>
                                                <p className="mB-0">Sales Report</p></div>
                                            <div className="peer"><h3 className="text-right">$6,000</h3></div>
                                        </div>
                                    </div>
                                    <div className="table-responsive p-20">
                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th className="bdwT-0">Name</th>
                                                <th className="bdwT-0">Status</th>
                                                <th className="bdwT-0">Date</th>
                                                <th className="bdwT-0">Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td className="fw-600">Item #1 Name</td>
                                                <td><span
                                                    className="badge bgc-red-50 c-red-700 p-10 lh-0 tt-c badge-pill">Unavailable</span>
                                                </td>
                                                <td>Nov 18</td>
                                                <td><span className="text-success">$12</span></td>
                                            </tr>
                                            <tr>
                                                <td className="fw-600">Item #2 Name</td>
                                                <td><span
                                                    className="badge bgc-deep-purple-50 c-deep-purple-700 p-10 lh-0 tt-c badge-pill">New</span>
                                                </td>
                                                <td>Nov 19</td>
                                                <td><span className="text-info">$34</span></td>
                                            </tr>
                                            <tr>
                                                <td className="fw-600">Item #3 Name</td>
                                                <td><span
                                                    className="badge bgc-pink-50 c-pink-700 p-10 lh-0 tt-c badge-pill">New</span>
                                                </td>
                                                <td>Nov 20</td>
                                                <td><span className="text-danger">-$45</span></td>
                                            </tr>
                                            <tr>
                                                <td className="fw-600">Item #4 Name</td>
                                                <td><span
                                                    className="badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill">Unavailable</span>
                                                </td>
                                                <td>Nov 21</td>
                                                <td><span className="text-success">$65</span></td>
                                            </tr>
                                            <tr>
                                                <td className="fw-600">Item #5 Name</td>
                                                <td><span
                                                    className="badge bgc-red-50 c-red-700 p-10 lh-0 tt-c badge-pill">Used</span>
                                                </td>
                                                <td>Nov 22</td>
                                                <td><span className="text-success">$78</span></td>
                                            </tr>
                                            <tr>
                                                <td className="fw-600">Item #6 Name</td>
                                                <td><span
                                                    className="badge bgc-orange-50 c-orange-700 p-10 lh-0 tt-c badge-pill">Used</span>
                                                </td>
                                                <td>Nov 23</td>
                                                <td><span className="text-danger">-$88</span></td>
                                            </tr>
                                            <tr>
                                                <td className="fw-600">Item #7 Name</td>
                                                <td><span
                                                    className="badge bgc-yellow-50 c-yellow-700 p-10 lh-0 tt-c badge-pill">Old</span>
                                                </td>
                                                <td>Nov 22</td>
                                                <td><span className="text-success">$56</span></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="ta-c bdT w-100 p-20"><a href="#">Check all the sales</a></div>
                        </div>
                    </div>
                    <div className="masonry-item col-md-6">
                        <div className="bd bgc-white p-20">
                            <div className="layers">
                                <div className="layer w-100 mB-20"><h6 className="lh-1">Weather</h6></div>
                                <div className="layer w-100">
                                    <div className="peers ai-c jc-sb fxw-nw">
                                        <div className="peer peer-greed">
                                            <div className="layers">
                                                <div className="layer w-100">
                                                    <div className="peers fxw-nw ai-c">
                                                        <div className="peer mR-20"><h3>32<sup>°F</sup></h3></div>
                                                        <div className="peer">
                                                            <canvas className="sleet" width="44" height="44"></canvas>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="layer w-100"><span
                                                    className="fw-600 c-grey-600">Partly Clouds</span></div>
                                            </div>
                                        </div>
                                        <div className="peer">
                                            <div className="layers ai-fe">
                                                <div className="layer"><h5 className="mB-5">Monday</h5></div>
                                                <div className="layer"><span
                                                    className="fw-600 c-grey-600">Nov, 01 2017</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="layer w-100 mY-30">
                                    <div className="layers bdB">
                                        <div className="layer w-100 bdT pY-5">
                                            <div className="peers ai-c jc-sb fxw-nw">
                                                <div className="peer"><span>Wind</span></div>
                                                <div className="peer ta-r"><span
                                                    className="fw-600 c-grey-800">10km/h</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="layer w-100 bdT pY-5">
                                            <div className="peers ai-c jc-sb fxw-nw">
                                                <div className="peer"><span>Sunrise</span></div>
                                                <div className="peer ta-r"><span
                                                    className="fw-600 c-grey-800">05:00 AM</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="layer w-100 bdT pY-5">
                                            <div className="peers ai-c jc-sb fxw-nw">
                                                <div className="peer"><span>Pressure</span></div>
                                                <div className="peer ta-r"><span className="fw-600 c-grey-800">1B</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="layer w-100">
                                    <div className="peers peers-greed ai-fs ta-c">
                                        <div className="peer"><h6 className="mB-10">MON</h6>
                                            <canvas className="sleet" width="30" height="30"></canvas>
                                            <span className="d-b fw-600">32<sup>°F</sup></span></div>
                                        <div className="peer"><h6 className="mB-10">TUE</h6>
                                            <canvas className="clear-day" width="30" height="30"></canvas>
                                            <span className="d-b fw-600">30<sup>°F</sup></span></div>
                                        <div className="peer"><h6 className="mB-10">WED</h6>
                                            <canvas className="partly-cloudy-day" width="30" height="30"></canvas>
                                            <span className="d-b fw-600">28<sup>°F</sup></span></div>
                                        <div className="peer"><h6 className="mB-10">THR</h6>
                                            <canvas className="cloudy" width="30" height="30"></canvas>
                                            <span className="d-b fw-600">32<sup>°F</sup></span></div>
                                        <div className="peer"><h6 className="mB-10">FRI</h6>
                                            <canvas className="snow" width="30" height="30"></canvas>
                                            <span className="d-b fw-600">24<sup>°F</sup></span></div>
                                        <div className="peer"><h6 className="mB-10">SAT</h6>
                                            <canvas className="wind" width="30" height="30"></canvas>
                                            <span className="d-b fw-600">28<sup>°F</sup></span></div>
                                        <div className="peer"><h6 className="mB-10">SUN</h6>
                                            <canvas className="sleet" width="30" height="30"></canvas>
                                            <span className="d-b fw-600">32<sup>°F</sup></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="masonry-item col-md-6">
                        <div className="bd bgc-white">
                            <div className="layers">
                                <div className="layer w-100 p-20"><h6 className="lh-1">Quick Chat</h6></div>
                                <div className="layer w-100">
                                    <div className="bgc-grey-200 p-20 gapY-15">
                                        <div className="peers fxw-nw">
                                            <div className="peer mR-20">
                                                <img className="w-2r bdrs-50p" src="https://randomuser.me/api/portraits/men/11.jpg" alt=""/></div>
                                            <div className="peer peer-greed">
                                                <div className="layers ai-fs gapY-5">
                                                    <div className="layer">
                                                        <div
                                                            className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
                                                            <div className="peer mR-10"><small>10:00 AM</small></div>
                                                            <div className="peer-greed"><span>Lorem Ipsum is simply dummy text of</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="layer">
                                                        <div
                                                            className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
                                                            <div className="peer mR-10"><small>10:00 AM</small></div>
                                                            <div className="peer-greed"><span>the printing and typesetting industry.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="layer">
                                                        <div
                                                            className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
                                                            <div className="peer mR-10"><small>10:00 AM</small></div>
                                                            <div className="peer-greed"><span>Lorem Ipsum has been the industry's</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="peers fxw-nw ai-fe">
                                            <div className="peer ord-1 mL-20"><img className="w-2r bdrs-50p"
                                                                                   src="https://randomuser.me/api/portraits/men/12.jpg"
                                                                                   alt=""/></div>
                                            <div className="peer peer-greed ord-0">
                                                <div className="layers ai-fe gapY-10">
                                                    <div className="layer">
                                                        <div
                                                            className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
                                                            <div className="peer mL-10 ord-1"><small>10:00 AM</small>
                                                            </div>
                                                            <div className="peer-greed ord-0"><span>Heloo</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="layer">
                                                        <div
                                                            className="peers fxw-nw ai-c pY-3 pX-10 bgc-white bdrs-2 lh-3/2">
                                                            <div className="peer mL-10 ord-1"><small>10:00 AM</small>
                                                            </div>
                                                            <div className="peer-greed ord-0"><span>??</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-20 bdT bgc-white">
                                        <div className="pos-r"><input type="text" className="form-control bdrs-10em m-0"
                                                                      placeholder="Say something..."/>
                                            <button type="button"
                                                    className="btn btn-primary bdrs-50p w-2r p-0 h-2r pos-a r-1 t-1"><i
                                                className="fa fa-paper-plane-o"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Index;
