import NoRecords from "../NoRecords/NoRecords";

function ProductShipping(props) {

    function renderBootstrap(item) {
        const checks = [
            "Expedited Shipping",
            "One Day Shipping",
            "Return Accepted",
        ];
        if (checks.includes(item[0])) {
            if (item[1] === "true") {
                return (
                    <div className="col-12 col-sm-6">
                        <td className="row mx-2" style={{ width: "60%" }}>
                            <span
                                className="material-symbols-outlined"
                                style={{ color: "green" }}
                            >
                                done
                            </span>
                        </td>
                    </div>
                );
            } else {
                return (
                    <div className="col-12 col-sm-6">
                        <td className="row mx-2" style={{ width: "60%" }}>
                            <span
                                className="material-symbols-outlined"
                                style={{ color: "red" }}
                            >
                                close
                            </span>
                        </td>
                    </div>
                );
            }
        } else {
            return (
                <div className="col-12 col-sm-6">
                    <td className="row mx-2" style={{ width: "60%" }}>
                        {item[1]}
                    </td>
                </div>
            );
        }
    }

    return (
        <>
            {props.shipping_detail.length !== 0 ? (
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <table className="table table-bordered table-dark fs-8">
                            <tbody>
                                {props.shipping_detail.map((item) => (
                                    <tr className="row" key={item[0]}>
                                        <div className="col-12 col-sm-6">
                                            <td
                                                className="row mx-2"
                                                style={{ width: "40%" }}
                                            >
                                                {item[0]}
                                            </td>
                                        </div>
                                        {renderBootstrap(item)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="col-sm-2"></div>
                    </div>
                </div>
            ) : (
                <NoRecords />
            )}
        </>
    );
}

export default ProductShipping;
