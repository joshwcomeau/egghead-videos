// Making canvases sharp on retina displays with React
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  state = {
    size: 20,
    x: 40,
    y: 10,
  };

  componentDidMount() {
    this.tick();
  }

  tick = () => {
    window.requestAnimationFrame(() => {
      this.setState(
        state => ({
          x: state.x + 1,
          y: state.y + 1,
        }),
        this.tick
      );
    });
  };

  render() {
    return (
      <ScreenSize>
        {({ width, height }) => (
          <Canvas
            width={width}
            height={height}
            style={{ display: 'block' }}
            draw={(canvas, ctx) => {
              const { x, y, size } = this.state;

              ctx.clearRect(0, 0, canvas.width, canvas.height);

              ctx.strokeRect(0, 0, canvas.width, canvas.height);

              ctx.fillStyle = 'red';
              ctx.fillRect(x, y, size, size);
            }}
          />
        )}
      </ScreenSize>
    );
  }
}

class ScreenSize extends Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  render() {
    return this.props.children(this.state);
  }
}

class Canvas extends Component {
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');

    this.scale();
    this.props.draw(this.canvas, this.ctx);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      this.scale();
    }
    this.props.draw(this.canvas, this.ctx);
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
    const { width, height, style } = this.props;

    return (
      <canvas
        ref={node => {
          this.canvas = node;
        }}
        width={width}
        height={height}
        style={style}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
