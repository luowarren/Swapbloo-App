import { supabase } from './supabaseClient'

export async function getUserId() {
    const userBlob = await supabase.auth.getUser();

    if (userBlob.error || userBlob.data == null) {
        return null;
    } else {
        return userBlob.data.user.id;
    }
}

export async function getUser() {
    const userBlob = await supabase.auth.getUser();

    if (userBlob.error || userBlob.data == null) {
        return null;
    } else {
        return userBlob.data.user;
    }
}

export const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
    }
};
