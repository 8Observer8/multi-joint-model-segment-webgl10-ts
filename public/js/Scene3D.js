define(["require", "exports", "./WebGLContext", "./ShaderProgram", "gl-matrix", "./VertexBuffers"], function (require, exports, WebGLContext_1, ShaderProgram_1, gl_matrix_1, VertexBuffers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scene3D = /** @class */ (function () {
        function Scene3D() {
            var _this = this;
            this.ANGLE_STEP = 3.0;
            this.baseHeight = 2.0;
            this.arm1Length = 10.0;
            this.arm2Length = 10.0;
            this.palmLength = 2.0;
            this.arm1Angle = 90.0;
            this.joint1Angle = 45.0;
            this.joint2Angle = 0.0;
            this.joint3Angle = 0.0;
            // Array for storing a matrix
            this.matrixStack = [];
            var program = ShaderProgram_1.default.Create();
            if (program === null) {
                console.log("Failed to get a shader program.");
                return;
            }
            this.amountOfVertices = VertexBuffers_1.default.Init(program);
            if (this.amountOfVertices == -1) {
                console.log("Failed to initialize the vertex buffers");
                return;
            }
            this.aPositionLocation = WebGLContext_1.gl.getAttribLocation(program, "aPosition");
            this.uMvpMatrixLocation = WebGLContext_1.gl.getUniformLocation(program, "uMvpMatrix");
            this.uNormalMatrixLocation = WebGLContext_1.gl.getUniformLocation(program, "uNormalMatrix");
            if (this.aPositionLocation < 0 || !this.uMvpMatrixLocation || !this.uNormalMatrixLocation) {
                console.log("Failed to get the storage location of attribute or uniform variable");
                return;
            }
            this.modelMatrix = gl_matrix_1.mat4.create();
            this.mvpMatrix = gl_matrix_1.mat4.create();
            this.normalMatrix = gl_matrix_1.mat4.create();
            this.viewProjMatrix = gl_matrix_1.mat4.create();
            var projMatrix = gl_matrix_1.mat4.create();
            var viewMatrix = gl_matrix_1.mat4.create();
            gl_matrix_1.mat4.perspective(projMatrix, 50.0 * Math.PI / 180.0, 1.0, 0.1, 100.0);
            gl_matrix_1.mat4.lookAt(viewMatrix, gl_matrix_1.vec3.fromValues(20.0, 10.0, 30.0), gl_matrix_1.vec3.fromValues(0.0, 0.0, 0.0), gl_matrix_1.vec3.fromValues(0.0, 1.0, 0.0));
            gl_matrix_1.mat4.multiply(this.viewProjMatrix, projMatrix, viewMatrix);
            WebGLContext_1.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            WebGLContext_1.gl.enable(WebGLContext_1.gl.DEPTH_TEST);
            WebGLContext_1.gl.viewport(0, 0, WebGLContext_1.gl.canvas.width, WebGLContext_1.gl.canvas.height);
            document.onkeydown =
                function (ev) {
                    _this.KeyDown(ev);
                };
            this.Draw();
        }
        Scene3D.prototype.KeyDown = function (ev) {
            switch (ev.keyCode) {
                case 40: // Up arrow key -> the positive rotation of joint1 around the z-axis
                case 83: // 'W' key
                    if (this.joint1Angle < 135.0) {
                        this.joint1Angle += this.ANGLE_STEP;
                    }
                    break;
                case 38: // Down arrow key -> the negative rotation of joint1 around the z-axis
                case 87: // S
                    if (this.joint1Angle > -135.0) {
                        this.joint1Angle -= this.ANGLE_STEP;
                    }
                    break;
                case 39: // Right arrow key -> the positive rotation of arm1 around the y-axis
                case 68:
                    this.arm1Angle = (this.arm1Angle + this.ANGLE_STEP) % 360;
                    break;
                case 37: // Left arrow key -> the negative rotation of arm1 around the y-axis
                case 65:
                    this.arm1Angle = (this.arm1Angle - this.ANGLE_STEP) % 360;
                    break;
                case 90: // 'ｚ'key -> the positive rotation of joint2
                    this.joint2Angle = (this.joint2Angle + this.ANGLE_STEP) % 360;
                    break;
                case 88:
                    this.joint2Angle = (this.joint2Angle - this.ANGLE_STEP) % 360;
                    break;
                case 86: // 'v'key -> the positive rotation of joint3
                    if (this.joint3Angle < 60.0) {
                        this.joint3Angle = (this.joint3Angle + this.ANGLE_STEP) % 360;
                    }
                    break;
                case 67: // 'c'key -> the nagative rotation of joint3
                    if (this.joint3Angle > -60.0) {
                        this.joint3Angle = (this.joint3Angle - this.ANGLE_STEP) % 360;
                    }
                    break;
                default: return; // Skip drawing at no effective action
            }
            this.Draw();
        };
        Scene3D.prototype.Draw = function () {
            // Clear color and depth buffer
            WebGLContext_1.gl.clear(WebGLContext_1.gl.COLOR_BUFFER_BIT | WebGLContext_1.gl.DEPTH_BUFFER_BIT);
            // Draw a base
            gl_matrix_1.mat4.fromTranslation(this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, -12.0, 0.0));
            this.DrawSegment(VertexBuffers_1.default.baseBuffer);
            // Arm1
            // Move onto the base
            gl_matrix_1.mat4.translate(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, this.baseHeight, 0.0));
            // Rotate around the y-axis
            gl_matrix_1.mat4.rotateY(this.modelMatrix, this.modelMatrix, this.arm1Angle * Math.PI / 180.0);
            this.DrawSegment(VertexBuffers_1.default.arm1Buffer);
            // Arm2
            // Move to joint1
            gl_matrix_1.mat4.translate(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, this.arm1Length, 0.0));
            // Rotate around the z-axis
            gl_matrix_1.mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.joint1Angle * Math.PI / 180.0);
            this.DrawSegment(VertexBuffers_1.default.arm2Buffer);
            // A palm
            // Move to palm
            gl_matrix_1.mat4.translate(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, this.arm2Length, 0.0));
            // Rotate around the y-axis
            gl_matrix_1.mat4.rotateY(this.modelMatrix, this.modelMatrix, this.joint2Angle * Math.PI / 180.0);
            this.DrawSegment(VertexBuffers_1.default.palmBuffer);
            // Move to the center of the tip of the palm
            gl_matrix_1.mat4.translate(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, this.palmLength, 0.0));
            // Draw finger1
            this.PushMatrix(this.modelMatrix);
            gl_matrix_1.mat4.translate(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, 0.0, 2.0));
            gl_matrix_1.mat4.rotateX(this.modelMatrix, this.modelMatrix, this.joint3Angle * Math.PI / 180.0);
            this.DrawSegment(VertexBuffers_1.default.fingerBuffer);
            this.modelMatrix = this.PopMatrix();
            // Draw finger2
            gl_matrix_1.mat4.translate(this.modelMatrix, this.modelMatrix, gl_matrix_1.vec3.fromValues(0.0, 0.0, -2.0));
            gl_matrix_1.mat4.rotateX(this.modelMatrix, this.modelMatrix, -this.joint3Angle * Math.PI / 180.0);
            this.DrawSegment(VertexBuffers_1.default.fingerBuffer);
        };
        // Store the specified matrix to the array
        Scene3D.prototype.PushMatrix = function (m) {
            var m2 = gl_matrix_1.mat4.clone(m);
            this.matrixStack.push(m2);
        };
        // Retrieve the matrix from the array
        Scene3D.prototype.PopMatrix = function () {
            return this.matrixStack.pop();
        };
        Scene3D.prototype.DrawSegment = function (buffer) {
            WebGLContext_1.gl.bindBuffer(WebGLContext_1.gl.ARRAY_BUFFER, buffer);
            // Assign the buffer object to the attribute variable
            WebGLContext_1.gl.vertexAttribPointer(this.aPositionLocation, 3, WebGLContext_1.gl.FLOAT, false, 0, 0);
            // Enable the assignment of the buffer object to the attribute variable
            WebGLContext_1.gl.enableVertexAttribArray(this.aPositionLocation);
            // Calculate the model view project matrix and pass it to uMvpMatrix
            gl_matrix_1.mat4.multiply(this.mvpMatrix, this.viewProjMatrix, this.modelMatrix);
            WebGLContext_1.gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);
            // Calculate the normal transformation matrix and pass it to u_NormalMatrix
            gl_matrix_1.mat4.transpose(this.normalMatrix, this.modelMatrix);
            gl_matrix_1.mat4.invert(this.normalMatrix, this.normalMatrix);
            WebGLContext_1.gl.uniformMatrix4fv(this.uNormalMatrixLocation, false, this.normalMatrix);
            // Draw
            WebGLContext_1.gl.drawElements(WebGLContext_1.gl.TRIANGLES, this.amountOfVertices, WebGLContext_1.gl.UNSIGNED_BYTE, 0);
        };
        return Scene3D;
    }());
    exports.default = Scene3D;
});
//# sourceMappingURL=Scene3D.js.map