# PlayZ - مشغل فيديو متقدم

PlayZ هو مشغل فيديو متقدم مفتوح المصدر يتفوق على Plyr مع دعم تبديل الجودة اليدوي وتصميم أنيق وفخم. تم تصميمه ليكون سهل الاستخدام وقابل للتخصيص بالكامل.

## المميزات

- **تصميم أنيق وفخم**: واجهة مستخدم عصرية وجذابة
- **دعم تبديل الجودة اليدوي**: تغيير جودة الفيديو بسهولة أثناء التشغيل
- **دعم الترجمات**: عرض ترجمات الفيديو بتنسيق VTT
- **وضع ملء الشاشة**: مشاهدة الفيديو في وضع ملء الشاشة
- **وضع صورة داخل صورة**: متابعة مشاهدة الفيديو أثناء تصفح صفحات أخرى
- **تحكم كامل في الصوت**: ضبط مستوى الصوت بسهولة
- **واجهة مستخدم سهلة الاستخدام**: تصميم بديهي وسهل الاستخدام
- **دعم HTML5 الكامل**: متوافق مع معايير HTML5
- **متوافق مع جميع المتصفحات الحديثة**: يعمل على Chrome و Firefox و Safari و Edge
- **اختصارات لوحة المفاتيح**: للتحكم السريع في المشغل
- **تصميم متجاوب**: يعمل على جميع أحجام الشاشات

## كيفية الاستخدام

### التثبيت

1. قم بتنزيل أو استنساخ هذا المستودع
2. قم بتضمين ملفات CSS و JavaScript في مشروعك

```html
<link rel="stylesheet" href="css/playz.css">
<script src="js/playz.js"></script>
```

### الاستخدام الأساسي

```html
<div class="playz-container" id="player-container">
    <div class="playz-wrapper">
        <video id="playz-player" playsinline>
            <source src="path/to/video-576p.mp4" type="video/mp4" data-quality="576p">
            <source src="path/to/video-720p.mp4" type="video/mp4" data-quality="720p">
            <source src="path/to/video-1080p.mp4" type="video/mp4" data-quality="1080p">
            <track kind="captions" label="English" src="path/to/captions.vtt" srclang="en" default>
        </video>
        
        <div class="playz-controls">
            <!-- عناصر التحكم هنا -->
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const player = new PlayZ('#player-container', {
            autoplay: false,
            muted: false,
            volume: 0.8,
            defaultQuality: '720p'
        });
    });
</script>
```

### الخيارات

| الخيار | النوع | الافتراضي | الوصف |
|--------|------|-----------|-------|
| `autoplay` | boolean | `false` | تشغيل الفيديو تلقائيًا عند التحميل |
| `muted` | boolean | `false` | كتم صوت الفيديو افتراضيًا |
| `volume` | number | `1` | مستوى الصوت الافتراضي (0-1) |
| `defaultQuality` | string | `'720p'` | الجودة الافتراضية للفيديو |

## اختصارات لوحة المفاتيح

| المفتاح | الوظيفة |
|---------|--------|
| `Space` أو `K` | تشغيل/إيقاف |
| `M` | كتم/إلغاء كتم الصوت |
| `F` | تبديل وضع ملء الشاشة |
| `P` | تبديل وضع صورة داخل صورة |
| `←` | إرجاع 5 ثوانٍ |
| `→` | تقديم 5 ثوانٍ |
| `↑` | زيادة مستوى الصوت |
| `↓` | خفض مستوى الصوت |

## واجهة برمجة التطبيقات (API)

### الأساليب

| الأسلوب | الوصف |
|---------|--------|
| `togglePlay()` | تبديل حالة التشغيل/الإيقاف |
| `toggleMute()` | تبديل حالة كتم الصوت |
| `setVolume(level)` | تعيين مستوى الصوت (0-1) |
| `setQuality(quality)` | تغيير جودة الفيديو |
| `toggleCaptions()` | تبديل عرض الترجمات |
| `togglePiP()` | تبديل وضع صورة داخل صورة |
| `toggleFullscreen()` | تبديل وضع ملء الشاشة |

## التخصيص

يمكنك تخصيص مظهر المشغل بسهولة عن طريق تعديل متغيرات CSS في ملف `playz.css`:

```css
:root {
    --playz-primary: #6200ea; /* اللون الرئيسي */
    --playz-secondary: #b388ff; /* اللون الثانوي */
    --playz-background: #121212; /* لون الخلفية */
    --playz-surface: #1e1e1e; /* لون السطح */
    --playz-on-surface: #ffffff; /* لون النص على السطح */
    --playz-on-surface-variant: rgba(255, 255, 255, 0.7); /* متغير لون النص */
    --playz-progress-bg: rgba(255, 255, 255, 0.2); /* خلفية شريط التقدم */
    --playz-progress-buffered: rgba(255, 255, 255, 0.4); /* لون التخزين المؤقت */
    --playz-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); /* الظل */
    --playz-transition: all 0.3s ease; /* تأثير الانتقال */
    --playz-border-radius: 8px; /* نصف قطر الحدود */
    --playz-controls-spacing: 10px; /* تباعد عناصر التحكم */
    --playz-controls-height: 60px; /* ارتفاع شريط التحكم */
}
```

## المتطلبات

- متصفح حديث يدعم HTML5 و JavaScript ES6
- Font Awesome 6 للأيقونات

## الترخيص

هذا المشروع مرخص بموجب [MIT License](LICENSE).

## المساهمة

نرحب بالمساهمات! يرجى إرسال طلبات السحب أو فتح مشكلة لاقتراح تحسينات أو الإبلاغ عن أخطاء.

---

تم تطويره بواسطة [اسمك هنا] © 2023