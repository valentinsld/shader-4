uniform vec3 uColor;

varying float vElevation;

void main()
{
  vec3 color = mix(vec3(0.0, 0.0, 0.0), uColor, vElevation);
  gl_FragColor.rgb = color;
  gl_FragColor.a = 1.0;
}