import * as dom from "../static/dom_structures.js";


function get_ebay_url(keyword, from_range, to_range) {

    const sort_by_array = new Map([
        ['Best Match', 'BestMatch'],
        ['Price: highest first', 'CurrentPriceHighest'],
        ['Price + Shipping: highest first', 'PricePlusShippingHighest'],
        ['Price + Shipping: lowest first', 'PricePlusShippingLowest']
    ]);

    let app_id = 'AdityaSi-adityasi-PRD-ab45afebc-323e9a90';
    let operation_name = 'findItemsAdvanced';
    let return_accepted = document.getElementById('return_accepted').checked;
    let free = document.getElementById('free').checked;
    let expedited = document.getElementById('expedited').checked;
    let sort_by = document.getElementById('sort_by').value;


    let ebay_url = `https://svcs.ebay.com/services/search/FindingService/v1?SERVICE-VERSION=1.0.0&` +
                `OPERATION-NAME=${operation_name}&SECURITY-APPNAME=${app_id}&` +
                `RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD=true&keywords=${keyword}`;


    let all_items_dicts = {}
    all_items_dicts['MinPrice'] = from_range;
    all_items_dicts['MaxPrice'] = to_range;
    all_items_dicts['ReturnsAcceptedOnly'] = return_accepted;
    all_items_dicts['FreeShippingOnly'] = free;
    all_items_dicts['ExpeditedShippingType'] = expedited;
    
    let start = 0;
    let value = 0;
    let key_query;
    let value_query;
    let checks = 0;

    key_query = `&itemFilter(${start}).name=`;
    value_query = `&itemFilter(${start}).value=`;
    if (from_range !== '') {
        ebay_url = ebay_url + `${key_query}MinPrice${value_query}${from_range}`;

        ebay_url = ebay_url + `&itemFilter(${start}).paramName=Currency&itemFilter(${start}).paramValue=USD`;
        checks = 1;
        start++;
    }
    
    key_query = `&itemFilter(${start}).name=`;
    value_query = `&itemFilter(${start}).value=`;
    if (to_range !== '') {
        ebay_url = ebay_url + `${key_query}MaxPrice${value_query}${to_range}`;

        if (checks === 0) {
            ebay_url = ebay_url + `&itemFilter(${start}).paramName=Currency&itemFilter(${start}).paramValue=USD`;
        }
        start++;
    }

    for (let key in all_items_dicts) {
        if (all_items_dicts[key] === true) {

            key_query = `&itemFilter(${start}).name=`;
            value_query = `&itemFilter(${start}).value=`;

            if (key === 'ExpeditedShippingType') {
                ebay_url = ebay_url + `${key_query}${key}${value_query}Expedited`;
                start++;
                continue;
            }

            ebay_url = ebay_url + `${key_query}${key}${value_query}${all_items_dicts[key]}`;
            start++;
        }
    }

    const condition_array = new Map([
                                ['new', '1000'],
                                ['used', '3000'],
                                ['very_good', '4000'],
                                ['good', '5000'],
                                ['acceptable', '6000']
                            ]);
    
    
    let count = 0;
    checks = 0;
    condition_array.forEach (function(value, key) {
        if (document.getElementById(key).checked == true) {
            if (checks == 0) {
                ebay_url = ebay_url + `&itemFilter(${start}).name=Condition`;
                checks = 1
            }
            ebay_url = ebay_url + `&itemFilter(${start}).value(${count})=${value}`;
            count = count + 1;
        }
    })

    ebay_url = ebay_url + `&sortOrder=${sort_by_array.get(sort_by)}`;

    return ebay_url + '&paginationInput.entriesPerPage=200';
}


function validate_top_data(product_summary_response) {

    let validated_item_object = {};
    if (product_summary_response.searchResult[0]['@count'] != 0) {
        let item_detail_object = product_summary_response.searchResult[0].item;
        let item_count = item_detail_object.length;

        let count = 0;
        for (let i = 0; i < item_count; i++) {
            try {
                if ('title' in item_detail_object[i] && 
                    'categoryName' in item_detail_object[i].primaryCategory[0] && 
                    'conditionDisplayName' in item_detail_object[i].condition[0] && 
                    '__value__' in item_detail_object[i].sellingStatus[0].currentPrice[0]
                    )
                {
                    
                    // keys are present
                    // Now check for values

                    if (
                        item_detail_object[i].title.length > 0 && 
                        item_detail_object[i].title[0] !== '' &&
                        item_detail_object[i].primaryCategory[0].categoryName.length > 0 && 
                        item_detail_object[i].primaryCategory[0].categoryName[0] !== '' && 
                        item_detail_object[i].condition[0].conditionDisplayName.length > 0  && 
                        item_detail_object[i].condition[0].conditionDisplayName[0] !== ''  && 
                        item_detail_object[i].sellingStatus[0].currentPrice[0].__value__ !== ''
                        ) 
                    {
                        validated_item_object[count] = item_detail_object[i];
                        count++;

                        if (count >= 15) {
                            break;
                        }
                    }

                }
            }
            catch(error) {
                console.log('Item not present');
                continue;
            }
        }
    }
    

    return validated_item_object;
}


