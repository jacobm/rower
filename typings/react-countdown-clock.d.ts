declare module "react-countdown-clock" {
    import * as React from "react";
    interface Props {
        seconds: number;
        color: string;
        alpha: number;
        size: number;
        onComplete: Function;
    }
    class ReactCountdownClock extends React.Component<Props, {}> {}
    export = ReactCountdownClock;
}
