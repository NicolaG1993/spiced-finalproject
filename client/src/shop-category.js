import { Component } from "react";
import axios from "./axios";

import ItemUploader from "./item-uploader";
import Items from "./items";

export default class ShopCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
        this.postItem = this.postItem.bind(this);
        this.buyItem = this.buyItem.bind(this);
    }

    async componentDidMount() {
        console.log("ShopCategory component did mount");
        console.log("this.props: ", this.props);

        if (this.props.category === "Guitars") {
            this.setState({
                banner:
                    "https://www.adorama.com/alc/wp-content/uploads/2017/08/shutterstock_584510992-1024x681.jpg",
            });
        } else if (this.props.category === "Drums") {
            this.setState({
                banner:
                    "https://cdn.technologynetworks.com/tn/images/thumbs/jpeg/640_360/how-playing-the-drums-changes-the-brain-328265.jpg",
            });
        } else if (this.props.category === "Microphones") {
            this.setState({
                banner:
                    "https://mynewmicrophone.com/wp-content/uploads/2019/07/mnm_What_Is_Microphone_Feedback_And_How_To_Eliminate_It_For_Good_large.jpg",
            });
        } else if (this.props.category === "Keyboards") {
            this.setState({
                banner:
                    "https://usa.yamaha.com/files/keyboardsindex_6aecfb3aa62a2ecfca1204dea45918da.jpg?impolicy=resize&imwid=4648&imhei=2848",
            });
        } else if (this.props.category === "Amps") {
            this.setState({
                banner:
                    "https://www.thomann.de/blog/wp-content/uploads/2017/01/modeling-guitar-amps.jpg",
            });
        } else if (this.props.category === "Pedals") {
            this.setState({
                banner:
                    "https://pitstopmusicians.com/images/Guitar-Effects-Pedals-Guide_PitStop_Musicians.jpg",
            });
        }

        try {
            const { data } = await axios.get(
                `/api/all-items/${this.props.category}`
            );
            console.log("data in ShopCategory: ", data);
            this.setState({
                items: data,
            });
        } catch (err) {
            console.log("err in home-->componentDidMount: ", err);
        }
    }

    async postItem() {
        console.log("postItem state: ", this.state);
        try {
            const { data } = await axios.get(
                `/api/all-items/${this.props.category}`
            );
            console.log("data in postItem: ", data);

            this.setState({
                items: data,
            });
        } catch (err) {
            console.log("err in shop-category-->postItem: ", err);
        }
    }

    async buyItem(item_id) {
        console.log("buyItem state: ", this.state);
        console.log("item_id: ", item_id);
        try {
            const results = await axios.post(`/api/buy-item/${item_id}`);
            console.log("data in buyItem: ", results.data);

            try {
                const { data } = await axios.get(
                    `/api/all-items/${this.props.category}`
                );
                console.log("data in postItem: ", data);

                this.setState({
                    items: data,
                });
            } catch (err) {
                console.log("err in shop-category-->postItem: ", err);
            }
        } catch (err) {
            console.log("err in shop-category-->buyItem: ", err);
        }
    }

    render() {
        console.log("this.state in shop-category: ", this.state);

        // if (!this.state.items) {
        //     return null;
        //     // return (
        //     //     <div className="spinner-container">
        //     //         <div className="spinner"></div>
        //     //     </div>
        //     // );
        // }
        return (
            <div id="shop-category">
                <h1>{this.props.category}</h1>
                <div className="category-banner">
                    <img src={this.state.banner} />
                </div>

                <h2>Items from the community</h2>

                <ItemUploader postItem={this.postItem} />

                <Items items={this.state.items} buyItem={this.buyItem} />
            </div>
        );
    }
}

//mi serve un uploader (pic é secondaria)
//devo fare una get request usando this.props.category
//mi serve una post request per pubblicare nuovi items in ogni category
//mi serve una post request per update database quando premo buy (setto buyer_id per determinare l'acquisto, se non cé vuol dire che non é stato acquistato)
