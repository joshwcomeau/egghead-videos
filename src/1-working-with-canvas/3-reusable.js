import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return <Canvas width={200} height={200} />;
};

class Canvas extends Component {
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.draw();
  }

  draw() {
    this.ctx.rect(10, 10, 20, 20);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  }

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        ref={elem => (this.canvas = elem)}
        width={width}
        height={height}
        style={{ outline: '1px solid black' }}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
