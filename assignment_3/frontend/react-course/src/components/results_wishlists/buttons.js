import { Container, Row, Col, Button } from "react-bootstrap";

function GetResultWishlistsButton(props) {
    return (
        <Container>
            <Row className="justify-content-center">
                {props.result_wishlist_state == 1 ? (
                    <>
                        <Col xs="auto">
                            <Button
                                className="bg-black"
                                onClick={() => props.goBack(props.keyword)}
                            >
                                Results
                            </Button>
                        </Col>
                        <Col xs="auto" className="p-0">
                            <Button
                                className="bg-white text-black border-0"
                                onClick={() => props.updateState(2)}
                            >
                                Wish List
                            </Button>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col xs="auto">
                            <Button
                                className="bg-white text-black border-0"
                                onClick={() => props.goBack(props.keyword)}
                            >
                                Results
                            </Button>
                        </Col>
                        <Col xs="auto" className="p-0">
                            <Button
                                className="bg-black"
                                onClick={() => props.updateState(2)}
                            >
                                Wish List
                            </Button>
                        </Col>
                    </>
                )}
            </Row>
        </Container>
    );
}

export default GetResultWishlistsButton;
