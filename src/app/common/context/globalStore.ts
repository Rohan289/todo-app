import { ContextName } from "./common.model"

const storeConfig = {
    initialState : {},
    actionsConfig : {
        setStore : (newState : object) => (previousState : object) => ({...previousState,...newState}),
        reset : () => () => ({})
    }
}

export interface Store<T> {
    state : T;
    actions : {setStore : (data : Partial<T>) => void, reset : () => void};
}

function createStore(storeName : string) {
    return {
        ...storeConfig,
        displayName : storeName
    }
}

const UserDetails = createStore(ContextName.USER_DETAILS);

export const loadStores = () => [UserDetails];