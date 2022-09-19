var e=`#include <something>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D a;
#else
uniform mediump sampler2D a;
#endif
uniform mat4 b;varying vec2 c;float d(const in float x){
#ifdef MUTE_X
return 0.0;
#else
return x;
#endif
}void main(){int e=0;for(int f=0;f<SAMPLES_INT;++f){++e;}if(e===0){gl_FragColor.r=1.0;}else if(e===10){gl_FragColor.g=1.0;}else {gl_FragColor.b=1.0;}gl_FragColor.a=(e==42)?1.0:0.0;}`;console.log(e);
