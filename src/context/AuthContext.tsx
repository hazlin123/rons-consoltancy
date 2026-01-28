import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
    user: User | null;
    login: (email: string, password?: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async (session: any) => {
            if (!session?.user) {
                setUser(null);
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            let role = profile?.role || 'student';

            // Fail-safe for designated Admin email
            if (session.user.email === 'eleazerlagat60@gmail.com') {
                role = 'admin';
                // Proactively update DB if role is student
                if (profile?.role === 'student') {
                    await supabase.from('profiles').update({ role: 'admin' }).eq('id', session.user.id);
                }
            }

            setUser({
                id: session.user.id,
                studentId: profile?.student_id,
                name: profile?.name || session.user.user_metadata.name || "User",
                email: session.user.email || "",
                role: role as 'admin' | 'student',
            });
            setLoading(false);
        };

        // 1. Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchProfile(session);
        });

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchProfile(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password?: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: password || 'temporary-password',
            });

            if (error) throw error;

            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                let role = profile?.role || 'student';
                if (data.user.email === 'eleazerlagat60@gmail.com') {
                    role = 'admin';
                    if (profile?.role === 'student') {
                        await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.user.id);
                    }
                }

                setUser({
                    id: data.user.id,
                    studentId: profile?.student_id,
                    name: profile?.name || data.user.user_metadata.name || "User",
                    email: data.user.email || "",
                    role: role as 'admin' | 'student',
                });
            }
        } catch (error: any) {
            console.error("Login failed:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role: 'student',
                    },
                },
            });
            if (error) throw error;
        } catch (error: any) {
            console.error("Signup failed:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signUp,
            logout,
            loading,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
