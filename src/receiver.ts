import * as SerialPort from "serialport";
import * as U from "./utils";

type State = {
    serialPort: SerialPort | null;
};
var state: State = { serialPort: null };

export enum ConnectionStatus {
    Connected = "Connected",
    RowerNotFound = "RowerNotFound"
}
export interface RowerEvent {
    totalMinutes: number;
    totalSeconds: number;
    distance: number;
    split500mSeconds: number;
    split500mMinutes: number;
    spm: number;
    watt: number;
    calories: number;
    level: number;
}

export const startRowerEvent: RowerEvent = {
    totalMinutes: 0,
    totalSeconds: 0,
    distance: 0,
    split500mMinutes: 0,
    split500mSeconds: 0,
    spm: 0,
    watt: 0,
    calories: 0,
    level: 2
};

type ConnectionResult = U.Result<SerialPort, string>;

async function detectRower(
    name: string
): Promise<U.Result<SerialPort, string>> {
    const parser = new SerialPort.parsers.Readline({ delimiter: "\r\n" });
    return new Promise<ConnectionResult>((resolve, reject) => {
        try {
            let serialport = new SerialPort(name, { baudRate: 9600 });
            serialport.pipe(parser);
            serialport.on("open", (data: any) => {
                console.log("Port was opened");
                parser.once("data", (chunk: any) => {
                    if ("C1164" == String(chunk)) {
                        return resolve(new U.Ok(serialport));
                    }

                    return resolve(new U.Fail("Not the rower usb"));
                });
                serialport.write("C\n");
            });
        } catch (exception) {
            reject(exception);
        }
    });
}

function parseEvent(data: any) {
    var event: RowerEvent = {
        totalMinutes: parseInt(data.slice(3, 5), 10),
        totalSeconds: parseInt(data.slice(5, 7), 10),
        distance: parseInt(data.slice(7, 12), 10),
        split500mMinutes: parseInt(data.slice(13, 15), 10),
        split500mSeconds: parseInt(data.slice(15, 17), 10),
        spm: parseInt(data.slice(17, 20), 10),
        watt: parseInt(data.slice(20, 23), 10),
        calories: parseInt(data.slice(23, 27), 10),
        level: parseInt(data.slice(27, 29), 10)
    };

    return event;
}

function listenForRowerData(serialport: SerialPort, callback: Function): void {
    const parser = new SerialPort.parsers.Readline({ delimiter: "\r\n" });
    serialport.pipe(parser);
    parser.on("data", chunk => {
        let event = parseEvent(chunk);
        callback(event);
    });
}

var mockItem: RowerEvent = {
    totalMinutes: 2,
    totalSeconds: 34,
    distance: 2133,
    split500mMinutes: 2,
    split500mSeconds: 14,
    spm: 18,
    watt: 200,
    calories: 514,
    level: 2
};
function emitFake(callback: Function) {
    setTimeout(() => {
        const rnd = Math.trunc((Math.random() - 0.5) * 8);
        mockItem.split500mSeconds = mockItem.split500mSeconds + rnd;
        mockItem.distance = mockItem.distance + 3;
        mockItem.watt = Math.trunc(mockItem.watt + rnd * 0.3);
        mockItem.spm = Math.trunc(mockItem.spm + rnd);
        mockItem.calories = Math.trunc(mockItem.calories + rnd);
        callback(mockItem);
        emitFake(callback);
    }, 500);
}

export async function connect(
    mockSerial: boolean,
    callback: Function
): Promise<ConnectionStatus> {
    if (mockSerial) {
        setTimeout(() => {
            emitFake(callback);
        }, 500);

        return Promise.resolve(ConnectionStatus.Connected);
    }

    let items: Array<any> = await SerialPort.list();
    let names = items
        .map(x => String(x["comName"]))
        .filter(x => x.toLowerCase().startsWith("/dev/tty.usb"));

    let results = (await Promise.all(names.map(detectRower))).filter(x =>
        U.isSuccess(x)
    );

    if (results.length > 0 && U.isSuccess(results[0])) {
        state.serialPort = (<U.Success<SerialPort>>results[0]).item;

        listenForRowerData(state.serialPort, callback);
        return Promise.resolve(ConnectionStatus.Connected);
    }

    state.serialPort = null;
    return Promise.resolve(ConnectionStatus.RowerNotFound);
}
