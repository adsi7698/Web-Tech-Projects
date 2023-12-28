import Form from "react-bootstrap/Form";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { React, useState, useEffect, useRef, Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";

import { GetValidation } from "../../utility/utilities";

import "./forms.css";

function GetForms(props) {
    const [validating_form, update_validating_form] = useState({});
    const [change_police, update_change_police] = useState(false);
    const [error_form, update_error_form] = useState({});
    const [location_type, update_location_type] = useState("current_location");
    const [zip_code_for_auto, update_zip_code_for_auto] = useState("");
    const [auto_ip, update_auto_ip] = useState([]);
    const [distance, update_distance] = useState(10);

    const keywords_ref = useRef();
    const category_ref = useRef();

    const condition_ref_new = useRef();
    const condition_ref_used = useRef();
    const condition_ref_unspecificed = useRef();

    const shipping_ref_local = useRef();
    const shipping_ref_free = useRef();
    const distance_ref = useRef();

    const initial_form = {
        keywords: "",
        category: "All Category",
        new: false,
        used: false,
        unspecified: false,
        local_pickup: false,
        free_shipping: false,
        distance: "10",
        current_location: true,
        zip: false,
        zip_code: "",
    };

    const check_data = [
        "new",
        "used",
        "unspecified",
        "local_pickup",
        "free_shipping",
    ];

    const [unvalidated_form, update_unvalidated_form] = useState(initial_form);

    function onChangeCaptureForm(event) {
        var temp_form = unvalidated_form;

        if (event.target.id === "distance") {
            update_distance(event.target.value);
        }

        if (check_data.includes(event.target.id)) {
            temp_form[event.target.id] = event.target.checked;
        } else {
            temp_form[event.target.id] = event.target.value;
        }

        update_unvalidated_form(temp_form);
    }

    function displayFormSearchButton() {
        // Minute bug in zip_code -> it gets deleted somewhere
        // console.log(Object.keys(error_form).length === 0);
        // console.log(validating_form["keywords"]);
        // console.log("ppee");
        // console.log(validating_form["zip_code"]);
        // console.log(zip_code_for_auto.length);
        // console.log("edfdd");
        // console.log(!validating_form["zip_code"]);
        if (
            Object.keys(error_form).length === 0 &&
            validating_form["keywords"] &&
            ((validating_form["zip_code"] && zip_code_for_auto.length === 5) ||
                (!validating_form["zip_code"] &&
                    zip_code_for_auto.length === 0) ||
                zip_code_for_auto.length === 5)
        ) {
            return (
                <Button
                    variant="primary"
                    type="submit"
                    className="bg-white text-black btn-sm mb-4"
                >
                    <span className="material-symbols-outlined">Search</span>
                    <span className="fs-5 me-1"> Search</span>
                </Button>
            );
        } else {
            return (
                <Button
                    variant="primary"
                    type="submit"
                    className="bg-white text-black btn-sm mb-4"
                    disabled
                >
                    <span className="material-symbols-outlined">Search</span>
                    <span className="fs-5 me-1"> Search</span>
                </Button>
            );
        }
    }

    function updateKeyword(event) {
        let temp_form = validating_form;
        temp_form["keywords"] = event.target.value;
        update_validating_form(temp_form);
        validateForm();
        update_change_police(!change_police);
    }

    function handleCurrentLocationCheckbox(event) {
        update_location_type(event.target.id);

        var temp_form = validating_form;
        if (event.target.id === "zip") {
            if (!validating_form.hasOwnProperty("zip_code")) {
                temp_form["zip_code"] = "";
            }

            if (!validating_form.hasOwnProperty("keywords")) {
                temp_form["keywords"] = "";
            }
        } else {
            update_zip_code_for_auto("");
            if (validating_form.hasOwnProperty("zip_code")) {
                delete temp_form.zip_code;
            }
        }

        update_validating_form(temp_form);
        validateForm();
        update_change_police(!change_police);
    }

    useEffect(() => {
        validateForm();
        displayFormSearchButton();
    }, [change_police]);

    const validateForm = () => {
        const new_errors = {};

        if (
            validating_form.hasOwnProperty("keywords") &&
            validating_form["keywords"].trim().length === 0
        ) {
            new_errors.keywords = "Please enter a keyword";
        }

        if (
            validating_form.hasOwnProperty("zip_code") &&
            validating_form["zip_code"].length === 0
        ) {
            new_errors.zip_code = "Please enter a zip code";
        }

        update_error_form(new_errors);
    };

    function handleSuggestionClick(suggestion) {
        update_zip_code_for_auto(suggestion);
        update_auto_ip([]);
    }

    function getPincodes(input_value) {
        // const pincode_url = `http://localhost:3000/get_pincodes?pincode=${input_value}`;
        const pincode_url = `https://assignment-3-web-tech-final.wl.r.appspot.com/get_pincodes?pincode=${input_value}`;
        axios
            .get(pincode_url)
            .then((response) => {
                const autocomplete_pincodes = response.data.postalCodes.map(
                    (code) => code.postalCode
                );

                update_auto_ip(autocomplete_pincodes);
            })
            .catch((error) => {
                console.error("Error fetching suggestions:", error);
            });
    }

    function updateUserInputZip(event) {
        var temp_form = validating_form;
        if (event.target.value) {
            if (validating_form.hasOwnProperty("zip_code")) {
                delete temp_form.zip_code;
            }
        } else {
            if (!validating_form.hasOwnProperty("zip_code")) {
                temp_form["zip_code"] = "";
            }
        }
        update_validating_form(temp_form);
        validateForm();
        update_change_police(!change_police);
        update_zip_code_for_auto(event.target.value);
        getPincodes(event.target.value);
    }

    function displayZipCode(state) {
        if (state) {
            return (
                <>
                    <Form.Control
                        style={{ backgroundImage: "none" }}
                        type="number"
                        onChange={updateUserInputZip}
                        value={zip_code_for_auto}
                        isInvalid={!!error_form.zip_code}
                    />
                    <Form.Control.Feedback type="invalid">
                        {error_form.zip_code}
                    </Form.Control.Feedback>

                    <div>
                        {zip_code_for_auto.length > 0 && (
                            <ListGroup style={{ position: "absolute" }}>
                                {auto_ip.map((suggestion) => (
                                    <ListGroup.Item
                                        style={{
                                            width: "430%",
                                            zIndex: 1,
                                        }}
                                        className="test"
                                        key={suggestion}
                                        action
                                        onClick={() =>
                                            handleSuggestionClick(suggestion)
                                        }
                                    >
                                        {suggestion}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </div>
                </>
            );
        } else {
            return <Form.Control type="number" value="" disabled />;
        }
    }

    function handleResults(form_data) {
        // for loading effect
        props.set_loader(true);

        // const apiUrl = "http://localhost:3000/testing";
        const apiUrl = "https://assignment-3-web-tech-final.wl.r.appspot.com/testing";

        const queryParams = new URLSearchParams(form_data).toString();
        const fullUrl = `${apiUrl}?${queryParams}`;

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
                ebay_main_result =
                    ebay_main_result.findItemsAdvancedResponse[0];
                if (
                    ebay_main_result.paginationOutput[0].totalEntries[0] == "0"
                ) {
                    props.get_main_result(null, form_data["keywords"], 2, 1);
                } else {
                    props.get_main_result(
                        ebay_main_result,
                        form_data["keywords"],
                        3,
                        1
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                props.get_main_result(null, form_data["keywords"], 2, 1);
            })
            .finally(() => {
                props.set_loader(false);
            });
    }

    function getZipFromLocation(form_data) {
        axios
            .get(`https://ipinfo.io/json?token=317b4c2b460834`)
            .then((response) => {
                form_data["code"] = response.data.postal;
                handleResults(form_data);
            })
            .catch((error) => {
                console.error(
                    "Error fetching zip code, ip info not working:",
                    error
                );
                props.get_main_result(null, form_data["keywords"], 2, 1);
            });
    }

    function handleSubmit(event) {
        event.preventDefault();

        var form_data = {
            keywords: validating_form["keywords"],
            category: unvalidated_form["category"],
            conditions: [
                unvalidated_form["new"],
                unvalidated_form["used"],
                unvalidated_form["unspecified"],
            ],
            shipping: [
                unvalidated_form["local_pickup"],
                unvalidated_form["free_shipping"],
            ],
            distance: unvalidated_form["distance"],
        };

        if (location_type === "current_location") {
            getZipFromLocation(form_data);
        } else {
            form_data["code"] = zip_code_for_auto;
            handleResults(form_data);
        }
    }

    function CleanData() {
        keywords_ref.current.value = "";
        let temp_form = validating_form;
        temp_form["keywords"] = "";
        update_validating_form(temp_form);
        update_error_form({});

        category_ref.current.value = "All Category";

        condition_ref_new.current.checked = false;
        condition_ref_used.current.checked = false;
        condition_ref_unspecificed.current.checked = false;

        shipping_ref_local.current.checked = false;
        shipping_ref_free.current.checked = false;

        distance_ref.current.value = "";
        update_zip_code_for_auto("");
        update_location_type("current_location");

        props.get_main_result(null, null, 1, 1);
    }

    return (
        <>
            <div className="row mx-2 mb-4 mt-4">
                <div className="col-sm-2"></div>
                <div className="col-sm-8 bg-dark text-white">
                    <div>
                        <Form
                            className="formElement justify-content-center"
                            onSubmit={handleSubmit}
                        >
                            <div className="row mt-4">
                                <div className="col mt-4 mb-4">
                                    <h3 className="row">
                                        <div className="col-sm-3"></div>
                                        <div className="col-sm-3">
                                            Product Search
                                        </div>
                                        <div className="col-sm-6"></div>
                                    </h3>
                                </div>
                            </div>

                            <Form.Group className="mb-3">
                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-2">
                                        <Form.Label>
                                            Keyword
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Form.Label>
                                    </div>
                                    <div className="col-sm-4">
                                        <Form.Control
                                            style={{ backgroundImage: "none" }}
                                            type="text"
                                            placeholder="Enter Product Name (eg. iPhone 8)"
                                            onChange={updateKeyword}
                                            ref={keywords_ref}
                                            isInvalid={!!error_form.keywords}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {error_form.keywords}
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className="col-sm-2"></div>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-2">
                                        <Form.Label>Category</Form.Label>
                                    </div>
                                    <div className="col-sm-2">
                                        <Form.Select
                                            id="category"
                                            onChange={onChangeCaptureForm}
                                            ref={category_ref}
                                        >
                                            <option>All Category</option>
                                            <option value="Art">Art</option>
                                            <option value="Baby">Baby</option>
                                            <option value="Books">Books</option>
                                            <option value="Clothing">
                                                Clothing, Shoes & Accessories
                                            </option>
                                            <option value="Computers">
                                                Computers/Tablets & Networking
                                            </option>
                                            <option value="Health">
                                                Health & Beauty
                                            </option>
                                            <option value="Music">Music</option>
                                            <option value="Video">
                                                Video Games & Consoles
                                            </option>
                                        </Form.Select>
                                    </div>
                                    <div className="col-sm-5"></div>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-2">
                                        <Form.Label inline="true">
                                            Condition
                                        </Form.Label>
                                    </div>
                                    <div className="col-sm-6">
                                        <Form.Check
                                            inline="true"
                                            label="New"
                                            name="new"
                                            type="checkbox"
                                            id="new"
                                            ref={condition_ref_new}
                                            onChange={onChangeCaptureForm}
                                        />
                                        <Form.Check
                                            inline="true"
                                            label="Used"
                                            name="used"
                                            type="checkbox"
                                            id="used"
                                            ref={condition_ref_used}
                                            onChange={onChangeCaptureForm}
                                        />
                                        <Form.Check
                                            inline="true"
                                            label="Unspecified"
                                            name="unspecified"
                                            type="checkbox"
                                            id="unspecified"
                                            ref={condition_ref_unspecificed}
                                            onChange={onChangeCaptureForm}
                                        />
                                    </div>
                                    <div className="col-sm-1"></div>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-2">
                                        <Form.Label inline="true">
                                            Shipping Option
                                        </Form.Label>
                                    </div>
                                    <div className="col-sm-6">
                                        <Form.Check
                                            inline="true"
                                            label="Local Pickup"
                                            name="local_pickup"
                                            type="checkbox"
                                            id="local_pickup"
                                            ref={shipping_ref_local}
                                            onChange={onChangeCaptureForm}
                                        />
                                        <Form.Check
                                            inline="true"
                                            label="Free Shipping"
                                            name="free_shipping"
                                            type="checkbox"
                                            id="free_shipping"
                                            ref={shipping_ref_free}
                                            onChange={onChangeCaptureForm}
                                        />
                                    </div>
                                    <div className="col-sm-1"></div>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-2">
                                        <Form.Label>
                                            Distance (Miles)
                                        </Form.Label>
                                    </div>
                                    <div className="col-sm-2">
                                        <Form.Control
                                            type="number"
                                            placeholder="10"
                                            id="distance"
                                            ref={distance_ref}
                                            value={distance}
                                            onChange={onChangeCaptureForm}
                                        />
                                    </div>
                                    <div className="col-sm-5"></div>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="row">
                                    <div className="col-sm-3"></div>
                                    <div className="col-sm-2">
                                        <Form.Label>
                                            From
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </Form.Label>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="row-sm-2">
                                            <Form.Check
                                                label="'Current Location'"
                                                name="zip_values"
                                                type="radio"
                                                id="current_location"
                                                onChange={
                                                    handleCurrentLocationCheckbox
                                                }
                                                checked={
                                                    location_type ===
                                                    "current_location"
                                                }
                                            />
                                        </div>
                                        <div className="row-sm-2 mb-2 col-sm-7 p-0">
                                            <Form.Check
                                                label="Other. Please specify zip code:"
                                                name="zip_values"
                                                type="radio"
                                                id="zip"
                                                onChange={
                                                    handleCurrentLocationCheckbox
                                                }
                                                checked={
                                                    location_type === "zip"
                                                }
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-9">
                                                {location_type ===
                                                "current_location"
                                                    ? displayZipCode(false)
                                                    : displayZipCode(true)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-1"></div>
                                </div>
                            </Form.Group>
                            <div className="row mb-3">
                                <div className="col-sm-3"></div>
                                <div className="col-sm-5">
                                    {displayFormSearchButton()}
                                    <Button
                                        variant="primary"
                                        onClick={CleanData}
                                        className="bg-white text-black btn-sm mx-4 mb-4"
                                    >
                                        <span className="material-symbols-outlined">
                                            clear_all
                                        </span>
                                        <span className="fs-5 me-1">Clear</span>
                                    </Button>
                                </div>
                                <div className="col-sm-4"></div>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="col-sm-2"></div>
            </div>
        </>
    );
}

export default GetForms;
