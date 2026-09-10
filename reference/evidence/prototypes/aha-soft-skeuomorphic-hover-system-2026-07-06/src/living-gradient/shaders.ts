export const SOURCE_SIZE = 256;
export const FRAME_RATE = 30;
export const CYCLE_SECONDS = 22;
export const EVOLUTION_SPEED = 1.68;
export const STATIC_PHASE_SECONDS = (CYCLE_SECONDS * 0.34) / EVOLUTION_SPEED;
export const SHARED_BLUR_RADIUS = 22;

export const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const flameFragmentSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform float u_time;

  const float CYCLE = 22.0;
  const float SPEED = 1.68;
  const float FLAME_SCALE = 1.36;
  const float FLAME_ROTATION = -52.0;
  const float FLAME_X = 0.91;
  const float FLAME_Y = 0.65;
  const float FLAME_WIDTH = 1.48;
  const float FLAME_HEIGHT = 1.33;
  const float FLAME_STRENGTH = 1.39;
  const float RED_PLUME_X = 0.04;
  const float RED_PLUME_Y = -0.02;
  const float TAPER_POWER = 1.62;
  const float EDGE_SPREAD = 2.0;
  const float EDGE_THICKNESS = 1.0;
  const float EDGE_MOTION = 1.0;
  const float WARM_LIGHT = 1.00;
  const float WARM_SPREAD = 1.28;
  const float ORANGE_PLUME_X = 0.17;
  const float ORANGE_PLUME_Y = -0.04;
  const float ORANGE_PLUME_HEIGHT = 0.90;
  const float ORANGE_PLUME_SOFTNESS = 1.98;
  const float DEEP_PRESSURE = 0.86;
  const float TURBULENCE = 1.0;
  const float EDGE_SOFTNESS = 0.62;
  const float NOISE_SCALE = 1.44;
  const float RISE = 1.40;
  const float SWAY = 0.79;
  const float RED_EXTRA_SWAY = 2.39;
  const float ENERGY = 1.20;
  const float CONTRAST = 0.98;
  const vec3 DEEP_COLOR = vec3(0.5607843, 0.0274510, 0.0901961);
  const vec3 RED_COLOR = vec3(0.8117647, 0.1333333, 0.1686275);
  const vec3 ORANGE_COLOR = vec3(1.0, 0.7568627, 0.2235294);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.52;
    }
    return value;
  }

  float breathSignal(float t) {
    float phase = fract(t * max(SPEED, 0.01) / max(CYCLE, 1.0));
    float inhale = smoothstep(0.1, 0.42, phase);
    float exhale = 1.0 - smoothstep(0.58, 0.94, phase);
    return inhale * exhale;
  }

  vec3 flame(vec2 uv, float t) {
    float breath = breathSignal(t);
    float loopPhase = fract(t * max(SPEED, 0.01) / max(CYCLE, 1.0));
    float loopAngle = loopPhase * 6.28318530718;
    float loopSin = sin(loopAngle);
    float loopCos = cos(loopAngle);
    float loopRadius = (0.35 + max(RISE, 0.02) * 0.45) * max(SPEED, 0.08);
    vec2 p = uv - vec2(FLAME_X, FLAME_Y);
    float rotation = radians(FLAME_ROTATION);
    float s = sin(rotation);
    float c = cos(rotation);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    p /= max(FLAME_SCALE, 0.01);

    float drift = (fbm(vec2(loopSin * 0.36 * loopRadius, loopCos * 0.36 * loopRadius + 0.37)) - 0.5) * 0.18 * SWAY;
    p.x -= drift;

    vec2 redP = p - vec2(RED_PLUME_X, RED_PLUME_Y);
    float vertical = clamp((redP.y / max(FLAME_HEIGHT, 0.01)) + 0.56, 0.0, 1.0);
    float activeHeight = smoothstep(0.02, 0.18, vertical) * (1.0 - smoothstep(0.97, 1.0, vertical));
    float taper = mix(max(FLAME_WIDTH, 0.01), max(FLAME_WIDTH, 0.01) * 0.13, pow(vertical, max(TAPER_POWER, 0.01)));
    float spineNoise = fbm(vec2(vertical * 1.8 * NOISE_SCALE + loopSin * 0.8 * loopRadius, loopCos * 0.8 * loopRadius));
    float spine = (spineNoise - 0.5) * taper * 0.7 * SWAY;
    float redSwayNoise = fbm(vec2(vertical * 2.4 * NOISE_SCALE + loopCos * 0.64 * loopRadius, loopSin * 0.52 * loopRadius + 2.1));
    float redSwayBoost = (loopSin * 0.075 + (redSwayNoise - 0.5) * 0.11) * taper * RED_EXTRA_SWAY;
    float redSpine = spine + redSwayBoost;
    float x = redP.x - redSpine;
    float edge = abs(x) / max(taper, 0.001);
    float largeNoise = fbm(vec2(x * 2.0 * NOISE_SCALE + loopSin * 0.32 * loopRadius * EDGE_MOTION, vertical * 2.35 * NOISE_SCALE + loopCos * 0.6 * loopRadius * EDGE_MOTION));
    float fineNoise = fbm(vec2(x * 4.6 * NOISE_SCALE + loopSin * 0.75 * loopRadius * EDGE_MOTION, vertical * 4.4 * NOISE_SCALE + loopCos * 0.9 * loopRadius * EDGE_MOTION));
    float organicEdge = edge - (largeNoise - 0.5) * 0.3 * TURBULENCE - (fineNoise - 0.5) * 0.08 * TURBULENCE;

    float thicknessDelta = EDGE_THICKNESS - 1.0;
    float redStart = clamp((0.56 - EDGE_SOFTNESS * 0.2) - thicknessDelta * 0.08, 0.18, 1.05);
    float redReach = (0.32 + EDGE_SOFTNESS * 1.12) * EDGE_SPREAD / 2.0;
    float redEnd = clamp(redStart + redReach, redStart + 0.06, 2.05);
    float redPlume = (1.0 - smoothstep(redStart, redEnd, organicEdge)) * activeHeight;
    redPlume *= FLAME_STRENGTH * mix(0.84, 1.08, breath);
    redPlume *= mix(1.08, 0.84, clamp((DEEP_PRESSURE - 0.35) / 1.3, 0.0, 1.0));
    redPlume = clamp(redPlume, 0.0, 0.96);

    vec2 orangeP = p - vec2(ORANGE_PLUME_X, ORANGE_PLUME_Y);
    float orangeVertical = clamp((orangeP.y / max(FLAME_HEIGHT * ORANGE_PLUME_HEIGHT, 0.01)) + 0.56, 0.0, 1.0);
    float orangeX = orangeP.x - spine;
    float orangeNoise = fbm(vec2(orangeX * 2.8 * NOISE_SCALE + loopSin * 0.56 * loopRadius, orangeVertical * 3.2 * NOISE_SCALE + loopCos * 0.72 * loopRadius));
    float orangeCenter = taper * (0.18 + (orangeNoise - 0.5) * 0.36);
    float orangeWidth = max(taper * mix(0.16, 0.48, clamp(WARM_SPREAD / 1.6, 0.0, 1.0)), 0.006);
    float orangeEdge = abs(orangeX - orangeCenter) / orangeWidth;
    float orangeBandSize = clamp(0.24 * ORANGE_PLUME_HEIGHT, 0.08, 0.48);
    float orangeBand = 1.0 - smoothstep(0.82, 1.08, abs(orangeVertical - 0.62) / orangeBandSize);
    float orangePlume = 1.0 - smoothstep(0.42 - (ORANGE_PLUME_SOFTNESS - 1.0) * 0.08, 1.18 + EDGE_SOFTNESS * 0.42 * ORANGE_PLUME_SOFTNESS, orangeEdge - (orangeNoise - 0.5) * 0.2 * TURBULENCE);
    orangePlume *= redPlume * orangeBand * WARM_LIGHT * mix(0.78, 1.18, breath);
    orangePlume = clamp(orangePlume, 0.0, 0.80);

    vec3 color = DEEP_COLOR;
    color = mix(color, RED_COLOR, redPlume);
    color = mix(color, ORANGE_COLOR, orangePlume);
    color = mix(DEEP_COLOR, color, clamp(0.78 + (clamp(ENERGY, 0.75, 1.25) - 0.75) * 0.44, 0.78, 1.0));
    return clamp(RED_COLOR + (color - RED_COLOR) * clamp(CONTRAST, 0.7, 1.8), 0.0, 1.0);
  }

  float luma(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  vec3 figmaGrade(vec3 color) {
    float originalLuma = luma(color);
    float shadowMask = 1.0 - smoothstep(0.05, 0.62, originalLuma);
    color = mix(color, min(color, DEEP_COLOR), shadowMask * 0.08);
    float orangeMask = smoothstep(0.08, 0.52, color.g - color.b) * smoothstep(0.18, 0.72, color.r - color.b);
    float capScale = min(1.0, 0.88 / max(luma(color), 0.001));
    color = mix(color, color * capScale, orangeMask);
    color = mix(vec3(luma(color)), color, 1.03);
    return clamp(color * 1.03, 0.0, 1.0);
  }

  void main() {
    gl_FragColor = vec4(figmaGrade(flame(v_uv, u_time)), 1.0);
  }
`;

export const blurFragmentSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;
  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_direction;
  uniform float u_radius;

  void main() {
    vec2 stepSize = u_direction * u_radius / max(u_resolution, vec2(1.0));
    vec4 color = texture2D(u_texture, v_uv) * 0.208;
    float total = 0.208;
    for (int i = 1; i <= 7; i++) {
      float progress = float(i) / 7.0;
      float weight = exp(-4.5 * progress * progress);
      vec2 offset = stepSize * progress;
      color += texture2D(u_texture, v_uv + offset) * weight;
      color += texture2D(u_texture, v_uv - offset) * weight;
      total += weight * 2.0;
    }
    gl_FragColor = color / total;
  }
`;
