import { GetValidation } from "../../utility/utilities";

function ProductDetails(props) {
    const selected_item = [];

    try {
        if (Object.keys(props.selected_item.Item.PictureURL).length !== 0) {
            const temp_array = [];
            temp_array[0] = "Product Images";
            temp_array[1] = "View Product Images Here";
            temp_array[2] = GetValidation(
                props.selected_item,
                ["Item", "PictureURL"],
                ""
            );
            selected_item.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.CurrentPrice.Value) {
            const temp_array = [];
            temp_array[0] = "Price";
            temp_array[1] = `$${props.selected_item.Item.CurrentPrice.Value}`;
            selected_item.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.Location) {
            const temp_array = [];
            temp_array[0] = "Location";
            temp_array[1] = props.selected_item.Item.Location;
            selected_item.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.ReturnPolicy.ReturnsAccepted) {
            const temp_array = [];
            temp_array[0] = "Return Policy";
            if (props.selected_item.Item.ReturnPolicy.ReturnsWithin) {
                temp_array[1] =
                    `${props.selected_item.Item.ReturnPolicy.ReturnsAccepted} Within ` +
                    `${props.selected_item.Item.ReturnPolicy.ReturnsWithin}`;
            } else {
                temp_array[1] =
                    props.selected_item.Item.ReturnPolicy.ReturnsAccepted;
            }
            selected_item.push(temp_array);
        }
    } catch (error) {
        // error
    }

    try {
        if (props.selected_item.Item.ItemSpecifics.NameValueList) {
            const name_value_list =
                props.selected_item.Item.ItemSpecifics.NameValueList;
            const length = Object.keys(name_value_list).length;

            for (let i = 0; i < length; i++) {
                try {
                    const temp_array = [];
                    temp_array[0] = name_value_list[i].Name;
                    temp_array[1] = name_value_list[i].Value;

                    selected_item.push(temp_array);
                } catch (err) {
                    // skip
                }
            }
        }
    } catch (error) {
        // error
    }

    function renderProductDetails(item) {
        if (item[0] === "Product Images") {
            return (
                <tr className="row" key={item[0]}>
                    <div className="col-12 col-sm-6">
                        <td className="row mx-2" style={{ width: "35%" }}>
                            {item[0]}
                        </td>
                    </div>
                    <div className="col-12 col-sm-6">
                        <td className="row" style={{ width: "65%" }}>
                            <a
                                style={{
                                    color: "rgb(34, 148, 133)",
                                    textDecoration: "none",
                                }}
                                href="#"
                                onClick={() => props.handleModal(true, item[2])}
                            >
                                &nbsp;&nbsp;{item[1]}
                            </a>
                        </td>
                    </div>
                </tr>
            );
        } else {
            return (
                <tr className="row" key={item[0]}>
                    <div className="col-sm-6">
                        <td className="row mx-2" style={{ width: "35%" }}>
                            {item[0]}
                        </td>
                    </div>
                    <div className="col-sm-6">
                        <td className="row mx-2" style={{ width: "65%" }}>
                            {item[1]}
                        </td>
                    </div>
                </tr>
            );
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                    <table className="table table-dark table-striped fs-8">
                        <tbody className="row">
                            {selected_item.map((item) =>
                                renderProductDetails(item)
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="col-sm-2"></div>
            </div>
        </>
    );
}

export default ProductDetails;
