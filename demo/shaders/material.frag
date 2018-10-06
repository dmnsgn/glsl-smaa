precision highp float;

uniform sampler2D uColorMap;
uniform sampler2D uEnvMap;

uniform vec3 uCameraPosition;

uniform vec4 uDiffuseColor;

varying vec3 vViewPosition;
varying vec3 vNormal;

#ifdef UVS
varying vec2 vUv;
#endif

#define PI 3.14159265

#pragma glslify: orenNayar = require(glsl-diffuse-oren-nayar)
#pragma glslify: blinnPhong = require(glsl-specular-blinn-phong)

struct PhongMaterial {
  vec3 ambientColor;
  vec3 diffuseColor;
  vec3 specularColor;
  float	shininess;
  float	roughness;
  float	albedo;
};

struct DirectionalLight {
  vec3 diffuse;
  vec3 specular;
  float intensity;
  vec3 direction;
};

vec3 computeDirectionalLight(
  const in PhongMaterial material,
  const in DirectionalLight light,
  const in vec3 normal,
  const in vec3 viewDirection
) {
  vec3 lightDirection = normalize(-light.direction);

  vec3 ambientColor = vec3(0.5);
  float ambientIntensity = 0.5;

  float diff = orenNayar(lightDirection, viewDirection, normal, material.roughness, material.albedo);
  float spec = blinnPhong(lightDirection, viewDirection, normal, material.shininess);

  vec3 ambient = ambientColor * ambientIntensity * material.ambientColor;
  vec3 diffuse = light.diffuse * diff * material.diffuseColor;
  vec3 specular = light.specular * spec * material.specularColor;
  return ambient + diffuse + specular;
}

void main () {
  vec3 color = vec3(0.0);
  vec3 viewDirection = normalize(uCameraPosition - vViewPosition);

  // Normal
  vec3 normal = normalize(vNormal);
  normal = normal * (float(gl_FrontFacing) * 2.0 - 1.0);

  // Diffuse
  vec4 diffuse = uDiffuseColor;
  #ifdef UVS
    diffuse = texture2D(uColorMap, vUv);
  #endif

  if (diffuse.a < 0.5) discard;

  // Hardcoded lights and material
  DirectionalLight dirLight;
  dirLight.diffuse = vec3(1.0, 1.0, 1.0);
  dirLight.specular = vec3(1.0, 0.0, 0.0);
  dirLight.intensity = 20.0;
  dirLight.direction = vec3(-1.0, -1.0, -1.0);

  DirectionalLight dirLight2;
  dirLight2.diffuse = vec3(1.0, 1.0, 1.0);
  dirLight2.specular = vec3(0.0, 1.0, 0.0);
  dirLight2.intensity = 20.0;
  dirLight2.direction = vec3(0.0, 0.0, -1.0);

  PhongMaterial material;
  material.ambientColor = vec3(0.1, 0.1, 0.1);
  material.diffuseColor = diffuse.xyz;
  material.specularColor = vec3(1.0, 1.0, 1.0);
  material.shininess = 50.0;
  material.roughness = 0.9;
  material.albedo = 1.0;

  color += computeDirectionalLight(material, dirLight, normal, viewDirection);
  color += computeDirectionalLight(material, dirLight2, normal, viewDirection);

  gl_FragColor.rgb = color;
  gl_FragColor.a = diffuse.a;
}
