"use strict";

// const { vec3 } = require("gl-matrix");

// const { vec3 } = require("gl-matrix");

// const { mat4 } = require("gl-matrix");

// Array flattening trick from http://stackoverflow.com/questions/10865025/merge-flatten-a-multidimensional-array-in-javascript

var freeLook = true;
var freeCamera = vec3.fromValues(-5, 1, -1);
var renderMode = "shade";
var objectSelected = "walle";

var LightMapDemoScene = function (gl) {
  this.gl = gl;
};

LightMapDemoScene.prototype.Load = function (cb) {
  console.log("Loading demo scene");

  var me = this;

  async.parallel(
    {
      Models: function (callback) {
        async.map(
          {
            RoomModel: "RoomY.json",
          },
          LoadJSONResource,
          callback
        );
      },
      ShaderCode: function (callback) {
        async.map(
          {
            NoShadow_VSText: "shaders/NoShadow.vs.glsl",
            NoShadow_FSText: "shaders/NoShadow.fs.glsl",
            Shadow_VSText: "shaders/Shadow.vs.glsl",
            Shadow_FSText: "shaders/Shadow.fs.glsl",
            ShadowMapGen_VSText: "shaders/ShadowMapGen.vs.glsl",
            ShadowMapGen_FSText: "shaders/ShadowMapGen.fs.glsl",
          },
          LoadTextResource,
          callback
        );
      },
    },
    function (loadErrors, loadResults) {
      if (loadErrors) {
        cb(loadErrors);
        return;
      }

      //
      // Create Model objects
      //
      console.log(loadResults.Models.RoomModel.meshes.length);
      for (var i = 0; i < loadResults.Models.RoomModel.meshes.length; i++) {
        var mesh = loadResults.Models.RoomModel.meshes[i];
        switch (mesh.name) {
          case "ChairMesh":
            me.ChairMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            mat4.translate(
              me.ChairMesh.world,
              me.ChairMesh.world,
              vec3.fromValues(-0.939364, -0.248872, 0.266437)
            );

            break;
          case "ChalkboardMesh":
            console.log("rendered");
            me.ChalkboardMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "LightBulbMesh":
            me.lightPosition = vec3.fromValues(0, 0.0, 0);
            me.LightBulbMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(4, 4, 4, 1)
            );
            mat4.translate(
              me.LightBulbMesh.world,
              me.LightBulbMesh.world,
              me.lightPosition
            );
            break;
          case "RoomMesh":
            me.RoomMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0.3, 0.3, 0.3, 1)
            );
            break;
          case "WalleLeftLegMesh":
            me.WalleLeftLegMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "WalleRightLegMesh":
            me.WalleRightLegMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "WalleRightUpperArmMesh":
            me.WalleRightUpperArmMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "WalleRightLowerArmMesh":
            me.WalleRightLowerArmMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "WalleLeftLowerArmMesh":
            me.WalleLeftLowerArmMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "WalleLeftUpperArmMesh":
            me.WalleLeftUpperArmMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "WalleHeadMesh":
            me.WalleHeadMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "WalleTorsoMesh":
            me.WalleTorsoMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "BoxiTorsoMesh":
            me.BoxiTorsoMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "BoxiLeftHandMesh":
            me.BoxiLeftHandMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "BoxiRightHandMesh":
            me.BoxiRightHandMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "PocongTorsoMesh":
            me.PocongTorsoMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "PocongRightHandMesh":
            me.PocongRightHandMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
          case "PocongLeftHandMesh":
            me.PocongLeftHandMesh = new Model(
              me.gl,
              mesh.vertices,
              [].concat.apply([], mesh.faces),
              mesh.normals,
              vec4.fromValues(0, 1, 1, 1)
            );
            break;
        }
      }
      console.log(loadResults.Models.RoomModel.meshes);

      if (!me.ChairMesh) {
        cb("Failed to load chair mesh");
        return;
      }
      if (!me.ChalkboardMesh) {
        cb("Failed to load chalkboard mesh");
        return;
      }
      if (!me.LightBulbMesh) {
        cb("Failed to load light mesh");
        return;
      }
      if (!me.RoomMesh) {
        cb("Failed to load room mesh");
        return;
      }
      if (!me.WalleLeftLegMesh) {
        cb("Failed to load walle left leg mesh");
        return;
      }
      if (!me.WalleRightLegMesh) {
        cb("Failed to load wrl mesh");
        return;
      }
      if (!me.WalleRightUpperArmMesh) {
        cb("Failed to load wrua mesh");
        return;
      }
      if (!me.WalleRightLowerArmMesh) {
        cb("Failed to load wrla mesh");
        return;
      }
      if (!me.WalleLeftLowerArmMesh) {
        cb("Failed to load wlla mesh");
        return;
      }
      if (!me.WalleLeftUpperArmMesh) {
        cb("Failed to load wlua mesh");
        return;
      }
      if (!me.WalleHeadMesh) {
        cb("Failed to load whead mesh");
        return;
      }
      if (!me.WalleTorsoMesh) {
        cb("Failed to load wtorso mesh");
        return;
      }
      if (!me.BoxiTorsoMesh) {
        cb("Failed to load btorso mesh");
        return;
      }
      if (!me.BoxiRightHandMesh) {
        cb("Failed to load brh mesh");
        return;
      }
      if (!me.BoxiLeftHandMesh) {
        cb("Failed to load blh mesh");
        return;
      }
      if (!me.PocongTorsoMesh) {
        cb("Failed to load ptorso mesh");
        return;
      }
      if (!me.PocongRightHandMesh) {
        cb("Failed to load prh mesh");
        return;
      }
      if (!me.PocongLeftHandMesh) {
        cb("Failed to load plh mesh");
        return;
      }
      me.Meshes = [
        me.ChairMesh,
        me.ChalkboardMesh,
        me.LightBulbMesh,
        me.RoomMesh,

        me.WalleLeftLegMesh,
        me.WalleRightLegMesh,
        me.WalleRightUpperArmMesh,
        me.WalleRightLowerArmMesh,
        me.WalleLeftLowerArmMesh,
        me.WalleLeftUpperArmMesh,
        me.WalleHeadMesh,
        me.WalleTorsoMesh,

        me.BoxiTorsoMesh,
        me.BoxiRightHandMesh,
        me.BoxiLeftHandMesh,

        me.PocongTorsoMesh,
        me.PocongRightHandMesh,
        me.PocongLeftHandMesh,
      ];

      //
      // Create Shaders
      //
      me.NoShadowProgram = CreateShaderProgram(
        me.gl,
        loadResults.ShaderCode.NoShadow_VSText,
        loadResults.ShaderCode.NoShadow_FSText
      );
      if (me.NoShadowProgram.error) {
        cb("NoShadowProgram " + me.NoShadowProgram.error);
        return;
      }

      me.ShadowProgram = CreateShaderProgram(
        me.gl,
        loadResults.ShaderCode.Shadow_VSText,
        loadResults.ShaderCode.Shadow_FSText
      );
      if (me.ShadowProgram.error) {
        cb("ShadowProgram " + me.ShadowProgram.error);
        return;
      }

      me.ShadowMapGenProgram = CreateShaderProgram(
        me.gl,
        loadResults.ShaderCode.ShadowMapGen_VSText,
        loadResults.ShaderCode.ShadowMapGen_FSText
      );
      if (me.ShadowMapGenProgram.error) {
        cb("ShadowMapGenProgram " + me.ShadowMapGenProgram.error);
        return;
      }

      me.NoShadowProgram.uniforms = {
        mProj: me.gl.getUniformLocation(me.NoShadowProgram, "mProj"),
        mView: me.gl.getUniformLocation(me.NoShadowProgram, "mView"),
        mWorld: me.gl.getUniformLocation(me.NoShadowProgram, "mWorld"),

        pointLightPosition: me.gl.getUniformLocation(
          me.NoShadowProgram,
          "pointLightPosition"
        ),
        meshColor: me.gl.getUniformLocation(me.NoShadowProgram, "meshColor"),
      };
      me.NoShadowProgram.attribs = {
        vPos: me.gl.getAttribLocation(me.NoShadowProgram, "vPos"),
        vNorm: me.gl.getAttribLocation(me.NoShadowProgram, "vNorm"),
      };

      me.ShadowProgram.uniforms = {
        mProj: me.gl.getUniformLocation(me.ShadowProgram, "mProj"),
        mView: me.gl.getUniformLocation(me.ShadowProgram, "mView"),
        mWorld: me.gl.getUniformLocation(me.ShadowProgram, "mWorld"),

        pointLightPosition: me.gl.getUniformLocation(
          me.ShadowProgram,
          "pointLightPosition"
        ),
        meshColor: me.gl.getUniformLocation(me.ShadowProgram, "meshColor"),
        lightShadowMap: me.gl.getUniformLocation(
          me.ShadowProgram,
          "lightShadowMap"
        ),
        shadowClipNearFar: me.gl.getUniformLocation(
          me.ShadowProgram,
          "shadowClipNearFar"
        ),

        bias: me.gl.getUniformLocation(me.ShadowProgram, "bias"),
      };
      me.ShadowProgram.attribs = {
        vPos: me.gl.getAttribLocation(me.ShadowProgram, "vPos"),
        vNorm: me.gl.getAttribLocation(me.ShadowProgram, "vNorm"),
      };

      me.ShadowMapGenProgram.uniforms = {
        mProj: me.gl.getUniformLocation(me.ShadowMapGenProgram, "mProj"),
        mView: me.gl.getUniformLocation(me.ShadowMapGenProgram, "mView"),
        mWorld: me.gl.getUniformLocation(me.ShadowMapGenProgram, "mWorld"),

        pointLightPosition: me.gl.getUniformLocation(
          me.ShadowMapGenProgram,
          "pointLightPosition"
        ),
        shadowClipNearFar: me.gl.getUniformLocation(
          me.ShadowMapGenProgram,
          "shadowClipNearFar"
        ),
      };
      me.ShadowMapGenProgram.attribs = {
        vPos: me.gl.getAttribLocation(me.ShadowMapGenProgram, "vPos"),
      };

      //
      // Create Framebuffers and Textures
      //
      me.shadowMapCube = me.gl.createTexture();
      me.gl.bindTexture(me.gl.TEXTURE_CUBE_MAP, me.shadowMapCube);
      me.gl.texParameteri(
        me.gl.TEXTURE_CUBE_MAP,
        me.gl.TEXTURE_MIN_FILTER,
        me.gl.LINEAR
      );
      me.gl.texParameteri(
        me.gl.TEXTURE_CUBE_MAP,
        me.gl.TEXTURE_MAG_FILTER,
        me.gl.LINEAR
      );
      me.gl.texParameteri(
        me.gl.TEXTURE_CUBE_MAP,
        me.gl.TEXTURE_WRAP_S,
        me.gl.MIRRORED_REPEAT
      );
      me.gl.texParameteri(
        me.gl.TEXTURE_CUBE_MAP,
        me.gl.TEXTURE_WRAP_T,
        me.gl.MIRRORED_REPEAT
      );
      me.floatExtension = me.gl.getExtension("OES_texture_float");
      me.floatLinearExtension = me.gl.getExtension("OES_texture_float_linear");
      if (me.floatExtension && me.floatLinearExtension) {
        for (var i = 0; i < 6; i++) {
          me.gl.texImage2D(
            me.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
            0,
            me.gl.RGBA,
            me.textureSize,
            me.textureSize,
            0,
            me.gl.RGBA,
            me.gl.FLOAT,
            null
          );
        }
      } else {
        for (var i = 0; i < 6; i++) {
          me.gl.texImage2D(
            me.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
            0,
            me.gl.RGBA,
            me.textureSize,
            me.textureSize,
            0,
            me.gl.RGBA,
            me.gl.UNSIGNED_BYTE,
            null
          );
        }
      }

      me.shadowMapFramebuffer = me.gl.createFramebuffer();
      me.gl.bindFramebuffer(me.gl.FRAMEBUFFER, me.shadowMapFramebuffer);

      me.shadowMapRenderbuffer = me.gl.createRenderbuffer();
      me.gl.bindRenderbuffer(me.gl.RENDERBUFFER, me.shadowMapRenderbuffer);
      me.gl.renderbufferStorage(
        me.gl.RENDERBUFFER,
        me.gl.DEPTH_COMPONENT16,
        me.textureSize,
        me.textureSize
      );

      me.gl.bindTexture(me.gl.TEXTURE_CUBE_MAP, null);
      me.gl.bindRenderbuffer(me.gl.RENDERBUFFER, null);
      me.gl.bindFramebuffer(me.gl.FRAMEBUFFER, null);

      //
      // Logical Values
      //
      // me.camera = new Camera(
      //   vec3.fromValues(-1, 1, 0),
      //   vec3.fromValues(0, 1, 0),
      //   vec3.fromValues(-0.8, 0.9, 0)
      // );

      //   me.camera = new Camera(
      //     vec3.fromValues(-5, 1, -1), //posisi kamera, var pertama itu garis kursi sama papan tulis, var kedua garis vertikal atas bawah nya kursi, var ketiga horizontalnya kursi, tapi POV nya beda tergantung subs sama parameter kedua
      //     vec3.fromValues(0, 1, -1), // POVnya; kalau mau geser kiri kanan biar pas, var ketiga ini harus sama kaya var ketiga yg posisi kamera biar pov nya ga miring
      //     vec3.fromValues(0, 0, 1) //kemiringan kameranya aja
      //   );

      me.camera = new Camera(
        vec3.fromValues(-5, 1, -1),
        vec3.fromValues(0, 1, 1),
        vec3.fromValues(0, 1, 0)
      );

      me.projMatrix = mat4.create();
      me.viewMatrix = mat4.create();

      mat4.perspective(
        me.projMatrix,
        glMatrix.toRadian(90),
        me.gl.canvas.clientWidth / me.gl.canvas.clientHeight,
        0.35,
        85.0
      );
      
      me.shadowMapCameras = [
        // Positive X
        new Camera(
          me.lightPosition,
          vec3.add(vec3.create(), me.lightPosition, vec3.fromValues(1, 0, 0)),
          vec3.fromValues(0, -1, 0)
        ),
        // Negative X
        new Camera(
          me.lightPosition,
          vec3.add(vec3.create(), me.lightPosition, vec3.fromValues(-1, 0, 0)),
          vec3.fromValues(0, -1, 0)
        ),
        // Positive Y
        new Camera(
          me.lightPosition,
          vec3.add(vec3.create(), me.lightPosition, vec3.fromValues(0, 1, 0)),
          vec3.fromValues(0, 0, 1)
        ),
        // Negative Y
        new Camera(
          me.lightPosition,
          vec3.add(vec3.create(), me.lightPosition, vec3.fromValues(0, -1, 0)),
          vec3.fromValues(0, 0, -1)
        ),
        // Positive Z
        new Camera(
          me.lightPosition,
          vec3.add(vec3.create(), me.lightPosition, vec3.fromValues(0, 0, 1)),
          vec3.fromValues(0, -1, 0)
        ),
        // Negative Z
        new Camera(
          me.lightPosition,
          vec3.add(vec3.create(), me.lightPosition, vec3.fromValues(0, 0, -1)),
          vec3.fromValues(0, -1, 0)
        ),
      ];
      me.shadowMapViewMatrices = [
        mat4.create(),
        mat4.create(),
        mat4.create(),
        mat4.create(),
        mat4.create(),
        mat4.create(),
      ];
      me.shadowMapProj = mat4.create();
      me.shadowClipNearFar = vec2.fromValues(0.05, 15.0);
      mat4.perspective(
        me.shadowMapProj,
        glMatrix.toRadian(90),
        1.0,
        me.shadowClipNearFar[0],
        me.shadowClipNearFar[1]
      );

      cb();
    }
  );

  me.PressedKeys = {
    Up: false,
    Right: false,
    Down: false,
    Left: false,
    Forward: false,
    Back: false,
    ChangeCamera: false,

    RotLeft: false,
    RotRight: false,

    WalleForward: false,
    WalleBack: false,
    WalleRight: false,
    WalleLeft: false,
  };

  me.MoveForwardSpeed = 3.5;
  me.RotateSpeed = 1.5;
  me.textureSize = getParameterByName("texSize") || 512;

  me.lightDisplacementInputAngle = 0.0;
};

