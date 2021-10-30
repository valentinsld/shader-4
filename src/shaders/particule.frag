uniform float uLastElevation;
uniform vec3 uColor;

varying float vElevation;
varying vec3 vColor;

void main()
{
  // Diffuse point
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength *= 2.0;
  strength = 1.0 - strength;

  float alpha = 1.0 - smoothstep(uLastElevation * 0.2, uLastElevation, vElevation);

  gl_FragColor.rgb = vColor * strength;
  gl_FragColor.a = alpha;
}