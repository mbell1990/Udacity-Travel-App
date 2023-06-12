import { handleSubmit } from "./js/formHandler";

import "./styles/base.scss";
import "./styles/components.scss";
import "./styles/layout.scss";

//Load weather icons
function importAll(r) {
  return r.keys().map(r);
}
importAll(require.context("./media/weatherbit_icons", false, /\.(png)$/));

export { handleSubmit };
