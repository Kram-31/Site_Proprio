import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Redirect to dashboard
            window.location.href = '/admin/dashboard';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <div className="max-w-md w-full p-8 border border-white/10 bg-white/5 rounded-lg">
                <h1 className="text-3xl font-heading text-center mb-8 uppercase tracking-widest text-[var(--color-primary)]">
                    Admin Access
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm uppercase tracking-wider text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-[var(--color-primary)] focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-primary)] text-white font-heading font-bold uppercase py-3 tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Connexion...' : 'Entrer'}
                    </button>
                </form>
            </div>
        </div>
    );
}
