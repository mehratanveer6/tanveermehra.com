export const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

export const FRAGMENT_SHADER = `
  precision mediump float;

  uniform sampler2D u_image;
  uniform vec3 u_keyColor;     // the green being keyed out, 0-1 rgb
  uniform float u_similarity;  // how close to u_keyColor counts as "key" (0-1)
  uniform float u_smoothness;  // feather width at the key boundary
  uniform float u_spill;       // green-spill suppression strength (0-1)
  uniform float u_edgeShrink;  // matte erosion (0-1) -- bites the alpha mask inward
                                // slightly so the last, most spill-contaminated
                                // ring of pixels at the key boundary is dropped
                                // entirely rather than shown at partial alpha

  varying vec2 v_texCoord;

  // YCbCr-space distance reads chroma-key green far more reliably than raw
  // RGB distance -- it separates luma (lighting/shadow on the green cloth)
  // from chroma (the actual green-ness), so a shadowed corner of the green
  // box keys out exactly as cleanly as a brightly lit one.
  vec2 toChroma(vec3 c) {
    float y = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    float cb = (c.b - y) * 0.564;
    float cr = (c.r - y) * 0.713;
    return vec2(cb, cr);
  }

  void main() {
    vec4 texColor = texture2D(u_image, v_texCoord);
    vec3 color = texColor.rgb;

    vec2 keyChroma = toChroma(u_keyColor);
    vec2 chroma = toChroma(color);
    float dist = distance(chroma, keyChroma);

    float edge0 = u_similarity;
    float edge1 = u_similarity + u_smoothness;
    float alpha = smoothstep(edge0, edge1, dist);

    // Erode the matte: push the whole alpha curve up so the outermost band
    // of the "revealed" region (the part closest to the key boundary, most
    // likely to carry green spill) is pulled back to fully transparent
    // instead of sitting at partial alpha. This costs a hair of the card's
    // edge but removes the green fringe a straight feather alone leaves.
    alpha = clamp((alpha - u_edgeShrink) / max(1.0 - u_edgeShrink, 0.0001), 0.0, 1.0);

    // Despill: pull green back toward the max of red/blue wherever the pixel
    // still leans green, so any thin remaining rim reads neutral/gray
    // instead of glowing green, even where alpha hasn't dropped to 0 yet.
    float maxRB = max(color.r, color.b);
    float spillAmount = max(color.g - maxRB, 0.0) * u_spill;
    color.g -= spillAmount;

    gl_FragColor = vec4(color, alpha);
  }
`;