function search_forms(validated_item_object, keyword) {

    let item_details_tag = document.getElementById("ebay-each-item-h1");
    if (item_details_tag) {
        item_details_tag.remove();
    }

    let back_to_result = document.getElementById("back-to-result");
    if (back_to_result) {
        back_to_result.remove();
    }

    let table_container = document.getElementById("tableContainer");
    if (table_container) {
        table_container.remove();
    }


    if (validated_item_object === '') {
        let product_summary_response;

        let keyword = document.getElementById('keyword').value;
        window.keyword = keyword;
        let from_range = document.getElementById('from').value;
        let to_range = document.getElementById('to').value;
        window.show_more_toggle = false;

        if (keyword !== null && keyword !== '') {

            if (from_range < 0.0 || to_range < 0.0) {
                alert("Price Range values cannot be negative! Please try a value greater than or equal to 0.0");
            }
            else if ((from_range - to_range) > 0 && (to_range !== null && to_range !== '')) {
                alert("Oops! Lower Price limit cannot be greater than upper price limit! Please try again.");
            }
            else {
                let ebay_url = get_ebay_url(keyword, from_range, to_range);
                
                let encoded_ebay_url = encodeURIComponent(ebay_url);
                
                let retrieve_summary_ajax = new XMLHttpRequest();
                // https://assignment-2-web-tech.wl.r.appspot.com
                let url = `https://assignment-2-web-tech.wl.r.appspot.com/testing?url=${encoded_ebay_url}`;
                // let url = `http://127.0.0.1:5000/testing?url=${encoded_ebay_url}`;
                retrieve_summary_ajax.open('GET', url, true);

                retrieve_summary_ajax.addEventListener('load', function() {
                    if (retrieve_summary_ajax.status === 200) {
                        product_summary_response = JSON.parse(retrieve_summary_ajax.responseText);

                        product_summary_response = product_summary_response.findItemsAdvancedResponse[0];

                        if (product_summary_response.ack[0] === 'Success') {
                            let validated_item_object = validate_top_data(product_summary_response);
                            let result_count = product_summary_response.paginationOutput[0].totalEntries[0];
                            window.result_count = result_count;

                            dom.create_result_div(validated_item_object, keyword);
                        }
                        else {
                            // Ebay api gave bad result
                        }
                    } else {
                        console.error('Request failed with status: ' + retrieve_summary_ajax.status);
                    }
                });

                retrieve_summary_ajax.send();
            }
        }
    }
    else {
        dom.create_result_div(validated_item_object, keyword);
    }
}


function clear_forms() {
    document.getElementById('keyword').value = '';
    document.getElementById('from').value = '';
    document.getElementById('to').value = '';
    document.getElementById('new').checked = false;
    document.getElementById('used').checked = false;
    document.getElementById('very_good').checked = false;
    document.getElementById('good').checked = false;
    document.getElementById('acceptable').checked = false;
    document.getElementById('return_accepted').checked = false;
    document.getElementById('free').checked = false;
    document.getElementById('expedited').checked = false;
    document.getElementById('sort_by').value = 'Best Match';

    let summary_result_div = document.getElementById("result-summary");
    if (summary_result_div) {
        summary_result_div.remove();
    }

    let main_ebay_result_div = document.getElementById("main-ebay-result-div");
    if (main_ebay_result_div) {
        main_ebay_result_div.remove();
    }

    let hr_tag = document.getElementById("hr-id");
    if (hr_tag) {
        hr_tag.remove();
    }

    let item_details_tag = document.getElementById("ebay-each-item-h1");
    if (item_details_tag) {
        item_details_tag.remove();
    }

    let back_to_result = document.getElementById("back-to-result");
    if (back_to_result) {
        back_to_result.remove();
    }

    let table_container = document.getElementById("tableContainer");
    if (table_container) {
        table_container.remove();
    }
}


export {
    clear_forms,
    search_forms
}