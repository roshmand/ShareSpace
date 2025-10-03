// Photo/Video Sharing Platform - Main JavaScript
class MediaSharingPlatform {
    constructor() {
        this.uploadedFiles = [];
        this.currentFilter = 'all';
        this.lightboxOpen = false;
        this.currentLightboxIndex = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleContent();
        this.initializeAnimations();
        this.setupScrollAnimations();
    }

    setupEventListeners() {
        // Upload zone events
        const uploadZone = document.getElementById('uploadZone');
        if (uploadZone) {
            uploadZone.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadZone.addEventListener('drop', this.handleDrop.bind(this));
            uploadZone.addEventListener('click', this.triggerFileSelect.bind(this));
        }

        // File input change
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Lightbox controls
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        document.addEventListener('click', this.handleLightboxClick.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    triggerFileSelect() {
        document.getElementById('fileInput').click();
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const mediaItem = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    src: e.target.result,
                    size: this.formatFileSize(file.size),
                    date: new Date().toLocaleDateString()
                };
                this.uploadedFiles.unshift(mediaItem);
                this.renderGallery();
                this.animateNewUpload();
            };
            reader.readAsDataURL(file);
        });
    }

    loadSampleContent() {
        const sampleImages = [
            { name: 'Abstract Patterns', src: 'resources/sample-01.jpg', type: 'image' },
            { name: 'Ocean Waves', src: 'resources/sample-02.jpg', type: 'image' },
            { name: 'Urban Night', src: 'resources/sample-03.jpg', type: 'image' },
            { name: 'Forest Light', src: 'resources/sample-04.jpg', type: 'image' },
            { name: 'Mountain Sunset', src: 'resources/sample-05.jpg', type: 'image' },
            { name: 'Vintage Camera', src: 'resources/sample-06.jpg', type: 'image' },
            { name: 'Street Art', src: 'resources/sample-07.jpg', type: 'image' },
            { name: 'Minimal Design', src: 'resources/sample-08.jpg', type: 'image' },
            { name: 'Portrait Study', src: 'resources/sample-09.jpg', type: 'image' },
            { name: 'Literature', src: 'resources/sample-10.jpg', type: 'image' },
            { name: 'Wildlife', src: 'resources/sample-11.jpg', type: 'image' },
            { name: 'Interior Space', src: 'resources/sample-12.jpg', type: 'image' },
            { name: 'Technology', src: 'resources/sample-13.jpg', type: 'image' },
            { name: 'Architecture', src: 'resources/sample-14.jpg', type: 'image' },
            { name: 'Nature Scene', src: 'resources/sample-15.jpg', type: 'image' }
        ];

        sampleImages.forEach((img, index) => {
            const mediaItem = {
                id: `sample-${index}`,
                name: img.name,
                type: img.type,
                src: img.src,
                size: '2.4 MB',
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
            };
            this.uploadedFiles.push(mediaItem);
        });

        this.renderGallery();
    }

    renderGallery() {
        const gallery = document.getElementById('mediaGallery');
        if (!gallery) return;

        const filteredFiles = this.uploadedFiles.filter(file => {
            if (this.currentFilter === 'all') return true;
            return file.type === this.currentFilter;
        });

        gallery.innerHTML = filteredFiles.map((file, index) => `
            <div class="media-card" data-index="${index}" data-id="${file.id}">
                <div class="media-container">
                    ${file.type === 'image' ? 
                        `<img src="${file.src}" alt="${file.name}" loading="lazy">` :
                        `<video src="${file.src}" controls></video>`
                    }
                    <div class="media-overlay">
                        <div class="media-info">
                            <h3>${file.name}</h3>
                            <p>${file.size} • ${file.date}</p>
                        </div>
                        <div class="media-actions">
                            <button class="btn-view" onclick="mediaPlatform.openLightbox(${index})">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                </svg>
                            </button>
                            <button class="btn-download" onclick="mediaPlatform.downloadFile('${file.src}', '${file.name}')">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateStats();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderGallery();
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const mediaCards = document.querySelectorAll('.media-card');
        
        mediaCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    openLightbox(index) {
        const filteredFiles = this.uploadedFiles.filter(file => {
            if (this.currentFilter === 'all') return true;
            return file.type === this.currentFilter;
        });

        if (index >= filteredFiles.length) return;

        this.currentLightboxIndex = index;
        this.lightboxOpen = true;
        const file = filteredFiles[index];

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="mediaPlatform.closeLightbox()">&times;</button>
                <button class="lightbox-nav lightbox-prev" onclick="mediaPlatform.navigateLightbox(-1)">&#8249;</button>
                <button class="lightbox-nav lightbox-next" onclick="mediaPlatform.navigateLightbox(1)">&#8250;</button>
                <div class="lightbox-media">
                    ${file.type === 'image' ? 
                        `<img src="${file.src}" alt="${file.name}">` :
                        `<video src="${file.src}" controls autoplay></video>`
                    }
                </div>
                <div class="lightbox-info">
                    <h3>${file.name}</h3>
                    <p>${file.size} • ${file.date}</p>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Animate in
        anime({
            targets: lightbox,
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }

    closeLightbox() {
        const lightbox = document.querySelector('.lightbox');
        if (lightbox) {
            anime({
                targets: lightbox,
                opacity: [1, 0],
                duration: 200,
                easing: 'easeOutQuad',
                complete: () => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }
            });
        }
        this.lightboxOpen = false;
    }

    navigateLightbox(direction) {
        const filteredFiles = this.uploadedFiles.filter(file => {
            if (this.currentFilter === 'all') return true;
            return file.type === this.currentFilter;
        });

        const newIndex = this.currentLightboxIndex + direction;
        if (newIndex >= 0 && newIndex < filteredFiles.length) {
            this.closeLightbox();
            setTimeout(() => this.openLightbox(newIndex), 100);
        }
    }

    handleKeydown(e) {
        if (!this.lightboxOpen) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.navigateLightbox(-1);
                break;
            case 'ArrowRight':
                this.navigateLightbox(1);
                break;
        }
    }

    handleLightboxClick(e) {
        if (e.target.classList.contains('lightbox')) {
            this.closeLightbox();
        }
    }

    downloadFile(src, filename) {
        const link = document.createElement('a');
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    animateNewUpload() {
        const newCard = document.querySelector('.media-card');
        if (newCard) {
            anime({
                targets: newCard,
                scale: [0, 1],
                opacity: [0, 1],
                duration: 500,
                easing: 'easeOutBack'
            });
        }
    }

    initializeAnimations() {
        // Animate upload zone on hover
        const uploadZone = document.getElementById('uploadZone');
        if (uploadZone) {
            uploadZone.addEventListener('mouseenter', () => {
                anime({
                    targets: uploadZone,
                    scale: 1.02,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });

            uploadZone.addEventListener('mouseleave', () => {
                anime({
                    targets: uploadZone,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        duration: 600,
                        easing: 'easeOutQuad',
                        delay: Math.random() * 200
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.media-card, .stats-card').forEach(el => {
            observer.observe(el);
        });
    }

    updateStats() {
        const totalUploads = this.uploadedFiles.length;
        const imageCount = this.uploadedFiles.filter(f => f.type === 'image').length;
        const videoCount = this.uploadedFiles.filter(f => f.type === 'video').length;

        const statsElements = {
            totalUploads: document.getElementById('totalUploads'),
            imageCount: document.getElementById('imageCount'),
            videoCount: document.getElementById('videoCount')
        };

        Object.entries(statsElements).forEach(([key, element]) => {
            if (element) {
                let value;
                switch(key) {
                    case 'totalUploads': value = totalUploads; break;
                    case 'imageCount': value = imageCount; break;
                    case 'videoCount': value = videoCount; break;
                }
                
                anime({
                    targets: { count: 0 },
                    count: value,
                    duration: 1000,
                    easing: 'easeOutQuad',
                    update: function(anim) {
                        element.textContent = Math.round(anim.animatables[0].target.count);
                    }
                });
            }
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Enhanced MediaSharingPlatform with Language Support
class MultilingualMediaPlatform extends MediaSharingPlatform {
    constructor() {
        super();
        this.languageManager = new LanguageManager();
        this.initMultilingualFeatures();
    }

    initMultilingualFeatures() {
        // Override text content with translations
        this.updateUIText();
        
        // Listen for language changes
        document.addEventListener('languageChanged', () => {
            this.updateUIText();
            this.renderGallery(); // Re-render gallery with new language
        });
    }

    updateUIText() {
        // Update common UI elements
        const elements = {
            'hero-title': this.languageManager.getTranslation('heroTitle'),
            'hero-subtitle': this.languageManager.getTranslation('heroSubtitle'),
            'upload-zone-title': this.languageManager.getTranslation('dropFiles'),
            'upload-zone-text': this.languageManager.getTranslation('orClick'),
            'total-uploads-label': this.languageManager.getTranslation('totalUploads'),
            'image-count-label': this.languageManager.getTranslation('photos'),
            'video-count-label': this.languageManager.getTranslation('videos'),
            'featured-title': this.languageManager.getTranslation('featuredContent'),
            'gallery-title': this.languageManager.getTranslation('communityGallery'),
            'search-placeholder': this.languageManager.getTranslation('searchGallery'),
            'filter-all': this.languageManager.getTranslation('all'),
            'filter-images': this.languageManager.getTranslation('image'),
            'filter-videos': this.languageManager.getTranslation('video')
        };

        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    // Override renderGallery to use translated content
    renderGallery() {
        const gallery = document.getElementById('mediaGallery');
        if (!gallery) return;

        const filteredFiles = this.uploadedFiles.filter(file => {
            if (this.currentFilter === 'all') return true;
            return file.type === this.currentFilter;
        });

        gallery.innerHTML = filteredFiles.map((file, index) => `
            <div class="media-card" data-index="${index}" data-id="${file.id}">
                <div class="media-container">
                    ${file.type === 'image' ? 
                        `<img src="${file.src}" alt="${file.name}" loading="lazy">` :
                        `<video src="${file.src}" controls></video>`
                    }
                    <div class="media-overlay">
                        <div class="media-info">
                            <h3>${file.name}</h3>
                            <p>${file.size} • ${this.languageManager.formatDate(new Date(file.date))}</p>
                        </div>
                        <div class="media-actions">
                            <button class="btn-view" onclick="mediaPlatform.openLightbox(${index})" title="${this.languageManager.getTranslation('view')}">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                </svg>
                            </button>
                            <button class="btn-download" onclick="mediaPlatform.downloadFile('${file.src}', '${file.name}')" title="${this.languageManager.getTranslation('download')}">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateStats();
    }
}

// Initialize the platform when DOM is loaded
let mediaPlatform;
document.addEventListener('DOMContentLoaded', () => {
    mediaPlatform = new MediaSharingPlatform();
});

// Utility functions for other pages
function showComingSoon() {
    alert('Coming soon! This feature is under development.');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = 'Copied to clipboard!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    });
}