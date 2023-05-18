uniform float utime;

in vec2 textureUV;

void main() {
    // float s = 0.5 * (sin(utime) + 1.0);
    // s = mix(0.2, 0.3, s);
    // float l = s / length(textureUV);

    // gl_FragColor = vec4(l, l, l, 1.0);
    // gl_FragColor = vec4(textureUV, 0.0, 1.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}
