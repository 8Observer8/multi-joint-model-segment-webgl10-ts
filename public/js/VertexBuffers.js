define(["require", "exports", "./WebGLContext"], function (require, exports, WebGLContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VertexBuffers = /** @class */ (function () {
        function VertexBuffers() {
        }
        VertexBuffers.Init = function (program) {
            // Vertex coordinate (prepare coordinates of cuboids for all segments)
            var verticesBase = new Float32Array([
                5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0, 5.0, 0.0, 5.0,
                5.0, 2.0, 5.0, 5.0, 0.0, 5.0, 5.0, 0.0, -5.0, 5.0, 2.0, -5.0,
                5.0, 2.0, 5.0, 5.0, 2.0, -5.0, -5.0, 2.0, -5.0, -5.0, 2.0, 5.0,
                -5.0, 2.0, 5.0, -5.0, 2.0, -5.0, -5.0, 0.0, -5.0, -5.0, 0.0, 5.0,
                -5.0, 0.0, -5.0, 5.0, 0.0, -5.0, 5.0, 0.0, 5.0, -5.0, 0.0, 5.0,
                5.0, 0.0, -5.0, -5.0, 0.0, -5.0, -5.0, 2.0, -5.0, 5.0, 2.0, -5.0 // v4-v7-v6-v5 back
            ]);
            var verticesArm1 = new Float32Array([
                1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5,
                1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5,
                1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5,
                -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5,
                -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5,
                1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5 // v4-v7-v6-v5 back
            ]);
            var verticesArm2 = new Float32Array([
                2.0, 10.0, 2.0, -2.0, 10.0, 2.0, -2.0, 0.0, 2.0, 2.0, 0.0, 2.0,
                2.0, 10.0, 2.0, 2.0, 0.0, 2.0, 2.0, 0.0, -2.0, 2.0, 10.0, -2.0,
                2.0, 10.0, 2.0, 2.0, 10.0, -2.0, -2.0, 10.0, -2.0, -2.0, 10.0, 2.0,
                -2.0, 10.0, 2.0, -2.0, 10.0, -2.0, -2.0, 0.0, -2.0, -2.0, 0.0, 2.0,
                -2.0, 0.0, -2.0, 2.0, 0.0, -2.0, 2.0, 0.0, 2.0, -2.0, 0.0, 2.0,
                2.0, 0.0, -2.0, -2.0, 0.0, -2.0, -2.0, 10.0, -2.0, 2.0, 10.0, -2.0 // v4-v7-v6-v5 back
            ]);
            var verticesPalm = new Float32Array([
                1.0, 2.0, 3.0, -1.0, 2.0, 3.0, -1.0, 0.0, 3.0, 1.0, 0.0, 3.0,
                1.0, 2.0, 3.0, 1.0, 0.0, 3.0, 1.0, 0.0, -3.0, 1.0, 2.0, -3.0,
                1.0, 2.0, 3.0, 1.0, 2.0, -3.0, -1.0, 2.0, -3.0, -1.0, 2.0, 3.0,
                -1.0, 2.0, 3.0, -1.0, 2.0, -3.0, -1.0, 0.0, -3.0, -1.0, 0.0, 3.0,
                -1.0, 0.0, -3.0, 1.0, 0.0, -3.0, 1.0, 0.0, 3.0, -1.0, 0.0, 3.0,
                1.0, 0.0, -3.0, -1.0, 0.0, -3.0, -1.0, 2.0, -3.0, 1.0, 2.0, -3.0 // v4-v7-v6-v5 back
            ]);
            var verticesFinger = new Float32Array([
                0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5,
                0.5, 2.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 2.0, -0.5,
                0.5, 2.0, 0.5, 0.5, 2.0, -0.5, -0.5, 2.0, -0.5, -0.5, 2.0, 0.5,
                -0.5, 2.0, 0.5, -0.5, 2.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5,
                -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5,
                0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 2.0, -0.5, 0.5, 2.0, -0.5 // v4-v7-v6-v5 back
            ]);
            var normals = new Float32Array([
                0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
                -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
                0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
                0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 // v4-v7-v6-v5 back
            ]);
            // Indices of the vertices
            var indices = new Uint8Array([
                0, 1, 2, 0, 2, 3,
                4, 5, 6, 4, 6, 7,
                8, 9, 10, 8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23 // back
            ]);
            // Write coords to buffers, but don't assign to attribute variables
            this.baseBuffer = this.InitArrayBufferForLaterUse(verticesBase);
            this.arm1Buffer = this.InitArrayBufferForLaterUse(verticesArm1);
            this.arm2Buffer = this.InitArrayBufferForLaterUse(verticesArm2);
            this.palmBuffer = this.InitArrayBufferForLaterUse(verticesPalm);
            this.fingerBuffer = this.InitArrayBufferForLaterUse(verticesFinger);
            // Write normals to a buffer, assign it to aNormal and enable it
            if (!this.InitArrayBuffer(program, "aNormal", normals, WebGLContext_1.gl.FLOAT, 3))
                return -1;
            // Unbind the buffer object
            WebGLContext_1.gl.bindBuffer(WebGLContext_1.gl.ARRAY_BUFFER, null);
            // Write the indices to the buffer object
            var indexBuffer = WebGLContext_1.gl.createBuffer();
            WebGLContext_1.gl.bindBuffer(WebGLContext_1.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            WebGLContext_1.gl.bufferData(WebGLContext_1.gl.ELEMENT_ARRAY_BUFFER, indices, WebGLContext_1.gl.STATIC_DRAW);
            return indices.length;
        };
        VertexBuffers.InitArrayBufferForLaterUse = function (data) {
            // Create a buffer object
            var buffer = WebGLContext_1.gl.createBuffer();
            // Write date into the buffer object
            WebGLContext_1.gl.bindBuffer(WebGLContext_1.gl.ARRAY_BUFFER, buffer);
            WebGLContext_1.gl.bufferData(WebGLContext_1.gl.ARRAY_BUFFER, data, WebGLContext_1.gl.STATIC_DRAW);
            return buffer;
        };
        VertexBuffers.InitArrayBuffer = function (program, attributeName, data, type, num) {
            // Create a buffer object
            var buffer = WebGLContext_1.gl.createBuffer();
            // Write date into the buffer object
            WebGLContext_1.gl.bindBuffer(WebGLContext_1.gl.ARRAY_BUFFER, buffer);
            WebGLContext_1.gl.bufferData(WebGLContext_1.gl.ARRAY_BUFFER, data, WebGLContext_1.gl.STATIC_DRAW);
            // Assign the buffer object to the attribute variable
            var attributeLocation = WebGLContext_1.gl.getAttribLocation(program, attributeName);
            if (attributeLocation === -1) {
                console.log("Failed to get the storage location of " + attributeName);
                return false;
            }
            WebGLContext_1.gl.vertexAttribPointer(attributeLocation, num, type, false, 0, 0);
            // Enable the assignment of the buffer object to the attribute variable
            WebGLContext_1.gl.enableVertexAttribArray(attributeLocation);
            return true;
        };
        return VertexBuffers;
    }());
    exports.default = VertexBuffers;
});
//# sourceMappingURL=VertexBuffers.js.map