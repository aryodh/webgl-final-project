precision mediump float;

uniform vec3 pointLightPosition;
uniform vec4 meshColor;

// The texture.
uniform sampler2D sampler;

// Passed in from the vertex shader.
varying vec2 fragTexCoord;

varying vec3 fPos;
varying vec3 fNorm;

void main()
{
	vec3 toLightNormal = normalize(pointLightPosition - fPos);

	float lightIntensity = 0.6 + 0.4 * max(dot(fNorm, toLightNormal), 0.0);

	highp vec4 texColor = texture2D(sampler, fragTexCoord);

	gl_FragColor = vec4((texColor.rgb + meshColor.rgb) * lightIntensity, texColor.a + meshColor.a);
}