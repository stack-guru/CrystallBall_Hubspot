import React, { useState } from "react";
import { scaleLinear } from "d3-scale";
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from "react-simple-maps";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = (props) => {

    let maxImpressionCount = 0;
    let data = {};
    props.countriesStatistics.forEach(cS => {
        data[cS.country] = cS;
        if (cS.sum_impressions_count > maxImpressionCount) {
            maxImpressionCount = cS.sum_impressions_count
        }
    });

    const colorScale = scaleLinear()
        .domain([0, maxImpressionCount])
        .range(["#c1d0cb", "#15997e"]);

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
