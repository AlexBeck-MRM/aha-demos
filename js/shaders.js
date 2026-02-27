export const vertexShaderSource = `#version 300 es
layout(location = 0) in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_flow_speed;
uniform float u_warp;
uniform float u_turbulence;
uniform float u_blur_softness;
uniform float u_saturation;
uniform float u_contrast;
uniform float u_brightness;
uniform float u_vibrance;
uniform float u_mood_blend;
uniform float u_oxygen_glow;
uniform float u_seed;
uniform vec3 u_palette[5];
uniform int u_octaves;
uniform int u_tap_count;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float total = 0.0;
  float amp = 0.62;
  float freq = 1.0;
  for (int i = 0; i < 3; i++) {
    if (i >= octaves) {
      break;
    }
    total += amp * valueNoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return total;
}

float blob(vec2 p, vec2 center, vec2 radii) {
  vec2 d = (p - center) / max(radii, vec2(0.001));
  float r2 = dot(d, d);
  return exp(-r2 * 2.2);
}

vec3 paletteRamp(float t) {
  float x = clamp(t, 0.0, 1.0) * 4.0;

  if (x < 1.0) {
    return mix(u_palette[0], u_palette[1], x);
  }
  if (x < 2.0) {
    return mix(u_palette[1], u_palette[2], x - 1.0);
  }
  if (x < 3.0) {
    return mix(u_palette[2], u_palette[3], x - 2.0);
  }
  return mix(u_palette[3], u_palette[4], x - 3.0);
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
  return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float flowT = u_time * (0.3 + 1.15 * u_flow_speed) + u_seed * 0.73;
  vec2 q = p;

  vec2 advection = vec2(
    fbm(q * 0.62 + vec2(flowT * 0.1, -flowT * 0.07), u_octaves),
    fbm(q * 0.62 + vec2(-flowT * 0.08, flowT * 0.09) + 7.2, u_octaves)
  ) - 0.5;
  q += advection * (0.08 + 0.24 * u_warp);

  vec2 c1 = vec2(-0.82 + 0.24 * sin(flowT * 0.23 + 0.4), -0.48 + 0.2 * cos(flowT * 0.19 + 0.1));
  vec2 c2 = vec2(-0.18 + 0.3 * sin(flowT * 0.17 + 1.6), 0.46 + 0.18 * cos(flowT * 0.14 + 1.0));
  vec2 c3 = vec2(0.42 + 0.22 * sin(flowT * 0.2 + 2.1), -0.12 + 0.26 * cos(flowT * 0.15 + 1.7));
  vec2 c4 = vec2(0.88 + 0.18 * sin(flowT * 0.16 + 3.2), 0.34 + 0.16 * cos(flowT * 0.18 + 0.8));
  vec2 c5 = vec2(-0.56 + 0.18 * sin(flowT * 0.13 + 2.4), 0.0 + 0.24 * cos(flowT * 0.21 + 2.0));
  vec2 c6 = vec2(0.08 + 0.28 * sin(flowT * 0.15 + 0.7), -0.58 + 0.2 * cos(flowT * 0.11 + 2.8));

  float blobsField = 0.0;
  float weightSum = 0.0;
  blobsField += 0.95 * blob(q, c1, vec2(0.82, 0.62)); weightSum += 0.95;
  blobsField += 0.9 * blob(q, c2, vec2(0.74, 0.58)); weightSum += 0.9;
  blobsField += 0.88 * blob(q, c3, vec2(0.78, 0.64)); weightSum += 0.88;
  blobsField += 0.78 * blob(q, c4, vec2(0.68, 0.54)); weightSum += 0.78;
  blobsField += 0.72 * blob(q, c5, vec2(0.74, 0.6)); weightSum += 0.72;
  blobsField += 0.7 * blob(q, c6, vec2(0.76, 0.6)); weightSum += 0.7;
  blobsField = clamp(blobsField / max(0.0001, weightSum), 0.0, 1.0);

  float nA = fbm(q * 1.2 + vec2(flowT * 0.12, -flowT * 0.05), u_octaves);
  float nB = valueNoise(q * 0.72 + vec2(-flowT * 0.06, flowT * 0.04) + 12.3);

  float field = blobsField;
  field += (nA - 0.5) * (0.14 * u_turbulence + 0.028);
  field += (nB - 0.5) * (0.14 * u_warp + 0.03);

  vec2 centerQ = q * vec2(1.0, 0.85);
  float centerMask = 1.0 - smoothstep(0.18, 0.9, length(centerQ));

  float seepNoiseA = valueNoise(q * 2.1 + vec2(flowT * 0.05, -flowT * 0.04) + u_seed * 2.7);
  float seepNoiseB = valueNoise(q * 3.1 + vec2(-flowT * 0.04, flowT * 0.06) + 13.2 + u_seed * 1.9);
  float seepField = mix(seepNoiseA, seepNoiseB, 0.45);
  float seepVeinMask = smoothstep(0.42, 0.86, seepField);
  float seepMask = clamp((0.24 + 0.76 * centerMask) * mix(0.54, 1.0, seepVeinMask), 0.0, 1.0);
  field += seepMask * (0.003 + 0.005 * u_oxygen_glow);
  field = clamp(field, 0.0, 1.0);

  float blurSoft = clamp(u_blur_softness, 0.1, 3.0);
  float blurSpread = 0.018 + 0.078 * sqrt(blurSoft);
  vec2 blurVec = vec2(blurSpread / aspect, blurSpread);

  float smoothField = field;
  float sampleA = valueNoise((q + blurVec) * 0.9 + vec2(flowT * 0.08, -flowT * 0.03) + 20.0);
  float sampleB = valueNoise((q - blurVec) * 0.9 + vec2(flowT * 0.08, -flowT * 0.03) + 20.0);
  smoothField += clamp(blobsField + (sampleA - 0.5) * 0.12, 0.0, 1.0);
  smoothField += clamp(blobsField + (sampleB - 0.5) * 0.12, 0.0, 1.0);
  float divisor = 3.0;

  if (u_tap_count > 1) {
    vec2 diag = blurVec * vec2(1.0, -1.0);
    float sampleC = valueNoise((q + diag) * 0.92 + vec2(flowT * 0.06, -flowT * 0.02) + 40.0);
    float sampleD = valueNoise((q - diag) * 0.92 + vec2(flowT * 0.06, -flowT * 0.02) + 40.0);
    smoothField += clamp(blobsField + (sampleC - 0.5) * 0.12, 0.0, 1.0);
    smoothField += clamp(blobsField + (sampleD - 0.5) * 0.12, 0.0, 1.0);
    divisor = 5.0;
  }

  smoothField /= divisor;
  smoothField = mix(field, smoothField, 0.78);
  smoothField = smoothstep(0.08, 0.98, smoothField);

  float shapedBase = pow(smoothField, mix(1.08, 0.74, clamp(u_mood_blend, 0.0, 1.0)));
  float shaped = clamp(shapedBase + seepMask * (0.02 + 0.02 * u_oxygen_glow), 0.0, 1.0);
  vec3 color = paletteRamp(shaped);

  float glowMask = smoothstep(0.48, 1.0, smoothField);
  color = mix(color, u_palette[3], glowMask * (0.14 + 0.34 * u_mood_blend));
  color += u_palette[4] * glowMask * (0.08 + 0.22 * u_oxygen_glow);
  color = mix(color, paletteRamp(clamp(shaped + 0.04 * seepMask, 0.0, 1.0)), seepMask * 0.18);

  float luma = dot(color, vec3(0.299, 0.587, 0.114));
  float dynamicSaturation = clamp(u_saturation + seepMask * 0.08 * u_oxygen_glow, 0.4, 2.8);
  color = mix(vec3(luma), color, dynamicSaturation);

  float maxC = max(color.r, max(color.g, color.b));
  float minC = min(color.r, min(color.g, color.b));
  float sat = maxC - minC;
  color += (color - vec3(luma)) * (1.0 - sat) * (u_vibrance - 1.0) * 0.5;

  color = (color - 0.5) * u_contrast + 0.5;
  color *= u_brightness;

  float exposureLift = seepMask * 0.006 * u_oxygen_glow * (0.72 + 0.28 * centerMask);
  color *= 1.0 + exposureLift;
  color = max(color, 0.0);
  color = color / (vec3(1.0) + color * 0.35);

  vec3 hsv = rgb2hsv(clamp(color, 0.0, 1.0));
  float h = hsv.x;
  if (h > 0.5) {
    h -= 1.0;
  }
  h = clamp(h, -0.03, 0.035);
  if (h < 0.0) {
    h += 1.0;
  }
  hsv.x = h;
  hsv.y = clamp(hsv.y, 0.56, 1.0);
  hsv.z = clamp(hsv.z, 0.0, 0.985);
  color = hsv2rgb(hsv);

  float grain = (hash21(gl_FragCoord.xy + vec2(u_time * 37.0, u_seed * 41.0)) - 0.5) * 0.0016;
  color += grain;

  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;
