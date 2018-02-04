# Working with Canvas in React

The HTML canvas is a wonderful, powerful tool that lets you build cool things not otherwise possible with the DOM. It may not be clear, though, how to work with it in React.

Let's start by building a Canvas component. We'll keep it really simple for now: it will just return a canvas element.

In the browser, we don't see anything, but that's only because Canvas elements are invisible by default.

To help with this, I like to give my Canvases an outline. This is just a temporary helper, we'll get rid of it later.

Something a bit funny about Canvas is that it has a default size of 300 by 150.

Let's give it an explicit size.

Rather than hardcode a width and height, let's use props. This way, each Canvas can specify its own size. In our App, we'll pass a width and height down. Today feels like a square day, so let's make it 200 by 200.

In order for us to paint to the canvas, we need to capture a reference to the underlying DOM node.

With vanilla Javascript, you might use something like `document.querySelector` to grab the canvas DOM node.

The way to do this in React is with refs. Our ref prop takes a function, and that function is called with the DOM node by React. We'll assign the DOM node to a property on the Canvas instance.

`ref={node => { this.canvas = node; }}`

Once the component has mounted, we'll be able to access that node. Let's verify that it works with a quick 'console.log'.

There it is! Let's use it to draw something.

Earlier, I said we'd get rid of that `outline`. Let's do that now, and recreate it within the Canvas.

As we would with vanilla Javascript, we'll get a 2D context. Then, we'll draw a rect, from the top left corner at 0-0, to the bottom right corner.

This does the trick! But, our work isn't over yet.

I don't like that the Canvas component hardcodes the drawing instructions; We want our Canvas to be generic, so that different Canvas instances can draw different things.

Let's invert the control by allowing the App to specify the draw instructions. We can add a `draw` prop to the Canvas element. This will be a function, which will be given the canvas and its context as arguments.

Then we'll copy all those drawing instructions into this method, so that the Canvas doesn't own them anymore. We just need to update the Canvas to invoke the draw method on mount instead.

This is the essence of drawing with React!

Our Canvas component produces a canvas DOM node. We can supply it with a width and height from props. We capture a reference to the underlying DOM node. When the component mounts, we create a 2D context, and invoke the `draw` callback with everything it needs to draw something.

Within our App, we can add these Canvas elements wherever we need them, and specify their drawing instructions on a canvas-by-canvas basis.

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <Canvas
      width={200}
      height={200}
      draw={(canvas, ctx) => {
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.stroke();
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
```
