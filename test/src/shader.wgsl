// A fragment shader which lights textured geometry with point lights.

// Lights from a storage buffer binding.
struct PointLight {
	position : vec3f,
	color : vec3f
}

struct LightStorage {
	pointCount : u32,
	point : array<PointLight>
}

@group(0) @binding(0) var<storage> lights : LightStorage;

// Texture and sampler.
@group(1) @binding(0) var baseColorSampler : sampler;
@group(1) @binding(1) var baseColorTexture : texture_2d<f32>;

// Function arguments are values from a vertex shader.
@fragment
fn fragmentMain(
  @location(0) worldPos : vec3f,
	@location(1) normal : vec3f,
	@location(2) uv : vec2f
) -> @location(0) vec4f {

	// Sample the base color of the surface from a texture.
	let baseColor = textureSample(baseColorTexture, baseColorSampler, uv);

	let N = normalize(normal);
	var surfaceColor = vec3f(0);

	// Loop over the scene point lights.
	for(var i = 0u; i < lights.pointCount; i++) {

		let worldToLight = lights.point[i].position - worldPos;
		let dist = length(worldToLight);
		let dir = normalize(worldToLight);

		// Determine the contribution of this light to the surface color.
		let radiance = lights.point[i].color * (1 / pow(dist, 2));
		let nDotL = max(dot(N, dir), 0);

		// Accumulate light contribution to the surface color.
		surfaceColor += baseColor.rgb * radiance * nDotL;

	}

	// Return the accumulated surface color.
	// @preserve This is a comment that should be preserved.
	return vec4(surfaceColor, baseColor.a);

}

//! This is a single-line legal comment
/*!
 * This is a multi-line legal comment.
 */
// @license This is a comment that specifies a license.
