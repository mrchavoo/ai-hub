'use client';

import { useState, useEffect } from 'react';
import toolsData from '@/app/data/tools.json';
import Link from 'next/link';

interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  pricingModel: string;
  priceDetails?: string;
  websiteUrl: string;
  tags?: string[];
}

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>(toolsData as Tool[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState('default');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Yeni araç ekleme modalı
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Metin Üretimi');
  const [newDesc, setNewDesc] = useState('');
  const [newPricing, setNewPricing] = useState('Freemium');
  const [newUrl, setNewUrl] = useState('');

  // Bülten aboneliği
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const savedFavs = localStorage.getItem('ai_hub_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    const customTools = localStorage.getItem('ai_hub_custom_tools');
    if (customTools) {
      setTools([...(toolsData as Tool[]), ...JSON.parse(customTools)]);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('ai_hub_favorites', JSON.stringify(updated));
  };

  const categories = ['Tümü', ...Array.from(new Set(tools.map((t) => t.category)))];

  const filteredTools = tools
    .filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.tags && tool.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === 'Tümü' || tool.category === selectedCategory;

      const matchesFav = !showOnlyFavorites || favorites.includes(tool.id);

      return matchesSearch && matchesCategory && matchesFav;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc || !newUrl) return;

    const slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const created: Tool = {
      id: Date.now().toString(),
      slug,
      name: newName,
      category: newCategory,
      shortDescription: newDesc,
      pricingModel: newPricing,
      priceDetails: newPricing,
      websiteUrl: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      tags: [newCategory],
    };

    const existingCustom = JSON.parse(localStorage.getItem('ai_hub_custom_tools') || '[]');
    const updatedCustom = [created, ...existingCustom];
    localStorage.setItem('ai_hub_custom_tools', JSON.stringify(updatedCustom));

    setTools([created, ...tools]);
    setNewName('');
    setNewDesc('');
    setNewUrl('');
    setIsModalOpen(false);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Üst Başlık ve Butonlar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              AI Hub
            </h1>
            <p className="text-slate-400 mt-2 text-base md:text-lg">
              En iyi yapay zeka araçlarını keşfet, incele ve favorilerine ekle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md cursor-pointer"
            >
              + Aracını Ekle
            </button>
          </div>
        </header>

        {/* Arama, Sıralama ve Favori Filtresi */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-6">
            <input
              type="text"
              placeholder="Araç adı, özellik veya etiket ara (örn: ChatGPT, kodlama)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Varsayılan Sıralama</option>
              <option value="name-asc">İsim (A - Z)</option>
              <option value="name-desc">İsim (Z - A)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                showOnlyFavorites
                  ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              ❤️ Favorilerim ({favorites.length})
            </button>
          </div>
        </div>

        {/* Kategori Sekmeleri */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Araç Kartları Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 mb-16">
            <p className="text-slate-400 text-base">Aramanıza uygun yapay zeka aracı bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {filteredTools.map((tool) => {
              const isFav = favorites.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="bg-blue-950/60 text-blue-300 border border-blue-900/80 text-xs px-2.5 py-1 rounded-lg font-medium">
                        {tool.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                          {tool.pricingModel}
                        </span>
                        <button
                          onClick={() => toggleFavorite(tool.id)}
                          title="Favorilere Ekle"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          {isFav ? '❤️' : '🤍'}
                        </button>
                      </div>
                    </div>

                    <Link href={`/tools/${tool.slug}`}>
                      <h2 className="text-xl font-bold text-slate-100 hover:text-blue-400 transition-colors mb-2">
                        {tool.name}
                      </h2>
                    </Link>

                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {tool.shortDescription}
                    </p>
                  </div>

                  <div>
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="flex-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                      >
                        İncele
                      </Link>
                      <a
                        href={tool.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Siteye Git ↗
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bülten Bölümü */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center mb-12">
          <h3 className="text-2xl font-bold mb-2">En Yeni AI Araçlarından Haberdar Ol</h3>
          <p className="text-slate-400 text-sm mb-6">
            Her hafta çıkan en iyi yeni yapay zeka araçları ve fırsatları doğrudan e-postana gelsin.
          </p>

          {subscribed ? (
            <p className="text-emerald-400 font-semibold text-sm">
              ✅ Bültene başarıyla abone oldun!
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                required
                placeholder="E-posta adresini yaz..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Abone Ol 🚀
              </button>
            </form>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 border-t border-slate-900 pt-8">
          <p>© 2026 AI Hub. Tüm hakları saklıdır.</p>
          <p className="mt-1">
            İletişim & Sponsorluk:{' '}
            <a href="mailto:torqbox.tr@gmail.com" className="text-blue-400 hover:underline">
              torqbox.tr@gmail.com
            </a>
          </p>
        </footer>
      </div>

      {/* Araç Ekleme Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Yeni AI Aracı Ekle</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddTool} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Araç Adı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Perplexity AI"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Kategori</label>
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Fiyatlandırma</label>
                  <select
                    value={newPricing}
                    onChange={(e) => setNewPricing(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                  >
                    <option value="Ücretsiz">Ücretsiz</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Ücretli">Ücretli</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Kısa Açıklama</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Bu araç ne işe yarar?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Web Sitesi URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Aracı Ekle
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}