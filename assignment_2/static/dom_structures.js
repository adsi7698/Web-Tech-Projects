import * as forms from "../static/form.js";


function get_result_summary_message(summary_h1_result, keyword) {
    if (window.result_count == 0) {
        summary_h1_result.innerHTML = 'No Results Found';
    }
    else {
        if(typeof keyword === 'undefined') {
            keyword = window.keyword;
        }
        summary_h1_result.innerHTML = `${window.result_count} Results found for <span class="italized">${keyword}</span>`;
    }

    return summary_h1_result;
}


function get_summary_url(each_item_value) {

    let item_id = each_item_value['itemId'][0];

    return `https://open.api.ebay.com/shopping?IncludeSelector=Description,Details,ItemSpecifics&` +
                `callname=GetSingleItem&responseencoding=JSON&version=967&` +
                `ItemID=${item_id}`;
}


function stopEventPropagation(event) {
    event.stopPropagation(); 
}


function create_each_item_tables(each_item) {
    let container = document.createElement("div");
    container.setAttribute('id', 'tableContainer');
    container.setAttribute('class', 'container-table-each-item');
    let table = document.createElement("table");
    table.setAttribute('class', 'table-each-item');


    try {
        let picture = each_item.PictureURL[0];

        let newRow = table.insertRow();
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        cell1.setAttribute('class', 'each-cell-1');
        cell2.setAttribute('class', 'each-cell-2');
        cell1.textContent = 'Photo';

        let image_element = document.createElement('img');
        image_element.setAttribute('class', 'image-single');
        if (picture == 'https://thumbs1.ebaystatic.com/%20pict/04040_0.jpg' || picture == '' || picture == null) {
            image_element.src = './static/images/ebay_default.jpg';
        }
        else {
            image_element.src = picture;
        }
        cell2.appendChild(image_element);
    }
    catch(error) {
        let newRow = table.insertRow();
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        cell1.setAttribute('class', 'each-cell-1');
        cell2.setAttribute('class', 'each-cell-2');
        cell1.textContent = 'Photo';

        let image_element = document.createElement('img');
        image_element.setAttribute('class', 'image-single');
        image_element.src = './static/images/ebay_default.jpg';
        cell2.appendChild(image_element);
    }

    try {
        let ebay_link = each_item.ViewItemURLForNaturalSearch;
        if (ebay_link) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = 'eBay Link';
    
            let link_element = document.createElement('a');
            link_element.setAttribute("href", ebay_link);
            link_element.setAttribute("target", "_blank");
            link_element.textContent = 'eBay Product Link';
    
            cell2.appendChild(link_element);
        }
    }
    catch(error) {
        console.log('Item not present');
    }


    try {
        let title = each_item.Title;
        if (title) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = 'Title';

            let temp = document.createElement("div");
            temp.innerHTML = title;
            cell2.textContent = "";
            cell2.appendChild(temp);
        }
    }
    catch(error) {
        console.log('Item not present');
    }


    try {
        let sub_title = each_item.SubTitle;
        if (sub_title) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = 'Subtitle';

            let temp = document.createElement("div");
            temp.innerHTML = sub_title;
            cell2.textContent = "";
            cell2.appendChild(temp);
        }
    }
    catch(error) {
        console.log('Item not present');
    }


    try {
        let price = each_item.CurrentPrice.Value;
        if (price) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = 'Price';

            let temp = document.createElement("div");
            temp.innerHTML = price + ' USD';
            cell2.textContent = "";
            cell2.appendChild(temp);
        }
    }
    catch(error) {
        console.log('Item not present');
    }


    try {
        let location = each_item.Location;
        if (location) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = 'Location';

            let temp = document.createElement("div");
            temp.innerHTML = location
            cell2.textContent = "";
            cell2.appendChild(temp);
        }
    }
    catch(error) {
        console.log('Item not present');
    }
    

    try {
        let seller = each_item.Seller.UserID;
        if (seller) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = 'Seller';

            let temp = document.createElement("div");
            temp.innerHTML = seller
            cell2.textContent = "";
            cell2.appendChild(temp);
        }
    }
    catch(error) {
        console.log('Item not present');
    }

    try {
        let within_checks = 0;
        let temp_text = '';
        try {
            var return_within = each_item.ReturnPolicy.ReturnsWithin;
            within_checks = 1;
        }
        catch(error) {
            console.log('Item not present');
        }
        let return_accepted = each_item.ReturnPolicy.ReturnsAccepted;

        if (within_checks == 1) {
            if (return_accepted) {
                temp_text = `${return_accepted}`;
            }
        }
        else {
            if (return_accepted && return_within) {
                temp_text = `Return Accepted within ${return_within}`;
            }
            else if (return_accepted && !return_within) {
                temp_text = `${return_accepted}`;
            }
        }

        if (temp_text !== '') {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = 'Return Policy(US)';

            let temp = document.createElement("div");
            temp.innerHTML = temp_text
            cell2.textContent = "";
            cell2.appendChild(temp);
        }

    }
    catch(error) {
        console.log('Item not present');
    }
    

    try {
        let item_specifics = each_item.ItemSpecifics.NameValueList;
        for (let each in item_specifics) {
            let newRow = table.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            cell1.setAttribute('class', 'each-cell-1');
            cell2.setAttribute('class', 'each-cell-2');
            cell1.textContent = item_specifics[each].Name;
            
            let temp = document.createElement("div");
            temp.innerHTML = item_specifics[each].Value[0];
            cell2.textContent = "";
            cell2.appendChild(temp);
            
        }
    }
    catch(error) {
        console.log('Item not present');
    }
    
    container.appendChild(table);
    document.body.appendChild(container);

}


