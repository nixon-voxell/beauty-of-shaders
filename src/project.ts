import {makeProject} from "@motion-canvas/core";

import intro from "./scenes/intro?scene";
import outline from "./scenes/outline?scene"
import coordinate_system from "./scenes/coordinate_system?scene"

export default makeProject({
  scenes: [
    intro,
    outline,
    coordinate_system,
  ],
});
