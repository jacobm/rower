import * as React from "react";
import * as d3 from "d3";
import ReactCountdownClock = require("react-countdown-clock");
import { ipcRenderer, EventEmitter } from "electron";
import { ConnectionStatus, RowerEvent, startRowerEvent } from "./receiver";
import { start } from "repl";

ipcRenderer.send("connect-to-rower");
ipcRenderer.addListener(
    "connectionStatus",
    (_: EventEmitter, payload: ConnectionStatus) => {
        console.log("recieved " + payload);
    }
);
interface IStatusWidgetProps {
    value: string | number;
    label: string;
    unit: string;
}

class StatusWidget extends React.Component<IStatusWidgetProps, {}> {
    render() {
        return (
            <span className="statusWidget">
                <span className="statusHeader">{this.props.label} </span>
                <span className="rowValue">{this.props.value} </span>
                <span>{this.props.unit} </span>
            </span>
        );
    }
}

interface IConnectPanelState {
    isConnected: boolean;
}

class ConnectPanel extends React.Component<{}, IConnectPanelState> {
    state = { isConnected: false };
    feedback(_: EventEmitter, payload: ConnectionStatus) {
        console.log("recieved " + payload);
    }

    clicked = () => {
        ipcRenderer.send("connect-to-rower");
        ipcRenderer.addListener(
            "connectionStatus",
            (sender: any, payload: ConnectionStatus) => {}
        );
    };

    render() {
        return (
            <div>
                <button type="Connect" onClick={this.clicked}>
                    Connect
                </button>
            </div>
        );
    }
}

interface IStatusPanel {
    event: RowerEvent;
}
class StatusPanel extends React.Component<IStatusPanel, {}> {
    render() {
        const current = this.props.event;
        const time = `${current.totalMinutes}:${current.totalSeconds}`;
        const splitTime = `${current.split500mMinutes}:${
            current.split500mSeconds
        }`;

        return (
            <div className="statusPanel">
                <div className="statusRow">
                    {" "}
                    <StatusWidget
                        label="Time"
                        value={time}
                        unit="minutes"
                    />{" "}
                    <StatusWidget
                        label="Distance"
                        value={current.distance}
                        unit="meters"
                    />
                    <StatusWidget label="Watt" value={current.watt} unit="W" />
                </div>
                <div className="statusRow">
                    <StatusWidget
                        label="500m"
                        value={splitTime}
                        unit="minutes"
                    />
                    <StatusWidget
                        label="Strokes"
                        value={current.spm}
                        unit="per minute"
                    />{" "}
                    <StatusWidget
                        label="Calories"
                        value={current.calories}
                        unit="per hour"
                    />
                </div>
            </div>
        );
    }
}

class App extends React.Component<{ rowerEvents: RowerEvent[] }, {}> {
    render(): JSX.Element {
        var current = startRowerEvent;
        if (this.props.rowerEvents.length > 0) {
            const index = this.props.rowerEvents.length - 1;
            current = this.props.rowerEvents[index];
        }

        return (
            <div className="mainPanel">
                <ConnectPanel />
                <ReactCountdownClock
                    seconds={90}
                    color="#000"
                    alpha={0.9}
                    size={100}
                    onComplete={() => console.log("done")}
                />
                <StatusPanel event={current} />
            </div>
        );
    }
}
class AppOld extends React.Component<{ greeting: string }, { count: number }> {
    state = { count: 0 };
    render() {
        return (
            <div>
                <h2>{this.props.greeting}</h2>
                <button
                    onClick={() =>
                        this.setState({ count: this.state.count + 1 })
                    }>
                    This button has been clicked {this.state.count} times.
                </button>
            </div>
        );
    }
}

interface Props {
    width: number;
    height: number;
}

class D3App extends React.Component<Props, {}> {
    ref: SVGSVGElement | null = null;

    componentDidMount() {
        d3.select(this.ref)
            .append("circle")
            .attr("r", 200)
            .attr("cx", this.props.width / 2)
            .attr("cy", this.props.height / 2)
            .attr("fill", "red");
    }

    render() {
        return (
            <svg
                ref={(ref: SVGSVGElement) => (this.ref = ref)}
                width={this.props.width}
                height={this.props.height}
            />
        );
    }
}

export { D3App, AppOld, App };
