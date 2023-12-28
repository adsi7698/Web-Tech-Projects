import { useEffect, useState } from "react";
import { Modal, Button, Image, Carousel } from "react-bootstrap";
import "./ModalProducts.css";

function ModalProducts(props) {
    const [image_index, update_image_index] = useState(0);
    const images = props.product_carousel_images;

    const handleSelect = (selectedIndex, e) => {
        update_image_index(selectedIndex);
    };

    return (
        <>
            <Modal
                show={true}
                onHide={() => props.handleModal(false)}
                dialogClassName="custom-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Product Images</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        Width: "600px",
                        Height: "400px",
                    }}
                >
                    <Carousel
                        activeIndex={image_index}
                        onSelect={handleSelect}
                        indicators={false}
                        prevIcon={
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: "30px",
                                    backgroundColor: "black",
                                }}
                            >
                                navigate_before
                            </span>
                        }
                        nextIcon={
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    fontSize: "30px",
                                    backgroundColor: "black",
                                }}
                            >
                                navigate_next
                            </span>
                        }
                    >
                        {images.map((slide) => (
                            <Carousel.Item interval={null} className="p-1">
                                <a
                                    href={slide}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="d-block w-100"
                                        src={slide}
                                        alt="Product Image"
                                        style={{
                                            width: "400px",
                                            height: "350px",
                                            objectFit: "cover",
                                            border: "5px solid black",
                                            margin: "0",
                                            padding: "0",
                                            transition: "width 0s",
                                        }}
                                    />
                                </a>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => props.handleModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalProducts;
