uniform vec3 uColor;
uniform sampler2D tDiffuse;

varying vec4 vUv;
varying float vElevation;

float blendOverlay( float base, float blend ) {

  return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

}

vec3 blendOverlay( vec3 base, vec3 blend ) {

  return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

}

void main() {
  vec4 base = texture2DProj( tDiffuse, vUv  );
  gl_FragColor = vec4( base.rgb, 1.0 );
  vec2 offs_blur = vec2(0.02);
  // effet cool à 0.05


  vec4 color = vec4(0.0);
  color += texture2DProj(tDiffuse, vUv + vec4(-offs_blur.x, -offs_blur.y, 0, 0)) * vec4(0.0625);
  color += texture2DProj(tDiffuse, vUv + vec4(         0.0, -offs_blur.y, 0, 0)) * vec4(0.1250); 
  color += texture2DProj(tDiffuse, vUv + vec4( offs_blur.x, -offs_blur.y, 0, 0)) * vec4(0.0625);

  color += texture2DProj(tDiffuse, vUv + vec4(-offs_blur.x,          0.0, 0, 0)) * vec4(0.125);
  color += texture2DProj(tDiffuse, vUv +vec4(         0.0,          0.0, 0, 0)) * vec4(0.25);   
  color += texture2DProj(tDiffuse, vUv + vec4( offs_blur.x,          0.0, 0, 0)) * vec4(0.125);  


  color += texture2DProj(tDiffuse, vUv + vec4(-offs_blur.x, offs_blur.y, 0, 0)) * vec4(0.0625);
  color += texture2DProj(tDiffuse, vUv + vec4(         0.0, offs_blur.y, 0, 0)) * vec4(0.1250);   
  color += texture2DProj(tDiffuse, vUv + vec4( offs_blur.x, offs_blur.y, 0, 0)) * vec4(0.0625);  

  vec3 colorPlane = (vec3(1.0) - color.rgb) * mix(vec3(0.0, 0.0, 0.0), uColor, (vElevation - 0.5 * 1.4));

  gl_FragColor = vec4( color.rgb + colorPlane.rgb, 1.0 );
}