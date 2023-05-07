import {makeProject} from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import outline from "./scenes/outline?scene"
import coordinate_system from "./scenes/coordinate_system?scene"
import types_of_shaders from "./scenes/types_of_shaders?scene"
import what_is_a_shader from "./scenes/what_is_a_shader?scene";

export default makeProject({
  scenes: [
    intro,
    outline,
    what_is_a_shader,
    coordinate_system,
    types_of_shaders,
  ],
});
