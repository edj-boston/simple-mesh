'use strict';

class SimpleMesh { // eslint-disable-line no-unused-vars
    constructor (context, opts) {
        if (!context) throw new Error('A `context` argument is required');

        const defaults = {
            fog              : false,
            origin           : { x : 0, y : 0, z : 0 },
            theta            : { x : 0, y : 0, z : 0 }, // Rotation angles in +/- degrees
            vertices         : {}, // Vertex container
            vertexVisibility : false,
            vertexStyle      : {
                fillStyle          : '#000000',
                strokeStyle        : '#ffffff',
                lineWidth          : 1,
                radius             : 3,
                labelVisibility    : true,
                labelOffset        : { x : 5, y : 5 },
                labelFillStyle     : '#000000',
                labelStrokeStyle   : '#ffffff',
                labelLineWidth     : 2,
                labelTextFillStyle : '#000000'
            },
            edges          : {}, // Edge container
            edgeVisibility : true,
            edgeStyle      : {
                strokeStyle : '#000000',
                lineWidth   : 1,
                lineCap     : 'round'
            },
            faces          : {}, // Face container
            faceVisibility : true,
            faceStyle      : {
                fillStyle : '#cc0000'
            }
        };

        this.deepExtend(this, defaults, opts);
        this.context = context; // Don't want this property subject to extension
        this.validate();

        return this;
    }

    deepExtend () {
        for (let i = arguments.length - 1; i > 0; i--) {
            const source = arguments[i];
            const dest = arguments[i - 1];
            for (const prop in source) {
                if (typeof source[prop] == 'object' && !Array.isArray(source[prop])) {
                    if (!dest.hasOwnProperty(prop)) dest[prop] = {};
                    dest[prop] = this.deepExtend(dest[prop], source[prop]);
                } else {
                    dest[prop] = source[prop];
                }
            }
        }
        return arguments[0];
    };

    /* Validate properties */
    validate () {
        if (typeof this.fog != 'boolean') throw 'The "fog" property must be boolean';
        if (typeof this.origin != 'object') throw 'The "origin" property must be an object';
        if (typeof this.origin.x != 'number') throw 'The "origin.x" property must be a number';
        if (typeof this.origin.y != 'number') throw 'The "origin.y" property must be a number';
        if (typeof this.origin.z != 'number') throw 'The "origin.z" property must be a number';
        if (typeof this.theta != 'object') throw 'The "theta" property must be an object';
        if (typeof this.theta.x != 'number') throw 'The "theta.x" property must be a number';
        if (typeof this.theta.y != 'number') throw 'The "theta.y" property must be a number';
        if (typeof this.theta.z != 'number') throw 'The "theta.z" property must be a number';
        if (typeof this.vertexVisibility != 'boolean') throw 'The "vertexVisibility" property must be boolean';
        if (typeof this.vertexStyle != 'object') throw 'The "vertexStyle" property must be an object';
        if (typeof this.edgeVisibility != 'boolean') throw 'The "edgeVisibility" property must be boolean';
        if (typeof this.edgeStyle != 'object') throw 'The "edgeStyle" property must be an object';
        if (typeof this.faceVisibility != 'boolean') throw 'The "faceVisibility" property must be boolean';
        if (typeof this.faceStyle != 'object') throw 'The "faceStyle" property must be an object';
    }

    /* Load objects */
    loadObjects (opts) {
        // Vertices
        if (opts.hasOwnProperty('vertices')) {
            for (const id in opts.vertices) {
                opts.vertices[id].id = id;
                this.vertices[id] = new Vertex(opts.vertices[id]);
            }
        }

        // Edges
        if (opts.hasOwnProperty('edges')) {
            for (const id in opts.edges) {
                const edge = opts.edges[id];

                // Make certain the vertices are a real
                if (this.vertices[edge.a] == 'undefined') throw 'A is not a vertex';
                if (this.vertices[edge.b] == 'undefined') throw 'B is not a vertex';

                edge.id = id;
                edge.a = this.vertices[edge.a];
                edge.b = this.vertices[edge.b];

                //
                this.edges[id] = new Edge(edge);
            }
        }

        // Faces
        if (opts.hasOwnProperty('faces')) {
            for (const faceId in opts.faces) {
                const face = opts.faces[faceId];
                for (const vertexId in face.vertices) {
                    const vertex = face.vertices[vertexId];
                    face.vertices[vertexId] = this.vertices[vertex];
                }
                this.faces[faceId] = new Face(face);
            }
        }
    };

