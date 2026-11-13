'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// SUPABASE BAĞLANTISI (Kendi bilgilerinle değiştir)
const SUPABASE_URL = 'https://SENIN_PROJE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'SENIN_ANON_PUBLIC_KEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Review {
  id: string;
  toolId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  pricingModel: string;
  priceDetails: string;
  websiteUrl: string;
  affiliateUrl: string;
  tags: string[];
}

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Metin Üretimi');
  const [formDesc, setFormDesc] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formPricing, setFormPricing] = useState('Freemium');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // SUPABASE'DEN ARAÇLARI ÇEKME
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase.from('tools').select('*');
        if (error) {
          console.error('Araçlar çekilirken hata:', error);
        } else if (data && data.length > 0) {
          setTools(data);
        }
      } catch (err) {
        console.error('Bağlantı hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();

    const savedFavs = localStorage.getItem('ai_hub_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const savedReviews = localStorage.getItem('ai_hub_reviews');
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let updatedFavs;
    if (favorites.includes(id)) {
      updatedFavs = favorites.filter(favId => favId !== id);
    } else {
      updatedFavs = [...favorites, id];
    }
    setFavorites(updatedFavs);
    localStorage.setItem('ai_hub_favorites', JSON.stringify(updatedFavs));
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // YENİ ARACI SUPABASE'E KAYDETME
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formUrl || !formDesc) return;

    const newTool = {
      slug: formName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: formName,
      category: formCategory,
      shortDescription: formDesc,
      pricingModel: formPricing,
      priceDetails: "Özel fiyatlandırma detayları yakında eklenecek.",
      websiteUrl: formUrl,
      affiliateUrl: "",
      tags: [formCategory, "Yeni Eklenen"]
    };

    try {
      const { data, error } = await supabase.from('tools').insert([newTool]).select();
      if (error) {
        alert('Araç eklenirken bir hata oluştu: ' + error.message);
        return;
      }

      if (data) {
        setTools([data[0], ...tools]);
      }
      setSubmitSuccess(true);
      setFormName('');
      setFormDesc('');
      setFormUrl('');

      setTimeout(() => {
        setSubmitSuccess(false);
        setIsSubmitModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Kayıt hatası:', err);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setNewsletterError('');
    setNewsletterSuccess(false);

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: newsletterEmail }]);

      if (error) {
        if (error.code === '23505') {
          setNewsletterError('Bu e-posta adresi zaten bültenimize kayıtlı!');
        } else {
          setNewsletterError('Bir hata oluştu, lütfen tekrar deneyin.');
        }
        return;
      }

      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    } catch (err) {
      console.error('Bağlantı hatası:', err);
      setNewsletterError('Beklenmeyen bir hata oluştu.');
    }
  };

  const categories = ['Tümü', ...Array.from(new Set(tools.map(tool => tool.category)))];

  let filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'Tümü' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showOnlyFavorites || favorites.includes(tool.id);
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  if (sortBy === 'name-asc') {
    filteredTools.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'name-desc') {
    filteredTools.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'pricing') {
    filteredTools.sort((a, b) => a.pricingModel.localeCompare(b.pricingModel));
  }

  const featuredTool = tools[0];

  return (
    <main className="min-h-screen p-6 md:p-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Üst Kısım */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
              AI Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">
              En iyi yapay zeka araçlarını keşfet, incele ve favorilerine ekle.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/rehber"
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors shadow-sm"
            >
              📖 Rehber
            </Link>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
            >
              + Aracını Ekle
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-105 transition-transform shadow-sm"
              title="Tema Değiştir"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* GÜNÜN ÖNE ÇIKAN ARACI BANNERI */}
        {featuredTool && (
          <Link 
            href={`/tools/${featuredTool.slug}`}
            className="mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-8 rounded-3xl shadow-xl hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 block"
          >
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-3 backdrop-blur-md">
                ⭐ Günün Öne Çıkan Yapay Zekası
              </span>
              <h2 className="text-2xl md:text-4xl font-black mb-2">{featuredTool.name}</h2>
              <p className="text-blue-100 text-sm md:text-base max-w-xl leading-relaxed">
                {featuredTool.shortDescription}
              </p>
            </div>
            <div className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shrink-0 hover:bg-blue-50 transition-colors">
              Detayları İncele ➔
            </div>
          </Link>
        )}

        {/* Arama ve Kontroller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Araç adı veya özellik ara (örn. ChatGPT, Claude...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="default">Varsayılan Sıralama</option>
              <option value="name-asc">İsme Göre (A-Z)</option>
              <option value="name-desc">İsme Göre (Z-A)</option>
              <option value="pricing">Fiyat Modeline Göre</option>
            </select>

            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-4 py-4 rounded-2xl font-medium text-sm transition-all border flex items-center justify-center shrink-0 ${
                showOnlyFavorites
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Favorilerim"
            >
              ❤️ ({favorites.length})
            </button>
          </div>
        </div>
        
        {/* Kategoriler */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-xs ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-blue-500/30 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Yükleniyor Durumu */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Veritabanından araçlar yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredTools.map((tool: Tool) => {
              const isFav = favorites.includes(tool.id);
              const toolReviews = reviews.filter(r => r.toolId === tool.id);
              const avgRating = toolReviews.length > 0 
                ? (toolReviews.reduce((acc, r) => acc + r.rating, 0) / toolReviews.length).toFixed(1) 
                : null;

              return (
                <Link 
                  key={tool.id} 
                  href={`/tools/${tool.slug}`}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer relative group block"
                >
                  <button
                    onClick={(e) => toggleFavorite(tool.id, e)}
                    className={`absolute top-5 right-5 p-2 rounded-full transition-all z-10 ${
                      isFav 
                        ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' 
                        : 'text-slate-300 dark:text-slate-700 hover:text-rose-500 bg-slate-50 dark:bg-slate-800/50'
                    }`}
                    title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>

                  <div>
                    <div className="flex items-start mb-3 pr-10">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold tracking-tight">{tool.name}</h2>
                          {avgRating && (
                            <span className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-200 dark:border-amber-900">
                              ⭐ {avgRating}
                            </span>
                          )}
                        </div>
                        <span className="inline-block mt-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs px-2.5 py-0.5 rounded-lg font-semibold border border-blue-100 dark:border-blue-900">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-auto">
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-lg font-medium border border-emerald-100 dark:border-emerald-900/50">
                      {tool.pricingModel}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      Detayları İncele ➔
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && filteredTools.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            Aradığın kriterlere uygun yapay zeka aracı bulunamadı.
          </div>
        )}

        {/* BÜLTEN ABONELİK BÖLÜMÜ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 mb-16 text-center shadow-sm">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">En Yeni AI Araçlarından Haberdar Ol</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-6">
            Her hafta çıkan en iyi yeni yapay zeka araçları ve fırsatları doğrudan e-postana gelsin.
          </p>
          
          {newsletterSuccess ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl max-w-md mx-auto font-medium">
              🎉 Başarıyla bültene abone oldun!
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="E-posta adresini yaz..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-semibold text-sm transition-colors shadow-sm shrink-0"
                >
                  Abone Ol 🚀
                </button>
              </form>

              {newsletterError && (
                <div className="mt-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 p-3 rounded-xl text-xs font-medium">
                  ⚠️ {newsletterError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ARAÇ GÖNDER MODALI */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div 
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
              >
                ✕
              </button>

              <h2 className="text-2xl font-extrabold mb-2">Yeni Yapay Zeka Aracı Öner</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                Keşfettiğin veya geliştirdiğin aracı hemen Supabase veritabanına ekle.
              </p>

              {submitSuccess ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl text-center font-medium my-8">
                  🎉 Araç başarıyla veritabanına eklendi!
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Araç Adı</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Claude 3.5"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Kategori</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Metin Üretimi">Metin Üretimi</option>
                      <option value="Görsel Tasarım">Görsel Tasarım</option>
                      <option value="Kodlama">Kodlama</option>
                      <option value="Verimlilik">Verimlilik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Kısa Açıklama</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ne işe yarar?"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Web Sitesi URL</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://ornek.com"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fiyatlandırma Modeli</label>
                    <select
                      value={formPricing}
                      onChange={(e) => setFormPricing(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Ücretsiz">Ücretsiz</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Ücretli">Ücretli</option>
                      <option value="Açık Kaynak">Açık Kaynak</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsSubmitModalOpen(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      İptal
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium text-sm transition-colors shadow-sm"
                    >
                      Aracı Ekle 🚀
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto w-full border-t border-slate-200 dark:border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div>
          © 2026 AI Hub. Tüm hakları saklıdır.
        </div>
        <div>
          İletişim & Sponsorluk: <a href="mailto:torqbox.tr@gmail.com" className="text-blue-500 hover:underline font-medium">torqbox.tr@gmail.com</a>
        </div>
      </footer>
    </main>
  );
}