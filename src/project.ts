import {makeProject} from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import outline from "./scenes/outline?scene"
import types_of_shaders from "./scenes/types_of_shaders?scene"
import what_is_a_shader from "./scenes/what_is_a_shader?scene";
import why_parallelism from "./scenes/why_parallelism?scene"
import coordinate_systems from "./scenes/coordinate_systems?scene"

export default makeProject({
  scenes: [
    intro,
    outline,
    what_is_a_shader,
    types_of_shaders,
    why_parallelism,
    coordinate_systems,
  ],
});
