import { Button } from "react-bootstrap";
import { React, useState, useEffect } from "react";
import {
    getShippingInfo,
    wishlistAddition,
    updateSelectedItem,
    GetValidation,
} from "../../utility/utilities";

import "./GetEachElementOfMainEbay.css";
import PaginationControl from "../pagination/PaginationControl";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function GetEachElementOfMainEbay(props) {
    const data = props.data;
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = data.slice(startIndex, endIndex);

    useEffect(() => {
        console.log("Wishlist data changed");
    }, [props.wishlist_data]);

    function shoppingButtonToggle(item) {
        const wishlist_data_check = props.wishlist_data.find(
            (each) => each.item_id === GetValidation(item, ["itemId", "0"], "")
        );

        const shipping_info = getShippingInfo(item);
        const wishlist_addition = wishlistAddition(
            item,
            shipping_info,
            props.keyword
        );

        if (wishlist_data_check) {
            return (
                <Button
                    className="bg-white"
                    onClick={() =>
                        props.handleWishlists("DELETE", wishlist_addition)
                    }
                >
                    <span
                        className="material-icons"
                        style={{ color: "#cc9616" }}
                    >
                        remove_shopping_cart
                    </span>
                </Button>
            );
        } else {
            return (
                <Button
                    className="bg-white text-black"
                    onClick={() =>
                        props.handleWishlists("POST", wishlist_addition)
                    }
                >
                    <span className="material-symbols-outlined">
                        add_shopping_cart
                    </span>
                </Button>
            );
        }
    }

    function manageSelectedItem(item, index) {
        const refined_selected_item = updateSelectedItem(item, props.keyword);
        props.handleCase4(refined_selected_item, index, 4, false);
    }

    function GetShippingDetails(item) {
        const shipping_cost = GetValidation(
            item,
            ["shippingInfo", "0", "shippingServiceCost", "0", "__value__"],
            "N/A"
        );

        if (shipping_cost === "0.0") {
            return "Free Shipping";
        } else if (shipping_cost === "N/A") {
            return shipping_cost;
        }

        return `$${shipping_cost}`;
    }

    function renderTooltip(item) {
        return (
            <Tooltip id="button-tooltip">
                {GetValidation(item, ["title", "0"], "N/A")}
            </Tooltip>
        );
    }

    return (
        <>
            <div className="row mx-2">
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                    <div className="row">
                        <div className="col-sm-10"></div>
                        {props.selected_item ? (
                            <div className="col-sm-2">
                                <Button
                                    className="bg-white text-black border-0 float-end"
                                    onClick={() =>
                                        props.handleDetails("detail case", 0)
                                    }
                                >
                                    <span className="fs-5 me-1">Detail</span>
                                    <span className="material-symbols-outlined">
                                        navigate_next
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <div className="col-sm-2">
                                <Button
                                    disabled
                                    className="bg-white text-black border-0 float-end"
                                >
                                    <span className="fs-5 me-1">Detail</span>
                                    <span className="material-symbols-outlined">
                                        navigate_next
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-dark table-striped table-hover fs-8">
                            <thead>
                                <tr>
                                    <th
                                        className="align-middle"
                                        style={{ width: "5%" }}
                                    >
                                        #
                                    </th>
                                    <th
                                        className="align-middle"
                                        style={{ width: "8%" }}
                                    >
                                        Image
                                    </th>
                                    <th
                                        className="align-middle"
                                        style={{ width: "40%" }}
                                    >
                                        Title
                                    </th>
                                    <th
                                        className="align-middle"
                                        style={{ width: "12%" }}
                                    >
                                        Price
                                    </th>
                                    <th
                                        className="align-middle"
                                        style={{ width: "17%" }}
                                    >
                                        Shipping
                                    </th>
                                    <th
                                        className="align-middle"
                                        style={{ width: "8%" }}
                                    >
                                        Zip
                                    </th>
                                    <th
                                        className="align-middle"
                                        style={{ width: "10%" }}
                                    >
                                        Wish List
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {itemsToDisplay.map((item, index) => (
                                    <tr
                                        key={index + startIndex}
                                        className={
                                            props.selected_item &&
                                            item.itemId[0] ===
                                                props.selected_item.item_id
                                                ? "table-secondary"
                                                : ""
                                        }
                                    >
                                        <td>{index + 1 + startIndex}</td>
                                        <td>
                                            <a
                                                href={GetValidation(
                                                    item,
                                                    ["galleryURL", "0"],
                                                    ""
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <img
                                                    src={GetValidation(
                                                        item,
                                                        ["galleryURL", "0"],
                                                        ""
                                                    )}
                                                    className="img-fluid"
                                                    style={{
                                                        maxWidth: "100px",
                                                        height: "80px",
                                                        width: "100px",
                                                        marginRight: "50px",
                                                    }}
                                                    alt="N/A"
                                                />
                                            </a>
                                        </td>
                                        <td>
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={renderTooltip(item)}
                                            >
                                                <a
                                                    id="title-id"
                                                    href="#"
                                                    onClick={() =>
                                                        manageSelectedItem(
                                                            item,
                                                            index
                                                        )
                                                    }
                                                >
                                                    {GetValidation(
                                                        item,
                                                        ["title", "0"],
                                                        "N/A"
                                                    )}
                                                </a>
                                            </OverlayTrigger>
                                        </td>
                                        <td>
                                            $
                                            {GetValidation(
                                                item,
                                                [
                                                    "sellingStatus",
                                                    "0",
                                                    "currentPrice",
                                                    "0",
                                                    "__value__",
                                                ],
                                                "N/A"
                                            )}
                                        </td>
                                        <td>{GetShippingDetails(item)}</td>
                                        <td>
                                            {GetValidation(
                                                item,
                                                ["postalCode", "0"],
                                                "N/A"
                                            )}
                                        </td>
                                        <td>{shoppingButtonToggle(item)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <PaginationControl
                            data={props.data}
                            currentpage={currentPage}
                            itemsperpage={itemsPerPage}
                            setcurrentpage={setCurrentPage}
                        />
                    </div>
                </div>
                <div className="col-sm-2"></div>
            </div>
        </>
    );
}

export default GetEachElementOfMainEbay;
