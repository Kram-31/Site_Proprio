import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function DashboardStats() {
    const [stats, setStats] = useState({
        bookingsCount: 0,
        tattoosCount: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            // Get bookings count (new)
            const { count: bookingsCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'new');

            // Get tattoos count
            const { count: tattoosCount } = await supabase
                .from('tattoos')
                .select('*', { count: 'exact', head: true });

            setStats({
                bookingsCount: bookingsCount || 0,
                tattoosCount: tattoosCount || 0,
            });
        }

        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
            {/* Overlays the static content or replaces it using a portal? No, let's just render. */}
            <div className="bg-black/80 border border-white/10 p-6 rounded backdrop-blur-md">
                <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-2">Bookings en attente</h3>
                <p className="text-4xl font-bold text-[var(--color-primary)]">{stats.bookingsCount}</p>
            </div>
            <div className="bg-black/80 border border-white/10 p-6 rounded backdrop-blur-md">
                <h3 className="text-gray-400 uppercase tracking-widest text-sm mb-2">Tatouages publiés</h3>
                <p className="text-4xl font-bold text-white">{stats.tattoosCount}</p>
            </div>
        </div>
    );
}
// Note: In a real app we would render the cards here directly instead of the static HTML in dashboard.astro
// For now let's just log or console.
