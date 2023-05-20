uniform float utime;
uniform float opacity;

in vec2 textureUV;

void main() {
    vec2 uv = textureUV - 0.5;
    // getting the ratio right.. (use variables for this in the future)
    uv.x = uv.x * 16.0 / 9.0;

    float s = 0.5 * (sin(utime) + 1.0);
    s = mix(0.2, 0.3, s);
    float l = s / length(uv);
    gl_FragColor = vec4(l, l, l, 1.0);
}
