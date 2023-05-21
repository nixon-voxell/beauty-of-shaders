uniform float utime;
uniform float opacity;
uniform vec3 color;
uniform float colorOpacity;
uniform float sinTimeOpacity;
uniform float scaledSinTimeOpacity;
uniform float mixTimeOpacity;
uniform vec2 shiftCoord;
uniform float shiftedCoordOpacity;
uniform float uniformCoordOpacity;
uniform float uniformCoordLenOpacity;
uniform float resultOpacity;

in vec2 textureUV;

void main() {
    vec2 resolution = vec2(80.0, 45.0);
    vec2 fragCoord = textureUV * resolution;

    vec2 shiftedCoord = fragCoord - shiftCoord * resolution;
    vec2 uniformCoord = shiftedCoord / min(resolution.x, resolution.y);
    float uniformCoordLength = length(uniformCoord);

    float sinTime = sin(utime);
    float scaledSinTime = (sinTime + 1.0) * 0.5;
    float mixTime = mix(0.2, 0.3, scaledSinTime);

    float l = mixTime / uniformCoordLength;

    vec4 resultCol = vec4(0.0);

    resultCol = mix(resultCol, vec4(color, 1.0), colorOpacity);
    resultCol = mix(resultCol, vec4(vec3(sinTime), 1.0), sinTimeOpacity);
    resultCol = mix(resultCol, vec4(vec3(scaledSinTime), 1.0), scaledSinTimeOpacity);
    resultCol = mix(resultCol, vec4(vec3(mixTime), 1.0), mixTimeOpacity);
    resultCol = mix(resultCol, vec4(ivec2(shiftedCoord), 0.0, 1.0), shiftedCoordOpacity);
    resultCol = mix(resultCol, vec4(uniformCoord, 0.0, 1.0), uniformCoordOpacity);
    resultCol = mix(resultCol, vec4(vec3(uniformCoordLength), 1.0), uniformCoordLenOpacity);
    resultCol = mix(resultCol, vec4(vec3(l), 1.0), resultOpacity);

    resultCol.a = opacity;
    gl_FragColor = resultCol;
    // gl_FragColor = vec4(ivec2(shiftedCoord), 0.0, 1.0);
    // gl_FragColor = vec4(vec3(l), 1.0);
}
