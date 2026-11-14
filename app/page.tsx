'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// SUPABASE BAĞLANTISI (app/page.tsx dosyasındaki kendi bilgilerinle değiştir)
const SUPABASE_URL = 'https://vaguptcnmswwupussmrr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_VrNIj7RK3HJGZLymm02F0Q_HdmIZfBN';
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
  tags: string[];
}

export default function ToolDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const savedReviews = localStorage.getItem('ai_hub_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchTool = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Supabase hatası:', error.message);
          setTool(null);
        } else if (data) {
          setTool(data);
        }
      } catch (err) {
        console.error('Araç detayları çekilirken hata:', err);
        setTool(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
        Araç detayları yükleniyor...
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h1 className="text-2xl font-bold mb-4">Araç bulunamadı!</h1>
        <Link href="/" className="text-blue-400 hover:underline">← Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const toolReviews = reviews.filter(r => r.toolId === tool.id);
  const avgRating = toolReviews.length > 0 
    ? (toolReviews.reduce((acc, r) => acc + r.rating, 0) / toolReviews.length).toFixed(1) 
    : null;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) return;

    const newReview: Review = {
      id: Date.now().toString(),
      toolId: tool.id,
      userName,
      rating: Number(rating),
      comment,
      date: new Date().toLocaleDateString('tr-TR')
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('ai_hub_reviews', JSON.stringify(updatedReviews));

    setUserName('');
    setComment('');
    setRating(5);
  };

  return (
    <main className="min-h-screen p-6 md:p-16 bg-slate-950 text-slate-100 transition-colors">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-sm text-blue-400 hover:underline">
          ← Ana Sayfaya Dön
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <span className="bg-blue-950/50 text-blue-300 text-xs px-3 py-1 rounded-lg font-semibold border border-blue-900">
            {tool.category}
          </span>
          {avgRating && (
            <span className="text-xs bg-amber-950/40 text-amber-400 px-3 py-1 rounded-lg font-bold border border-amber-900">
              ⭐ {avgRating} ({toolReviews.length} Değerlendirme)
            </span>
          )}
        </div>

        <h1 className="text-4xl font-extrabold mb-4">{tool.name}</h1>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          {tool.shortDescription}
        </p>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Fiyatlandırma Detayları</h3>
          <p className="text-slate-200 text-base font-medium">
            {tool.priceDetails || 'Fiyatlandırma detayları belirtilmemiş.'}
          </p>
        </div>

        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tool.tags.map(tag => (
              <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <a 
          href={tool.websiteUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition-colors shadow-lg mb-16"
        >
          Resmi Web Sitesini Ziyaret Et ➔
        </a>

        {/* YORUMLAR VE DEĞERLENDİRME BÖLÜMÜ */}
        <div className="border-t border-slate-800 pt-10">
          <h3 className="text-2xl font-bold mb-6">Kullanıcı Yorumları ve Puanlar</h3>

          <form onSubmit={handleAddReview} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-10 space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Bu Araç İçin Yorum Yap</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Adınız</label>
                <input 
                  type="text"
                  required
                  placeholder="Adınız Soyadınız"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Puanınız</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 Mükemmel)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 Çok İyi)</option>
                  <option value="3">⭐⭐⭐ (3/5 Ortalama)</option>
                  <option value="2">⭐⭐ (2/5 Geliştirilmeli)</option>
                  <option value="1">⭐ (1/5 Beğenmedim)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Yorumunuz</label>
              <textarea 
                required
                rows={3}
                placeholder="Bu araç hakkında ne düşünüyorsunuz?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              Yorumu Gönder 💬
            </button>
          </form>

          <div className="space-y-4">
            {toolReviews.length === 0 ? (
              <p className="text-slate-500 text-sm">Bu araç için henüz yorum yapılmamış. İlk yorum yapan sen ol!</p>
            ) : (
              toolReviews.map((rev) => (
                <div key={rev.id} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-200">{rev.userName}</span>
                    <span className="text-xs text-slate-500">{rev.date}</span>
                  </div>
                  <div className="text-amber-400 text-xs mb-2">
                    {'⭐'.repeat(rev.rating)}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}