import {makeProject} from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import outline from "./scenes/outline?scene"
// import types_of_shaders from "./scenes/types_of_shaders?scene"
import what_is_a_shader from "./scenes/what_is_a_shader?scene";
import why_parallelism from "./scenes/why_parallelism?scene"
import basic_mesh_concepts from "./scenes/basic_mesh_concepts?scene"
import graphics_pipeline from "./scenes/graphics_pipeline?scene"
import coordinate_systems from "./scenes/coordinate_systems?scene"
import writing_first_shader from "./scenes/writing_first_shader?scene"
import debugging from "./scenes/debugging?scene";

export default makeProject({
  scenes: [
    intro,
    outline,
    what_is_a_shader,
    // types_of_shaders,
    why_parallelism,
    basic_mesh_concepts,
    graphics_pipeline,
    coordinate_systems,
    writing_first_shader,
    debugging,
  ],
});
