import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";

import GetForms from "./components/forms/forms";
import GetResultWishlistsButton from "./components/results_wishlists/buttons";
import DisplayMainEbayResult from "./components/display_main_ebay_result/DisplayMainEbayResult";
import GetEachItem from "./components/get_each_item/get_each_item";
import GetWishlists from "./components/wishlist_result/Wishlists";
import ModalProducts from "./components/modal_products/ModalProducts";
import NoRecords from "./components/NoRecords/NoRecords";

import {
    getShippingInfo,
    wishlistAddition,
    GetValidation,
} from "./utility/utilities";

function App() {
    const [main_api_result, update_main_api] = useState(null);
    const [keyword, update_keyword] = useState(null);
    const [display_cases, update_case] = useState(1);
    const [selected_item, update_selected_item] = useState(null);
    const [each_shipping_detail, update_each_shipping_detail] = useState(null);
    const [mongo_wishlists, update_mongo_wishlists] = useState(null);
    const [fetch_mongo_once, update_fetch_mongo_once] = useState(false);
    const [result_wishlist_state, update_result_wishlist_state] = useState(1);
    const [modal_visibility, update_modal_visibility] = useState(false);
    const [product_carousel_images, update_product_carousel_images] = useState(
        []
    );
    const [selected_wishlist, update_selected_wishlist] = useState(null);

    const [loader, set_loader] = useState(false);

    useEffect(() => {
        if (!fetch_mongo_once) {
            // const wishlist_get_url = "http://localhost:3000/get_wishlists";
            const wishlist_get_url = "https://assignment-3-web-tech-final.wl.r.appspot.com/get_wishlists";
            fetch(wishlist_get_url, {
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
                .then((wishlist_data) => {
                    update_mongo_wishlists(wishlist_data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            update_fetch_mongo_once(true);
        }
    }, [fetch_mongo_once]);

    useEffect(() => {
        if (modal_visibility) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modal_visibility]);

    function handleModal(state, images) {
        update_modal_visibility(state);
        update_product_carousel_images(images);
    }

    function goBack(keyword) {
        if (keyword === '' || keyword === null || keyword === undefined) {
            update_keyword(keyword);
            update_result_wishlist_state(1);
            update_case(1);
        } else {
            update_keyword(keyword);
            update_result_wishlist_state(1);
            update_case(3);
        }
    }

    function updateResultWishlistState(state) {
        update_result_wishlist_state(state);
    }

    function update_wishlist_data(method_type, item) {
        if (method_type === "DELETE") {
            const item_id = item.item_id;
            // const delete_url = "http://localhost:3000/delete_wishlist";
            const delete_url = "https://assignment-3-web-tech-final.wl.r.appspot.com/delete_wishlist";

            var raw = JSON.stringify({
                item_id: item_id,
            });

            var requestOptions = {
                method: method_type,
                headers: {
                    "Content-Type": "application/json",
                },
                body: raw,
            };

            fetch(delete_url, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Request failed with status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((wishlist_data) => {
                    update_mongo_wishlists(
                        mongo_wishlists.filter(
                            (each) => each.item_id !== item_id
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            var requestOptions = {
                method: method_type,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            };

            // const add_wishlist_url = "http://localhost:3000/add_wishlist";
            const add_wishlist_url = "https://assignment-3-web-tech-final.wl.r.appspot.com/add_wishlist";
            fetch(add_wishlist_url, requestOptions)
                .then((response) => response.text())
                .then((wishlist_response) => {
                    var temp = [];
                    temp.push(...mongo_wishlists);
                    temp.push(item);
                    update_mongo_wishlists(temp);
                })
                .catch((error) => console.log("error", error));
        }
    }

    function handleData(api_result, keyword, result_case, wishlist_case) {
        update_main_api(api_result);
        update_keyword(keyword);
        update_case(result_case);
        updateResultWishlistState(wishlist_case);
    }

    function handleDetails(detail_wishlist_case) {
        if (detail_wishlist_case === "detail case") {
            handleCase4(selected_item, 0, 4, false);
        } else {
            handleCase4(selected_wishlist, 0, 4, false);
        }
    }

    function handleCase4(
        selected_item,
        index,
        result_case,
        wishlist_redirection
    ) {
        var shipping_info = "";
        if (!wishlist_redirection) {
            shipping_info = getShippingInfo(
                GetValidation(
                    main_api_result,
                    ["searchResult", "0", "item", index],
                    []
                )
            );
        } else {
            shipping_info = GetValidation(
                selected_item,
                ["shipping_details"],
                []
            );
            update_keyword(GetValidation(selected_item, ["keyword"], ""));
            update_selected_wishlist(selected_item);
        }

        update_result_wishlist_state(1);
        update_each_shipping_detail(shipping_info);
        update_selected_item(selected_item);
        update_case(result_case);
    }

    // Display cases
    // case 1 - null (clear case)
    // case 2 - No result found from search case
    // case 3 - Result found for main ebay api
    // case 4 - Get each item link clicked
    function renderChildMainEbayTable() {
        if (result_wishlist_state === 1) {
            return display_cases === 1 ? (
                <></>
            ) : display_cases === 2 ? (
                <NoRecords />
            ) : display_cases === 3 ? (
                <DisplayMainEbayResult
                    ebay_main_result={main_api_result}
                    handleCase4={handleCase4}
                    handleWishlists={update_wishlist_data}
                    handleDetails={handleDetails}
                    wishlist_data={mongo_wishlists}
                    keyword={keyword}
                    selected_item={selected_item}
                />
            ) : display_cases === 4 ? (
                <GetEachItem
                    selected_item={selected_item}
                    shipping_detail={each_shipping_detail}
                    keyword={keyword}
                    goBack={goBack}
                    wishlist_data={mongo_wishlists}
                    handleWishlists={update_wishlist_data}
                    handleModal={handleModal}
                />
            ) : (
                <></>
            );
        } else {
            return (
                <GetWishlists
                    mongo_wishlists={mongo_wishlists}
                    handleWishlists={update_wishlist_data}
                    handleCase4={handleCase4}
                    handleDetails={handleDetails}
                    selected_wishlist={selected_wishlist}
                    selected_item={selected_item}
                ></GetWishlists>
            );
        }
    }

    return (
        <div>
            {modal_visibility && (
                <ModalProducts
                    handleModal={handleModal}
                    product_carousel_images={product_carousel_images}
                />
            )}

            <GetForms get_main_result={handleData} set_loader={set_loader} />
            <GetResultWishlistsButton
                updateState={updateResultWishlistState}
                keyword={keyword}
                goBack={goBack}
                result_wishlist_state={result_wishlist_state}
            />

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
                renderChildMainEbayTable()
            )}
        </div>
    );
}

export default App;
