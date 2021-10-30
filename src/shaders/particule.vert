uniform float uTime;
uniform float uSize;
uniform float uLastElevation;

attribute float aElevation;
attribute vec3 aColor;
attribute float aRandom;

varying float vElevation;
varying vec3 vColor;

void main()
{
  // Position
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += mod(aElevation + uTime, uLastElevation);
  modelPosition += aRandom;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Size
  gl_PointSize = uSize;
  gl_PointSize *= (1.0 / - viewPosition.z);

  // Varyings
  vElevation = modelPosition.z;
  vColor = aColor;
}