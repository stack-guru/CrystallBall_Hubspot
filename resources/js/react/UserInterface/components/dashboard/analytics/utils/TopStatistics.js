import React from 'react';

export default function TopStatistics(props) {
    return(
        <>

            <div className="">
                <div className={"w-100 report-box"}>
                    {/* <div className="d-flex justify-content-between">
                        <div>
                            <h4 className="card-heading">
                                Today's Expence
                            </h4>
                            <h6>sales summery</h6>
                        </div>
                        <div className="icons">
                            <span> <img src="/images/svg/visitor-country.svg" alt="visit icon" />
                            </span>
                            <span> <img src="/images/svg/dashboard-list-option.svg" alt="list icon" />
                            </span>
                        </div>
                    </div> */}
                    <div className="fourGridBoxesHolder" style={{gap: '15px'}}>
                        <div className=" d-flex flex-column  w-100 box-color1">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon1.svg" alt="list icon" />
                            </span>
                            <h2 className="box-headings"
                            > {props.topStatistics.sum_sessions_count}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px", }}
                            >  Total Sessions
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +8% from yesterday
                            </h5> */}
                        </div>
                        <div className="d-flex flex-column  w-100 box-color2">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon2.svg" alt="list icon" />
                            </span>
                            <h2 className="box-headings"
                            > {props.topStatistics.sum_conversions_count}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px", }}
                            > Total Conversations
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +2% from yesterd
                            </h5> */}
                        </div>
                        <div className="d-flex flex-column w-100 box-color3">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon3.svg" alt="list icon" />
                            </span>

                            <h2 className="box-headings"
                            > {props.topStatistics.sum_events_count}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px", }}
                            > Total Events
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +1% from yesterd
                            </h5> */}
                        </div>
                        <div className="d-flex flex-column w-100 box-color4">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon4.svg" alt="list icon" />
                            </span>

                            <h2 className="box-headings"
                            > {props.topStatistics.sum_users_count}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px",
                            }}
                            > Total Users
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +0% from yesterd
                            </h5> */}
                        </div>
                    </div>

                    <div className="fourGridBoxesHolder mt-4" style={{gap: '15px'}}>
                        <div className=" d-flex flex-column  w-100 box-color1">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon1.svg" alt="list icon" />
                            </span>
                            <h2 className="box-headings"
                            > {props.consoleTopStatistics.min_position_rank}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px", }}
                            >  Min Position Rank
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +8% from yesterday
                            </h5> */}
                        </div>
                        <div className="d-flex flex-column  w-100 box-color2">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon2.svg" alt="list icon" />
                            </span>
                            <h2 className="box-headings"
                            > {props.consoleTopStatistics.sum_impressions_count}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px", }}
                            > Total Impressions
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +2% from yesterd
                            </h5> */}
                        </div>
                        <div className="d-flex flex-column w-100 box-color3">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon3.svg" alt="list icon" />
                            </span>

                            <h2 className="box-headings"
                            > {props.consoleTopStatistics.sum_clicks_count}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px", }}
                            > Total Clicks
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +1% from yesterd
                            </h5> */}
                        </div>
                        <div className="d-flex flex-column w-100 box-color4">
                            <span className="box-icon"> <img src="/images/svg/todays-expence-icon4.svg" alt="list icon" />
                            </span>

                            <h2 className="box-headings"
                            > {props.consoleTopStatistics.max_ctr_count}
                            </h2>
                            <h5 className="box-headings" style={{ color: "#425166", fontWeight: "400", fontSize: "16px",
                            }}
                            > Max Click Through Rate
                            </h5>
                            {/* <h5 className="box-headings" style={{ color: "#4079ED", fontWeight: "400", fontSize: "13px", }}
                            > +0% from yesterd
                            </h5> */}
                        </div>
                    </div>



                </div>
            </div>


              {/* <div id="mainContent" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <div className="row gap-20 masonry pos-r" style={{ position: 'relative', height: '115px' }}>
                    <div className="masonry-item w-100" style={{ position: 'absolute' }}>
                        <div className="row gap-20" style={{ paddingLeft: '12%', paddingRight: '12%' }}>
                            <div className="col-md-3">
                                <div className="layers bd bgc-white p-20">
                                    <div className="layer w-100 mB-10"><h6 className="lh-1">Total Users</h6></div>
                                    <div className="layer w-100"><div className="peers ai-sb fxw-nw">
                                        <div className="peer peer-greed">

                                            <span id="sparklinedash">
                                                <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                            </span>

                                        </div>
                                        <div className="peer">
                                            <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-green-50 c-green-500">{props.topStatistics.sum_users_count}</span>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div><div className="col-md-3"><div className="layers bd bgc-white p-20">
                                <div className="layer w-100 mB-10"><h6 className="lh-1">Total Sessions</h6></div>
                                <div className="layer w-100"><div className="peers ai-sb fxw-nw">
                                    <div className="peer peer-greed">

                                        <span id="sparklinedash2">
                                                        <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                                    </span>

                                    </div><div className="peer">

                                        <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-red-50 c-red-500">{props.topStatistics.sum_sessions_count}</span>

                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="col-md-3">
                                <div className="layers bd bgc-white p-20"><div className="layer w-100 mB-10">
                                    <h6 className="lh-1">Total Events</h6></div><div className="layer w-100">
                                        <div className="peers ai-sb fxw-nw"><div className="peer peer-greed">

                                            <span id="sparklinedash3">
                                                <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                            </span>

                                        </div><div className="peer">

                                                <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-purple-50 c-purple-500">{props.topStatistics.sum_events_count}</span>

                                            </div></div></div></div></div><div className="col-md-3"><div className="layers bd bgc-white p-20">
                                                <div className="layer w-100 mB-10"><h6 className="lh-1">Total Conversions</h6></div>
                                                <div className="layer w-100"><div className="peers ai-sb fxw-nw"><div className="peer peer-greed">

                                                    <span id="sparklinedash4">
                                                        <canvas style={{ display: 'inline-block', width: '45px', height: '20px', verticalAlign: 'top' }} width="45" height="20"></canvas>
                                                    </span>

                                                </div><div className="peer">

                                                        <span className="d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-blue-50 c-blue-500">{props.topStatistics.sum_conversions_count}</span>

                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>; */}
        </>
    ) 
  
}


    {/* <div className="">
        <div className={"w-100 report-box"}>
            <div className="d-flex justify-content-between">
                <div>
                    <h4 className="card-heading">
                        Today's Expence
                    </h4>
                    <h6>sales summery</h6>
                </div>
                <div className="icons">
                    <span>
                        <img
                            src="/images/svg/visitor-country.svg"
                            alt="visit icon"
                        />
                    </span>
                    <span>
                        <img
                            src="/images/svg/dashboard-list-option.svg"
                            alt="list icon"
                        />
                    </span>
                </div>
            </div>
            <div className="fourGridBoxesHolder" style={{gap: '15px'}}>
                <div className=" d-flex flex-column  w-100 box-color1">
                    <span className="box-icon">
                        <img
                            src="/images/svg/todays-expence-icon1.svg"
                            alt="list icon"
                        />
                    </span>
                    <h2
                        className="box-headings"
                    >
                        $1K
                    </h2>
                    <h5
                        className="box-headings"
                        style={{
                            color: "#425166",
                            fontWeight: "400",
                            fontSize: "16px",
                        }}
                    >
                        Total sales
                    </h5>
                    <h5
                        className="box-headings"
                        style={{
                            color: "#4079ED",
                            fontWeight: "400",
                            fontSize: "13px",
                        }}
                    >
                        +8% from yesterday
                    </h5>
                </div>
                <div className="d-flex flex-column  w-100 box-color2">
                    <span className="box-icon">
                        <img
                            src="/images/svg/todays-expence-icon2.svg"
                            alt="list icon"
                        />
                    </span>
                    <h2
                        className="box-headings"
                    >
                        300
                    </h2>
                    <h5
                        className="box-headings"
                        style={{
                            color: "#425166",
                            fontWeight: "400",
                            fontSize: "16px",
                        }}
                    >
                        Total orders
                    </h5>
                    <h5
                        className="box-headings"
                        style={{
                            color: "#4079ED",
                            fontWeight: "400",
                            fontSize: "13px",
                        }}
                    >
                        +8% from yesterd
                    </h5>
                </div>
                <div className="d-flex flex-column w-100 box-color3">
                    <span className="box-icon">
                        <img
                            src="/images/svg/todays-expence-icon3.svg"
                            alt="list icon"
                        />
                    </span>

                    <h2
                        className="box-headings"
                    >
                        5
                    </h2>
                    <h5
                        className="box-headings"
                        style={{
                            color: "#425166",
                            fontWeight: "400",
                            fontSize: "16px",
                        }}
                    >
                        Total sales
                    </h5>
                    <h5
                        className="box-headings"
                        style={{
                            color: "#4079ED",
                            fontWeight: "400",
                            fontSize: "13px",
                        }}
                    >
                        +8% from yesterd
                    </h5>
                </div>
                <div className="d-flex flex-column w-100 box-color4">
                    <span className="box-icon">
                        <img
                            src="/images/svg/todays-expence-icon4.svg"
                            alt="list icon"
                        />
                    </span>

                    <h2
                        className="box-headings"
                    >
                        300
                    </h2>
                    <h5 className="box-headings"
                        style={{
                        color: "#425166",
                        fontWeight: "400",
                        fontSize: "16px",
                    }}
                    >
                        Total orders
                    </h5>
                    <h5
                        className="box-headings"
                        style={{
                            color: "#4079ED",
                            fontWeight: "400",
                            fontSize: "13px",
                        }}
                    >
                        +8% from yesterd
                    </h5>
                </div>
            </div>
        </div>

        <div className="w-100 report-box">
            <div>
                <p>
                    Create your own moodboard <br />
                    and find them all at one place
                </p>
            </div>
            <div>
                <form>
                    <span>
                        <img
                            src="/images/svg/image.svg"
                            alt="image icon"
                        />
                    </span>
                    <input
                        className="add-  "
                        type="file"
                        placeholder="Add image"
                        id="img"
                        name="img"
                        accept="image/*"
                    />
                </form>
            </div>
        </div>

    </div> */}