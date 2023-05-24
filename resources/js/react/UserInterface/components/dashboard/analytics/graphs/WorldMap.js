import React, { useState } from "react";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = (props) => {

    let maxImpressionCount = 0;
    let minImpressionCount = 0;
    let data = {};
    props.countriesStatistics.forEach(cS => {
        data[cS.country] = cS;
        if (cS.sum_impressions_count > maxImpressionCount) {
            maxImpressionCount = cS.sum_impressions_count
        }
        if (cS.sum_impressions_count < minImpressionCount) {
            minImpressionCount = cS.sum_impressions_count
        }
    });

    // Substracting 10 from least impression value to prevent showing #c1d0cb color for countries with least impressions
    // Adding 1 to max impression value to prevent showing black color for countries with max impressions
    const colorScale = scaleLinear()
        .domain([minImpressionCount - 10, maxImpressionCount + 1])
        .range(["#d7ecfb", "#59afff"]);
    // .range(["#8bb4f7", "#164ea5"]);
    // .range(["#c1d0cb", "#15997e"]);

    return (
        <>
            
            {/* <div className="report-box">
                            <div className="justify-content-between d-flex">
                                <div className="d-flex flex-column">
                                    <h3 className="card-heading">
                                        Visitors by country
                                    </h3>
                                    <h6>Traffic analyze</h6>
                                </div>
                                
                                <div className="flex">
                                    <span>
                                        <img
                                            src="/images/svg/visitor-country.svg"
                                            alt="option icon"
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
                            <div className="mb-3">                                
                                 <img
                                        src="/images/svg/map.svg"
                                        alt="map Image"
                                    />                                
                                </div>
                            <h4 className="card-heading">Top countries</h4>

                            <div className="d-flex flex-row">
                                <span className="pr-2 d-flex align-items-center">
                                        <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                        <img
                                            style={{'width': '100%', 'height':'auto',}}
                                            src="/images/svg/usa.svg"
                                            alt="usa icon"
                                        />
                                        </span>
                                        <h5 className="country-name">United states</h5>
                                </span>                                
                                <h5 className="ml-5">123456</h5>
                            </div>
                            <div className="d-flex flex-row">
                            <span className="pr-2 d-flex align-items-center">
                                        <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                        <img
                                            style={{'width': '100%', 'height':'auto',}}
                                            src="/images/svg/germany.svg"
                                            alt="usa icon"
                                        />
                                        </span>
                                        <h5 className="country-name">Germany</h5>
                                </span> 
                                <h5 className="ml-5">123456</h5>
                            </div>
                            <div className="d-flex flex-row">
                            <span className="pr-2 d-flex align-items-center">
                                        <span style={{'width': '1rem', 'display':'block', 'marginRight':'8px'}}>
                                        <img
                                            style={{'width': '100%', 'height':'auto',}}
                                            src="/images/svg/canada.svg"
                                            alt="usa icon"
                                        />
                                        </span>
                                        <h5 className="country-name">Canada</h5>
                                </span>                                
                                <h5 className="ml-5">123456</h5>
                            </div>
            </div> */}


            <div className="report-box">
                <div className="justify-content-between d-flex">
                    <div className="d-flex flex-column">
                        <h3 className="card-heading">
                            Visitors by country
                        </h3>
                        <h6>Traffic analyze</h6>
                    </div>
                    
                    <div className="flex">
                        <span>
                            <img
                                src="/images/svg/visitor-country.svg"
                                alt="option icon"
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
                <ComposableMap
                    projectionConfig={{

                        // comment this line rotate: [-10, 0, 0],
                        scale: 147
                    }}
                >
                {/* comment this line <Sphere stroke="#E4E5E6" strokeWidth={0.5} /> */}
                {/* comment this line <Graticule stroke="#E4E5E6" strokeWidth={0.5} /> */}
                {true && (
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const d = data[(geo.properties.ISO_A3).toLowerCase()];
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={d ? colorScale(d.sum_impressions_count) : "#c1d0cb"}
                                    />
                                );
                            })
                        }
                    </Geographies>
                )}
                </ComposableMap>
           
           </div>
           
        </>
    );
};

export default MapChart;
