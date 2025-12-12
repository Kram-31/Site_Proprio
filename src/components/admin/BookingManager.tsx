import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Booking {
    id: string;
    client_name: string;
    email: string;
    project_desc: string;
    status: 'new' | 'deposit' | 'booked' | 'done' | 'cancelled';
    created_at: string;
}

export default function BookingManager() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        let query = supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        const { data } = await query;
        if (data) setBookings(data);
        setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
        const { error } = await supabase
            .from('bookings')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) fetchBookings();
    }

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) return <div className="text-white">Chargement...</div>;

    return (
        <div className="space-y-8">

            {/* Filters */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {['all', 'new', 'deposit', 'booked', 'done'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`uppercase tracking-wider text-sm px-4 py-2 rounded-full border border-white/10 transition-colors ${filter === status ? 'bg-[var(--color-primary)] text-white border-transparent' : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        {status === 'all' ? 'Tous' : status}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredBookings.map(booking => (
                    <div key={booking.id} className="bg-white/5 border border-white/10 p-6 rounded hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl text-white font-heading font-bold">{booking.client_name}</h3>
                                <a href={`mailto:${booking.email}`} className="text-[var(--color-primary)] text-sm hover:underline">{booking.email}</a>
                            </div>
                            <span className={`px-3 py-1 rounded text-xs uppercase font-bold
                            ${booking.status === 'new' ? 'bg-blue-900 text-blue-200' : ''}
                            ${booking.status === 'deposit' ? 'bg-yellow-900 text-yellow-200' : ''}
                            ${booking.status === 'booked' ? 'bg-green-900 text-green-200' : ''}
                            ${booking.status === 'done' ? 'bg-gray-700 text-gray-300' : ''}
                            ${booking.status === 'cancelled' ? 'bg-red-900 text-red-200' : ''}
                        `}>
                                {booking.status}
                            </span>
                        </div>

                        <p className="text-gray-300 mb-6 bg-black/30 p-4 rounded text-sm whitespace-pre-wrap">
                            {booking.project_desc}
                        </p>

                        <div className="flex gap-2 justify-end border-t border-white/10 pt-4">
                            <p className="mr-auto text-xs text-gray-600 self-center">Reçu le {new Date(booking.created_at).toLocaleDateString()}</p>

                            {booking.status === 'new' && (
                                <button onClick={() => updateStatus(booking.id, 'deposit')} className="text-xs border border-white/20 px-3 py-1 rounded hover:bg-white/10">Mark as Deposit Paid</button>
                            )}
                            {booking.status === 'deposit' && (
                                <button onClick={() => updateStatus(booking.id, 'booked')} className="text-xs border border-white/20 px-3 py-1 rounded hover:bg-white/10">Mark as Booked</button>
                            )}
                            <select
                                className="bg-black border border-white/20 text-xs p-1 rounded ml-2"
                                value={booking.status}
                                onChange={(e) => updateStatus(booking.id, e.target.value)}
                            >
                                <option value="new">Nouveau</option>
                                <option value="deposit">Acompte</option>
                                <option value="booked">Booké</option>
                                <option value="done">Terminé</option>
                                <option value="cancelled">Annulé</option>
                            </select>
                        </div>
                    </div>
                ))}
                {filteredBookings.length === 0 && (
                    <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded">
                        Aucune demande trouvée.
                    </div>
                )}
            </div>
        </div>
    );
}
