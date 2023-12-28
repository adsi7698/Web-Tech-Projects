import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FacebookProvider, ShareButton } from "react-facebook";

import ProductDetails from "../each_product_details/product_details";
import ProductPhotos from "../each_product_photos/product_photos";
import ProductSeller from "../each_product_seller/product_seller";
import ProductShipping from "../each_product_shipping/product_shipping";
import ProductSimilarity from "../each_product_similarity/product_similarity";
import NoRecords from "../NoRecords/NoRecords";

import "./get_each_item.css";

function GetEachItem(props) {
    const [each_items_state, update_items_state] = useState(1);
    const [each_product_api, update_each_product_api] = useState(null);
    const [each_product_photo_api, update_each_product_photo_api] =
        useState(null);
    const [loader, set_loader] = useState(false);

    function removeSpecialCharacters(text) {
        return text.replace(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\\/"|=\\-]/g, "");
    }

    useEffect(() => {
        // const apiUrl = "http://localhost:3000/get_each";
        const apiUrl = "https://assignment-3-web-tech-final.wl.r.appspot.com/get_each";
        var item_id = `itemId=${props.selected_item.item_id}`;

        const fullUrl = `${apiUrl}?${item_id}`;
        const cleanedText = removeSpecialCharacters(props.selected_item.title);
        const encodedText = encodeURIComponent(cleanedText);
        // const photos_each_product_url =
        //     "http://localhost:3000/get_each_product_images?" +
        //     `query=${encodedText}`;

        const photos_each_product_url =
            "https://assignment-3-web-tech-final.wl.r.appspot.com/get_each_product_images?" +
            `query=${encodedText}`;
        set_loader(true);

        // get google photos
        fetch(photos_each_product_url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Request failed with status: ${response.status}`
                    );
                }
                return response.json();
            })
            .then((photos_each_product) => {
                const refined_photos = photos_each_product.items;

                const photos_list = refined_photos.map((item) => {
                    return item.link;
                });
                update_each_product_photo_api(photos_list);
            })
            .catch((error) => {
                console.error("Error of photos:", error);
            });

        // get each product details
        fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Request failed with status: ${response.status}`
                    );
                }
                return response.json();
            })
            .then((ebay_main_result) => {
                update_each_product_api(ebay_main_result);
            })
            .catch((error) => {
                console.error("Error:", error);
                updateCase(6);
            })
            .finally(() => {
                set_loader(false);
            });
    }, []);

    function updateCase(cases) {
        update_items_state(cases);
    }

    function shoppingButtonToggle(item) {
        var wishlist_addition = "";
        var wishlist_data_check = false;
        wishlist_data_check = props.wishlist_data.find(
            (each) => each.item_id === item.item_id
        );
        wishlist_addition = item;

        if (wishlist_data_check) {
            return (
                <Button
                    className="bg-white border-0"
                    onClick={() =>
                        props.handleWishlists("DELETE", wishlist_addition)
                    }
                >
                    <span
                        id="button-wishlist"
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
                    className="bg-white text-black border-0 btn"
                    onClick={() =>
                        props.handleWishlists("POST", wishlist_addition)
                    }
                >
                    <span
                        id="button-wishlist"
                        className="material-symbols-outlined"
                    >
                        add_shopping_cart
                    </span>
                </Button>
            );
        }
    }

    const handleClick = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${props.selected_item.facebook_url}&quote=`,
            "_blank"
        );
    };

    function getFacebook() {
        return (
            <FacebookProvider appId="123456789">
                <ShareButton
                    className="facebook-share-button"
                    onClick={handleClick}
                >
                    <img src="facebook.png" className="facebook-style" />
                </ShareButton>
            </FacebookProvider>
        );
    }

    function renderButtons() {
        return (
            <>
                <div>
                    <h5 style={{ textAlign: "center", marginTop: "35px" }}>
                        {props.selected_item.title}
                    </h5>
                    <div className="row">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-6">
                            <button
                                className="bg-white text-black border-0"
                                onClick={() => props.goBack(props.keyword)}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: "15px" }}
                                >
                                    arrow_back_ios
                                </span>
                                <span className="fs-5 me-1">List</span>
                            </button>
                        </div>
                        <div className="col-sm-2 d-flex justify-content-end">
                            <span>{getFacebook()}</span>
                            <span>
                                {shoppingButtonToggle(props.selected_item)}
                            </span>
                        </div>
                        <div className="col-sm-2"></div>
                    </div>

                    <div className="row">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-8 d-flex justify-content-end">
                            <div className="col-sm-1">
                                <Button
                                    onClick={() => updateCase(1)}
                                    className={
                                        each_items_state === 1 ||
                                        each_items_state === 6
                                            ? "bg-black text-white border-0"
                                            : "bg-white text-black border-0"
                                    }
                                    style={{ borderRadius: "0" }}
                                >
                                    Product
                                </Button>
                            </div>
                            <div className="col-sm-1">
                                <Button
                                    className={
                                        each_items_state === 2
                                            ? "bg-black text-white border-0"
                                            : "bg-white text-black border-0"
                                    }
                                    onClick={() => updateCase(2)}
                                    style={{ borderRadius: "0" }}
                                >
                                    Photos
                                </Button>
                            </div>
                            <div className="col-sm-1">
                                <Button
                                    className={
                                        each_items_state === 3
                                            ? "bg-black text-white border-0"
                                            : "bg-white text-black border-0"
                                    }
                                    onClick={() => updateCase(3)}
                                    style={{ borderRadius: "0" }}
                                >
                                    Shipping
                                </Button>
                            </div>
                            <div className="col-sm-1">
                                <Button
                                    className={
                                        each_items_state === 4
                                            ? "bg-black text-white border-0"
                                            : "bg-white text-black border-0"
                                    }
                                    onClick={() => updateCase(4)}
                                    style={{ borderRadius: "0" }}
                                >
                                    Seller
                                </Button>
                            </div>
                            <div className="col-sm-2">
                                <Button
                                    className={
                                        each_items_state === 5
                                            ? "bg-black text-white border-0"
                                            : "bg-white text-black border-0"
                                    }
                                    onClick={() => updateCase(5)}
                                    style={{ borderRadius: "0" }}
                                >
                                    <span>Similar Products</span>
                                </Button>
                            </div>
                        </div>
                        <div className="col-md-2"></div>
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <hr />
                        </div>
                        <div className=""></div>
                        <div className="col-sm-2"></div>
                    </div>
                </div>
            </>
        );
    }

    function renderChildCase() {
        return each_items_state === 1 ? (
            <ProductDetails
                selected_item={each_product_api}
                handleModal={props.handleModal}
            />
        ) : each_items_state === 2 ? (
            <ProductPhotos photos={each_product_photo_api} />
        ) : each_items_state === 3 ? (
            <ProductShipping shipping_detail={props.shipping_detail} />
        ) : each_items_state === 4 ? (
            <ProductSeller selected_item={each_product_api} />
        ) : each_items_state === 5 ? (
            <ProductSimilarity selected_item={each_product_api} />
        ) : (
            <NoRecords />
        );
    }

    return (
        <>
            {loader ? (
                <div className="container mt-2">
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-striped"
                            role="progressbar"
                            style={{ width: "50%" }}
                            aria-valuenow="10"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            ) : (
                <>
                    {renderButtons()}
                    {renderChildCase()}
                </>
            )}
        </>
    );
}

export default GetEachItem;
