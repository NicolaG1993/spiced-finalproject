import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./redux/reducer";
import { init } from "./socket.js";

import { App } from "./App.js";
import Welcome from "./welcome";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem =
        (init(store),
        (
            <Provider store={store}>
                <App />
            </Provider>
        ));
}

//render my function in my DOM?
ReactDOM.render(elem, document.querySelector("main"));
// ReactDOM.render(<HelloWorld />, document.querySelector("main"));
