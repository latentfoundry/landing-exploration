// GPU particle field. The CPU supplies each particle's departure and live destination in screen
// pixels plus a per-transition flight plan; the vertex shader flies every particle on its own
// curve, with its own delay, and lands it with a slight overshoot. Plain WebGL2, no framework.
const VERT = `#version 300 es
in vec2 aFrom; in vec3 aFromA; in vec2 aTo; in vec3 aToA; in vec4 aPath; in float aSeed;
uniform vec2 uRes; uniform float uT; uniform float uTime; uniform vec2 uMouse; uniform float uDpr; uniform vec3 uPal[3];
out vec4 vColor;
float back(float x) { float y = x - 1.0; return 1.0 + 2.1 * y * y * y + 1.1 * y * y; }
void main() {
  float local = clamp((uT - aPath.z) / aPath.w, 0.0, 1.0);
  float e = back(local), u = 1.0 - e;
  vec2 c1 = aPath.xy, c2 = mix(c1, aTo, 0.4);
  vec2 p = u * u * u * aFrom + 3.0 * u * u * e * c1 + 3.0 * u * e * e * c2 + e * e * e * aTo;
  float flight = sin(local * 3.14159);
  p += vec2(sin(uTime * 2.1 + aSeed * 40.0), cos(uTime * 1.7 + aSeed * 31.0)) * 7.0 * flight;
  vec2 d = p - uMouse; float dl = length(d), f = 0.0;
  if (dl < 120.0) { f = pow(1.0 - dl / 120.0, 2.0); p += d / max(dl, 1.0) * f * 18.0; }
  float k = smoothstep(0.0, 1.0, local);
  float size = mix(aFromA.x, aToA.x, k);
  float alpha = min(1.0, mix(aFromA.y, aToA.y, k) * 1.45 + f * 0.5 + flight * 0.15);
  float ci = local < 0.5 ? aFromA.z : aToA.z;
  vec3 col = ci < 0.5 ? uPal[0] : (ci < 1.5 ? uPal[1] : uPal[2]);
  vColor = vec4(col * alpha, alpha);
  vec2 clip = p / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(size * 2.0 * uDpr, 1.0);
}`;
const FRAG = `#version 300 es
precision mediump float; in vec4 vColor; out vec4 o;
void main() { float d = length(gl_PointCoord - 0.5); float a = 1.0 - smoothstep(0.42, 0.5, d); if (a < 0.01) discard; o = vColor * a; }`;

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

export function createField(canvas, colours) {
  const gl = canvas.getContext('webgl2', {alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true});
  if (!gl) return null;
  const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const attrs = {aFrom: 2, aFromA: 3, aTo: 2, aToA: 3, aPath: 4, aSeed: 1}, buffers = {};
  for (const [name, size] of Object.entries(attrs)) {
    const loc = gl.getAttribLocation(prog, name), buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    buffers[name] = buf;
  }
  const U = n => gl.getUniformLocation(prog, n);
  const u = {res: U('uRes'), t: U('uT'), time: U('uTime'), mouse: U('uMouse'), dpr: U('uDpr'), pal: U('uPal')};
  gl.uniform3fv(u.pal, new Float32Array(colours.flatMap(hex)));
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  let count = 0;
  const upload = (name, data) => { gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW); };
  return {
    resize(w, h, dpr) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(u.res, w, h); gl.uniform1f(u.dpr, dpr); },
    seeds(data) { count = data.length; upload('aSeed', data); },
    from(pos, attr) { upload('aFrom', pos); upload('aFromA', attr); },
    to(pos, attr) { upload('aTo', pos); upload('aToA', attr); },
    path(data) { upload('aPath', data); },
    draw(T, time, mx, my) {
      gl.uniform1f(u.t, T); gl.uniform1f(u.time, time); gl.uniform2f(u.mouse, mx, my);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS, 0, count);
    }
  };
}
