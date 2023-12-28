import { React, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

function GetWishlists(props) {
    const [total_value, update_total_value] = useState(0);

    useEffect(() => {
        console.log("Wishlist data changed");

        update_total_value(
            props.mongo_wishlists
                .map((item) => parseFloat(item.price))
                .reduce((acc, val) => acc + val, 0)
        );
    }, [props.mongo_wishlists]);

    function formatTotalValue() {
        return total_value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
        });
    }

    return (
        <>
            <div className="row mx-2">
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                    <div className="row">
                        <div className="col-sm-10"></div>
                        {props.selected_wishlist ? (
                            <div className="col-sm-2">
                                <Button
                                    className="bg-white text-black border-0 float-end"
                                    onClick={() =>
                                        props.handleDetails("wishlist case", 0)
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
                        {props.mongo_wishlists.length !== 0 ? (
                            <>
                                <table className="table table-dark table-striped table-hover">
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
                                                style={{ width: "15%" }}
                                            >
                                                Image
                                            </th>
                                            <th
                                                className="align-middle"
                                                style={{ width: "45%" }}
                                            >
                                                Title
                                            </th>
                                            <th
                                                className="align-middle"
                                                style={{ width: "10%" }}
                                            >
                                                Price
                                            </th>
                                            <th
                                                className="align-middle"
                                                style={{ width: "14%" }}
                                            >
                                                Shipping Option
                                            </th>
                                            <th
                                                className="align-middle"
                                                style={{ width: "11%" }}
                                            >
                                                Favorite
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.mongo_wishlists.map(
                                            (item, index) => (
                                                <tr
                                                    key={index}
                                                    className={
                                                        props.selected_item &&
                                                        item.item_id ===
                                                            props.selected_item
                                                                .item_id
                                                            ? "table-active"
                                                            : ""
                                                    }
                                                >
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <a
                                                            href={item.image_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <img
                                                                src={
                                                                    item.image_url
                                                                }
                                                                className="img-fluid"
                                                                style={{
                                                                    maxWidth:
                                                                        "100px",
                                                                    height: "80px",
                                                                    width: "100px",
                                                                    marginRight:
                                                                        "50px",
                                                                }}
                                                            />
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <a
                                                            style={{
                                                                width: "300px",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                display:
                                                                    "-webkit-box",
                                                                WebkitLineClamp: 1,
                                                                WebkitBoxOrient:
                                                                    "vertical",
                                                            }}
                                                            href="#"
                                                            onClick={() =>
                                                                props.handleCase4(
                                                                    item,
                                                                    index,
                                                                    4,
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            {item.title}
                                                        </a>
                                                    </td>
                                                    <td>${item.price}</td>
                                                    <td>
                                                        {item.shipping_option}{" "}
                                                        Shipping
                                                    </td>
                                                    <td>
                                                        <Button
                                                            className="bg-white"
                                                            onClick={() =>
                                                                props.handleWishlists(
                                                                    "DELETE",
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <span
                                                                className="material-icons"
                                                                style={{
                                                                    color: "#cc9616",
                                                                }}
                                                            >
                                                                remove_shopping_cart
                                                            </span>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th
                                                className="align-middle"
                                                style={{ width: "12%" }}
                                            >
                                                Total Shopping
                                            </th>
                                            <th
                                                className="align-middle"
                                                style={{ width: "11%" }}
                                            >
                                                ${formatTotalValue()}
                                            </th>
                                        </tr>
                                    </thead>
                                </table>
                            </>
                        ) : (
                            <>
                                <div
                                    className="container pt-3 pb-1 mt-5 pl-4"
                                    style={{
                                        backgroundColor: "#fff4cc",
                                        display: "block",
                                    }}
                                >
                                    <p
                                        className=""
                                        style={{ color: "#92762c" }}
                                    >
                                        No Records.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="col-sm-2"></div>
            </div>
        </>
    );
}

export default GetWishlists;