LightMapDemoScene.prototype.Unload = function () {
  this.LightBulbMesh = null;
  this.ChairMesh = null;
  this.ChalkboardMesh = null;
  this.RoomMesh = null;

  this.WalleLeftLegMesh = null;
  this.WalleRightLegMesh = null;
  this.WalleRightUpperArmMesh = null;
  this.WalleRightLowerArmMesh = null;
  this.WalleLeftLowerArmMesh = null;
  this.WalleLeftUpperArmMesh = null;
  this.WalleHeadMesh = null;
  this.WalleTorsoMesh = null;

  this.BoxiTorsoMesh = null;
  this.BoxiRightHandMesh = null;
  this.BoxiLeftHandMesh = null;

  this.PocongTorsoMesh = null;
  this.PocongRightHandMesh = null;
  this.PocongLeftHandMesh = null;

  this.NoShadowProgram = null;
  this.ShadowProgram = null;
  this.ShadowMapGenProgram = null;

  this.camera = null;
  this.lightPosition = null;

  this.Meshes = null;

  this.PressedKeys = null;

  this.MoveForwardSpeed = null;
  this.RotateSpeed = null;

  this.shadowMapCube = null;
  this.textureSize = null;

  this.shadowMapCameras = null;
  this.shadowMapViewMatrices = null;
};

