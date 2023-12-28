function main_table_cleaning(data) {
    data["shipping"] = data["shipping"]
        .split(",")
        .map((item) => item === "true");
    const shipping_list = ["LocalPickupOnly", "FreeShippingOnly"];

    data["conditions"] = data["conditions"]
        .split(",")
        .map((item) => item === "true");
    const conditions = ["New", "Used", "Unspecified"];

    var ebay_url =
        "https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&" +
        "SERVICE-VERSION=1.0.0&SECURITY-APPNAME=AdityaSi-adityasi-PRD-ab45afebc-323e9a90&" +
        "RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&paginationInput.entriesPerPage=50&";

    ebay_url = ebay_url + `keywords=${data["keywords"]}&`;
    ebay_url = ebay_url + `buyerPostalCode=${data["code"]}&`;

    var key_counter = 0;
    if (data["distance"]) {
        ebay_url =
            ebay_url +
            `itemFilter(${key_counter}).name=MaxDistance&itemFilter(${key_counter}).value=${data["distance"]}&`;
        key_counter += 1;
    }

    if (data["shipping"][0]) {
        ebay_url =
            ebay_url +
            `itemFilter(${key_counter}).name=${shipping_list[0]}&` +
            `itemFilter(${key_counter}).value=${data["shipping"][0]}&`;
        key_counter += 1;
    }

    if (data["shipping"][1]) {
        ebay_url =
            ebay_url +
            `itemFilter(${key_counter}).name=${shipping_list[1]}&` +
            `itemFilter(${key_counter}).value=${data["shipping"][1]}&`;
        key_counter += 1;
    }

    ebay_url =
        ebay_url +
        `itemFilter(${key_counter}).name=HideDuplicateItems&itemFilter(${key_counter}).value=true&`;
    key_counter += 1;

    var value_counter = 0;
    var check = false;
    var condition_url = `itemFilter(${key_counter}).name=Condition&`;
    for (var i = 0; i < conditions.length; i++) {
        if (data["conditions"][i] == true) {
            condition_url =
                condition_url +
                `itemFilter(${key_counter}).value(${value_counter})=${conditions[i]}&`;
            value_counter = value_counter + 1;
            check = true;
        }
    }

    if (check === true) {
        key_counter = key_counter + 1;
        ebay_url = ebay_url + condition_url;
        check = false;
    }

    const category_map = new Map();
    category_map.set("Art", "550");
    category_map.set("Baby", "2984");
    category_map.set("Books", "267");
    category_map.set("Clothing", "11450");
    category_map.set("Computers", "58058");
    category_map.set("Health", "26395");
    category_map.set("Music", "11233");
    category_map.set("Video", "1249");

    const category_url = `itemFilter(${key_counter}).name=categoryId&`;
    if (data["category"] != "All Category") {
        ebay_url =
            ebay_url +
            category_url +
            `itemFilter(${key_counter}).value(0)=${category_map.get(
                data["category"]
            )}&`;
    }

    return (
        ebay_url + "outputSelector(0)=SellerInfo&outputSelector(1)=StoreInfo"
    );
}

function get_each_product_url(item_id) {
    return (
        "https://open.api.ebay.com/shopping?" +
        "IncludeSelector=Description,Details,ItemSpecifics&" +
        `callname=GetSingleItem&responseencoding=JSON&version=967&ItemID=${item_id}`
    );
}

module.exports = { main_table_cleaning, get_each_product_url };
