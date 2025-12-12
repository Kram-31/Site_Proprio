import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Tattoo {
    id: string;
    title: string;
    image_url: string;
    tags: string[];
    status: 'done' | 'flash';
    published_date: string;
}

export default function TattooManager() {
    const [tattoos, setTattoos] = useState<Tattoo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Form states
    const [newTitle, setNewTitle] = useState('');
    const [newTags, setNewTags] = useState('');
    const [newImage, setNewImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchTattoos();
    }, []);

    async function fetchTattoos() {
        const { data, error } = await supabase
            .from('tattoos')
            .select('*')
            .order('published_date', { ascending: false });

        if (data) setTattoos(data);
        setLoading(false);
    }

    async function handleDelete(id: string, imageUrl: string) {
        if (!confirm('Supprimer ce tatouage ?')) return;

        // 1. Delete DB entry
        const { error } = await supabase.from('tattoos').delete().eq('id', id);
        if (error) {
            alert('Erreur suppression DB');
            return;
        }

        // 2. Delete Storage Image (Extract filename from URL if needed)
        // Needs logic to parse URL to get path 'portfolio/filename'
        // For now simple reload
        fetchTattoos();
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newImage || !newTitle) return;

        setUploading(true);

        try {
            // 1. Upload Image
            const fileExt = newImage.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, newImage);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            // 3. Insert into DB
            const tagsArray = newTags.split(',').map(t => t.trim()).filter(t => t);

            const { error: insertError } = await supabase
                .from('tattoos')
                .insert({
                    title: newTitle,
                    image_url: publicUrl,
                    tags: tagsArray,
                    status: 'done',
                    published_date: new Date().toISOString()
                });

            if (insertError) throw insertError;

            // Reset
            setShowAddForm(false);
            setNewTitle('');
            setNewTags('');
            setNewImage(null);
            fetchTattoos();

        } catch (error: any) {
            alert('Erreur: ' + error.message);
        } finally {
            setUploading(false);
        }
    }

    if (loading) return <div className="text-white">Chargement...</div>;

    return (
        <div className="space-y-8">

            {/* Actions */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-[var(--color-primary)] text-white font-sans font-bold uppercase px-6 py-2 hover:bg-white hover:text-black transition-colors"
                >
                    {showAddForm ? 'Annuler' : '+ Ajouter un Tatouage'}
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-white/5 border border-white/10 p-6 rounded animate-fade-in">
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Titre du tatouage"
                                className="bg-black/50 border border-white/20 p-3 text-white w-full"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Tags (séparés par des virgules)"
                                className="bg-black/50 border border-white/20 p-3 text-white w-full"
                                value={newTags}
                                onChange={e => setNewTags(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={e => setNewImage(e.target.files ? e.target.files[0] : null)}
                                required
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex items-center justify-center w-full bg-white/5 border border-white/20 p-4 text-gray-300 hover:bg-white/10 hover:text-white transition-colors border-dashed"
                            >
                                <span className="uppercase font-heading font-bold tracking-wider text-sm">
                                    {newImage ? `Fichier sélectionné : ${newImage.name}` : '+ Choisir une image'}
                                </span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="block w-full bg-white text-black font-bold uppercase py-3 hover:bg-gray-200 disabled:opacity-50"
                        >
                            {uploading ? 'Upload en cours...' : 'Publier'}
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tattoos.map(tattoo => (
                    <div key={tattoo.id} className="group relative bg-white/5 border border-white/10 overflow-hidden rounded">
                        <div className="aspect-square overflow-hidden">
                            <img src={tattoo.image_url} alt={tattoo.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                            <h3 className="text-white font-heading font-bold truncate">{tattoo.title}</h3>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {tattoo.tags?.map(tag => (
                                    <span key={tag} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">#{tag}</span>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center border-t border-white/10 pt-4">
                                <span className="text-xs text-gray-500">{new Date(tattoo.published_date).toLocaleDateString()}</span>
                                <button
                                    onClick={() => handleDelete(tattoo.id, tattoo.image_url)}
                                    className="text-red-500 hover:text-red-300 text-sm uppercase tracking-wider"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {tattoos.length === 0 && (
                    <div className="col-span-3 text-center py-20 text-gray-500">
                        Aucun tatouage dans la base de données.
                    </div>
                )}
            </div>
        </div>
    );
}
