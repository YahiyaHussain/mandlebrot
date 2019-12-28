
function main() {

  function setupUniform(programName, uniformName) {
    gl.shaders[programName].uniforms[uniformName] = gl.getUniformLocation(gl.programs[programName], uniformName);
    if (!gl.shaders[programName].uniforms[uniformName]){
      console.log('Failed to get the storage location of ' + uniformName + ' in ' + programName);
      return false;
    }
  }

  canvas = document.getElementById('webgl');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  /*Shaders woohoo!*/

      {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", "texture.vert", false);
        oReq.send();
        VSHADER_SOURCE = oReq.responseText;
        
    
        var oReq = new XMLHttpRequest();
        oReq.open("GET", "mandlebrot.frag", false);
        oReq.send();
        FSHADER_SOURCE = oReq.responseText;
        FSHADER_SOURCE = FSHADER_SOURCE.replace('MAX_ITERATIONS', '2000');

        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE, 'mandlebrot')) {
          console.log('Failed to intialize shaders.');
          return;
        }

        setupUniform('mandlebrot', 'u_lowerLeftPoint');
        setupUniform('mandlebrot', 'u_boxDimensions');
      }

  /*Set the vertex information*/
  var n = setupGeometry(gl);
  if (n < 0) {
    console.log('Failed to set the geometry.');
    return;
  }

  // Specify the color for clearing <canvas> (if needed)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  
  //dat.gui

  var gui = new dat.GUI();
  data = [];
  data.iterationQuality = 2000;
  data.msDelay = 100;
  data.lerpFactor = .2;
  var controls = gui.add(data, 'iterationQuality', 100, 20000);
  gui.add(data, 'lerpFactor', 0, 1);
  gui.add(data, 'msDelay', 5, 1000);
  controls.onFinishChange(function(value){
          value = Math.floor(value);
          console.log("changed iterationQuality to: ", value);
      {
        
        var oReq = new XMLHttpRequest();
        oReq.open("GET", "texture.vert", false);
        oReq.send();
        VSHADER_SOURCE = oReq.responseText;
        
    
        var oReq = new XMLHttpRequest();
        oReq.open("GET", "mandlebrot.frag", false);
        oReq.send();
        FSHADER_SOURCE = oReq.responseText;
        FSHADER_SOURCE = FSHADER_SOURCE.replace('MAX_ITERATIONS', value.toString());
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE, 'mandlebrot')) {
          console.log('Failed to intialize shaders.');
          return;
        }

        setupUniform('mandlebrot', 'u_lowerLeftPoint');
        setupUniform('mandlebrot', 'u_boxDimensions');
      }
  });



  Render(gl, n);
}

function setupGeometry(gl) {
  var verticesTexCoords = new Float32Array([
    /*Vertex coordinates, texture coordinate*/
    -1.0,  1.0,   0.0, 1.0,
    -1.0, -1.0,   0.0, 0.0,
     1.0,  1.0,   1.0, 1.0,
     1.0, -1.0,   1.0, 0.0,
  ]);
  var n = 4;

  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object



  // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

  return n;
}

function Render(gl, n){


  gl.useProgram(gl.programs['mandlebrot']);

  unitSquareResolution = 512;
  u_boxDimensions = [canvas.width / unitSquareResolution, canvas.height / unitSquareResolution]; 
  u_lowerLeftPoint = [-1., -.66];

  gl.uniform2fv(gl.shaders['mandlebrot'].uniforms['u_boxDimensions'], u_boxDimensions);
  gl.uniform2fv(gl.shaders['mandlebrot'].uniforms['u_lowerLeftPoint'], u_lowerLeftPoint);

  renderToTexture(gl, null, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

  
// render every 20 ms
  // setInterval(() => {
  //   render();
  // }, 20);
  document.addEventListener('mousemove', logKey);

  function logKey(e) {
    mousePosX = e.clientX;
    mousePosY = e.clientY;
  }
  canCall = true;
  window.onkeydown = function(e){

    if (!canCall) 
    return;

    if (e.keyCode == '40'){ // down arrow
      zoom = 1.05;
    }
    else if(e.keyCode == '38'){ //up
      zoom = 0.95238095238;
    }

    mouseScreenCoord_X = mousePosX / canvas.width;
    mouseScreenCoord_Y = 1. - mousePosY / canvas.height;

    mouseGridCoord_X = u_lowerLeftPoint[0] + u_boxDimensions[0] * mouseScreenCoord_X;
    mouseGridCoord_Y = u_lowerLeftPoint[1] + u_boxDimensions[1] * mouseScreenCoord_Y;

    this.console.log(u_boxDimensions);
    u_boxDimensions[0] *= zoom;
    u_boxDimensions[1] *= zoom;
    this.console.log(u_boxDimensions);
    u_lowerLeftPoint[0] = u_lowerLeftPoint[0]*(1 - data.lerpFactor) + (mouseGridCoord_X - u_boxDimensions[0]*.5)*data.lerpFactor;
    u_lowerLeftPoint[1] = u_lowerLeftPoint[1]*(1 - data.lerpFactor) + (mouseGridCoord_Y - u_boxDimensions[1]*.5)*data.lerpFactor;
    

    gl.uniform2fv(gl.shaders['mandlebrot'].uniforms['u_boxDimensions'], u_boxDimensions);
    gl.uniform2fv(gl.shaders['mandlebrot'].uniforms['u_lowerLeftPoint'], u_lowerLeftPoint);

    renderToTexture(gl, null, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

    canCall = false;
        setTimeout(function(){
            canCall = true;
        }, data.msDelay);
  }
}

// creating textures is boring so I abstracted it
  // 4C means 4 channel
createDataTexture_4C = function(gl, width, height, iData){
  

const targetTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, targetTexture);

{

const level = 0;
const internalFormat = gl.RGBA;
const targetTextureWidth = width;
const targetTextureHeight = height;
const border = 0;
const format = gl.RGBA;
const type = gl.UNSIGNED_BYTE;     
const data = iData;
gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
              targetTextureWidth, targetTextureHeight, border,
              format, type, data);


gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);


gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

  
  const alignment = 1;
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);

  return targetTexture;
}

createFramebuffer_AttachTexture = function(gl, texture){
  // Create and bind the framebuffer
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  
  // attach the texture as the first color attachment
  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const level = 0;
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level);
  
  return fb;
}

renderToTexture = function(gl, framebuffer, width, height){
  gl.viewport(0, 0, width, height );
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
}

