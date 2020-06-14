

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

attribute vec3 vPos;
attribute vec3 vNorm;

varying vec3 fPos;
varying vec3 fNorm;

//varying vec4 fColor;

uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform float shininess;

void main()
{
	fPos = (mWorld * vec4(vPos, 1.0)).xyz;
	fNorm = (mWorld * vec4(vNorm, 0.0)).xyz;

	//vec3 pos = -(mView * (mWorld * vec4(vPos, 1.0))).xyz;

    //vec3 L = normalize( pointLightPosition - pos );

    //vec3 E = normalize( -pos );
    //vec3 H = normalize( L + E );

	//vec4 NN = vec4(fNorm,0);
	
	//vec3 N = normalize( (mView*NN).xyz);

	//vec4 ambient = ambientProduct;

    //float Kd = max( dot(L, N), 0.0 );
    //vec4  diffuse = Kd*diffuseProduct;

    //float Ks = pow( max(dot(N, H), 0.0), shininess );
    //vec4  specular = Ks * specularProduct;

    //if( dot(L, N) < 0.0 ) {
    //	specular = vec4(0.0, 0.0, 0.0, 1.0);
    //}

	//fColor = ambient + diffuse +specular;

	gl_Position = mProj * mView * vec4(fPos, 1.0);
}