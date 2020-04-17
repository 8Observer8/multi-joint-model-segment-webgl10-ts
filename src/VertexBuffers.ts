import { gl } from "./WebGLContext";

export default class VertexBuffers
{
    public static baseBuffer;       // Buffer object for a base
    public static arm1Buffer;       // Buffer object for a arm1
    public static arm2Buffer;       // Buffer object for a arm2
    public static palmBuffer;       // Buffer object for a a palm
    public static fingerBuffer;     // Buffer object for a fingers

    public static Init(program: WebGLProgram): number
    {
        // Vertex coordinate (prepare coordinates of cuboids for all segments)
        let verticesBase = new Float32Array([ // Base(10x2x10)
            5.0, 2.0, 5.0, -5.0, 2.0, 5.0, -5.0, 0.0, 5.0, 5.0, 0.0, 5.0,       // v0-v1-v2-v3 front
            5.0, 2.0, 5.0, 5.0, 0.0, 5.0, 5.0, 0.0, -5.0, 5.0, 2.0, -5.0,       // v0-v3-v4-v5 right
            5.0, 2.0, 5.0, 5.0, 2.0, -5.0, -5.0, 2.0, -5.0, -5.0, 2.0, 5.0,     // v0-v5-v6-v1 up
            -5.0, 2.0, 5.0, -5.0, 2.0, -5.0, -5.0, 0.0, -5.0, -5.0, 0.0, 5.0,   // v1-v6-v7-v2 left
            -5.0, 0.0, -5.0, 5.0, 0.0, -5.0, 5.0, 0.0, 5.0, -5.0, 0.0, 5.0,     // v7-v4-v3-v2 down
            5.0, 0.0, -5.0, -5.0, 0.0, -5.0, -5.0, 2.0, -5.0, 5.0, 2.0, -5.0    // v4-v7-v6-v5 back
        ]);

        let verticesArm1 = new Float32Array([  // Arm1(3x10x3)
            1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5,         // v0-v1-v2-v3 front
            1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, 1.5, 10.0, -1.5,         // v0-v3-v4-v5 right
            1.5, 10.0, 1.5, 1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5,     // v0-v5-v6-v1 up
            -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5,     // v1-v6-v7-v2 left
            -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5,         // v7-v4-v3-v2 down
            1.5, 0.0, -1.5, -1.5, 0.0, -1.5, -1.5, 10.0, -1.5, 1.5, 10.0, -1.5      // v4-v7-v6-v5 back
        ]);

        let verticesArm2 = new Float32Array([  // Arm2(4x10x4)
            2.0, 10.0, 2.0, -2.0, 10.0, 2.0, -2.0, 0.0, 2.0, 2.0, 0.0, 2.0,         // v0-v1-v2-v3 front
            2.0, 10.0, 2.0, 2.0, 0.0, 2.0, 2.0, 0.0, -2.0, 2.0, 10.0, -2.0,         // v0-v3-v4-v5 right
            2.0, 10.0, 2.0, 2.0, 10.0, -2.0, -2.0, 10.0, -2.0, -2.0, 10.0, 2.0,     // v0-v5-v6-v1 up
            -2.0, 10.0, 2.0, -2.0, 10.0, -2.0, -2.0, 0.0, -2.0, -2.0, 0.0, 2.0,     // v1-v6-v7-v2 left
            -2.0, 0.0, -2.0, 2.0, 0.0, -2.0, 2.0, 0.0, 2.0, -2.0, 0.0, 2.0,         // v7-v4-v3-v2 down
            2.0, 0.0, -2.0, -2.0, 0.0, -2.0, -2.0, 10.0, -2.0, 2.0, 10.0, -2.0      // v4-v7-v6-v5 back
        ]);

        let verticesPalm = new Float32Array([  // Palm(2x2x6)
            1.0, 2.0, 3.0, -1.0, 2.0, 3.0, -1.0, 0.0, 3.0, 1.0, 0.0, 3.0,       // v0-v1-v2-v3 front
            1.0, 2.0, 3.0, 1.0, 0.0, 3.0, 1.0, 0.0, -3.0, 1.0, 2.0, -3.0,       // v0-v3-v4-v5 right
            1.0, 2.0, 3.0, 1.0, 2.0, -3.0, -1.0, 2.0, -3.0, -1.0, 2.0, 3.0,     // v0-v5-v6-v1 up
            -1.0, 2.0, 3.0, -1.0, 2.0, -3.0, -1.0, 0.0, -3.0, -1.0, 0.0, 3.0,   // v1-v6-v7-v2 left
            -1.0, 0.0, -3.0, 1.0, 0.0, -3.0, 1.0, 0.0, 3.0, -1.0, 0.0, 3.0,     // v7-v4-v3-v2 down
            1.0, 0.0, -3.0, -1.0, 0.0, -3.0, -1.0, 2.0, -3.0, 1.0, 2.0, -3.0    // v4-v7-v6-v5 back
        ]);

        let verticesFinger = new Float32Array([  // Fingers(1x2x1)
            0.5, 2.0, 0.5, -0.5, 2.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0, 0.5,       // v0-v1-v2-v3 front
            0.5, 2.0, 0.5, 0.5, 0.0, 0.5, 0.5, 0.0, -0.5, 0.5, 2.0, -0.5,       // v0-v3-v4-v5 right
            0.5, 2.0, 0.5, 0.5, 2.0, -0.5, -0.5, 2.0, -0.5, -0.5, 2.0, 0.5,     // v0-v5-v6-v1 up
            -0.5, 2.0, 0.5, -0.5, 2.0, -0.5, -0.5, 0.0, -0.5, -0.5, 0.0, 0.5,   // v1-v6-v7-v2 left
            -0.5, 0.0, -0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5,     // v7-v4-v3-v2 down
            0.5, 0.0, -0.5, -0.5, 0.0, -0.5, -0.5, 2.0, -0.5, 0.5, 2.0, -0.5    // v4-v7-v6-v5 back
        ]);

        let normals = new Float32Array([
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,     // v0-v1-v2-v3 front
            1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,     // v0-v3-v4-v5 right
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,     // v0-v5-v6-v1 up
            -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
            0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
            0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0  // v4-v7-v6-v5 back
        ]);

        // Indices of the vertices
        let indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,           // front
            4, 5, 6, 4, 6, 7,           // right
            8, 9, 10, 8, 10, 11,        // up
            12, 13, 14, 12, 14, 15,     // left
            16, 17, 18, 16, 18, 19,     // down
            20, 21, 22, 20, 22, 23      // back
        ]);

        // Write coords to buffers, but don't assign to attribute variables
        this.baseBuffer = this.InitArrayBufferForLaterUse(verticesBase);
        this.arm1Buffer = this.InitArrayBufferForLaterUse(verticesArm1);
        this.arm2Buffer = this.InitArrayBufferForLaterUse(verticesArm2);
        this.palmBuffer = this.InitArrayBufferForLaterUse(verticesPalm);
        this.fingerBuffer = this.InitArrayBufferForLaterUse(verticesFinger);

        // Write normals to a buffer, assign it to aNormal and enable it
        if (!this.InitArrayBuffer(program, "aNormal", normals, gl.FLOAT, 3)) return -1;

        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // Write the indices to the buffer object
        let indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return indices.length;
    }

    private static InitArrayBufferForLaterUse(data: Float32Array): WebGLBuffer
    {
        // Create a buffer object
        let buffer = gl.createBuffer();

        // Write date into the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        return buffer;
    }

    private static InitArrayBuffer(program: WebGLProgram, attributeName: string, data: Float32Array, type: number, num: number): boolean
    {
        // Create a buffer object
        let buffer = gl.createBuffer();

        // Write date into the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        // Assign the buffer object to the attribute variable
        let attributeLocation = gl.getAttribLocation(program, attributeName);
        if (attributeLocation === -1)
        {
            console.log("Failed to get the storage location of " + attributeName);
            return false;
        }
        gl.vertexAttribPointer(attributeLocation, num, type, false, 0, 0);

        // Enable the assignment of the buffer object to the attribute variable
        gl.enableVertexAttribArray(attributeLocation);

        return true;
    }
}