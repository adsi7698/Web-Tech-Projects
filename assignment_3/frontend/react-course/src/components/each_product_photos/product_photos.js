import "./product_photos.css";
import { GetValidation } from "../../utility/utilities";
import NoRecords from "../../components/NoRecords/NoRecords";

function ProductPhotos(props) {
    var photos = props.photos;

    function ValidatePhoto(index) {
        return GetValidation(photos, [index], "");
    }

    return (
        <>
            {photos ? (
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <div className="row">
                            <div className="col-12 col-sm-4">
                                <a
                                    href={ValidatePhoto(0)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(0)}
                                        alt="N/A"
                                    />
                                </a>
                                <a
                                    href={ValidatePhoto(1)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(1)}
                                        alt="N/A"
                                    />
                                </a>
                            </div>
                            <div className="col-12 col-sm-4">
                                <a
                                    href={ValidatePhoto(2)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(2)}
                                        alt="N/A"
                                    />
                                </a>
                                <a
                                    href={ValidatePhoto(3)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(3)}
                                        alt="N/A"
                                    />
                                </a>
                                <a
                                    href={ValidatePhoto(4)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(4)}
                                        alt="N/A"
                                    />
                                </a>
                            </div>
                            <div className="col-12 col-sm-4">
                                <a
                                    href={ValidatePhoto(5)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(5)}
                                        alt="N/A"
                                    />
                                </a>
                                <a
                                    href={ValidatePhoto(6)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(6)}
                                        alt="N/A"
                                    />
                                </a>
                                <a
                                    href={ValidatePhoto(7)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="google-photos"
                                        src={ValidatePhoto(7)}
                                        alt="N/A"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2"></div>
                </div>
            ) : (
                <NoRecords />
            )}
        </>
    );
}

export default ProductPhotos;
