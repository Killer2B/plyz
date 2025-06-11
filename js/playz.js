/**
 * PlayZ - مشغل فيديو متقدم
 * يتفوق على Plyr مع دعم تبديل الجودة اليدوي وتصميم أنيق وفخم
 */

class PlayZ {
    constructor(selector, options = {}) {
        // تحديد العناصر الرئيسية
        this.container = document.querySelector(selector);
        if (!this.container) {
            console.error('PlayZ: لم يتم العثور على العنصر المحدد', selector);
            return;
        }

        // الإعدادات الافتراضية
        this.options = {
            autoplay: false,
            muted: false,
            volume: 1,
            defaultQuality: '720p',
            ...options
        };

        // تهيئة المتغيرات
        this.video = this.container.querySelector('video');
        this.controls = this.container.querySelector('.playz-controls');
        this.progressBar = this.container.querySelector('.playz-progress-bar');
        this.progressIndicator = this.container.querySelector('.playz-progress-indicator');
        this.timeTooltip = this.container.querySelector('.playz-time-tooltip');
        this.playPauseBtn = this.container.querySelector('.playz-play-pause');
        this.volumeBtn = this.container.querySelector('.playz-volume');
        this.volumeSlider = this.container.querySelector('.playz-volume-slider');
        this.volumeIndicator = this.container.querySelector('.playz-volume-indicator');
        this.currentTimeEl = this.container.querySelector('.playz-current-time');
        this.durationEl = this.container.querySelector('.playz-duration');
        this.qualityBtn = this.container.querySelector('.playz-quality-btn');
        this.qualityMenu = this.container.querySelector('.playz-quality-menu');
        this.qualityOptions = this.container.querySelectorAll('.playz-quality-menu button');
        this.currentQualityEl = this.container.querySelector('.playz-current-quality');
        this.captionsBtn = this.container.querySelector('.playz-captions');
        this.settingsBtn = this.container.querySelector('.playz-settings');
        this.pipBtn = this.container.querySelector('.playz-pip');
        this.fullscreenBtn = this.container.querySelector('.playz-fullscreen');

        // تخزين مصادر الفيديو حسب الجودة
        this.videoSources = {};
        const sources = this.video.querySelectorAll('source');
        sources.forEach(source => {
            const quality = source.getAttribute('data-quality');
            if (quality) {
                this.videoSources[quality] = source.src;
            }
        });

        // تهيئة المشغل
        this.init();
    }

    init() {
        // تطبيق الإعدادات الأولية
        this.video.volume = this.options.volume;
        this.video.muted = this.options.muted;
        this.updateVolumeUI();

        // تعيين الجودة الافتراضية
        this.setQuality(this.options.defaultQuality);

        // إضافة أحداث المشغل
        this.addEventListeners();

        // التحقق من دعم وضع صورة داخل صورة
        if (!document.pictureInPictureEnabled) {
            this.pipBtn.style.display = 'none';
        }

        // التحقق من دعم ملء الشاشة
        if (!document.fullscreenEnabled) {
            this.fullscreenBtn.style.display = 'none';
        }

        // التحقق من دعم اللمس
        if ('ontouchstart' in window) {
            this.container.classList.add('touch-device');
        }

        // تشغيل تلقائي إذا كان مفعلاً
        if (this.options.autoplay) {
            this.video.play().catch(error => {
                console.warn('PlayZ: فشل التشغيل التلقائي', error);
            });
        }

        console.log('PlayZ: تم تهيئة المشغل بنجاح');
    }

