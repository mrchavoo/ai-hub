'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Genel Soru');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const mailtoLink = `mailto:torqbox.tr@gmail.com?subject=${encodeURIComponent(
      `[AI Hub - ${subject}] ${name}`
    )}&body=${encodeURIComponent(`Gönderen: ${name} (${email})\n\n${message}`)}`;

    window.location.href = mailtoLink;
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 md:px-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-8 text-sm text-blue-400 hover:underline">
          ← Ana Sayfaya Dön
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">İletişim</h1>
        <p className="text-slate-400 text-sm md:text-base mb-8">
          Araç önerileri, hata bildirimleri, reklam veya iş birliği talepleriniz için bizimle iletişime geçebilirsiniz.
        </p>

        <div className="bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800 mb-8">
          <div className="mb-6 pb-6 border-b border-slate-800">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Doğrudan E-Posta</p>
            <a
              href="mailto:torqbox.tr@gmail.com"
              className="text-lg font-bold text-blue-400 hover:underline"
            >
              torqbox.tr@gmail.com
            </a>
          </div>

          {sent ? (
            <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-300 p-4 rounded-xl text-sm">
              ✅ E-posta uygulamanız açıldı. Mesajınızı doğrudan <strong>torqbox.tr@gmail.com</strong> adresine gönderebilirsiniz.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Adınız Soyadınız</label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">E-Posta Adresiniz</label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Konu</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Genel Soru">Genel Soru / Öneri</option>
                  <option value="Yeni Araç Önerisi">Yeni AI Aracı Önerisi</option>
                  <option value="Reklam ve Sponsorluk">Reklam ve Sponsorluk</option>
                  <option value="Hata Bildirimi">Hata / İçerik Düzeltme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mesajınız</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mesajınızı buraya yazın..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                Mesaj Gönder ✉️
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}