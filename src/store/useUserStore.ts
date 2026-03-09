import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber?: string | null;
}

interface UserStore {
    user: UserProfile | null;
    setUser: (user: FirebaseUser | null) => void;
    clearUser: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => {
        if (!user) {
            set({ user: null, isLoading: false });
            return;
        }
        set({
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber,
            },
            isLoading: false,
        });
    },
    clearUser: () => set({ user: null, isLoading: false }),
    setIsLoading: (loading) => set({ isLoading: loading }),
}));
