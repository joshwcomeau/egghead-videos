import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <Canvas
      width={200}
      height={200}
      draw={(canvas, ctx) => {
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
      }}
    />
  );
};

class Canvas extends Component {
  componentDidMount() {
    const ctx = this.canvas.getContext('2d');
    this.props.draw(this.canvas, ctx);
  }
  render() {
    const { width, height } = this.props;

    return (
      <canvas
        ref={node => (this.canvas = node)}
        width={width}
        height={height}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
