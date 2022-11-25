import React from "react";
import ApplePodcastConfig from "./ApplePodcastConfig";

const ApplePodcast = ({
    state,
    serviceStatusHandler,
    sectionToggler,
}) => {
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
                                Apple Podcast{" "}
                                <img
                                    id="apple-podcast"
                                    className="hint-button-2"
                                    src="/images/info-logo.png"
                                />
                            </small>
                        </h2>
                    </div>

                    <div className="px-2 text-center">
                        {state.userServices
                            .is_ds_apple_podcast_annotation_enabled
                            ? "ON"
                            : "OFF"}
                        <label className="trigger switch">
                            <input
                                type="checkbox"
                                checked={
                                    state.userServices
                                        .is_ds_apple_podcast_annotation_enabled
                                }
                                onChange={serviceStatusHandler}
                                name="is_ds_apple_podcast_annotation_enabled"
                            />
                            <span
                                className={`slider round ${
                                    state.userServices
                                        .is_ds_apple_podcast_annotation_enabled
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
                    {state.sectionName == "apple_podcast"
                        ? "Hide"
                        : "Configure Podcast"}
                </p>
            </div>
        </div>
    );
};

export default ApplePodcast;
export { ApplePodcastConfig };