function create_each_item_summary(each_item, item_detail_object, keyword) {
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

    if (!document.getElementById("back-to-result")) {
        summary_result_div = document.createElement("div");
        summary_result_div.setAttribute('class', 'ebay-each-item-div');
        summary_result_div.setAttribute('id', 'ebay-each-item-div');

        let summary_h1_result;
        summary_h1_result = document.createElement("h1");
        summary_h1_result.setAttribute('id', 'ebay-each-item-h1');
        summary_h1_result.innerHTML = 'Item Details';
        
        summary_result_div.appendChild(summary_h1_result);
        document.body.appendChild(summary_result_div);

        let back_to_result = document.createElement('BUTTON');
        let result_text = document.createTextNode("Back to search results");
        back_to_result.setAttribute('id', 'back-to-result');
        back_to_result.appendChild(result_text);

        document.body.appendChild(back_to_result);

        document.getElementById('back-to-result').addEventListener('click', function() {
            forms.search_forms(item_detail_object, keyword);
        });

        create_each_item_tables(each_item);   
    }
}


// summary api call
function get_each_item_summary(each_item_value, item_detail_object, keyword) {

    let summary_url = get_summary_url(each_item_value);
    let encoded_summary_url = encodeURIComponent(summary_url);
    
    let retrieve_summary_ajax = new XMLHttpRequest();
    // https://assignment-2-web-tech.wl.r.appspot.com
    let url = `https://assignment-2-web-tech.wl.r.appspot.com/get_each?url=${encoded_summary_url}`;
    // let url = `http://127.0.0.1:5000/get_each?url=${encoded_summary_url}`;
    retrieve_summary_ajax.open('GET', url, true);
    let each_item_data;

    retrieve_summary_ajax.addEventListener('load', function() {
        if (retrieve_summary_ajax.status === 200) {
            each_item_data = JSON.parse(retrieve_summary_ajax.responseText);

            if (each_item_data.Ack === 'Success') {
                create_each_item_summary(each_item_data.Item, item_detail_object, keyword);
            }
            else {
                console.log('failed');
                // Ebay api gave bad result
            }

        } else {
            console.error('Request failed with status: ' + retrieve_summary_ajax.status);
        }
    });

    retrieve_summary_ajax.send();

}


function get_each_div(each_item, item_detail_object, keyword) {
    
    let each_section = document.createElement('div');
    each_section.setAttribute('id', `section_${each_item}`);
    each_section.setAttribute('class', 'section');

    each_section.addEventListener("click", function() {
        get_each_item_summary(item_detail_object[each_item], item_detail_object, keyword);
    });

    let each_image = document.createElement('img');
    each_image.setAttribute('class', 'image');
    
    try {
        let gallery_url = item_detail_object[each_item].galleryURL[0];

        if (gallery_url == 'https://thumbs1.ebaystatic.com/%20pict/04040_0.jpg' || gallery_url == '' || gallery_url == null) {
            each_image.src = './static/images/ebay_default.jpg'
        }
        else {
            each_image.src = item_detail_object[each_item].galleryURL[0];
        }
    }
    catch(error) {
        each_image.src = './static/images/ebay_default.jpg'
    }
    
    let each_content = document.createElement('div');
    each_content.setAttribute('class', 'content');
    
    let each_title = document.createElement('p');
    each_title.setAttribute('class', 'each-title-bold');
    each_title.innerHTML = item_detail_object[each_item].title[0];

    let each_category = document.createElement('p');
    each_category.innerHTML = `Category: ${item_detail_object[each_item].primaryCategory[0].categoryName[0]} `;

    let link_element = document.createElement('a');
    link_element.setAttribute("href", item_detail_object[each_item].viewItemURL[0]);
    link_element.setAttribute("target", "_blank");
    link_element.onclick = stopEventPropagation;

    let hyperlink_img = document.createElement('img');
    hyperlink_img.setAttribute('class', 'hyperlink-img');
    hyperlink_img.src = './static/images/redirect.png';

    link_element.appendChild(hyperlink_img);
    each_category.appendChild(link_element);

    let each_condition = document.createElement('p');
    each_condition.innerHTML = `Condition: ${item_detail_object[each_item].condition[0].conditionDisplayName[0]}  `;

    if (item_detail_object[each_item].topRatedListing[0] === 'true') {
        let top_rated = document.createElement('img');
        top_rated.setAttribute('class', 'top-rated-img');
        top_rated.src = './static/images/topRatedImage.png';

        each_condition.appendChild(top_rated);
    }

    let each_price = document.createElement('p');
    each_price.setAttribute('class', 'each-item-price');

    let shipping_price = '';
    let shipping_value = '';
    try {
        shipping_price = parseFloat(item_detail_object[each_item].shippingInfo[0].shippingServiceCost[0].__value__);
        if (shipping_price >= 0.01) {
            shipping_value = `(+ ${item_detail_object[each_item].shippingInfo[0].shippingServiceCost[0].__value__} for shipping)`;
        }
        else {
            // shipping price less than 0.01
        }
    }
    catch(error) {
        // error
    }

    each_price.innerHTML = `Price: $${item_detail_object[each_item].sellingStatus[0].currentPrice[0].__value__} ${shipping_value}`;

    each_content.appendChild(each_title);
    each_content.appendChild(each_category);
    each_content.appendChild(each_condition);
    each_content.appendChild(each_price);

    each_section.appendChild(each_image);
    each_section.appendChild(each_content);

    return each_section;
}


