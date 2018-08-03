import * as V from "./components";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as C from './components';
import { ipcRenderer } from "electron";
import ReactCountdownClock = require("react-countdown-clock");

ReactDOM.render(
    <div>
        <C.Home />
        <ReactCountdownClock
            seconds={90}
            color="#000"
            alpha={0.9}
            size={200}
            onComplete={() => console.log("done")} />
        <C.App greeting="Dingo hest fisk" />
        <C.D3App width={100} height={300} />
    </div>, document.getElementById("app"));

ipcRenderer.send("dingo", "hest");
ipcRenderer.on("reply", (event: any, args: any) => {
    console.log(args);
});
const result = [1, 2, 3].map(x => x + 1);
console.log(result);