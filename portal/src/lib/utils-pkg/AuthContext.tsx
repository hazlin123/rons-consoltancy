import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "./types";
import { supabase } from "./supabaseClient";


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

    const fetchProfile = useCallback(async (session: any) => {
        if (!session?.user) {
            console.log("[AuthContext] No session found.");
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            console.log("[AuthContext] Fetching profile for:", session.user.id);
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error("[AuthContext] Profile fetch error:", profileError);
            }

            let role = profile?.role || 'student';
            const userEmail = session.user.email?.trim().toLowerCase();

            // Fail-safe for designated Admin email
            if (userEmail === 'ronsfuturebridge7@gmail.com' || userEmail?.includes('ronsfuturebridge7')) {
                console.log("[AuthContext] Admin email detected via fail-safe.");
                role = 'admin';
                // Proactively update DB if role is student or profile missing
                if (!profile || profile.role === 'student') {
                    console.log("[AuthContext] Updating DB role to admin...");
                    await supabase.from('profiles').upsert({
                        id: session.user.id,
                        email: session.user.email,
                        role: 'admin'
                    });
                }
            }

            const userData = {
                id: session.user.id,
                studentId: profile?.student_id,
                name: profile?.name || session.user.user_metadata.name || "User",
                email: session.user.email || "",
                role: role as 'admin' | 'student',
            };

            console.log("[AuthContext] Auth State Determined:", userData);
            setUser(userData);
        } catch (err) {
            console.error("[AuthContext] Unexpected error in fetchProfile:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // 1. Initial Session Check
        console.log("[AuthContext] Initializing session check...");
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchProfile(session);
        });

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("[AuthContext] Auth event:", event);
            fetchProfile(session);
        });

        return () => subscription.unsubscribe();
    }, [fetchProfile]);

    const login = async (email: string, password?: string) => {
        setLoading(true);
        console.log("[AuthContext] Login attempt for:", email);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: password || 'temporary-password',
            });

            if (error) throw error;

            if (data.user) {
                console.log("[AuthContext] signInWithPassword successful. fetching profile...");
                await fetchProfile(data.session);
            }
        } catch (error: any) {
            console.error("[AuthContext] Login failed:", error.message);
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
            isAdmin: user?.role === 'admin' || user?.email?.toLowerCase().trim() === 'ronsfuturebridge7@gmail.com'
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
