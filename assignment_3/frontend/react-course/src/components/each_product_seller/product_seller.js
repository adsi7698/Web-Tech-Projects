import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import NoRecords from "../NoRecords/NoRecords";
import { useState } from "react";

function ProductSeller(props) {
    const seller_details = [];
    var star_type = "grade";

    try {
        if (props.selected_item.Item.Seller.FeedbackScore) {
            const temp_array = [];
            temp_array[0] = "Feedback Score";
            temp_array[1] = props.selected_item.Item.Seller.FeedbackScore;
            seller_details.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.Seller.PositiveFeedbackPercent) {
            const temp_array = [];
            temp_array[0] = "Popularity";
            temp_array[1] =
                props.selected_item.Item.Seller.PositiveFeedbackPercent;
            seller_details.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.Seller.FeedbackRatingStar) {
            const temp_array = [];
            temp_array[0] = "Feedback Rating Star";
            temp_array[1] = props.selected_item.Item.Seller.FeedbackRatingStar;

            try {
                if (props.selected_item.Item.Seller.FeedbackScore >= 10000) {
                    star_type = "stars";
                }
            } catch (error) {
                // error
            }

            seller_details.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.Seller.TopRatedSeller) {
            const temp_array = [];
            temp_array[0] = "Top Rated";
            temp_array[1] = props.selected_item.Item.Seller.TopRatedSeller;
            seller_details.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.Storefront.StoreName) {
            const temp_array = [];
            temp_array[0] = "Store Name";
            temp_array[1] = props.selected_item.Item.Storefront.StoreName;
            seller_details.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.Storefront.StoreName) {
            const temp_array = [];
            temp_array[0] = "Buy Product At";
            temp_array[1] = "Store";
            temp_array[2] = props.selected_item.Item.Storefront.StoreURL;
            seller_details.push(temp_array);
        }
    } catch (error) {
        // error
    }

    function renderBootstraps(item) {
        if (item[0] === "Buy Product At") {
            return (
                <div className="col-12 col-sm-8">
                    <td className="row mx-2">
                        <a
                            href={item[2]}
                            style={{
                                color: "rgb(34, 148, 133)",
                                textDecoration: "none",
                            }}
                            target="_blank"
                        >
                            {item[1]}
                        </a>
                    </td>
                </div>
            );
        } else if (item[0] === "Popularity") {
            return (
                <>
                    <div className="col-12 col-sm-8">
                        <td className="row mx-2">
                            <div style={{ width: "65px", height: "65px" }}>
                                <CircularProgressbar
                                    value={item[1]}
                                    text={item[1]}
                                    styles={buildStyles({
                                        textSize: "35px",
                                        pathColor: `#176e14`,
                                        textColor: `#ffffff`,
                                        trailColor: "#ffff0f",
                                    })}
                                />
                            </div>
                        </td>
                    </div>
                </>
            );
        } else if (item[0] === "Feedback Rating Star") {
            return (
                <div className="col-12 col-sm-8">
                    <td className="row mx-2">
                        <span
                            className={
                                star_type === "grade"
                                    ? "material-symbols-outlined"
                                    : "material-icons"
                            }
                            style={{ color: item[1], fontSize: "40px" }}
                        >
                            {star_type}
                        </span>
                    </td>
                </div>
            );
        } else if (item[0] === "Top Rated") {
            if (item[1]) {
                return (
                    <div className="col-12 col-sm-8">
                        <td className="row mx-2">
                            <span
                                className="material-symbols-outlined"
                                style={{ color: "green" }}
                            >
                                done
                            </span>
                        </td>
                    </div>
                );
            } else {
                return (
                    <div className="col-12 col-sm-8">
                        <td className="row mx-2">
                            <span
                                className="material-symbols-outlined"
                                style={{ color: "red" }}
                            >
                                close
                            </span>
                        </td>
                    </div>
                );
            }
        } else {
            return (
                <div className="col-12 col-sm-8">
                    <td className="row mx-2">&nbsp;&nbsp;&nbsp;{item[1]}</td>
                </div>
            );
        }
    }

    return (
        <>
            {seller_details.length !== 0 ? (
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <table className="table table-dark table-striped fs-8">
                            <tbody>
                                <tr className="row">
                                    <div className="col-12 col-sm-4">
                                        <td className="row mx-2"></td>
                                    </div>
                                    <div className="col-12 col-sm-8">
                                        <td
                                            style={{
                                                paddingTop: "15px",
                                                paddingBottom: "15px",
                                                paddingLeft: "100px",
                                            }}
                                            className="row mx-2"
                                        >
                                            {props.selected_item.Item.Seller.UserID.toUpperCase()}
                                        </td>
                                    </div>
                                </tr>
                                {seller_details.map((item) => (
                                    <tr className="row" key={item[0]}>
                                        <div className="col-12 col-sm-4">
                                            <td className="row mx-2">
                                                {item[0]}
                                            </td>
                                        </div>
                                        {renderBootstraps(item)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <NoRecords />
            )}
        </>
    );
}

export default ProductSeller;
