import { Pagination } from "react-bootstrap";
import "./PaginationControl.css";

function PaginationControl(props) {
    const data = props.data;
    const currentpage = props.currentpage;
    const itemsperpage = props.itemsperpage;
    const setcurrentpage = props.setcurrentpage;

    const totalpages = Math.ceil(Object.keys(data).length / itemsperpage);
    const handlePageChange = (page) => {
        setcurrentpage(page);
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center pagination-only-buttons">
                <Pagination
                    data={data}
                    currentpage={currentpage}
                    itemsperpage={itemsperpage}
                />
                <button
                    onClick={() => setcurrentpage(currentpage - 1)}
                    disabled={currentpage === 1}
                    className={currentpage === 1 ? "disabled-class" : ""}
                >
                    <span className="material-symbols-outlined" style={{fontSize: "10px"}}>
                        keyboard_double_arrow_left
                    </span>
                    <span> Previous</span>
                </button>
                {Array.from({ length: totalpages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={
                            currentpage === i + 1 ? "active btn-primaries" : ""
                        }
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setcurrentpage(currentpage + 1)}
                    disabled={currentpage * itemsperpage >= data.length}
                    className={currentpage * itemsperpage >= data.length ? "disabled-class" : ""}
                >
                    <span>Next </span>
                    <span className="material-symbols-outlined" style={{fontSize: "10px"}}>
                        keyboard_double_arrow_right
                    </span>
                </button>
            </div>
        </>
    );
}

export default PaginationControl;
