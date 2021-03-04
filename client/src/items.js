// import { useState, useEffect } from "react";
// import axios from "./axios";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllPosts } from "./redux/actions";
// import { Link } from "react-router-dom";

// import Comments from "./comments";

export default function Items(props) {
    console.log("Items.js props", props);
    let items = props.items;

    if (!items) {
        console.log("items is empty: ", items);
        return null;
        // return (
        //     <div className="spinner-container">
        //         <div className="spinner"></div>
        //     </div>
        // );
        // return (
        //     <div>
        //         <h2>My Friends</h2>
        //         <p>No results</p>
        //     </div>
        // );
    }

    const buy = (item) => {
        console.log("buy was clicked");
        props.buyItem(item);
    };

    return (
        <div className="items-container">
            {items &&
                items.map((elem, index) => {
                    if (elem.buyer_id) {
                        return (
                            <div className="item sold" key={index}>
                                <h3>{elem.title}</h3>
                                {/* <p>{elem.created_at}</p> */}
                                <img
                                    src={elem.pic_url || "no-image.png"}
                                    // className={`${props.size}`}
                                />
                                <p>{elem.price}€</p>
                                <p>{elem.text}</p>
                                <br />
                                <button>Sold out</button>
                            </div>
                        );
                    } else {
                        return (
                            <div className="item" key={index}>
                                <h3>{elem.title}</h3>
                                {/* <p>{elem.created_at}</p> */}
                                <img
                                    src={elem.pic_url || "no-image.png"}
                                    // className={`${props.size}`}
                                />
                                <p>{elem.price}€</p>
                                <p>{elem.text}</p>
                                <br />
                                <button onClick={() => buy(elem.item_id)}>
                                    Buy
                                </button>
                            </div>
                        );
                    }
                })}
        </div>
    );
}

//if statement per render items comprati
