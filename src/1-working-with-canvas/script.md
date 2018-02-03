# Working with Canvas in React

When coming to React, many folks wonder how they can integrate an HTML canvas into React. Because React abstracts the DOM, it may not be immediately obvious how to do this.

Let's start by creating a Canvas component.

```js
import React, { Component } from 'react';

class Canvas extends Component {
  render() {
    return <canvas />;
  }
}

export default Canvas;
```

We'll create the world's simplest application to use this Canvas in:

```js
// App.jsx
import React from 'react';

import Canvas from './Canvas';

const App = () => (
  <div>
    Hello canvas<br />
    <Canvas />
  </div>
);

export default App;
```

(check it out in-browser, an empty screen below "Hello canvas")

Believe it or not, the canvas is there; we can view it using the element inspector.

This is a bit of a pain, though, so one thing I like to do is to add a border to my canvas. This is temporary! We'll remove it later on when it stops being necessary.

```js
import React, { Component } from 'react';

class Canvas extends Component {
  render() {
    return <canvas style={{ border: '1px solid black' }} />;
  }
}

export default Canvas;
```

Better! We can see it now.

One thing that I always find a bit curious: we haven't given the Canvas a size. Canvas isn't like other `display: inline` DOM nodes, it defaults to 300 by 150.

Let's give it an explicit size.

Your first thought might be to inline the numbers directly:

```js
<canvas width={500} />
```

But we can help make this component reusable by specifying it as a prop:

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Canvas extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  render() {
    const { width, height } = this.props;

    return <canvas width={width} height={height} />;
  }
}

export default Canvas;
```

In our App, let's give it those props. I feel like working with a square today:

```js
import React from 'react';

import Canvas from './Canvas';

const App = () => (
  <div>
    Hello canvas<br />
    <Canvas width={500} height={500} />
  </div>
);

export default App;
```

We can see now that our

We need some way of accessing the DOM node, and for that, we need refs.

```js
import React, { Component } from 'react';

class Canvas extends Component {
  componentDidMount() {
    console.log(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.ctx.rect(10, 10, 100, 100);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  }

  render() {
    return <canvas ref={elem => (this.canvas = elem)} />;
  }
}

export default Canvas;
```

And we have a red box! When the component is rendering, it captures a reference to the canvas DOM element. After mount, we get the context from that canvas, and use it to draw a rectangle.

There are a couple of minor improvements we can make to this code. Let's start by moving the drawing logic out of `componentDidMount`.

```js
import React, { Component } from 'react';

class Canvas extends Component {
  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');

    this.draw();
  }

  draw = () => {
    this.ctx.rect(10, 10, 100, 100);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  };

  render() {
    return <canvas ref={elem => (this.canvas = elem)} />;
  }
}

export default Canvas;
```

Let's also move our ref-capturing logic into its own function.

```js
import React, { Component } from 'react';

class Canvas extends Component {
  componentDidMount() {
    this.draw();
  }

  captureRef = elem => {
    this.canvas = elem;
    this.ctx = this.canvas.getContext('2d');
  };

  draw = () => {
    this.ctx.rect(10, 10, 100, 100);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  };

  render() {
    return <canvas ref={this.captureRef} />;
  }
}

export default Canvas;
```

Something you'll likely notice pretty quickly, if you're doing this on a modern mac computer, is that the box is blurry. This is because the canvas doesn't know how to handle pixel-dense monitors like Apple's retina screens. Retina screens cram 4 physical pixels into the space of a single software pixel, and Canvas ignores this.

Thankfully there's a relatively simple fix for this.

Let's write a `scaleCanvas` helper function.

```js
function scaleCanvas(canvas, ctx) {
  const { width, height } = canvas;

  const ratio = window.devicePixelRatio || 1;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  canvas.width *= ratio;
  canvas.height *= ratio;
}
```

// Figure out our backing scale.
// This ensures canvas looks crisp on retina displays, where there are
// in fact 4 on-screen pixels for every 1 calculated pixel.
export function scaleCanvas(
canvas: HTMLCanvasElement,
ctx: CanvasRenderingContext2D,
width?: number,
height?: number
) {
// If we're rendering on the server, do nothing.
if (typeof window === 'undefined') {
return;
}

width = typeof width === 'number' ? width : canvas.width;
height = typeof height === 'number' ? height : canvas.height;

const backingStoreRatio =
ctx.webkitBackingStorePixelRatio ||
ctx.mozBackingStorePixelRatio ||
ctx.msBackingStorePixelRatio ||
ctx.oBackingStorePixelRatio ||
ctx.backingStorePixelRatio ||
1;

// $FlowFixMe - apparently backingStoreRatio can contain non-numbers?
const ratio = (window.devicePixelRatio || 1) / backingStoreRatio;

if (ratio > 1) {
/_ eslint-disable no-param-reassign _/
canvas.style.height = `${height}px`;
canvas.style.width = `${width}px`;
canvas.width = width _ ratio;
canvas.height = height _ ratio;
/_ eslint-enable _/

    ctx.scale(ratio, ratio);

}
}
