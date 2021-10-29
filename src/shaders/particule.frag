uniform float uLastElevation;

varying float vElevation;

void main()
{
  // Diffuse point
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength *= 2.0;
  strength = 1.0 - strength;

  float alpha = 1.0 - smoothstep(uLastElevation * 0.4, uLastElevation, vElevation);

  gl_FragColor = vec4(vec3(strength), alpha);
}