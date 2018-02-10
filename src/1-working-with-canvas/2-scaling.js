// Making canvases sharp on retina displays with React
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <Canvas
      draw={(canvas, ctx) => {
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
      }}
      width={200}
      height={200}
    />
  );
};

class Canvas extends Component {
  componentDidMount() {
    const ctx = this.canvas.getContext('2d');

    this.scale();
    this.props.draw(this.canvas, ctx);
  }

  scale() {
    const { width, height } = this.props;

    const ratio = window.devicePixelRatio || 1;

    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;

    this.ctx.scale(ratio, ratio);
  }

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        ref={node => {
          this.canvas = node;
        }}
        width={width}
        height={height}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
