import Link from 'next/link';

export default function RehberPage() {
  return (
    <main className="min-h-screen p-6 md:p-16 bg-slate-950 text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Geri Dön Linki */}
        <Link href="/" className="inline-block mb-8 text-sm text-blue-400 hover:underline">
          ← Ana Sayfaya Dön
        </Link>

        {/* Başlık */}
        <span className="inline-block bg-blue-950/50 text-blue-300 text-xs px-3 py-1 rounded-lg font-semibold border border-blue-900 mb-3">
          AI Hub Bilgi Bankası
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Yapay Zeka (AI) Nedir ve Nasıl Kullanılır?
        </h1>
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
          Yapay zeka, bilgisayarların insan zekasını taklit ederek öğrenme, problem çözme ve karar verme gibi yetenekler kazanmasını sağlayan bir teknolojidir. Bu rehberde, yapay zeka dünyasına hızlıca adım atabilir ve işini kolaylaştıracak araçları keşfedebilirsin.
        </p>

        {/* Bölüm 1: Yapay Zeka Nedir? */}
        <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">1. Yapay Zeka Hayatımızı Nasıl Değiştiriyor?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Günümüzde yapay zeka sadece büyük şirketlerin kullandığı bir teknoloji olmaktan çıktı; hepimizin cebine, bilgisayarına kadar girdi. Metin yazmaktan görsel tasarlamaya, kod yazmaktan veri analizine kadar her alanda en büyük yardımcımız haline geldi.
          </p>
          <p className="text-slate-300 leading-relaxed">
            AI Hub olarak amacımız; kategorilere ayrılmış binlerce yapay zeka aracı arasından senin için en doğru olanı bulmanı sağlamak ve en güncel araçları tek bir yerden keşfetmene olanak tanımaktır.
          </p>
        </section>

        {/* Bölüm 2: Araç Türleri */}
        <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-blue-400">2. Hangi Araç Ne İşe Yarar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white mb-2">✍️ Metin Üretimi & Asistanlar</h3>
              <p className="text-slate-400 text-sm">ChatGPT, Claude gibi araçlar makale yazmanı, fikir üretmeni ve kod hatalarını ayıklamanı sağlar.</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white mb-2">🎨 Görsel & Tasarım</h3>
              <p className="text-slate-400 text-sm">Midjourney, DALL-E gibi araçlar yazdığın metinleri saniyeler içinde muazzam tablolara ve tasarımlara dönüştürür.</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white mb-2">💻 Kodlama & Geliştirme</h3>
              <p className="text-slate-400 text-sm">GitHub Copilot ve benzeri yazılımlar yazılımcıların kod yazma hızını 2-3 kat artırır.</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white mb-2">📊 Verimlilik & Otomasyon</h3>
              <p className="text-slate-400 text-sm">Toplantı özetleyen, e-posta taslakları oluşturan ve günlük işleri otomatikleştiren araçlardır.</p>
            </div>
          </div>
        </section>

        {/* Alt Çağrı */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl text-white shadow-xl">
          <h3 className="text-2xl font-extrabold mb-3">Keşfetmeye Hazır Mısın?</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-lg mx-auto">
            Yüzlerce yapay zeka aracını incelemek ve ihtiyacına uygun olanı seçmek için ana sayfaya dönebilirsin.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors"
          >
            Araçları Keşfet ➔
          </Link>
        </div>

      </div>
    </main>
  );
}