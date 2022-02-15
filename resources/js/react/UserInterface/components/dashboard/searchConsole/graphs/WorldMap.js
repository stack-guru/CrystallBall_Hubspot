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
        .range(["#c1d0cb", "#164ea5"]);
    // .range(["#8bb4f7", "#164ea5"]);
    // .range(["#c1d0cb", "#15997e"]);

    return (
        <ComposableMap
            projectionConfig={{
                // rotate: [-10, 0, 0],
                scale: 147
            }}
        >
            {/* <Sphere stroke="#E4E5E6" strokeWidth={0.5} /> */}
            {/* <Graticule stroke="#E4E5E6" strokeWidth={0.5} /> */}
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
    );
};

export default MapChart;
