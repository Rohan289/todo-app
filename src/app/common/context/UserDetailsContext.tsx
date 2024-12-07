
'use client';
import { TodoSubTaskType, TodoTaskType } from '@/app/ui/todoCard/TodoCard.model';
import React, { createContext, useContext, useReducer } from 'react';

// Define the User type
interface User {
  id: number;
  name: string;
  email : string;
}

// Define the context state type
interface UserDetailsContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentTodoType : TodoTaskType | TodoSubTaskType | null;
}

// Define the action types
type Action =
  | { type: 'SET_USER'; payload: User }
  | {type : 'SET_CURRENT_TODO_TYPE'; payload : TodoTaskType | TodoSubTaskType | null}
  | { type: 'LOGOUT' };

// Create the context
const UserDetailsContext = createContext<{
  state: UserDetailsContextType;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Initial state
const initialState: UserDetailsContextType = {
  user: null,
  isAuthenticated: false,
  currentTodoType : null
};

// Reducer function
const userReducer = (state: UserDetailsContextType, action: Action): UserDetailsContextType => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'SET_CURRENT_TODO_TYPE' : 
      return { ...state, currentTodoType: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

// Provider component
export const UserDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserDetailsContext.Provider value={{ state, dispatch }}>
      {children}
    </UserDetailsContext.Provider>
  );
};

// Custom hook to use the context
export const useUserDetails = () => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error('useUserDetails must be used within a UserDetailsProvider');
  }
  return context;
};