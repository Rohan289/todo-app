import { ContextName } from "./common.model"

const storeConfig = {
    initialialState : {},
    actionsConfig : {
        setStore : (newState : object) => (previousState : object) => ({...previousState,...newState}),
        reset : () => () => ({})
    }
}

function createStore(storeName : string) {
    return {
        ...storeConfig,
        displayName : storeName
    }
}

const UserDetails = createStore(ContextName.USER_DETAILS);

export const loadStores = () => [UserDetails];