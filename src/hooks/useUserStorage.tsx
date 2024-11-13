import { useEffect } from 'react';
import { useUserDetails } from '@/app/common/context/UserDetailsContext';

const useUserStorage = () => {
    const { dispatch } = useUserDetails();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            dispatch({ type: 'SET_USER', payload: user });
        }

        const handleStorageChange = (event: StorageEvent) => {
            console.log('Storage event:', event);
            if (event.key === 'user') {
                const updatedUser = JSON.parse(event.newValue as string);
                dispatch({ type: 'SET_USER', payload: updatedUser });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [dispatch]);
};

export default useUserStorage;