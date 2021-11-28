uniform vec3 color;
uniform sampler2D tDiffuse;

varying vec4 vUv;


void main() {
  vec4 base = texture2DProj( tDiffuse, vUv  );
  gl_FragColor = vec4( base.rgb, 1.0 );
  vec2 offs_blur = vec2(0.025);


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

  gl_FragColor = vec4( color.rgb, 1.0 );
}