    /* Load simple arrays */
    loadArrays (obj) {
        if (obj.vertices == null) throw 'An array of vertices must is required'; // Require vertices
        const verticeOrder = []; // Store the vertex order for loading edges

        // Loop over the array of vertices
        for (const i in obj.vertices) {
            // Set the vertex to our container obj with a unique id
            // and if successful, push into our stored order
            let id = null;
            do {
                id = this.generateUniqueId();
                if (this.vertices.hasOwnProperty(id)) {
                    console.log(`Id "${id}" is already a vertex! Generating a new id...`);
                    id = null;
                } else {
                    this.vertices[id] = new Vertex({
                        id,
                        x      : obj.vertices[i][0],
                        y      : obj.vertices[i][1],
                        z      : obj.vertices[i][2],
                        parent : this
                    });
                    verticeOrder.push(id);
                }
            } while (id == null);
        }

        // Loop over the array of edges (if set)
        for (const i in obj.edges) {
            const aI = obj.edges[i][0];
            const bI = obj.edges[i][1];
            const a = verticeOrder[aI];
            const b = verticeOrder[bI];

            // Make an edge
            let id = null;
            do {
                id = this.generateUniqueId();
                if (this.edges.hasOwnProperty(id)) {
                    console.log(`Id "${id}" is already an edge! Generating a new id...`);
                    id = null;
                } else {
                    this.edges[id] = new Edge({
                        id,
                        a      : this.vertices[a],
                        b      : this.vertices[b],
                        parent : this
                    });
                }
            } while (id == null);
        }
    };

    /* Expand or contract a mesh based on a numeric factor */
    scale (factor) {
        // Require a numeric factor
        if (typeof factor != 'number') throw `Factor "${factor}" must be numeric`;

        // Loop over the vertices and multiply
        for (const i in this.vertices) {
            const vertex = this.vertices[i];
            vertex.x = vertex.oX = vertex.x * factor;
            vertex.y = vertex.oY = vertex.y * factor;
            vertex.z = vertex.oZ = vertex.z * factor;
        }
    }

    /* translate */
    translate (origin) {
        for (const id in this.vertices) {
            const vertex = this.vertices[id];
            vertex.x += origin.x;
            vertex.y += origin.y;
            vertex.y *= -1; // Reverse Y
            vertex.z += origin.z;
        }
    }

    /* Reset the rotation angles */
    reset () {
        for (const id in this.vertices) {
            const vertex = this.vertices[id];
            vertex.x = vertex.oX;
            vertex.y = vertex.oY;
            vertex.z = vertex.oZ;
        }
    };

    /* Render the mesh */
    draw () {
        // Rotate
        this.rotateX(this.theta.x);
        this.rotateY(this.theta.y);
        this.rotateZ(this.theta.z);

        // Translate
        this.translate(this.origin);

        // Draw faces
        if (this.faceVisibility) {
            for (const id in this.faces) {
                this.faces[id].draw(this.context, this.faceStyle, this.origin);
            }
        }

        // Draw edges
        if (this.edgeVisibility) {
            for (const id in this.edges) {
                this.edges[id].draw(this.context, this.edgeStyle, this.fog);
            }
        }

        // Draw vertices
        if (this.vertexVisibility) {
            for (const id in this.vertices) {
                this.vertices[id].draw(this.context, this.vertexStyle);
            }
        }

        this.reset();
    }

    rotateX (theta) {
        this.rotate('y', 'z', theta);
    }

    rotateY (theta) {
        this.rotate('x', 'z', theta);
    }

    rotateZ (theta) {
        this.rotate('x', 'y', theta);
    }

    /* Perform a matrix rotation on all vertices */
    rotate (a, b, theta) {
        // Validate
        const axes = [ 'x', 'y', 'z' ];
        if (axes.indexOf(a) < 0) throw 'Axis A must be one of x, y, or z';
        if (axes.indexOf(b) < 0) throw 'Axis B must be one of x, y, or z';
        if (typeof theta != 'number') throw 'Theta must be numeric';

        // Perform a matrix rotation
        const radians = Math.PI / 180 * theta;

        for (const id in this.vertices) {
            const vertex = this.vertices[id];
            // Buffer the values before assigning
            const tempA = ((vertex[a] * Math.cos(radians)) - (vertex[b] * Math.sin(radians)));
            const tempB = ((vertex[a] * Math.sin(radians)) + (vertex[b] * Math.cos(radians)));
            vertex[a] = tempA;
            vertex[b] = tempB;
        }
    };

    /* Helper to generate a randomized 5 char Id */
    generateUniqueId () {
        let id = '';
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };
}

// Export on server only
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = SimpleMesh;
}
