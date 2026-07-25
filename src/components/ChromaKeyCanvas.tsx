"use client";

import { useEffect, useRef } from "react";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "@/shaders/chromaKey";

type ChromaKeyCanvasProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  className?: string;
  style?: React.CSSProperties;
  keyColor?: [number, number, number];
  similarity?: number;
  smoothness?: number;
  spill?: number;
  edgeShrink?: number;
};

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

/**
 * Draws the video into a WebGL canvas every frame, running it through the
 * chroma-key fragment shader on the GPU so green pixels come out with
 * alpha=0 (and everything else -- the actor's hands, motion, lighting, real
 * reflections -- comes out completely untouched). This canvas paints
 * nothing of its own; it is strictly "the video, but green is a hole."
 * Whatever sits in the DOM behind it shows through that hole.
 */
export default function ChromaKeyCanvas({
  videoRef,
  className,
  style,
  keyColor = [0.086, 0.925, 0.196], // matches the placeholder clip's pure #16EC32-ish green
  similarity = 0.22,
  smoothness = 0.12,
  spill = 0.6,
  edgeShrink = 0.06,
}: ChromaKeyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const a_position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW
    );
    const a_texCoord = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(a_texCoord);
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const u_image = gl.getUniformLocation(program, "u_image");
    const u_keyColor = gl.getUniformLocation(program, "u_keyColor");
    const u_similarity = gl.getUniformLocation(program, "u_similarity");
    const u_smoothness = gl.getUniformLocation(program, "u_smoothness");
    const u_spill = gl.getUniformLocation(program, "u_spill");
    const u_edgeShrink = gl.getUniformLocation(program, "u_edgeShrink");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = Math.round(canvas!.clientWidth * dpr);
      const displayHeight = Math.round(canvas!.clientHeight * dpr);
      if (canvas!.width !== displayWidth || canvas!.height !== displayHeight) {
        canvas!.width = displayWidth;
        canvas!.height = displayHeight;
      }
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }

    function draw() {
      if (!video || video.readyState < video.HAVE_CURRENT_DATA) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      resize();
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, video);

      gl!.uniform1i(u_image, 0);
      gl!.uniform3fv(u_keyColor, keyColor);
      gl!.uniform1f(u_similarity, similarity);
      gl!.uniform1f(u_smoothness, smoothness);
      gl!.uniform1f(u_spill, spill);
      gl!.uniform1f(u_edgeShrink, edgeShrink);

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
      gl.deleteTexture(texture);
    };
  }, [videoRef, keyColor, similarity, smoothness, spill, edgeShrink]);

  return <canvas ref={canvasRef} className={className} style={style} />;
}
