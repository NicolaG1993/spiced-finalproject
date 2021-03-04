// import axios from "./axios";
import { Component } from "react";
import ShopCategory from "./shop-category";
import { Link } from "react-router-dom";

export default class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            showComponent: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log("Shop component did mount");
        console.log("this.props: ", this.props);
    }

    async handleClick(category) {
        console.log("handleClick activated");
        this.props.setCategory(category);
        this.setState({
            showComponent: true,
        });
    }
    // async updateCategory() {
    //     this.props.setCategory(data.bio);
    // }

    render() {
        console.log("this.state in home: ", this.state);
        // if (!this.state.posts) {
        //     return null;
        //     // return (
        //     //     <div className="spinner-container">
        //     //         <div className="spinner"></div>
        //     //     </div>
        //     // );
        // }
        return (
            <div id="shop">
                <h1>Shop</h1>

                <div className="slider">Some images here...</div>

                <h2>Select a category</h2>

                <div className="categories">
                    <div className="category">
                        <Link
                            to={`/shop-category`}
                            onClick={() => this.handleClick("Guitars")}
                        >
                            <img
                                className="category-pic"
                                src="https://www.adorama.com/alc/wp-content/uploads/2017/08/shutterstock_584510992-1024x681.jpg"

                                // onClick={<ShopCategory category="guitars" />}
                            />
                            <p className="category-title">Guitars</p>
                        </Link>
                    </div>
                    <div className="category">
                        <Link
                            to={`/shop-category`}
                            onClick={() => this.handleClick("Drums")}
                        >
                            <img
                                className="category-pic"
                                src="https://cdn.technologynetworks.com/tn/images/thumbs/jpeg/640_360/how-playing-the-drums-changes-the-brain-328265.jpg"

                                // onClick={<ShopCategory category="guitars" />}
                            />
                            <p className="category-title">Drums</p>
                        </Link>
                    </div>
                    <div className="category">
                        <Link
                            to={`/shop-category`}
                            onClick={() => this.handleClick("Microphones")}
                        >
                            <img
                                className="category-pic"
                                src="https://mynewmicrophone.com/wp-content/uploads/2019/07/mnm_What_Is_Microphone_Feedback_And_How_To_Eliminate_It_For_Good_large.jpg"

                                // onClick={<ShopCategory category="guitars" />}
                            />
                            <p className="category-title">Microphones</p>
                        </Link>
                    </div>
                    <div className="category">
                        <Link
                            to={`/shop-category`}
                            onClick={() => this.handleClick("Keyboards")}
                        >
                            <img
                                className="category-pic"
                                src="https://usa.yamaha.com/files/keyboardsindex_6aecfb3aa62a2ecfca1204dea45918da.jpg?impolicy=resize&imwid=4648&imhei=2848"

                                // onClick={<ShopCategory category="guitars" />}
                            />
                            <p className="category-title">Keyboards</p>
                        </Link>
                    </div>
                    <div className="category">
                        <Link
                            to={`/shop-category`}
                            onClick={() => this.handleClick("Amps")}
                        >
                            <img
                                className="category-pic"
                                src="https://www.thomann.de/blog/wp-content/uploads/2017/01/modeling-guitar-amps.jpg"

                                // onClick={<ShopCategory category="guitars" />}
                            />
                            <p className="category-title">Amps</p>
                        </Link>
                    </div>
                    <div className="category">
                        <Link
                            to={`/shop-category`}
                            onClick={() => this.handleClick("Pedals")}
                        >
                            <img
                                className="category-pic"
                                src="https://cdn.technologynetworks.com/tn/images/thumbs/jpeg/640_360/how-playing-the-drums-changes-the-brain-328265.jpg"

                                // onClick={<ShopCategory category="guitars" />}
                            />
                            <p className="category-title">Pedals</p>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

// dentro ogni img in categories ci deve essere una fn onClick
