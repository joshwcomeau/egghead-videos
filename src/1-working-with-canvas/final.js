import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Canvas extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');

    this.scale();
    this.draw();

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.scale();
    this.draw();
  };

  scale = () => {
    const { width, height } = this.props;

    const ratio = window.devicePixelRatio || 1;

    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;

    this.ctx.scale(ratio, ratio);
  };

  draw = () => {
    this.ctx.rect(10, 10, 100, 100);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  };

  render() {
    const { width, height } = this.props;

    return (
      <canvas
        width={width}
        height={height}
        style={{ border: '1px solid black' }}
        ref={elem => (this.canvas = elem)}
      />
    );
  }
}

export default Canvas;
