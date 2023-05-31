import React from "react";
import { Button, Popover, PopoverHeader, PopoverBody } from "reactstrap";

import YoutubeConfig from "./YoutubeConfig";

const YoutubeMonitor = ({ sectionName, is_ds_youtube_tracking_enabled, serviceStatusHandler, sectionToggler }) => {
    return (
        <div
            className="d-flex border rounded flex-column justify-content-between"
            style={{ minHeight: "180px" }}
        >
            <div>
                <div
                    className="d-flex mt-2 justify-content-between "
                    id="keyword-tracking-data-source-section"
                >
                    <div className="px-2">
                        <h2>
                            <small>
                                Youtube Monitors{" "}
                                <img
                                    id="youtube"
                                    className="hint-button-2"
                                    src="/images/info-logo.png"
                                />
                            </small>
                        </h2>
                    </div>

                    <div className="px-2 text-center">
                        {is_ds_youtube_tracking_enabled
                            ? "ON"
                            : "OFF"}
                        <label className="trigger switch">
                            <input
                                type="checkbox"
                                checked={
                                    is_ds_youtube_tracking_enabled
                                }
                                onChange={serviceStatusHandler}
                                name="is_ds_youtube_tracking_enabled"
                            />
                            <span
                                className={`slider round ${
                                    is_ds_youtube_tracking_enabled
                                        ? "animate-pulse"
                                        : ""
                                }`}
                            />
                        </label>
                    </div>
                </div>
                {/* TODO: Need help for plan */}
                <div className="ml-2">Credits: TODO</div>
            </div>
            <div>
                <p
                    className="ds-update-text m-0 px-2 text-right"
                    onClick={() => {
                        sectionToggler();
                    }}
                >
                    {sectionName == "youtube"
                        ? "Hide"
                        : "Configure Monitor"}
                </p>
            </div>
        </div>
    );
};

export default YoutubeMonitor;
export { YoutubeConfig };
