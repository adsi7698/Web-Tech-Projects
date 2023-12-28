import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button, Container, Row, Col } from "react-bootstrap";

import NoRecords from "../NoRecords/NoRecords";

import "./product_similarity.css";

function ProductSimilarity(props) {
    const [product_similarity, update_product_similarity] = useState(null);
    const [sort_selected_value, update_sort_selected_value] =
        useState("default");
    const [sort_by_value, update_sort_by_value] = useState("ascending");
    const [show_more, update_show_more] = useState(false);

    const handleSortChange = (event) => {
        update_sort_selected_value(event.target.value);
    };

    const handleSortBy = (event) => {
        update_sort_by_value(event.target.value);
    };

    function updateShowMore() {
        update_show_more(!show_more);
    }

    function renderProductSimilarity() {
        if (show_more) {
            return (
                <>
                    {product_similarity.map((item, index) => (
                        <div className="row mx-3 mt-2" key={"similar_" + index}>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8 bg-dark mb-2">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <img
                                            className="mt-3 mb-3 mx-4"
                                            style={{
                                                width: "165px",
                                                height: "185px",
                                            }}
                                            src={item[0][1]}
                                        />
                                    </div>
                                    <div className="col-sm-8 mt-4 mx-4 ml-6">
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#169476",
                                                paddingRight: "8%",
                                            }}
                                        >
                                            <a
                                                className="similar-product-link"
                                                href={item[1][2]}
                                                target="_blank"
                                            >
                                                {item[1][1]}
                                            </a>
                                        </p>
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#20d42f",
                                            }}
                                        >
                                            {`Price: $${item[2][1]}`}
                                        </p>
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#d4bd15",
                                            }}
                                        >
                                            {`Shipping Cost: $${item[3][1]}`}
                                        </p>
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#ffffff",
                                            }}
                                        >
                                            {`Days Left: ${item[4][1]}`}
                                        </p>
                                    </div>
                                    <div className="col-sm-1"></div>
                                </div>
                            </div>
                            <div className="col-sm-2"></div>
                        </div>
                    ))}
                </>
            );
        } else {
            return (
                <>
                    {product_similarity.slice(0, 5).map((item, index) => (
                        <div className="row mx-3 mt-2" key={"similar_" + index}>
                            <div className="col-sm-2"></div>
                            <div className="col-sm-8 bg-dark mb-2">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <img
                                            className="mt-3 mb-3 mx-4"
                                            style={{
                                                width: "165px",
                                                height: "185px",
                                            }}
                                            src={item[0][1]}
                                        />
                                    </div>
                                    <div className="col-sm-8 mt-4 mx-4 ml-6">
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#169476",
                                                paddingRight: "8%",
                                            }}
                                        >
                                            <a
                                                className="similar-product-link"
                                                href={item[1][2]}
                                                target="_blank"
                                            >
                                                {item[1][1]}
                                            </a>
                                        </p>
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#20d42f",
                                            }}
                                        >
                                            {`Price: $${item[2][1]}`}
                                        </p>
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#d4bd15",
                                            }}
                                        >
                                            {`Shipping Cost: $${item[3][1]}`}
                                        </p>
                                        <p
                                            style={{
                                                marginBottom: 0,
                                                color: "#ffffff",
                                            }}
                                        >
                                            {`Days Left: ${item[4][1]}`}
                                        </p>
                                    </div>
                                    <div className="col-sm-1"></div>
                                </div>
                            </div>
                            <div className="col-sm-2"></div>
                        </div>
                    ))}
                </>
            );
        }
    }

    useEffect(() => {
        // const apiUrl = "http://localhost:3000/get_product_similarity";
        const apiUrl = "https://assignment-3-web-tech-final.wl.r.appspot.com/get_product_similarity";
        const item_id = `item_id=${props.selected_item.Item.ItemID}`;
        const url = `${apiUrl}?${item_id}`;

        fetch(url, {
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
            .then((product_similarity) => {
                const product_similarity_api =
                    product_similarity.getSimilarItemsResponse
                        .itemRecommendations.item;

                const product_temp_list = [];

                // Cleaning of api data to get exactly those details which are required
                product_similarity_api.map((item) => {
                    const temp_array_list = [];

                    try {
                        const temp_array = [];
                        temp_array[0] = "image";
                        temp_array[1] = item.imageURL;
                        temp_array_list.push(temp_array);
                    } catch (error) {
                        const temp_array = [];
                        temp_array[0] = "image";
                        temp_array[1] = "";
                        temp_array_list.push(temp_array);
                    }

                    try {
                        const temp_array = [];
                        temp_array[0] = "title";
                        temp_array[1] = item.title;
                        try {
                            temp_array[2] = item.viewItemURL;
                        } catch (error) {
                            temp_array[2] = "";
                        }

                        temp_array_list.push(temp_array);
                    } catch (error) {
                        // error
                    }

                    try {
                        const temp_array = [];
                        temp_array[0] = "Price";
                        temp_array[1] = item.buyItNowPrice.__value__;
                        temp_array_list.push(temp_array);
                    } catch (error) {
                        const temp_array = [];
                        temp_array[0] = "Price";
                        temp_array[1] = "N/A";
                        temp_array_list.push(temp_array);
                    }

                    try {
                        const temp_array = [];
                        temp_array[0] = "Shipping Cost";
                        temp_array[1] = item.shippingCost.__value__;
                        temp_array_list.push(temp_array);
                    } catch (error) {
                        const temp_array = [];
                        temp_array[0] = "Shipping Cost";
                        temp_array[1] = "N/A";
                        temp_array_list.push(temp_array);
                    }

                    try {
                        const regex = /P(.*?)D/;
                        const time_left = regex.exec(item.timeLeft);

                        const temp_array = [];
                        temp_array[0] = "Days Left";
                        temp_array[1] = time_left[1];
                        temp_array_list.push(temp_array);
                    } catch (error) {}

                    product_temp_list.push(temp_array_list);
                });

                update_product_similarity(product_temp_list);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []);

    // Sorting based on dropdowns
    if (sort_selected_value !== "default") {
        product_similarity.sort((a, b) => {
            const numerical_keys = ["Price", "Shipping Cost", "Days Left"];
            const temp_a = a.find((item) => item[0] === sort_selected_value)[1];
            const temp_b = b.find((item) => item[0] === sort_selected_value)[1];

            if (sort_by_value === "ascending") {
                if (numerical_keys.includes(sort_selected_value)) {
                    return parseFloat(temp_a) - parseFloat(temp_b);
                } else {
                    return temp_a.localeCompare(temp_b);
                }
            } else if (sort_by_value === "descending") {
                if (numerical_keys.includes(sort_selected_value)) {
                    return parseFloat(temp_b) - parseFloat(temp_a);
                } else {
                    return temp_b.localeCompare(temp_a);
                }
            }
        });
    }

    if (product_similarity && product_similarity.length !== 0) {
        return (
            <>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-3 mx-2">
                                <Form>
                                    <Form.Group>
                                        <Form.Select
                                            onChange={handleSortChange}
                                            value={sort_selected_value}
                                        >
                                            <option value="default">
                                                Default
                                            </option>
                                            <option value="title">
                                                Product Name
                                            </option>
                                            <option value="Days Left">
                                                Days Left
                                            </option>
                                            <option value="Price">Price</option>
                                            <option value="Shipping Cost">
                                                Shipping Cost
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </div>
                            <div className="col-sm-3 mx-2">
                                <Form>
                                    <Form.Group>
                                        <Form.Select
                                            onChange={handleSortBy}
                                            value={sort_by_value}
                                            disabled={
                                                sort_selected_value ===
                                                "default"
                                            }
                                        >
                                            <option value="ascending">
                                                Ascending
                                            </option>
                                            <option value="descending">
                                                Descending
                                            </option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </div>
                        </div>
                        <div className="col-sm-2"></div>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
                {product_similarity ? renderProductSimilarity() : <></>}

                <div className="d-flex justify-content-center align-items-center">
                    {show_more ? (
                        <Button
                            className="bg-black text-white mt-3"
                            style={{ borderRadius: "0" }}
                            onClick={updateShowMore}
                        >
                            Show Less
                        </Button>
                    ) : (
                        <Button
                            className="bg-black text-white mt-5"
                            style={{ borderRadius: "0" }}
                            onClick={updateShowMore}
                        >
                            Show More
                        </Button>
                    )}
                </div>
            </>
        );
    } else {
        return <NoRecords />;
    }
}

export default ProductSimilarity;
