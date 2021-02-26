import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            first: "",
            last: "",
            email: "",
            password: "",
        };

        // this.handleChange = this.handleChange.bind(this);
        // this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // remaining tasks: make the red underlines go away!
        axios
            .post("/registration", this.state)
            .then((resp) => {
                console.log("resp from server: ", resp);
                if (
                    this.state.first == "" ||
                    this.state.last == "" ||
                    this.state.email == "" ||
                    this.state.password == ""
                ) {
                    this.setState({
                        error: true,
                    });
                } else {
                    location.replace("/"); //app?
                }
            })
            .catch((err) => {
                console.log("err in registration: ", err);
                this.setState({
                    error: true,
                });
                // render an error message
            });
    }

    handleChange(e) {
        // which input field is the user typing in?
        console.log("e target name: ", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state after setState: ", this.state)
        );
    }

    render() {
        return (
            <div>
                {this.state.error && <p>Something broke :(</p>}
                <h1>Registration</h1>
                <Link to="/login">Click here to Log in!</Link>
                <br />
                <input
                    className="auth-input"
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    type="text"
                    placeholder="first"
                />
                <br />
                <input
                    className="auth-input"
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    type="text"
                    placeholder="last"
                />
                <br />
                <input
                    className="auth-input"
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    type="text"
                    placeholder="email"
                />
                <br />
                <input
                    className="auth-input"
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <br />
                <button
                    className="auth-button"
                    onClick={() => this.handleClick()}
                >
                    Submit
                </button>
            </div>
        );
    }
}
