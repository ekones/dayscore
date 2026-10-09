# DayScore – Günün Net Bilançosu (Web & Landing Page)

DayScore iOS uygulamasının resmi tanıtım ve interaktif web simülatörü sayfası. 

Canlı adres: [dayscore.eneskocak.com](https://dayscore.eneskocak.com)

---

## 🚀 Özellikler

- **İnteraktif Günlük Skor Simülatörü**: Kullanıcılar uygulamayı indirmeden önce tarayıcı üzerinden mikro-olay ekleyebilir, puanlayabilir ve canlı sıvı göstergeyi test edebilir.
- **Hızlı 1-Tık Presetler**: Kahve, spor, toplantı, trafik gibi günlük durumları tek tıkla ekleme.
- **Dinamik Günün Karnesi**: Gerçek zamanlı olarak skor durumuna göre değişen Liquid Glass teması (Harika Bir Gün, Pozitifteyiz, Nötr & Dengeli, Zor Bir Gün).
- **Apple App Store & HIG Uyumu**: Gizlilik Politikası (`privacy_policy.html`) ve Destek/SSS (`support.html`) sayfaları dahil eksiksiz App Store onay hazırlığı.
- **Sıfır Bağımlılık & Hızlı Yüklenme**: Saf HTML5, modern Vanilla CSS (Liquid Glassmorphism) ve hafif Vanilla JavaScript.

---

## 💻 Yerel Geliştirme (Local Run)

Herhangi bir statik sunucuyla veya doğrudan tarayıcıda açabilirsiniz:

```bash
# Python ile yerel sunucu başlatmak için:
cd docs
python3 -m http.server 8000
# http://localhost:8000 adresini tarayıcıda açın
```

---

## 🌐 Dağıtım (Deploy - GitHub Pages)

Bu depo GitHub Pages ile `docs/` klasöründen yayınlanacak şekilde yapılandırılmıştır:
- GitHub Repo Settings -> **Pages** -> Source: **Deploy from a branch** -> Branch: `main` / `/docs`
- Custom Domain: `dayscore.eneskocak.com` (CNAME dosyası mevcuttur)

---

© 2026 DayScore • Enes Koçak. Tüm hakları saklıdır.
