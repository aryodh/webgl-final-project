precision mediump float;

uniform vec3 pointLightPosition;
uniform vec4 meshColor;

uniform samplerCube lightShadowMap;
uniform vec2 shadowClipNearFar;

uniform float bias;

// The texture.
uniform sampler2D sampler;

// Passed in from the vertex shader.
varying vec2 fragTexCoord;

varying vec3 fPos;
varying vec3 fNorm;

void main()
{
	vec3 toLightNormal = normalize(pointLightPosition - fPos);

	float fromLightToFrag =
		(length(fPos - pointLightPosition) - shadowClipNearFar.x)
		/
		(shadowClipNearFar.y - shadowClipNearFar.x);

	float shadowMapValue = textureCube(lightShadowMap, -toLightNormal).r;

	float lightIntensity = 0.6;
	if ((shadowMapValue + bias) >= fromLightToFrag) {
		lightIntensity += 0.4 * max(dot(fNorm, toLightNormal), 0.0);
	}

	highp vec4 texColor = texture2D(sampler, fragTexCoord);

	gl_FragColor = vec4((texColor.rgb + meshColor.rgb) * lightIntensity, texColor.a + meshColor.a);
}