LightMapDemoScene.prototype.Begin = function () {
  //console.log("Beginning demo scene");

  var me = this;

  // Attach event listeners
  this.__ResizeWindowListener = this._OnResizeWindow.bind(this);
  this.__KeyDownWindowListener = this._OnKeyDown.bind(this);
  this.__KeyUpWindowListener = this._OnKeyUp.bind(this);

  AddEvent(window, "resize", this.__ResizeWindowListener);
  AddEvent(window, "keydown", this.__KeyDownWindowListener);
  AddEvent(window, "keyup", this.__KeyUpWindowListener);

  // Render Loop
  var previousFrame = performance.now();
  var dt = 0;
  var loop = function (currentFrameTime) {
    dt = currentFrameTime - previousFrame;
    me._Update(dt);
    previousFrame = currentFrameTime;

    me._GenerateShadowMap();
    me._Render();
    me.nextFrameHandle = requestAnimationFrame(loop);
  };
  me.nextFrameHandle = requestAnimationFrame(loop);

  me._OnResizeWindow();
};

LightMapDemoScene.prototype.End = function () {
  if (this.__ResizeWindowListener) {
    RemoveEvent(window, "resize", this.__ResizeWindowListener);
  }
  if (this.__KeyUpWindowListener) {
    RemoveEvent(window, "keyup", this.__KeyUpWindowListener);
  }
  if (this.__KeyDownWindowListener) {
    RemoveEvent(window, "keydown", this.__KeyDownWindowListener);
  }

  if (this.nextFrameHandle) {
    cancelAnimationFrame(this.nextFrameHandle);
  }
};
//
// Private Methods
//

var WalleTorsoLoc = vec3.fromValues(1.2409, 0.561914, 2.8015);
var WalleHeadLoc = vec3.fromValues(1.05582, 1.30675, 2.5989);
var camAwal = vec3.fromValues(1.05582, 1.7, 2.5989);
var WalleRightUpperArmLoc = vec3.fromValues(1.49657, 0.840917, 2.53671);
var WalleLeftUpperArmLoc = vec3.fromValues(0.951443, 0.822344, 3.05589);
var WalleRightLowerArmLoc = vec3.fromValues(1.55465, 0.751237, 1.97304);
var WalleLeftLowerArmLoc = vec3.fromValues(0.450769, 1.08849, 3.01258);
var WalleHeadLoc = vec3.fromValues(1.2409, 0.957854, 2.8015);
var WalleLeftLegLoc = vec3.fromValues(1.2409, 0.957854, 2.8015);
var WalleRightLegLoc = vec3.fromValues(1.2409, 0.957854, 2.8015);

var BoxiTorsoLoc = vec3.fromValues(0.106997, 1.00995, -2.09286);
var BoxiRightHandLoc = vec3.fromValues(0.110793, 1.06969, -2.67071);
var BoxiLeftHandLoc = vec3.fromValues(0.110793, 1.07005, -1.50526);

var PocongTorsoLoc = vec3.fromValues(-2.42676, 1.36728, -3.0117);
var PocongRightHandLoc = vec3.fromValues(-2.39227, 1.5066, -2.59971);
var PocongLeftHandLoc = vec3.fromValues(-2.39227, 1.5066, -3.42251);

var wTorsoTheta = 0;
var wRUATheta = 0;
var wLUATheta = 0;
var wRLATheta = 0;
var wLLATheta = 0;
var wHeadTheta = 0;
var camWallTheta = Math.PI;

var bTorsoTheta = 0;
var bRHTheta = 0;
var bLHTheta = 0;

var pTorsoTheta = 0;
var pRHTheta = 0;
var pLHTheta = 0;

