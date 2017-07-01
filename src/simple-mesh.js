/*!
 * SimpleMesh
 * Copyright (c) 2013 Eric Johnson
 * Version 0.5 
 * Licensed under the MIT license
 * http://ericjohnson.me
 */
 
/* *
* SimpleMesh namespace + constructor
*/
var SimpleMesh = function( opts ) {

	// Required properties
	if( opts.hasOwnProperty('context') ) {
		this.context = opts.context;
	} else {
		throw 'A ctx property is required!'
	}

	/* Defaults */
	var defaults = {
		fog : false,
		origin : { x:0, y:0, z:0 },
		theta : { x:0, y:0, z:0 }, // Rotation angles in +/- degrees
		vertices : {}, // Vertex container
		vertexVisibility : false,
		vertexStyle : {
			fillStyle : '#000000',
			strokeStyle : '#ffffff',
			lineWidth : 1,
			radius : 3,
			labelVisibility : true,
			labelOffset : {  x:5, y:5 },
			labelFillStyle : '#000000',
			labelStrokeStyle : '#ffffff',
			labelLineWidth : 2,
			labelTextFillStyle : '#000000'
		},
		edges : {}, // Edge container
		edgeVisibility : true,
		edgeStyle : {
			strokeStyle : '#000000',
			lineWidth : 1,
			lineCap : 'round'
		},
		faces : {}, // Face container
		faceVisibility : true,
		faceStyle : {
			fillStyle : '#cc0000'
		}
	}

	/* Helper function to extend objects */
	// http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
	this.extend = function(destination, source) {
		for(var property in source) {
			if(source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	};
	var obj = this.extend( defaults, opts );
	for( prop in obj ) {
		this[prop] = obj[prop];
	}


	/* Validate properties */
	this.validate = function() {
		if( typeof this.fog != 'boolean' ) throw 'The "fog" property must be boolean';
		if( typeof this.origin != 'object' ) throw 'The "origin" property must be an object';
		if( typeof this.origin.x != 'number' ) throw 'The "origin.x" property must be a number';
		if( typeof this.origin.y != 'number' ) throw 'The "origin.y" property must be a number';
		if( typeof this.origin.z != 'number' ) throw 'The "origin.z" property must be a number';
		if( typeof this.theta != 'object' ) throw 'The "theta" property must be an object';
		if( typeof this.theta.x != 'number' ) throw 'The "theta.x" property must be a number';
		if( typeof this.theta.y != 'number' ) throw 'The "theta.y" property must be a number';
		if( typeof this.theta.z != 'number' ) throw 'The "theta.z" property must be a number';
		if( typeof this.vertexVisibility != 'boolean' ) throw 'The "vertexVisibility" property must be boolean';
		if( typeof this.vertexStyle != 'object' ) throw 'The "vertexStyle" property must be an object';
		if( typeof this.edgeVisibility != 'boolean' ) throw 'The "edgeVisibility" property must be boolean';
		if( typeof this.edgeStyle != 'object' ) throw 'The "edgeStyle" property must be an object';
		if( typeof this.faceVisibility != 'boolean' ) throw 'The "faceVisibility" property must be boolean';
		if( typeof this.faceStyle != 'object' ) throw 'The "faceStyle" property must be an object';
	}
	this.validate();

	/* Load objects */
	this.loadObjects = function( opts ) {

		// Vertices
		if( opts.hasOwnProperty('vertices') ) {
			for( id in opts.vertices ) {
				var vertex = new Vertex( opts.vertices[id] );
				this.vertices[id] = vertex;
			}
		}

		// Edges
		if( opts.hasOwnProperty('edges')  ) {
			for( id in opts.edges ) {
				var edge = opts.edges[id];

				// Make certain the vertices are a real
				if( this.vertices[ edge.a ] == 'undefined' ) throw 'A is not a vertex';
				if( this.vertices[ edge.b ] == 'undefined' ) throw 'B is not a vertex';

				edge.a = this.vertices[ edge.a ];
				edge.b = this.vertices[ edge.b ];

				// 
				this.edges[id] = new Edge(edge);
			}

		}

		// Faces
		if( opts.hasOwnProperty('faces') ) {
			for( fId in opts.faces ) {
				var face = opts.faces[fId];
				for( vId in face.vertices ) {
					var vertex = face.vertices[vId];
					face.vertices[vId] = this.vertices[vertex];
				}
				this.faces[fId] = new Face(face);
			}
		}
	};

	/* Load simple arrays */
	this.loadArrays = function( obj ) {

		if( obj.vertices == null ) throw 'An array of vertices must is required'; // Require vertices
		var verticeOrder = []; // Store the vertex order for loading edges

		// Loop over the array of vertices
		for( i in obj.vertices ) {
			// Set the vertex to our container obj with a unique id
			// and if successful, push into our stored order
			do {
				var id = this.generateUniqueId();
				if( this.vertices.hasOwnProperty(id) ) {
					console.log('Id "' + id + '" is already a vertex! Generating a new id...');
					id = null;
				} else {
					this.vertices[id] = new Vertex({
						x : obj.vertices[i][0],
						y : obj.vertices[i][1],
						z : obj.vertices[i][2],
						parent : this
					});
					verticeOrder.push(id);
				}
			} while( id == null );
		}

		// Loop over the array of edges (if set)
		for( i in obj.edges ) {

			// Check to make sure the A index is actually a vertice
			// before passing the values to the constructor
			var aI = obj.edges[i][0];
			if( typeof verticeOrder[ aI ] != 'undefined' ) {
				var a = verticeOrder[ aI ];
			} else {
				throw('Index "' + aI + '" is not a vertex!');
			}

			// Check to make sure the B index is actually a vertice
			// before passing the values to the constructor
			var bI = obj.edges[i][1];
			if( typeof verticeOrder[ bI ] != 'undefined' ) {
				var b = verticeOrder[ bI ];
			} else {
				throw('Index "' + bI + '" is not a vertex!');
			}

			// Make an edge
			do {
				var id = this.generateUniqueId();
				if( this.edges.hasOwnProperty(id) ) {
					console.log('Id "' + id + '" is already an edge! Generating a new id...');
					id = null;
				} else {
					this.edges[id] = new Edge({
						a		: this.vertices[a],
						b		: this.vertices[b],
						parent	: this
					});
				}
			} while( id == null );
		}

	};

	/* Expand or contract a mesh based on a numeric factor */
	this.scale = function( factor ) {

		// Require a numeric factor
		if( typeof factor != 'number' ) throw 'Factor "' + factor + '" must be numeric';

		// Loop over the vertices and multiply
		for( i in this.vertices ) {
			var vertex = this.vertices[i];
			vertex.x = vertex.oX = vertex.x * factor;
			vertex.y = vertex.oY = vertex.y * factor;
			vertex.z = vertex.oZ = vertex.z * factor;
		}
	}

	/* translate */
	this.translate = function( origin ) {
		for( id in this.vertices ) {
			var vertex = this.vertices[id];
			vertex.x += origin.x;
			vertex.y += origin.y;
			vertex.y *= -1; // Reverse Y
			vertex.z += origin.z;
		}
	}

	/* Reset the rotation angles */
	this.reset = function() {
		for( id in this.vertices ) {
			var vertex = this.vertices[id];
			vertex.x = vertex.oX;
			vertex.y = vertex.oY;
			vertex.z = vertex.oZ;
		}
	};

	/* Render the mesh */
	this.draw = function() {

		// Rotate
		this.rotateX( this.theta.x );
		this.rotateY( this.theta.y );
		this.rotateZ( this.theta.z );

		// Translate
		this.translate( this.origin );

		// Draw faces
		if( this.faceVisibility ) {
			for( id in this.faces ) {
				this.faces[id].draw( this.context, this.faceStyle, this.origin );
			}
		}

		// Draw edges
		if( this.edgeVisibility ) {
			for( id in this.edges ) {
				this.edges[id].draw( this.context, this.edgeStyle, this.fog );
			}
		}

		// Draw vertices
		if( this.vertexVisibility ) {
			for( id in this.vertices ) {
				this.vertices[id].draw( this.context, this.vertexStyle );
			}
		}

		// Reset
		this.reset();
	}

	this.rotateX = function( theta ) {
		this.rotate( 'y', 'z', theta );
	}

	this.rotateY = function( theta ) {
		this.rotate( 'x', 'z', theta );
	}

	this.rotateZ = function( theta ) {
		this.rotate( 'x', 'y', theta);
	}

	/* Perform a matrix rotation on all vertices */
	this.rotate = function( a, b, theta ) {
		// Validate
		var axes = ['x','y','z'];
		if( axes.indexOf(a) < 0 ) throw 'Axis A must be one of x, y, or z';
		if( axes.indexOf(b) < 0 ) throw 'Axis B must be one of x, y, or z';
		if( typeof theta != 'number' ) throw 'Theta must be numeric';

		// Perform a matrix rotation
		var radians = Math.PI / 180 * theta;

		for( id in this.vertices ) {
			var vertex = this.vertices[id];
			// Buffer the values before assigning
			var tempA = ( (vertex[a] * Math.cos(radians) ) - (vertex[b] * Math.sin(radians)) );
			var tempB = ( (vertex[a] * Math.sin(radians) ) + (vertex[b] * Math.cos(radians)) );
			vertex[a] = tempA;
			vertex[b] = tempB;
		}
	};

	/* Helper to generate a randomized 5 char Id */
	this.generateUniqueId =  function() {

		// Initialize empty string and possible characters
		var id = '';
		var length = 5;
		var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

		// Assemble a random string
		for( var i=0; i < length; i++ ) {
			id += chars.charAt(Math.floor(Math.random() * chars.length));
		}

		return id;
	};
};

/* *
 * Vertex constructor
 */
var Vertex = function ( opts ) {
	// Validate
	if( opts.hasOwnProperty('x') == false ) throw 'X is required';
	if( opts.hasOwnProperty('y') == false ) throw 'Y is required';
	if( opts.hasOwnProperty('z') == false ) throw 'Z is required';

	// 
	this.oX = opts.x;
	this.oY = opts.y;
	this.oZ = opts.z;
	this.x = opts.x;
	this.y = opts.y;
	this.z = opts.z;

	this.draw = function( ctx, style ) {
		// Draw the circle
		ctx.beginPath();
		ctx.arc( this.x, this.y, style.radius, 0, 2*Math.PI, false);
		ctx.closePath();

		// Style the circle
		ctx.lineWidth = style.lineWidth;
		if( ctx.fillStyle = style.fillStyle ) ctx.fill();
		if( ctx.strokeStyle = style.strokeStyle ) ctx.stroke();

		// Draw the label
		if( style.labelVisibility ) {
			var x = this.x + style.labelOffset.x;
			var y = this.y - style.labelOffset.y;

			ctx.lineWidth = style.labelLineWidth;
			if( ctx.strokeStyle = style.labelStrokeStyle ) ctx.strokeText( id, x, y );

			if( ctx.fillStyle = style.labelFillStyle ) ctx.fillText( id, x, y );
		}
	}

	return this;
};

/* *
 * Edge constructor
 */
var Edge = function( opts ) {

	this.a = opts.a;
	this.b = opts.b;

	this.draw = function( ctx, style, fog ) {

		// Plot the line
		ctx.beginPath();
		ctx.moveTo( this.a.x, this.a.y );
		ctx.lineTo( this.b.x, this.b.y );
		ctx.moveTo( 0, 0 ); // Hack so lineCap works
		ctx.closePath();

		ctx.lineCap = style.lineCap;
		ctx.lineWidth = style.lineWidth;
		if( ctx.strokeStyle = style.strokeStyle ) ctx.stroke();

		// Calculate the z-index fog
		if( fog ) {
			var grad = ctx.createLinearGradient( this.a.x, this.a.y, this.b.x, this.b.y );
			grad.addColorStop(0, this.generateRgbZ(this.a.z) );
			grad.addColorStop(1, this.generateRgbZ(this.b.z) );
			ctx.strokeStyle = grad;
			ctx.stroke();
		}
	}

	/* Helper to build an RBG string based on z-index */
	this.generateRgbZ = function( z ) {
		var str = 'rgb('
		str += Math.round( 100 + ( z * 0.5 ) ) + ', ';
		str += Math.round( 100 + ( z * 0.5 ) ) + ', '
		str += Math.round( 100 + ( z * 0.5 ) ) + ')';
		
		return str;
	}

	return this;
};

/* *
 * Face
 */
var Face = function( opts ) {

	this.vertices = opts.vertices;
	this.fillStyle = opts.fillStyle;

	this.draw = function( ctx, style, origin ) {

		// Plot the shape
		var first = true;
		ctx.beginPath();
		for( id in this.vertices ) {
			var vertex = this.vertices[id];
			if( first ) {
				ctx.moveTo( vertex.x, vertex.y );
				first = false;
			} else {
				ctx.lineTo( vertex.x, vertex.y );
			}
		}
		ctx.closePath();

		// Paint the face
		if( this.fillStyle ) {
			ctx.fillStyle = this.fillStyle( origin );
		} else {
			ctx.fillStyle = style.fillStyle;
		}
		ctx.fill();
	}

	return this;
};