    addEventListeners() {
        // أحداث الفيديو
        this.video.addEventListener('loadedmetadata', () => this.updateDuration());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('volumechange', () => this.updateVolumeUI());
        this.video.addEventListener('play', () => this.playPauseBtn.classList.add('playing'));
        this.video.addEventListener('pause', () => this.playPauseBtn.classList.remove('playing'));
        this.video.addEventListener('ended', () => this.onVideoEnded());

        // أحداث التحكم
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('click', (e) => this.setVolume(e));
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.progressBar.addEventListener('mousemove', (e) => this.updateTimeTooltip(e));
        this.progressBar.addEventListener('mouseleave', () => this.timeTooltip.style.opacity = '0');
        this.qualityBtn.addEventListener('click', () => this.toggleQualityMenu());
        this.captionsBtn.addEventListener('click', () => this.toggleCaptions());
        this.pipBtn.addEventListener('click', () => this.togglePiP());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // إضافة أحداث لخيارات الجودة
        this.qualityOptions.forEach(option => {
            option.addEventListener('click', () => {
                const quality = option.getAttribute('data-quality');
                this.setQuality(quality);
                this.toggleQualityMenu();
            });
        });

        // إضافة أحداث المفاتيح
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // إغلاق قائمة الجودة عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!this.qualityBtn.contains(e.target) && this.qualityMenu.classList.contains('active')) {
                this.toggleQualityMenu();
            }
        });
    }

    // تبديل التشغيل/الإيقاف
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    // تبديل كتم الصوت
    toggleMute() {
        this.video.muted = !this.video.muted;
    }

    // تحديث واجهة مستوى الصوت
    updateVolumeUI() {
        const volumeLevel = this.video.muted ? 0 : this.video.volume;
        this.volumeIndicator.style.width = `${volumeLevel * 100}%`;

        // تحديث أيقونة الصوت
        const volumeIcon = this.volumeBtn.querySelector('i');
        volumeIcon.className = 'fas';

        if (this.video.muted || volumeLevel === 0) {
            volumeIcon.classList.add('fa-volume-mute');
        } else if (volumeLevel < 0.5) {
            volumeIcon.classList.add('fa-volume-down');
        } else {
            volumeIcon.classList.add('fa-volume-up');
        }
    }

    // ضبط مستوى الصوت
    setVolume(e) {
        const rect = this.volumeSlider.getBoundingClientRect();
        const volumeLevel = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.video.volume = volumeLevel;
        this.video.muted = volumeLevel === 0;
    }

    // تحديث مدة الفيديو
    updateDuration() {
        const duration = this.formatTime(this.video.duration);
        this.durationEl.textContent = duration;
    }

    // تحديث شريط التقدم
    updateProgress() {
        const currentTime = this.video.currentTime;
        const duration = this.video.duration;
        
        if (duration) {
            // تحديث مؤشر التقدم
            const progressPercentage = (currentTime / duration) * 100;
            this.progressIndicator.style.width = `${progressPercentage}%`;
            
            // تحديث عرض الوقت الحالي
            this.currentTimeEl.textContent = this.formatTime(currentTime);
        }
    }

    // تحديث تلميح الوقت
    updateTimeTooltip(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const time = this.video.duration * percentage;
        
        this.timeTooltip.textContent = this.formatTime(time);
        this.timeTooltip.style.left = `${e.clientX - rect.left}px`;
        this.timeTooltip.style.opacity = '1';
    }

    // الانتقال إلى وقت محدد
    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.video.currentTime = this.video.duration * percentage;
    }

    // تنسيق الوقت (ثواني إلى mm:ss)
    formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '00:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // تبديل قائمة الجودة
    toggleQualityMenu() {
        this.qualityMenu.classList.toggle('active');
    }

    // تعيين جودة الفيديو
    setQuality(quality) {
        if (!this.videoSources[quality]) {
            console.error('PlayZ: جودة غير متوفرة', quality);
            return;
        }

        // حفظ الموضع الحالي والحالة
        const currentTime = this.video.currentTime;
        const isPaused = this.video.paused;

        // تحديث عنصر الجودة الحالية
        this.currentQualityEl.textContent = quality;

        // تحديث الجودة النشطة في القائمة
        this.qualityOptions.forEach(option => {
            if (option.getAttribute('data-quality') === quality) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });

        // تغيير مصدر الفيديو
        this.video.src = this.videoSources[quality];

        // استعادة الموضع والحالة
        this.video.addEventListener('loadedmetadata', () => {
            this.video.currentTime = currentTime;
            if (!isPaused) {
                this.video.play();
            }
        }, { once: true });

        console.log('PlayZ: تم تغيير الجودة إلى', quality);
    }

    // تبديل الترجمات
    toggleCaptions() {
        if (this.video.textTracks.length === 0) {
            console.warn('PlayZ: لا توجد ترجمات متاحة');
            return;
        }

        const track = this.video.textTracks[0];
        if (track.mode === 'showing') {
            track.mode = 'hidden';
            this.captionsBtn.classList.remove('active');
        } else {
            track.mode = 'showing';
            this.captionsBtn.classList.add('active');
        }
    }

    // تبديل وضع صورة داخل صورة
    togglePiP() {
        if (!document.pictureInPictureEnabled) {
            console.warn('PlayZ: وضع صورة داخل صورة غير مدعوم');
            return;
        }

        if (document.pictureInPictureElement === this.video) {
            document.exitPictureInPicture();
        } else {
            this.video.requestPictureInPicture();
        }
    }

    // تبديل وضع ملء الشاشة
    toggleFullscreen() {
        if (!document.fullscreenEnabled) {
            console.warn('PlayZ: وضع ملء الشاشة غير مدعوم');
            return;
        }

        if (document.fullscreenElement === this.container) {
            document.exitFullscreen();
            this.container.classList.remove('fullscreen');
            this.fullscreenBtn.classList.remove('active');
        } else {
            this.container.requestFullscreen();
            this.container.classList.add('fullscreen');
            this.fullscreenBtn.classList.add('active');
        }
    }

    // معالجة اختصارات لوحة المفاتيح
    handleKeyboardShortcuts(e) {
        // التأكد من أن المشغل هو العنصر النشط
        if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
            return;
        }

        switch (e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'm':
                this.toggleMute();
                break;
            case 'f':
                this.toggleFullscreen();
                break;
            case 'p':
                this.togglePiP();
                break;
            case 'arrowright':
                e.preventDefault();
                this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 5);
                break;
            case 'arrowleft':
                e.preventDefault();
                this.video.currentTime = Math.max(0, this.video.currentTime - 5);
                break;
            case 'arrowup':
                e.preventDefault();
                this.video.volume = Math.min(1, this.video.volume + 0.1);
                break;
            case 'arrowdown':
                e.preventDefault();
                this.video.volume = Math.max(0, this.video.volume - 0.1);
                break;
        }
    }

    // معالجة انتهاء الفيديو
    onVideoEnded() {
        this.playPauseBtn.classList.remove('playing');
        // يمكن إضافة منطق إضافي هنا مثل التشغيل التلقائي للفيديو التالي
    }
}

// تهيئة المشغل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const player = new PlayZ('#player-container', {
        autoplay: false,
        muted: false,
        volume: 0.8,
        defaultQuality: '720p'
    });

    // إضافة المشغل إلى النافذة للوصول إليه من خلال وحدة التحكم
    window.player = player;
});