LightMapDemoScene.prototype.initNodes = function (
  meshname,
  theta,
  vector = null
) {
  // var m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  var resetvector = vec3.fromValues(0, 0, 0);
  var rotationMat = mat4.create();
  var rotationQuat = quat.create();
  switch (meshname) {
    case "WalleTorsoMesh":
      vector = WalleTorsoLoc;
      vec3.scale(resetvector, vector, -1);
      var firstmat = mat4.create();
      mat4.copy(firstmat, this.WalleTorsoMesh.world);
      var tempmat = mat4.create();
      //console.log(this.WalleTorsoMesh.world);

      //console.log(freeLook);
      // if (!freeLook) {
      //   this.camera.rotateRight(theta * (Math.PI/180));
      // }

      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.WalleTorsoMesh.world,
        this.WalleTorsoMesh.world,
        vector
      );

      mat4.copy(tempmat, this.WalleTorsoMesh.world);

      mat4.rotateY(this.WalleTorsoMesh.world, tempmat, theta * (Math.PI / 180));
      mat4.rotateY(
        this.WalleLeftUpperArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.WalleRightUpperArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.WalleLeftLowerArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.WalleRightLowerArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(this.WalleHeadMesh.world, tempmat, theta * (Math.PI / 180));
      mat4.rotateY(
        this.WalleLeftLegMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.WalleRightLegMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      mat4.translate(
        this.WalleTorsoMesh.world,
        this.WalleTorsoMesh.world,
        resetvector
      );

      mat4.translate(
        this.WalleLeftUpperArmMesh.world,
        this.WalleLeftUpperArmMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleRightUpperArmMesh.world,
        this.WalleRightUpperArmMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleLeftLowerArmMesh.world,
        this.WalleLeftLowerArmMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleRightLowerArmMesh.world,
        this.WalleRightLowerArmMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleHeadMesh.world,
        this.WalleHeadMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleLeftLegMesh.world,
        this.WalleLeftLegMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleRightLegMesh.world,
        this.WalleRightLegMesh.world,
        resetvector
      );
      //child
      // this.initNodes("WalleLeftUpperArmMesh", theta, vector);
      // // this.initNodes("WalleLeftLowerArmMesh", theta, vector);
      // this.initNodes("WalleRightUpperArmMesh", theta, vector);
      // // this.initNodes("WalleRightLowerArmMesh", theta, vector);
      // this.initNodes("WalleHeadMesh", theta, vector);
      // this.initNodes("WalleLeftLegMesh", theta, vector);
      // this.initNodes("WalleRightLegMesh", theta, vector);

      break;

    case "WalleLeftUpperArmMesh":
      vector = WalleLeftUpperArmLoc;
      var firstmat = this.WalleLeftUpperArmMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      var a = this.WalleLeftUpperArmMesh.world;
      mat4.translate(
        this.WalleLeftUpperArmMesh.world,
        this.WalleLeftUpperArmMesh.world,
        vector
      );

      mat4.copy(tempmat, this.WalleLeftUpperArmMesh.world);

      mat4.rotateY(
        this.WalleLeftUpperArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.WalleLeftLowerArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      //reset translate ke titik awal
      mat4.translate(
        this.WalleLeftUpperArmMesh.world,
        this.WalleLeftUpperArmMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleLeftLowerArmMesh.world,
        this.WalleLeftLowerArmMesh.world,
        resetvector
      );

      vec3.rotateY(
        WalleLeftUpperArmLoc,
        WalleLeftUpperArmLoc,
        vector,
        theta * (Math.PI / 180)
      );
      //console.log(theta);
      //console.log(WalleLeftUpperArmLoc);

      //child
      // this.initNodes("WalleLeftLowerArmMesh", theta, vector);

      break;

    case "WalleLeftLowerArmMesh":
      vector = WalleLeftLowerArmLoc;
      var firstmat = this.WalleLeftLowerArmMesh.world;
      var tempmat = mat4.create();

      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.WalleLeftLowerArmMesh.world,
        this.WalleLeftLowerArmMesh.world,
        vector
      );
      mat4.copy(tempmat, this.WalleLeftLowerArmMesh.world);

      mat4.rotateY(
        this.WalleLeftLowerArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      //reset translate ke titik awal
      mat4.translate(
        this.WalleLeftLowerArmMesh.world,
        this.WalleLeftLowerArmMesh.world,
        resetvector
      );

      vec3.rotateY(
        WalleLeftLowerArmLoc,
        WalleLeftLowerArmLoc,
        vector,
        theta * (Math.PI / 180)
      );
      console.log("--lla--");
      console.log(theta);
      console.log(WalleLeftLowerArmLoc);
      console.log("----");
      break;

    case "WalleRightUpperArmMesh":
      vector = WalleRightUpperArmLoc;
      var firstmat = this.WalleRightUpperArmMesh.world;
      var tempmat = mat4.create();

      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.WalleRightUpperArmMesh.world,
        this.WalleRightUpperArmMesh.world,
        vector
      );
      mat4.copy(tempmat, this.WalleRightUpperArmMesh.world);

      mat4.rotateY(
        this.WalleRightUpperArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      mat4.rotateY(
        this.WalleRightLowerArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.WalleRightUpperArmMesh.world,
        this.WalleRightUpperArmMesh.world,
        resetvector
      );
      mat4.translate(
        this.WalleRightLowerArmMesh.world,
        this.WalleRightLowerArmMesh.world,
        resetvector
      );

      vec3.rotateY(
        WalleRightUpperArmLoc,
        WalleRightUpperArmLoc,
        vector,
        theta * (Math.PI / 180)
      );

      //child
      // this.initNodes("WalleRightLowerArmMesh", theta, vector);

      break;

    case "WalleRightLowerArmMesh":
      vector = WalleRightLowerArmLoc;

      var firstmat = this.WalleRightLowerArmMesh.world;
      var tempmat = mat4.create();

      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.WalleRightLowerArmMesh.world,
        this.WalleRightLowerArmMesh.world,
        vector
      );
      mat4.copy(tempmat, this.WalleRightLowerArmMesh.world);

      mat4.rotateY(
        this.WalleRightLowerArmMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.WalleRightLowerArmMesh.world,
        this.WalleRightLowerArmMesh.world,
        resetvector
      );

      vec3.rotateY(
        WalleRightLowerArmLoc,
        WalleRightLowerArmLoc,
        vector,
        theta * (Math.PI / 180)
      );
      break;
    case "WalleHeadMesh":
      vector = WalleHeadLoc;

      var firstmat = this.WalleHeadMesh.world;
      var tempmat = mat4.create();

      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.WalleHeadMesh.world,
        this.WalleHeadMesh.world,
        vector
      );

      mat4.copy(tempmat, this.WalleHeadMesh.world);

      mat4.rotateY(this.WalleHeadMesh.world, tempmat, theta * (Math.PI / 180));

      mat4.translate(
        this.WalleTorsoMesh.world,
        this.WalleTorsoMesh.world,
        resetvector
      );

      //reset translate ke titik awal
      mat4.translate(
        this.WalleHeadMesh.world,
        this.WalleHeadMesh.world,
        resetvector
      );
      vec3.rotateY(WalleHeadLoc, WalleHeadLoc, vector, theta * (Math.PI / 180));

      break;
    case "WalleLeftLegMesh":
      vector = WalleLeftLegLoc;
      var firstmat = this.WalleLeftLegMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.WalleLeftLegMesh.world,
        this.WalleLeftLegMesh.world,
        vector
      );
      mat4.copy(tempmat, this.WalleLeftLegMesh.world);

      mat4.rotateY(
        this.WalleLeftLegMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.WalleLeftLegMesh.world,
        this.WalleLeftLegMesh.world,
        resetvector
      );
      vec3.rotateY(
        WalleLeftLegLoc,
        WalleLeftLegLoc,
        vector,
        theta * (Math.PI / 180)
      );
      break;
    case "WalleRightLegMesh":
      vector = WalleRightLoc;
      var firstmat = this.WalleRighLegMesh.world;
      var tempmat = mat4.create();

      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.WalleRightLegMesh.world,
        this.WalleRightLegMesh.world,
        vector
      );
      mat4.copy(tempmat, this.WalleRightLegMesh.world);

      mat4.rotateY(
        this.WalleRightLegMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.WalleRightLegMesh.world,
        this.WalleRightLegMesh.world,
        resetvector
      );
      vec3.rotateY(
        WalleRightLegLoc,
        WalleRightLegLoc,
        vector,
        theta * (Math.PI / 180)
      );
      break;

    case "WalleMoveForward":
      if (vector === null) {
        vector = vec3.fromValues(0.1, 0, 0);
      }
      if (!freeLook) {
        this.camera.moveWallE(vector);
      } else {
        vec3.add(camAwal, camAwal, vector);
      }
      console.log(freeLook);

      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      if (objectSelected == "walle") {
        mat4.translate(
          this.WalleTorsoMesh.world,
          this.WalleTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftUpperArmMesh.world,
          this.WalleLeftUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLowerArmMesh.world,
          this.WalleLeftLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightUpperArmMesh.world,
          this.WalleRightUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLowerArmMesh.world,
          this.WalleRightLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleHeadMesh.world,
          this.WalleHeadMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLegMesh.world,
          this.WalleLeftLegMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLegMesh.world,
          this.WalleRightLegMesh.world,
          vector
        );
      } else if (objectSelected == "boxi") {
        mat4.translate(
          this.BoxiTorsoMesh.world,
          this.BoxiTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiLeftHandMesh.world,
          this.BoxiLeftHandMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiRightHandMesh.world,
          this.BoxiRightHandMesh.world,
          vector
        );
      } else if (objectSelected == "eve") {
        mat4.translate(
          this.PocongTorsoMesh.world,
          this.PocongTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.PocongRightHandMesh.world,
          this.PocongRightHandMesh.world,
          vector
        );
        mat4.translate(
          this.PocongLeftHandMesh.world,
          this.PocongLeftHandMesh.world,
          vector
        );
      }
      // vec3.add(WalleTorsoLoc, WalleTorsoLoc, vector);
      // vec3.add(WalleLeftUpperArmLoc, WalleLeftUpperArmLoc, vector);
      // vec3.add(WalleRightUpperArmLoc, WalleRightUpperArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      // console.log(WalleRightUpperArmLoc);
      break;

    case "WalleMoveBack":
      if (vector === null) {
        vector = vec3.fromValues(-0.1, 0, 0);
      }
      if (!freeLook) {
        this.camera.moveWallE(vector);
      } else {
        vec3.add(camAwal, camAwal, vector);
      }
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      if (objectSelected == "walle") {
        mat4.translate(
          this.WalleTorsoMesh.world,
          this.WalleTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftUpperArmMesh.world,
          this.WalleLeftUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLowerArmMesh.world,
          this.WalleLeftLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightUpperArmMesh.world,
          this.WalleRightUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLowerArmMesh.world,
          this.WalleRightLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleHeadMesh.world,
          this.WalleHeadMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLegMesh.world,
          this.WalleLeftLegMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLegMesh.world,
          this.WalleRightLegMesh.world,
          vector
        );
      } else if (objectSelected == "boxi") {
        mat4.translate(
          this.BoxiTorsoMesh.world,
          this.BoxiTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiLeftHandMesh.world,
          this.BoxiLeftHandMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiRightHandMesh.world,
          this.BoxiRightHandMesh.world,
          vector
        );
      } else if (objectSelected == "eve") {
        mat4.translate(
          this.PocongTorsoMesh.world,
          this.PocongTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.PocongRightHandMesh.world,
          this.PocongRightHandMesh.world,
          vector
        );
        mat4.translate(
          this.PocongLeftHandMesh.world,
          this.PocongLeftHandMesh.world,
          vector
        );
      }
      // vec3.add(WalleTorsoLoc, WalleTorsoLoc, vector);
      // vec3.add(WalleLeftUpperArmLoc, WalleLeftUpperArmLoc, vector);
      // vec3.add(WalleRightUpperArmLoc, WalleRightUpperArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      break;

    case "WalleMoveRight":
      if (vector === null) {
        vector = vec3.fromValues(0, 0, 0.1);
      }
      if (!freeLook) {
        this.camera.moveWallE(vector);
      } else {
        vec3.add(camAwal, camAwal, vector);
      }
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      if (objectSelected == "walle") {
        mat4.translate(
          this.WalleTorsoMesh.world,
          this.WalleTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftUpperArmMesh.world,
          this.WalleLeftUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLowerArmMesh.world,
          this.WalleLeftLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightUpperArmMesh.world,
          this.WalleRightUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLowerArmMesh.world,
          this.WalleRightLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleHeadMesh.world,
          this.WalleHeadMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLegMesh.world,
          this.WalleLeftLegMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLegMesh.world,
          this.WalleRightLegMesh.world,
          vector
        );
      } else if (objectSelected == "boxi") {
        mat4.translate(
          this.BoxiTorsoMesh.world,
          this.BoxiTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiLeftHandMesh.world,
          this.BoxiLeftHandMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiRightHandMesh.world,
          this.BoxiRightHandMesh.world,
          vector
        );
      } else if (objectSelected == "eve") {
        mat4.translate(
          this.PocongTorsoMesh.world,
          this.PocongTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.PocongRightHandMesh.world,
          this.PocongRightHandMesh.world,
          vector
        );
        mat4.translate(
          this.PocongLeftHandMesh.world,
          this.PocongLeftHandMesh.world,
          vector
        );
      }
      // vec3.add(WalleTorsoLoc, WalleTorsoLoc, vector);
      // vec3.add(WalleLeftUpperArmLoc, WalleLeftUpperArmLoc, vector);
      // vec3.add(WalleRightUpperArmLoc, WalleRightUpperArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      break;

    case "WalleMoveLeft":
      if (vector === null) {
        vector = vec3.fromValues(0, 0, -0.1);
      }
      if (!freeLook) {
        this.camera.moveWallE(vector);
      } else {
        vec3.add(camAwal, camAwal, vector);
      }
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      if (objectSelected == "walle") {
        mat4.translate(
          this.WalleTorsoMesh.world,
          this.WalleTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftUpperArmMesh.world,
          this.WalleLeftUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLowerArmMesh.world,
          this.WalleLeftLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightUpperArmMesh.world,
          this.WalleRightUpperArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLowerArmMesh.world,
          this.WalleRightLowerArmMesh.world,
          vector
        );
        mat4.translate(
          this.WalleHeadMesh.world,
          this.WalleHeadMesh.world,
          vector
        );
        mat4.translate(
          this.WalleLeftLegMesh.world,
          this.WalleLeftLegMesh.world,
          vector
        );
        mat4.translate(
          this.WalleRightLegMesh.world,
          this.WalleRightLegMesh.world,
          vector
        );
      } else if (objectSelected == "boxi") {
        mat4.translate(
          this.BoxiTorsoMesh.world,
          this.BoxiTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiLeftHandMesh.world,
          this.BoxiLeftHandMesh.world,
          vector
        );
        mat4.translate(
          this.BoxiRightHandMesh.world,
          this.BoxiRightHandMesh.world,
          vector
        );
      } else if (objectSelected == "eve") {
        mat4.translate(
          this.PocongTorsoMesh.world,
          this.PocongTorsoMesh.world,
          vector
        );
        mat4.translate(
          this.PocongRightHandMesh.world,
          this.PocongRightHandMesh.world,
          vector
        );
        mat4.translate(
          this.PocongLeftHandMesh.world,
          this.PocongLeftHandMesh.world,
          vector
        );
      }
      // vec3.add(WalleTorsoLoc, WalleTorsoLoc, vector);
      // vec3.add(WalleLeftUpperArmLoc, WalleLeftUpperArmLoc, vector);
      // vec3.add(WalleRightUpperArmLoc, WalleRightUpperArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      // vec3.add(WalleRightLowerArmLoc, WalleRightLowerArmLoc, vector);
      break;

    case "BoxiTorsoMesh":
      vector = BoxiTorsoLoc;
      var firstmat = this.BoxiTorsoMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.BoxiTorsoMesh.world,
        this.BoxiTorsoMesh.world,
        vector
      );
      mat4.copy(tempmat, this.BoxiTorsoMesh.world);

      mat4.rotateY(this.BoxiTorsoMesh.world, tempmat, theta * (Math.PI / 180));
      mat4.rotateY(
        this.BoxiRightHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.BoxiLeftHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.BoxiTorsoMesh.world,
        this.BoxiTorsoMesh.world,
        resetvector
      );
      mat4.translate(
        this.BoxiRightHandMesh.world,
        this.BoxiRightHandMesh.world,
        resetvector
      );
      mat4.translate(
        this.BoxiLeftHandMesh.world,
        this.BoxiLeftHandMesh.world,
        resetvector
      );
      vec3.rotateY(BoxiTorsoLoc, BoxiTorsoLoc, vector, theta * (Math.PI / 180));

      //child

      break;

    case "BoxiRightHandMesh":
      vector = BoxiRightHandLoc;

      var firstmat = this.BoxiRightHandMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.BoxiRightHandMesh.world,
        this.BoxiRightHandMesh.world,
        vector
      );
      mat4.copy(tempmat, this.BoxiRightHandMesh.world);

      mat4.rotateZ(
        this.BoxiRightHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.BoxiRightHandMesh.world,
        this.BoxiRightHandMesh.world,
        resetvector
      );
      vec3.rotateZ(
        BoxiRightHandLoc,
        BoxiRightHandLoc,
        vector,
        theta * (Math.PI / 180)
      );
      break;

    case "BoxiLeftHandMesh":
      vector = BoxiLeftHandLoc;

      var firstmat = this.BoxiLeftHandMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.BoxiLeftHandMesh.world,
        this.BoxiLeftHandMesh.world,
        vector
      );
      mat4.copy(tempmat, this.BoxiLeftHandMesh.world);

      mat4.rotateZ(
        this.BoxiLeftHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.BoxiLeftHandMesh.world,
        this.BoxiLeftHandMesh.world,
        resetvector
      );
      vec3.rotateZ(
        BoxiLeftHandLoc,
        BoxiLeftHandLoc,
        vector,
        theta * (Math.PI / 180)
      );

      break;

    case "PocongTorsoMesh":
      vector = PocongTorsoLoc;
      var firstmat = this.PocongTorsoMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.PocongTorsoMesh.world,
        this.PocongTorsoMesh.world,
        vector
      );
      mat4.copy(tempmat, this.PocongTorsoMesh.world);

      mat4.rotateY(
        this.PocongTorsoMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.PocongRightHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );
      mat4.rotateY(
        this.PocongLeftHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.PocongTorsoMesh.world,
        this.PocongTorsoMesh.world,
        resetvector
      );
      mat4.translate(
        this.PocongRightHandMesh.world,
        this.PocongRightHandMesh.world,
        resetvector
      );
      mat4.translate(
        this.PocongLeftHandMesh.world,
        this.PocongLeftHandMesh.world,
        resetvector
      );
      vec3.rotateY(
        PocongTorsoLoc,
        PocongTorsoLoc,
        vector,
        theta * (Math.PI / 180)
      );

      //child

      break;

    case "PocongRightHandMesh":
      vector = PocongRightHandLoc;

      var firstmat = this.PocongRightHandMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.PocongRightHandMesh.world,
        this.PocongRightHandMesh.world,
        vector
      );
      mat4.copy(tempmat, this.PocongRightHandMesh.world);

      mat4.rotateZ(
        this.PocongRightHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.PocongRightHandMesh.world,
        this.PocongRightHandMesh.world,
        resetvector
      );
      vec3.rotateZ(
        PocongRightHandLoc,
        PocongRightHandLoc,
        vector,
        theta * (Math.PI / 180)
      );
      break;

    case "PocongLeftHandMesh":
      vector = PocongLeftHandLoc;

      var firstmat = this.PocongLeftHandMesh.world;
      var tempmat = mat4.create();
      vec3.scale(resetvector, vector, -1);
      // mat4.rotate(m, m, theta);
      mat4.translate(
        this.PocongLeftHandMesh.world,
        this.PocongLeftHandMesh.world,
        vector
      );
      mat4.copy(tempmat, this.PocongLeftHandMesh.world);

      mat4.rotateZ(
        this.PocongLeftHandMesh.world,
        tempmat,
        theta * (Math.PI / 180)
      );

      //reset translate ke titik awal
      mat4.translate(
        this.PocongLeftHandMesh.world,
        this.PocongLeftHandMesh.world,
        resetvector
      );
      vec3.rotateZ(
        PocongLeftHandLoc,
        PocongLeftHandLoc,
        vector,
        theta * (Math.PI / 180)
      );

      break;
  }
};

