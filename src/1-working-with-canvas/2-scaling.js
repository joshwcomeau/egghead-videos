import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const WIDTH = 200;
  const HEIGHT = 200;

  return (
    <Canvas
      width={WIDTH}
      height={HEIGHT}
      draw={(canvas, ctx) => {
        ctx.strokeRect(0, 0, WIDTH, HEIGHT);
        ctx.fillRect(20, 20, 20, 20);
      }}
    />
  );
};

class Canvas extends Component {
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');

    this.scale();
    this.props.draw(this.canvas, this.ctx);
  }

  scale = () => {
    const { width, height } = this.props;

    const ratio = window.devicePixelRatio || 1;

    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;

    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.ctx.scale(ratio, ratio);
  };

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
