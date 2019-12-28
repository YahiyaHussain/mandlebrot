#ifdef GL_ES
precision mediump float;
#endif
// Define complex operations
#define product(a, b) vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x)
#define conjugate(a) vec2(a.x,-a.y)
#define divide(a, b) vec2(((a.x*b.x+a.y*b.y)/(b.x*b.x+b.y*b.y)),((a.y*b.x-a.x*b.y)/(b.x*b.x+b.y*b.y)))

#define PI 3.1415926538 
#define MAX_ITERATIONS 9000
// uniform sampler2D u_data; 
// uniform sampler2D u_velocity;
// uniform float u_deltaTime;
// uniform int u_maxIterations;
    // uniform vec2 u_resolution;
    // uniform float u_zoom;
    // uniform vec2 u_zoomPoint;
    uniform vec2 u_lowerLeftPoint;
    uniform vec2 u_boxDimensions;
// uniform sampler2D u_pressure;
// uniform sampler2D u_divergence;
// 'uniform vec2 u_resolution;
varying vec2 v_TexCoord;

// All components are in the range [0…1], including hue.
vec4 hsv2rgba(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return vec4(c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y), 1.);
}

float modulus(float a, float b)
{
    return a - (b * floor(a/b));
}


void main() {

    // vec2 unitSquareResolution = vec2(512.,512.) * u_zoom;

    // vec2 currentPosition = (u_resolution / (unitSquareResolution)) * (v_TexCoord - vec2(0.5, 0.5) - (u_zoomPoint - vec2(0.5, 0.5)) * u_zoom);
    vec2 currentPosition = u_lowerLeftPoint + u_boxDimensions * v_TexCoord;
    // vec2 currentPosition = v_TexCoord * 2. - 2.;
    
    vec2 z = vec2(0., 0.);
    float n = 0.;

    
    // int maxIterations = floor(u_maxIterations);
    for (int i = 0; i < MAX_ITERATIONS; i++){
        if (length(z) >= 2.){
            break;
        }
        z = product(z, z) + currentPosition;
        n = n + 1.;
    } 
    // float m = float(MAX_ITERATIONS / 16);


				// ((50+sqrt(50*c)) % 100) / 100,
				// .75 + .25*cos(c/(10*pi)),
				// # exp(((c-110)/70)**2)
				// exp(c/20-1)/(exp(c/20-1)+5)

    // int x = int(sqrt(50.*n)) % 100;
    int x = int(sqrt(50.*n));
    float hue = (50. + modulus(float(x), 100.)) / 100.;

    float saturation = .75 + .25*cos(n/(10.* PI));

    float value = exp(n/20. - 1.)/(exp(n/20. - 1.) + 5.);

    gl_FragColor = hsv2rgba(vec3(hue, saturation, value));
    // gl_FragColor = hsv2rgba(vec3(v_TexCoord.x, v_TexCoord.y, 1.));
}