var demoFlag = true;
var thetaChangeSinceDemo = 0;
LightMapDemoScene.prototype._Update = function (dt) {
  //   mat4.rotateZ(
  //     this.MonkeyMesh.world,
  //     this.MonkeyMesh.world,
  //     (dt / 1000) * 2 * Math.PI * 0.3
  //   );
  var me = this;

  document.getElementById("wireframe").onchange = function (event) {
    if (renderMode == "shade") {
      renderMode = "wireframe";
    } else {
      renderMode = "shade";
    }
  };

  if (demoFlag) {
    this.initNodes("WalleTorsoMesh", (dt / 1000) * 2 * Math.PI);
    this.initNodes("BoxiTorsoMesh", (dt / 1000) * 2 * Math.PI);
    this.initNodes("PocongTorsoMesh", (dt / 1000) * 2 * Math.PI);
    thetaChangeSinceDemo += (dt / 1000) * 2 * Math.PI;
  }

  document.getElementById("demo").onchange = function (event) {
    if (demoFlag) {
      demoFlag = false;
      me.initNodes("WalleTorsoMesh", -thetaChangeSinceDemo);
      me.initNodes("BoxiTorsoMesh", -thetaChangeSinceDemo);
      me.initNodes("PocongTorsoMesh", -thetaChangeSinceDemo);
      thetaChangeSinceDemo = 0;
    } else {
      demoFlag = true;
    }
  };

  document.getElementById("objectSelector").onchange = function (event) {
    objectSelected = event.target.value;
  };

  document.getElementById("walleTorso").onchange = function (event) {
    document.getElementById("walleTorso").value = event.target.value;
    var rotTheta = event.target.value - wTorsoTheta;
    wTorsoTheta = event.target.value;
    console.log(rotTheta);
    camWallTheta += rotTheta * (180 / Math.PI);
    me.initNodes("WalleTorsoMesh", rotTheta);
  };
  document.getElementById("walleRightUpperArm").onchange = function (event) {
    document.getElementById("walleRightUpperArm").value = event.target.value;
    var rotTheta = event.target.value - wRUATheta;
    wRUATheta = event.target.value;
    me.initNodes("WalleRightUpperArmMesh", rotTheta, null);
  };

  document.getElementById("walleLeftUpperArm").onchange = function (event) {
    document.getElementById("walleLeftUpperArm").value = event.target.value;
    var rotTheta = event.target.value - wLUATheta;
    wLUATheta = event.target.value;
    me.initNodes("WalleLeftUpperArmMesh", rotTheta, null);
  };

  document.getElementById("walleRightLowerArm").onchange = function (event) {
    document.getElementById("walleRightLowerArm").value = event.target.value;
    var rotTheta = event.target.value - wRLATheta;
    wRLATheta = event.target.value;
    me.initNodes("WalleRightLowerArmMesh", rotTheta, null);
  };

  document.getElementById("walleLeftLowerArm").onchange = function (event) {
    document.getElementById("walleLeftLowerArm").value = event.target.value;
    var rotTheta = event.target.value - wLLATheta;
    wLLATheta = event.target.value;
    me.initNodes("WalleLeftLowerArmMesh", rotTheta, null);
  };

  document.getElementById("walleHead").onchange = function (event) {
    document.getElementById("walleHead").value = event.target.value;
    var rotTheta = event.target.value - wHeadTheta;
    wHeadTheta = event.target.value;
    me.initNodes("WalleHeadMesh", event.target.value, null);
  };

  document.getElementById("boxiTorso").onchange = function (event) {
    document.getElementById("boxiTorso").value = event.target.value;
    var rotTheta = event.target.value - bTorsoTheta;
    bTorsoTheta = event.target.value;
    me.initNodes("BoxiTorsoMesh", rotTheta, null);
  };

  document.getElementById("BoxiRightHand").onchange = function (event) {
    document.getElementById("BoxiRightHand").value = event.target.value;
    var rotTheta = event.target.value - bRHTheta;
    bRHTheta = event.target.value;
    me.initNodes("BoxiRightHandMesh", rotTheta, null);
  };

  document.getElementById("BoxiLeftHand").onchange = function (event) {
    document.getElementById("BoxiLeftHand").value = event.target.value;
    var rotTheta = event.target.value - bLHTheta;
    bLHTheta = event.target.value;
    me.initNodes("BoxiLeftHandMesh", rotTheta, null);
  };

  document.getElementById("pocongTorso").onchange = function (event) {
    document.getElementById("pocongTorso").value = event.target.value;
    var rotTheta = event.target.value - pTorsoTheta;
    pTorsoTheta = event.target.value;
    me.initNodes("PocongTorsoMesh", rotTheta, null);
  };

  document.getElementById("pocongRightHand").onchange = function (event) {
    document.getElementById("pocongRightHand").value = event.target.value;
    var rotTheta = event.target.value - pRHTheta;
    pRHTheta = event.target.value;
    me.initNodes("PocongRightHandMesh", rotTheta, null);
  };

  document.getElementById("pocongLeftHand").onchange = function (event) {
    document.getElementById("pocongLeftHand").value = event.target.value;
    var rotTheta = event.target.value - pLHTheta;
    pLHTheta = event.target.value;
    me.initNodes("PocongLeftHandMesh", rotTheta, null);
  };

  if (this.PressedKeys.ChangeCamera) {
    // var tujuanKamera = vec3.create();
    // vec3.rotateY(tujuanKamera, )
    if (freeLook) {
      console.log("masuk");
      this.camera.moveToWallE(camAwal, camWallTheta);
    } else {
      this.camera.moveToWallE(freeCamera, Math.PI);
    }
  }
  if (freeLook) {
    if (this.PressedKeys.Forward && !this.PressedKeys.Back) {
      this.camera.moveForward((dt / 1000) * this.MoveForwardSpeed);
    }
    if (this.PressedKeys.Back && !this.PressedKeys.Forward) {
      this.camera.moveForward((-dt / 1000) * this.MoveForwardSpeed);
    }

    if (this.PressedKeys.Right && !this.PressedKeys.Left) {
      this.camera.moveRight((dt / 1000) * this.MoveForwardSpeed);
    }

    if (this.PressedKeys.Left && !this.PressedKeys.Right) {
      this.camera.moveRight((-dt / 1000) * this.MoveForwardSpeed);
    }

    if (this.PressedKeys.Up && !this.PressedKeys.Down) {
      this.camera.moveUp((dt / 1000) * this.MoveForwardSpeed);
    }

    if (this.PressedKeys.Down && !this.PressedKeys.Up) {
      this.camera.moveUp((-dt / 1000) * this.MoveForwardSpeed);
    }
  }

  if (this.PressedKeys.RotRight && !this.PressedKeys.RotLeft) {
    if (freeLook) {
      this.camera.rotateRight((-dt / 1000) * this.RotateSpeed);
      camWallTheta -= (-dt / 1000) * this.RotateSpeed * (180 / Math.PI);
    } else {
      this.camera.rotateRight((-dt / 1000) * this.RotateSpeed);
      console.log((-dt / 1000) * this.RotateSpeed);
      me.initNodes(
        "WalleTorsoMesh",
        (-dt / 1000) * this.RotateSpeed * (180 / Math.PI)
      );
    }
  }

  if (this.PressedKeys.RotLeft && !this.PressedKeys.RotRight) {
    if (freeLook) {
      this.camera.rotateRight((dt / 1000) * this.RotateSpeed);
      camWallTheta -= (dt / 1000) * this.RotateSpeed * (180 / Math.PI);
    } else {
      this.camera.rotateRight((dt / 1000) * this.RotateSpeed);
      console.log((dt / 1000) * this.RotateSpeed);
      me.initNodes(
        "WalleTorsoMesh",
        (dt / 1000) * this.RotateSpeed * (180 / Math.PI)
      );
    }
  }

  if (this.PressedKeys.WalleForward && !this.PressedKeys.WalleBack) {
    me.initNodes("WalleMoveForward", null);
  }

  if (this.PressedKeys.WalleBack && !this.PressedKeys.WalleForward) {
    me.initNodes("WalleMoveBack", null);
  }

  if (this.PressedKeys.WalleRight && !this.PressedKeys.WalleLeft) {
    me.initNodes("WalleMoveRight", null);
  }

  if (this.PressedKeys.WalleLeft && !this.PressedKeys.WalleRight) {
    me.initNodes("WalleMoveLeft", null);
  }

  this.lightDisplacementInputAngle += dt / 2337;
  var xDisplacement = Math.sin(this.lightDisplacementInputAngle) * 2.8;

  this.LightBulbMesh.world[12] = xDisplacement;
  for (var i = 0; i < this.shadowMapCameras.length; i++) {
    mat4.getTranslation(
      this.shadowMapCameras[i].position,
      this.LightBulbMesh.world
    );
    this.shadowMapCameras[i].GetViewMatrix(this.shadowMapViewMatrices[i]);
  }

  this.camera.GetViewMatrix(this.viewMatrix);
};

