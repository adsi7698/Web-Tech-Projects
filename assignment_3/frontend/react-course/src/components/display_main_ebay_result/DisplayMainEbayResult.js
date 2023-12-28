import { useState } from "react";
import GetEachElementOfMainEbay from "../get_each_element_of_main_ebay/GetEachElementOfMainEbay";

function DisplayMainEbayResult(props) {
    return (
        <>
            <GetEachElementOfMainEbay
                data={props.ebay_main_result.searchResult["0"].item}
                handleCase4={props.handleCase4}
                handleDetails={props.handleDetails}
                handleWishlists={props.handleWishlists}
                wishlist_data={props.wishlist_data}
                keyword={props.keyword}
                selected_item={props.selected_item}
            />
        </>
    );
}

export default DisplayMainEbayResult;
