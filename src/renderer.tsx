import * as ReactDOM from "react-dom";
import * as React from "react";
import * as C from "./components";
import { RowerEvent } from "./receiver";

import { ipcRenderer } from "electron";
import { ConnectionStatus } from "./receiver";

var events: RowerEvent[] = [];
type Store = {
    rowerEvents: RowerEvent[];
};

var store: Store = {
    rowerEvents: []
};
updateDom(store);
ipcRenderer.send("connect-to-rower");
ipcRenderer.once(
    "connectionStatus",
    (sender: any, payload: ConnectionStatus) => {
        ipcRenderer.on("rowingEvent", (e: any, msg: RowerEvent) => {
            store.rowerEvents.push(msg);
            updateDom(store);
        });
    }
);
function updateDom(store: Store) {
    store = Object.assign({}, store, {});
    ReactDOM.render(
        <C.App rowerEvents={store.rowerEvents} />,
        document.getElementById("app")
    );
}
