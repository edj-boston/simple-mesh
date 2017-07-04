# SimpleMesh

SimpleMesh is a pseudo 3D context for the HTML5 canvas element. It allows you to load models from simple arrays or more complex objects. Models have 3 main componants: vertices, edges, and faces. Each of these can be styled. You can also scale, translate, and rotate the model in 3D.

Some special interactive flags are provided to easily control the visibility of vertices, edges, and faces. A simple fog effect is available for black & white models that gives a sense of depth perception.

<a href="http://edj-boston.github.io/simple-mesh/examples/basic/"><img width="250" height="250" src="http://edj-boston.github.io/simple-mesh/images/examples-basic.jpg" alt="Basic example" /></a>
<a href="http://edj-boston.github.io/simple-mesh/examples/house/"><img width="250" height="250" src="http://edj-boston.github.io/simple-mesh/images/examples-house.jpg" alt="House example" /></a>
<a href="http://edj-boston.github.io/simple-mesh/examples/dodecahedron/"><img width="250" height="250" src="http://edj-boston.github.io/simple-mesh/images/examples-dodecahedron.jpg" alt="Dodecahedron example" /></a>
<a href="http://edj-boston.github.io/simple-mesh/examples/icosahedron/"><img width="250" height="250" src="http://edj-boston.github.io/simple-mesh/images/examples-icosahedron.jpg" alt="Icosahedron example" /></a>


## Upcoming changes

 * Override styles on a per-vertex, edge, or face basis
 * Polygonal rendering with z-Index calculation
 * Polygon textures
 * Embedded mouse interaction methods
 * Collision detection


## Requirements

Host the file (located in `/dist`) and include the SimpleMesh JS in the head of your HTML document.

```html
<script type="text/javascript" src="simple-mesh.js"></script>
```


## Examples

### Setup your animation

Define some global namespaces for your animation.

```js
var canvas; // The canvas element
var WIDTH;
var HEIGHT;
var ctx; // The canvas context
var model; // You model
```

Attach a small procedure to the window.onload event. This will run a setup function once and a loop 60 times per second.

```js
window.onload = function() {
	setup();
	window.setInterval(loop, 1000 / 60);
}
```

Do a few things in your setup() function that only need to be done once. Set the canvas, context, some useful constants, and translate the coordinate system to the center.

```js
function setup() {
	canvas = document.getElementById('canvas');
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	ctx = canvas.getContext('2d');
	ctx.translate( WIDTH/2, HEIGHT/2 );

	// Instantiate a SimpleMesh object here
}
```

Use the requestAnimation frame object for a more sophisticated approach that allows the browser to select the framerate.


### Instantiate a SimpleMesh object

Just call the constructor and pass a object with a canvas context.

```js
model = new SimpleMesh(ctx);
```


### Load a model

Try using the loadArrays() method to create a simple model. Here's a pyramid from our basic example.

```js
model.loadArrays({
	vertices : [
		[  100, -75, -100 ], // Pyramid base
		[ -100, -75, -100 ],
		[ -100, -75,  100 ],
		[  100, -75,  100 ],
		[    0,  75,    0 ] // The top
	],
	edges : [
		[ 0, 1 ], [ 1, 2 ], [ 2, 3 ], [ 3, 0 ],
		[ 4, 0 ], [ 4, 1 ], [ 4, 2 ], [ 4, 3 ]
	]
});
```


### Draw a frame
This procedure draws a frame and gets repeated by the setInterval() you declared earlier.

```js
function loop() {
	ctx.clearRect( WIDTH/-2, HEIGHT/-2, WIDTH, HEIGHT );
	model.theta.z++;
	model.theta.x++;
	model.draw();
}
```

Wipe the canvas, rotate the model, and draw it.

All this can be seen in the the "basic" example included in the repository. Two other more advanced examples are included as well.
