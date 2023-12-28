function getShippingInfo(main_api_shipping_info) {
    const shipping_info = [];
    try {
        if (
            main_api_shipping_info.shippingInfo[0].shippingServiceCost[0]
                .__value__
        ) {
            const temp_shipping = [];
            temp_shipping.push("Shipping Cost");
            if (
                main_api_shipping_info.shippingInfo[0].shippingServiceCost[0]
                    .__value__ === "0.0"
            ) {
                temp_shipping.push("Free Shipping");
            } else {
                temp_shipping.push(
                    `$${main_api_shipping_info.shippingInfo[0].shippingServiceCost[0].__value__}`
                );
            }

            shipping_info.push(temp_shipping);
        }
    } catch (error) {
        // error
    }

    try {
        if (main_api_shipping_info.shippingInfo[0].shipToLocations[0]) {
            const temp_shipping = [];
            temp_shipping.push("Shipping Locations");
            temp_shipping.push(
                main_api_shipping_info.shippingInfo[0].shipToLocations[0]
            );
            shipping_info.push(temp_shipping);
        }
    } catch (error) {
        // error
    }

    try {
        if (main_api_shipping_info.shippingInfo[0].handlingTime[0]) {
            const temp_shipping = [];
            temp_shipping.push("Handling Time");
            var day = "day";

            if (
                parseFloat(
                    main_api_shipping_info.shippingInfo[0].handlingTime[0]
                ) > 1
            ) {
                day = "days";
            }
            temp_shipping.push(
                `${main_api_shipping_info.shippingInfo[0].handlingTime[0]} ${day}`
            );
            shipping_info.push(temp_shipping);
        }
    } catch (error) {
        // error
    }

    try {
        if (main_api_shipping_info.shippingInfo[0].expeditedShipping[0]) {
            const temp_shipping = [];
            temp_shipping.push("Expedited Shipping");
            temp_shipping.push(
                main_api_shipping_info.shippingInfo[0].expeditedShipping[0]
            );
            shipping_info.push(temp_shipping);
        }
    } catch (error) {
        // error
    }

    try {
        if (main_api_shipping_info.shippingInfo[0].oneDayShippingAvailable[0]) {
            const temp_shipping = [];
            temp_shipping.push("One Day Shipping");
            temp_shipping.push(
                main_api_shipping_info.shippingInfo[0]
                    .oneDayShippingAvailable[0]
            );
            shipping_info.push(temp_shipping);
        }
    } catch (error) {
        // error
    }

    try {
        if (main_api_shipping_info.returnsAccepted[0]) {
            const temp_shipping = [];
            temp_shipping.push("Return Accepted");
            temp_shipping.push(main_api_shipping_info.returnsAccepted[0]);
            shipping_info.push(temp_shipping);
        }
    } catch (error) {
        // error
    }

    return shipping_info;
}

function wishlistAddition(item, shipping_info, keyword) {
    const item_id = GetValidation(item, ['itemId', '0'], '');
    const wishlist_addition = {
        item_id: item_id,
    };
    try {
        wishlist_addition["title"] = item.title[0];
    } catch (err) {
        wishlist_addition["title"] = "";
    }

    try {
        wishlist_addition["price"] =
            item.sellingStatus["0"].currentPrice["0"].__value__;
    } catch (err) {
        wishlist_addition["price"] = "";
    }

    try {
        wishlist_addition["shipping_option"] =
            item.shippingInfo["0"].shippingType["0"];
    } catch (err) {
        wishlist_addition["shipping_option"] = "";
    }

    try {
        wishlist_addition["image_url"] = item.galleryURL[0];
    } catch (err) {
        wishlist_addition["image_url"] = "";
    }

    try {
        wishlist_addition["shipping_details"] = shipping_info;
    } catch (err) {
        wishlist_addition["shipping_details"] = {};
    }

    try {
        wishlist_addition["keyword"] = keyword;
    } catch (err) {
        wishlist_addition["keyword"] = "";
    }

    try {
        wishlist_addition["return_accepted"] = item.returnsAccepted[0];
    } catch (err) {
        wishlist_addition["return_accepted"] = "";
    }

    try {
        wishlist_addition["facebook_url"] = item.viewItemURL[0];
    } catch (err) {
        wishlist_addition["facebook_url"] = "";
    }

    return wishlist_addition;
}

function GetValidation(item, list_to_access, error_info) {
    try {
        list_to_access.forEach((index) => {
            item = item[index];
        });

        if (item === undefined) {
            throw new Error("");
        }
        return item;
    } catch (err) {
        return error_info;
    }
}

function updateSelectedItem(selected_item, keyword) {
    const shipping_info = getShippingInfo(selected_item);
    return wishlistAddition(selected_item, shipping_info, keyword);
}

export {
    getShippingInfo,
    wishlistAddition,
    updateSelectedItem,
    GetValidation,
};
