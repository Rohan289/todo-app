export enum ContextName  {
    USER_DETAILS = 'USER_DETAILS',
}

export interface UserDetails {
    id : number;
    name : string;
    email : string;
}

export interface UserDetailsContext extends UserDetails {
    isAuthenticated : boolean;
}
