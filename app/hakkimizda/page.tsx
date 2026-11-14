import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 md:px-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-8 text-sm text-blue-400 hover:underline">
          ← Ana Sayfaya Dön
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Hakkımızda</h1>

        <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800">
          <p>
            <strong className="text-white">AI Hub</strong>, hızla büyüyen yapay zeka ekosistemindeki en faydalı
            ve güvenilir araçları tek bir çatı altında toplamak amacıyla kurulmuş Türkçe yapay zeka dizin platformudur.
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">Misyonumuz</h2>
            <p>
              Öğrencilerin, öğretmenlerin, yazılımcıların ve içerik üreticilerinin ihtiyaçlarına en uygun yapay zeka
              araçlarını karmaşaya boğulmadan bulmalarını sağlamak. Her aracın ücretsiz plan durumunu, Türkçe dil
              desteğini ve kullanım alanlarını şeffaf biçimde sunuyoruz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">Neler Sunuyoruz?</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Eğitim, kodlama, araştırma, tasarım, ses ve video alanlarında kategorize edilmiş güncel araç listesi</li>
              <li>Ücretsiz kullanım ve Türkçe arayüz/çıktı desteği filtrelemesi</li>
              <li>Kullanıcıların kendi deneyimlerini paylaşabildiği puanlama ve yorum sistemi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">Bize Ulaşın</h2>
            <p>
              Platforma eklenmesini istediğiniz araçlar, öneriler veya iş birlikleri için{' '}
              <Link href="/iletisim" className="text-blue-400 hover:underline">
                İletişim
              </Link>{' '}
              sayfamız üzerinden bize ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}