precision mediump float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

attribute vec3 vPos;
attribute vec3 vNorm;
attribute vec2 vertTexCoord;

varying vec2 fragTexCoord;
varying vec3 fPos;
varying vec3 fNorm;

void main()
{
	fPos = (mWorld * vec4(vPos, 1.0)).xyz;
	fNorm = (mWorld * vec4(vNorm, 0.0)).xyz;

	fragTexCoord = vertTexCoord;

	gl_Position = mProj * mView * vec4(fPos, 1.0);
}