function show_all_results(item_count, item_detail_object) {
    let ebay_result_div = document.getElementById("ebay-result-div");

    if (item_count > 3) {
        let limiter = 10;
        for (let each_item = 3; each_item < item_count; each_item++) {
            if (each_item < limiter) {
                let each_section = get_each_div(each_item, item_detail_object);
                ebay_result_div.appendChild(each_section);
            }
            else {
                break;
            }
        }
    
    }
    const pageHeight = document.body.scrollHeight;
    window.scrollTo({top: pageHeight, behavior: 'smooth'});

    document.getElementById('show-more-button').innerHTML = 'Show Less';

}


function show_less_results() {
    let limiter = 10;
    for (let each_item = 3; each_item < limiter; each_item++) {
        if (document.getElementById(`section_${each_item}`)) {
            document.getElementById(`section_${each_item}`).remove();
        }
    }

    document.getElementById('show-more-button').innerHTML = 'Show More';
}


function result_summary_controller(item_count, item_detail_object, keyword) {
    if (item_count > 0) {
        if (!document.getElementById("hr-id")) {
            let hr_separator = document.createElement('hr');
            hr_separator.setAttribute('id', 'hr-id');
            document.body.appendChild(hr_separator);
        }

        let ebay_result_div = document.createElement('div');
        ebay_result_div.setAttribute('class', 'ebay-result-div');
        ebay_result_div.setAttribute('id', 'ebay-result-div');

        let limiter = window.show_more_toggle ? 10: 3;
        for (let each_item = 0; each_item < item_count; each_item++) {
            if (each_item < limiter) {

                let each_section = get_each_div(each_item, item_detail_object, keyword);

                ebay_result_div.appendChild(each_section);
                
            }
            else {
                break;
            }
        }
        return ebay_result_div;
    }
    else {
        // items not present
    }
    return null;

}


function create_result_div(validated_item_object, keyword) {
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

    // getting number of results
    summary_result_div = document.getElementById("result-summary");
    
    let summary_h1_result;
    summary_result_div = document.createElement("div");
    summary_result_div.setAttribute('class', 'ebay-main-div');
    summary_result_div.setAttribute('id', 'result-summary');

    summary_h1_result = document.createElement("h2");
    summary_h1_result.setAttribute('id', 'summary-h2-result');
    summary_h1_result = get_result_summary_message(summary_h1_result, keyword);
    
    summary_result_div.appendChild(summary_h1_result);
    document.body.appendChild(summary_result_div);

    
    let item_detail_object = validated_item_object;
    let item_count = Object.keys(item_detail_object).length;

    main_ebay_result_div = document.createElement("div");
    main_ebay_result_div.setAttribute('id', 'main-ebay-result-div');

    // get all result sections one by one, main page
    let ebay_result_div = result_summary_controller(item_count, item_detail_object, keyword);

    if (ebay_result_div === null) {
        // pass
    }
    else {
        let show_more_button = document.createElement('BUTTON');
        let show_more_text = document.createTextNode("Show More");
        show_more_button.setAttribute('id', 'show-more-button');
        show_more_button.appendChild(show_more_text);

        main_ebay_result_div.appendChild(ebay_result_div);
        main_ebay_result_div.appendChild(show_more_button);
        document.body.appendChild(main_ebay_result_div);

        if(window.show_more_toggle) {
            document.getElementById('show-more-button').innerHTML = 'Show Less';
        }

        document.getElementById('show-more-button').addEventListener('click', function() {
            window.show_more_toggle = window.show_more_toggle ? false: true;

            if (window.show_more_toggle) {
                // true case... 10 items to be shown
                show_all_results(item_count, item_detail_object);
            }
            else {
                // false case ... 3 items to be shown
                show_less_results();
            }
        });
    }
}


export {
    create_result_div,
    result_summary_controller
}