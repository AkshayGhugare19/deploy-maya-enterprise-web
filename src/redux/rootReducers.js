import userReducer from "./users/users";
import cartsReducer from "./carts/carts";
import globalConfigReducer from "./globalconfig/globalconfig";

const rootReducers = {
	user: userReducer,
	cart: cartsReducer,
	globalConfig: globalConfigReducer,
};

export default rootReducers;