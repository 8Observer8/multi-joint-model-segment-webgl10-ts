import { gl } from "./WebGLContext";
import ShaderProgram from "./ShaderProgram";
import { mat4, vec3 } from "gl-matrix";
import VertexBuffers from "./VertexBuffers";

export default class Scene3D
{
    private modelMatrix: mat4;
    private mvpMatrix: mat4;
    private normalMatrix: mat4;
    private viewProjMatrix: mat4;

    private aPositionLocation: number;
    private uMvpMatrixLocation: WebGLUniformLocation;
    private uNormalMatrixLocation: WebGLUniformLocation;

    private amountOfVertices: number;
    private readonly ANGLE_STEP = 3.0;
    private readonly baseHeight = 2.0;
    private readonly arm1Length = 10.0;
    private readonly arm2Length = 10.0;
    private readonly palmLength = 2.0;
    private arm1Angle = 90.0;
    private joint1Angle = 45.0;
    private joint2Angle = 0.0;
    private joint3Angle = 0.0;

    // Array for storing a matrix
    private matrixStack: mat4[] = [];

    public constructor()
    {
        let program = ShaderProgram.Create();
        if (program === null)
        {
            console.log("Failed to get a shader program.");
            return;
        }

        this.amountOfVertices = VertexBuffers.Init(program);
        if (this.amountOfVertices == -1)
        {
            console.log("Failed to initialize the vertex buffers");
            return;
        }

        this.aPositionLocation = gl.getAttribLocation(program, "aPosition");
        this.uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        this.uNormalMatrixLocation = gl.getUniformLocation(program, "uNormalMatrix");
        if (this.aPositionLocation < 0 || !this.uMvpMatrixLocation || !this.uNormalMatrixLocation)
        {
            console.log("Failed to get the storage location of attribute or uniform variable");
            return;
        }

        this.modelMatrix = mat4.create();
        this.mvpMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.viewProjMatrix = mat4.create();

        let projMatrix = mat4.create();
        let viewMatrix = mat4.create();
        mat4.perspective(projMatrix, 50.0 * Math.PI / 180.0, 1.0, 0.1, 100.0);
        mat4.lookAt(
            viewMatrix,
            vec3.fromValues(20.0, 10.0, 30.0),
            vec3.fromValues(0.0, 0.0, 0.0),
            vec3.fromValues(0.0, 1.0, 0.0));
        mat4.multiply(this.viewProjMatrix, projMatrix, viewMatrix);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        document.onkeydown =
            (ev: KeyboardEvent) =>
            {
                this.KeyDown(ev);
            };

        this.Draw();
    }

    private KeyDown(ev: KeyboardEvent): void
    {
        switch (ev.keyCode)
        {
            case 40:    // Up arrow key -> the positive rotation of joint1 around the z-axis
            case 83:    // 'W' key
                if (this.joint1Angle < 135.0)
                {
                    this.joint1Angle += this.ANGLE_STEP;
                }
                break;
            case 38:    // Down arrow key -> the negative rotation of joint1 around the z-axis
            case 87:    // S
                if (this.joint1Angle > -135.0)
                {
                    this.joint1Angle -= this.ANGLE_STEP;
                }
                break;
            case 39:    // Right arrow key -> the positive rotation of arm1 around the y-axis
            case 68:
                this.arm1Angle = (this.arm1Angle + this.ANGLE_STEP) % 360;
                break;
            case 37:    // Left arrow key -> the negative rotation of arm1 around the y-axis
            case 65:
                this.arm1Angle = (this.arm1Angle - this.ANGLE_STEP) % 360;
                break;
            case 90:    // 'ｚ'key -> the positive rotation of joint2
                this.joint2Angle = (this.joint2Angle + this.ANGLE_STEP) % 360;
                break;
            case 88:
                this.joint2Angle = (this.joint2Angle - this.ANGLE_STEP) % 360;
                break;
            case 86:    // 'v'key -> the positive rotation of joint3
                if (this.joint3Angle < 60.0)
                {
                    this.joint3Angle = (this.joint3Angle + this.ANGLE_STEP) % 360;
                }
                break;
            case 67:    // 'c'key -> the nagative rotation of joint3
                if (this.joint3Angle > -60.0)
                {
                    this.joint3Angle = (this.joint3Angle - this.ANGLE_STEP) % 360;
                }
                break;
            default: return; // Skip drawing at no effective action
        }
        this.Draw();
    }

    private Draw(): void
    {
        // Clear color and depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw a base
        mat4.fromTranslation(this.modelMatrix, vec3.fromValues(0.0, -12.0, 0.0));
        this.DrawSegment(VertexBuffers.baseBuffer);

        // Arm1
        // Move onto the base
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0.0, this.baseHeight, 0.0));
        // Rotate around the y-axis
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.arm1Angle * Math.PI / 180.0);
        this.DrawSegment(VertexBuffers.arm1Buffer);

        // Arm2
        // Move to joint1
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0.0, this.arm1Length, 0.0));
        // Rotate around the z-axis
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.joint1Angle * Math.PI / 180.0);
        this.DrawSegment(VertexBuffers.arm2Buffer);

        // A palm
        // Move to palm
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0.0, this.arm2Length, 0.0));
        // Rotate around the y-axis
        mat4.rotateY(this.modelMatrix, this.modelMatrix, this.joint2Angle * Math.PI / 180.0);
        this.DrawSegment(VertexBuffers.palmBuffer);

        // Move to the center of the tip of the palm
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0.0, this.palmLength, 0.0));

        // Draw finger1
        this.PushMatrix(this.modelMatrix);
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0.0, 0.0, 2.0));
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.joint3Angle * Math.PI / 180.0);
        this.DrawSegment(VertexBuffers.fingerBuffer);
        this.modelMatrix = this.PopMatrix();

        // Draw finger2
        mat4.translate(this.modelMatrix, this.modelMatrix, vec3.fromValues(0.0, 0.0, -2.0));
        mat4.rotateX(this.modelMatrix, this.modelMatrix, -this.joint3Angle * Math.PI / 180.0);
        this.DrawSegment(VertexBuffers.fingerBuffer);
    }

    // Store the specified matrix to the array
    private PushMatrix(m: mat4): void
    {
        let m2 = mat4.clone(m);
        this.matrixStack.push(m2);
    }

    // Retrieve the matrix from the array
    private PopMatrix()
    {
        return this.matrixStack.pop();
    }

    private DrawSegment(buffer: WebGLBuffer): void
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        // Assign the buffer object to the attribute variable
        gl.vertexAttribPointer(this.aPositionLocation, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment of the buffer object to the attribute variable
        gl.enableVertexAttribArray(this.aPositionLocation);

        // Calculate the model view project matrix and pass it to uMvpMatrix
        mat4.multiply(this.mvpMatrix, this.viewProjMatrix, this.modelMatrix);
        gl.uniformMatrix4fv(this.uMvpMatrixLocation, false, this.mvpMatrix);

        // Calculate the normal transformation matrix and pass it to u_NormalMatrix
        mat4.transpose(this.normalMatrix, this.modelMatrix);
        mat4.invert(this.normalMatrix, this.normalMatrix);
        gl.uniformMatrix4fv(this.uNormalMatrixLocation, false, this.normalMatrix);

        // Draw
        gl.drawElements(gl.TRIANGLES, this.amountOfVertices, gl.UNSIGNED_BYTE, 0);
    }
}