LightMapDemoScene.prototype._GenerateShadowMap = function () {
  var gl = this.gl;

  // Set GL state status
  gl.useProgram(this.ShadowMapGenProgram);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.shadowMapCube);
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowMapFramebuffer);
  gl.bindRenderbuffer(gl.RENDERBUFFER, this.shadowMapRenderbuffer);

  gl.viewport(0, 0, this.textureSize, this.textureSize);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // Set per-frame uniforms
  gl.uniform2fv(
    this.ShadowMapGenProgram.uniforms.shadowClipNearFar,
    this.shadowClipNearFar
  );
  // console.log(this.ShadowMapGenProgram.uniforms.pointLightPosition);
  this.lightPosition[1] += 3;
  gl.uniform3fv(
    this.ShadowMapGenProgram.uniforms.pointLightPosition,
    this.lightPosition
  );
  gl.uniformMatrix4fv(
    this.ShadowMapGenProgram.uniforms.mProj,
    gl.FALSE,
    this.shadowMapProj
  );

  for (var i = 0; i < this.shadowMapCameras.length; i++) {
    // Set per light uniforms
    gl.uniformMatrix4fv(
      this.ShadowMapGenProgram.uniforms.mView,
      gl.FALSE,
      this.shadowMapCameras[i].GetViewMatrix(this.shadowMapViewMatrices[i])
    );

    // Set framebuffer destination
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
      this.shadowMapCube,
      0
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      this.shadowMapRenderbuffer
    );

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw meshes
    for (var j = 0; j < this.Meshes.length; j++) {
      // Per object uniforms
      gl.uniformMatrix4fv(
        this.ShadowMapGenProgram.uniforms.mWorld,
        gl.FALSE,
        this.Meshes[j].world
      );

      // Set attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[j].vbo);
      gl.vertexAttribPointer(
        this.ShadowMapGenProgram.attribs.vPos,
        3,
        gl.FLOAT,
        gl.FALSE,
        0,
        0
      );
      gl.enableVertexAttribArray(this.ShadowMapGenProgram.attribs.vPos);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Meshes[j].ibo);
      if (j != 3 && j != 2 && renderMode == "wireframe") {
        gl.drawElements(gl.LINES, this.Meshes[j].nPoints, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawElements(
          gl.TRIANGLES,
          this.Meshes[j].nPoints,
          gl.UNSIGNED_SHORT,
          0
        );
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};

LightMapDemoScene.prototype._Render = function () {
  var gl = this.gl;

  // Clear back buffer, set per-frame uniforms
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.useProgram(this.ShadowProgram);
  gl.uniformMatrix4fv(
    this.ShadowProgram.uniforms.mProj,
    gl.FALSE,
    this.projMatrix
  );
  gl.uniformMatrix4fv(
    this.ShadowProgram.uniforms.mView,
    gl.FALSE,
    this.viewMatrix
  );
  
  gl.uniform3fv(
    this.ShadowProgram.uniforms.pointLightPosition,
    this.lightPosition
  );
  gl.uniform2fv(
    this.ShadowProgram.uniforms.shadowClipNearFar,
    this.shadowClipNearFar
  );
  if (this.floatExtension && this.floatLinearExtension) {
    gl.uniform1f(this.ShadowProgram.uniforms.bias, 0.0001);
  } else {
    gl.uniform1f(this.ShadowProgram.uniforms.bias, 0.003);
  }
  gl.uniform1i(this.ShadowProgram.uniforms.lightShadowMap, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.shadowMapCube);

  // Draw meshes
  for (var i = 0; i < this.Meshes.length; i++) {
    // Per object uniforms
    gl.uniformMatrix4fv(
      this.ShadowProgram.uniforms.mWorld,
      gl.FALSE,
      this.Meshes[i].world
    );
    gl.uniform4fv(this.ShadowProgram.uniforms.meshColor, this.Meshes[i].color);

    // Set attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].vbo);
    gl.vertexAttribPointer(
      this.ShadowProgram.attribs.vPos,
      3,
      gl.FLOAT,
      gl.FALSE,
      0,
      0
    );
    gl.enableVertexAttribArray(this.ShadowProgram.attribs.vPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].nbo);
    gl.vertexAttribPointer(
      this.ShadowProgram.attribs.vNorm,
      3,
      gl.FLOAT,
      gl.FALSE,
      0,
      0
    );
    gl.enableVertexAttribArray(this.ShadowProgram.attribs.vNorm);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Meshes[i].ibo);
    if (i != 3 && renderMode == "wireframe") {
      // console.log(this.Meshes[i])
      gl.drawElements(gl.LINES, this.Meshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawElements(
        gl.TRIANGLES,
        this.Meshes[i].nPoints,
        gl.UNSIGNED_SHORT,
        0
      );
    }
    // console.log(this.Meshes);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
};

LightMapDemoScene.prototype._RenderWireframe = function () {
  var gl = this.gl;

  // Clear back buffer, set per-frame uniforms
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.useProgram(this.ShadowProgram);
  gl.uniformMatrix4fv(
    this.ShadowProgram.uniforms.mProj,
    gl.FALSE,
    this.projMatrix
  );
  gl.uniformMatrix4fv(
    this.ShadowProgram.uniforms.mView,
    gl.FALSE,
    this.viewMatrix
  );
  gl.uniform3fv(
    this.ShadowProgram.uniforms.pointLightPosition,
    this.lightPosition
  );
  gl.uniform2fv(
    this.ShadowProgram.uniforms.shadowClipNearFar,
    this.shadowClipNearFar
  );
  if (this.floatExtension && this.floatLinearExtension) {
    gl.uniform1f(this.ShadowProgram.uniforms.bias, 0.0001);
  } else {
    gl.uniform1f(this.ShadowProgram.uniforms.bias, 0.003);
  }
  gl.uniform1i(this.ShadowProgram.uniforms.lightShadowMap, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.shadowMapCube);

  // Draw meshes
  for (var i = 0; i < this.Meshes.length; i++) {
    // Per object uniforms
    gl.uniformMatrix4fv(
      this.ShadowProgram.uniforms.mWorld,
      gl.FALSE,
      this.Meshes[i].world
    );
    gl.uniform4fv(this.ShadowProgram.uniforms.meshColor, this.Meshes[i].color);

    // Set attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].vbo);
    gl.vertexAttribPointer(
      this.ShadowProgram.attribs.vPos,
      3,
      gl.FLOAT,
      gl.FALSE,
      0,
      0
    );
    gl.enableVertexAttribArray(this.ShadowProgram.attribs.vPos);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.Meshes[i].nbo);
    gl.vertexAttribPointer(
      this.ShadowProgram.attribs.vNorm,
      3,
      gl.FLOAT,
      gl.FALSE,
      0,
      0
    );
    gl.enableVertexAttribArray(this.ShadowProgram.attribs.vNorm);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Meshes[i].ibo);
    gl.drawElements(gl.TRIANGLES, this.Meshes[i].nPoints, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
};

//
// Event Listeners
//
LightMapDemoScene.prototype._OnResizeWindow = function () {
  var gl = this.gl;

  var targetHeight = (window.innerWidth * 9) / 16;

  if (window.innerHeight > targetHeight) {
    // Center vertically
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = targetHeight;
    gl.canvas.style.left = "0px";
    gl.canvas.style.top = (window.innerHeight - targetHeight) / 2 + "px";
  } else {
    // Center horizontally
    gl.canvas.width = (window.innerHeight * 16) / 9;
    gl.canvas.height = window.innerHeight;
    gl.canvas.style.left = (window.innerWidth - gl.canvas.width) / 2 + "px";
    gl.canvas.style.top = "0px";
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
};

LightMapDemoScene.prototype._OnKeyDown = function (e) {
  switch (e.code) {
    case "KeyN":
      this.PressedKeys.ChangeCamera = true;
      break;
    case "KeyW":
      this.PressedKeys.Forward = true;
      break;
    case "KeyA":
      this.PressedKeys.Left = true;
      break;
    case "KeyD":
      this.PressedKeys.Right = true;
      break;
    case "KeyS":
      this.PressedKeys.Back = true;
      break;
    case "ArrowUp":
      this.PressedKeys.Up = true;
      break;
    case "ArrowDown":
      this.PressedKeys.Down = true;
      break;
    case "ArrowRight":
      this.PressedKeys.RotRight = true;
      break;
    case "ArrowLeft":
      this.PressedKeys.RotLeft = true;
      break;
    case "KeyI":
      this.PressedKeys.WalleForward = true;
      break;
    case "KeyK":
      this.PressedKeys.WalleBack = true;
      break;
    case "KeyL":
      this.PressedKeys.WalleRight = true;
      break;
    case "KeyJ":
      this.PressedKeys.WalleLeft = true;
      break;
  }
};

LightMapDemoScene.prototype._OnKeyUp = function (e) {
  switch (e.code) {
    case "KeyN":
      if (freeLook) {
        freeLook = false;
      } else {
        freeLook = true;
      }
      this.PressedKeys.ChangeCamera = false;
      break;
    case "KeyW":
      this.PressedKeys.Forward = false;
      break;
    case "KeyA":
      this.PressedKeys.Left = false;
      break;
    case "KeyD":
      this.PressedKeys.Right = false;
      break;
    case "KeyS":
      this.PressedKeys.Back = false;
      break;
    case "ArrowUp":
      this.PressedKeys.Up = false;
      break;
    case "ArrowDown":
      this.PressedKeys.Down = false;
      break;
    case "ArrowRight":
      this.PressedKeys.RotRight = false;
      break;
    case "ArrowLeft":
      this.PressedKeys.RotLeft = false;
      break;
    case "KeyI":
      this.PressedKeys.WalleForward = false;
      break;
    case "KeyK":
      this.PressedKeys.WalleBack = false;
      break;
    case "KeyL":
      this.PressedKeys.WalleRight = false;
      break;
    case "KeyJ":
      this.PressedKeys.WalleLeft = false;
      break;
  }
};
