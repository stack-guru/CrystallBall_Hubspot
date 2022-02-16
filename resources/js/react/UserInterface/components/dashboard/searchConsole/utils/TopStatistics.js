import React from 'react';

export default function TopStatistics(props) {
    return <div id="mainContent">
        <div className="row gap-20 masonry pos-r" style={{ position: 'relative', height: '115px' }}>
            <div className="masonry-item w-100" style={{ position: 'absolute', paddingLeft: '5%', paddingRight: '5%' }}>
                <div className="row gap-20" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
                    <div className="col-md-3">
                        <div className="layers bd bgc-white p-20">
                            <div className="layer w-100 mB-10"><h6 className="lh-1">Total Visits</h6></div>
                            <div className="layer w-100"><div className="peers ai-sb fxw-nw">
                                <div className="peer peer-greed">

                                    {/* <span id="sparklinedash">
                                        <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                    </span> */}

                                </div><div className="peer">

                                    <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-green-50 c-green-500">+10%</span>

                                </div></div></div></div></div><div className="col-md-3"><div className="layers bd bgc-white p-20">
                                    <div className="layer w-100 mB-10"><h6 className="lh-1">Total Page Views</h6></div>
                                    <div className="layer w-100"><div className="peers ai-sb fxw-nw">
                                        <div className="peer peer-greed">

                                            {/* <span id="sparklinedash2">
                                                <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                            </span> */}

                                        </div><div className="peer">

                                            <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-red-50 c-red-500">-7%</span>

                                        </div></div></div></div></div><div className="col-md-3">
                        <div className="layers bd bgc-white p-20"><div className="layer w-100 mB-10">
                            <h6 className="lh-1">Unique Visitor</h6></div><div className="layer w-100">
                                <div className="peers ai-sb fxw-nw"><div className="peer peer-greed">

                                    {/* <span id="sparklinedash3">
                                        <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                    </span> */}

                                </div><div className="peer">

                                        <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-purple-50 c-purple-500">~12%</span>

                                    </div></div></div></div></div><div className="col-md-3"><div className="layers bd bgc-white p-20">
                                        <div className="layer w-100 mB-10"><h6 className="lh-1">Bounce Rate</h6></div>
                                        <div className="layer w-100"><div className="peers ai-sb fxw-nw"><div className="peer peer-greed">

                                            {/* <span id="sparklinedash4">
                                                <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                            </span> */}

                                        </div><div className="peer">

                                                <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-blue-50 c-blue-500">33%</span>

                                            </div>
                                        </div>
                                        </div>
                                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}