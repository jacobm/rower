import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as d3 from 'd3';

class App extends React.Component<{ greeting: string }, { count: number }> {
    state = { count: 0 };
    render() {
        return (
            <div>
                <h2>{this.props.greeting}</h2>
                <button onClick={() => this.setState(
                    { count: this.state.count + 1 })}>
                    This button has been clicked {this.state.count} times.
              </button>
            </div>);
    }
}

interface Props {
    width: number,
    height: number
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
            <svg className="container" ref={(ref: SVGSVGElement) => this.ref = ref}
                width={this.props.width} height={this.props.height}>
            </svg>
        );
    }
}

class Home extends React.Component {
    render() {
        return (
            <div>
                <div data-tid="container">
                    <h2>Home rower dingo  </h2>
                </div>
            </div>
        );
    }
}

export {
    Home, D3App, App
}

