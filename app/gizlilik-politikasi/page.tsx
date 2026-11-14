import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 md:px-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-8 text-sm text-blue-400 hover:underline">
          ← Ana Sayfaya Dön
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Gizlilik Politikası</h1>
        <p className="text-xs text-slate-500 mb-8">Son Güncelleme: Kasım 2026</p>

        <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Genel Bilgilendirme</h2>
            <p>
              AI Hub olarak ziyaretçilerimizin gizliliğine önem veriyoruz. Bu Gizlilik Politikası, sitemizi
              ziyaret ettiğinizde hangi bilgilerin toplandığını, nasıl kullanıldığını ve haklarınızı açıklar.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Toplanan Veriler ve Yerel Depolama (LocalStorage)</h2>
            <p>
              Sitemizde oluşturduğunuz favori araç listeleri, eklediğiniz özel araçlar ve yaptığınız yorumlar
              sunucularımıza aktarılmadan yalnızca kendi tarayıcınızın yerel depolama alanında (LocalStorage)
              saklanır. Bülten aboneliği formunu kullanmanız durumunda yalnızca belirttiğiniz e-posta adresi
              bilgilendirme amacıyla işlenir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Çerezler (Cookies) ve Google AdSense</h2>
            <p className="mb-2">
              Sitemizde kullanıcı deneyimini iyileştirmek ve reklam göstermek amacıyla çerezler kullanılabilir:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>
                Üçüncü taraf satıcı olarak Google, sitemizde reklam yayınlamak için çerezlerden yararlanır.
              </li>
              <li>
                Google&apos;ın reklam çerezlerini kullanması, kullanıcılara sitemize ve internetteki diğer sitelere
                yaptıkları ziyaretlere dayalı reklamlar sunmasına olanak tanır.
              </li>
              <li>
                Kullanıcılar, <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Reklam Ayarları</a> sayfasını ziyaret ederek kişiselleştirilmiş reklamcılığı devre dışı bırakabilirler.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. Üçüncü Taraf Bağlantıları</h2>
            <p>
              AI Hub, yapay zeka araçlarını tanıtan bir dizin platformudur. Sitemizde yer alan &ldquo;Siteye Git&rdquo;
              veya &ldquo;Resmi Web Sitesini Ziyaret Et&rdquo; bağlantıları sizi ilgili araçların kendi web sitelerine
              yönlendirir. Yönlendirilen harici sitelerin gizlilik uygulamalarından AI Hub sorumlu değildir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. İletişim</h2>
            <p>
              Gizlilik politikamızla ilgili her türlü soru ve talebiniz için{' '}
              <a href="mailto:torqbox.tr@gmail.com" className="text-blue-400 hover:underline">
                torqbox.tr@gmail.com
              </a>{' '}
              adresinden bize ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}