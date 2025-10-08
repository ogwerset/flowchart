/**
 * Interaktywna Aplikacja Diagramu Procesu Muzycznego
 * Używa PRAWDZIWEGO diagramu z pliku DrawIO użytkownika - 92 węzły!
 */

// ═══════════════════════════════════════════════════════════════════════════════════
//                           URLS DO PRAWDZIWYCH DANYCH
// ═══════════════════════════════════════════════════════════════════════════════════

const ASSETS = {
    svgUrl: 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/e468d6b50c033a9122ef67ff16b649af/0b62498c-725c-43b8-9c9f-ff979082f18f/7ff74188.svg',
    nodesDataUrl: 'https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/e468d6b50c033a9122ef67ff16b649af/d4f44252-8ca8-456d-98d5-6290c69d0d15/7424e60f.json'
};

// ═══════════════════════════════════════════════════════════════════════════════════
//                               GŁÓWNA KLASA APLIKACJI
// ═══════════════════════════════════════════════════════════════════════════════════

class InteractiveDiagram {
    constructor() {
        this.panZoom = null;
        this.currentActiveNode = null;
        this.isPanelOpen = false;
        this.isMobile = window.innerWidth <= 768;
        this.touchStartY = 0;
        this.touchCurrentY = 0;
        this.isDragging = false;
        this.nodesData = [];
        
        // DOM elementy
        this.svgElement = null;
        this.svgContainer = null;
        this.sidePanel = null;
        this.panelBackdrop = null;
        this.loadingElement = null;
        
        this.init();
    }

    /**
     * Inicjalizacja aplikacji
     */
    async init() {
        try {
            console.log('🚀 Inicjalizacja aplikacji z prawdziwym diagramem...');
            
            this.setupDOM();
            
            // Załaduj prawdziwe dane
            await this.loadRealData();
            
            this.setupEventListeners();
            this.setupPanZoom();
            this.setupNodeInteractions();
            this.hideLoading();
            
            console.log('✅ Aplikacja z prawdziwym diagramem załadowana!');
            console.log(`📊 Załadowano ${this.nodesData.length} węzłów`);
        } catch (error) {
            console.error('❌ Błąd podczas inicjalizacji:', error);
            this.showError('Wystąpił błąd podczas ładowania prawdziwego diagramu');
        }
    }

    /**
     * Konfiguracja referencji DOM
     */
    setupDOM() {
        this.svgContainer = document.getElementById('svg-container');
        this.sidePanel = document.getElementById('side-panel');
        this.panelBackdrop = document.getElementById('panel-backdrop');
        this.loadingElement = document.getElementById('loading');
        
        if (!this.svgContainer) {
            throw new Error('Kontener SVG nie został znaleziony');
        }
        
        console.log('🔧 DOM skonfigurowany');
    }

    /**
     * Załaduj prawdziwe dane z assetów
     */
    async loadRealData() {
        try {
            console.log('📥 Ładowanie prawdziwego diagramu SVG...');
            
            // Załaduj SVG
            const svgResponse = await fetch(ASSETS.svgUrl);
            if (!svgResponse.ok) {
                throw new Error(`Błąd ładowania SVG: ${svgResponse.status}`);
            }
            const svgText = await svgResponse.text();
            
            // Załaduj dane węzłów
            console.log('📥 Ładowanie danych węzłów...');
            const nodesResponse = await fetch(ASSETS.nodesDataUrl);
            if (!nodesResponse.ok) {
                throw new Error(`Błąd ładowania danych węzłów: ${nodesResponse.status}`);
            }
            this.nodesData = await nodesResponse.json();
            
            // Wstaw SVG do DOM
            this.insertSVG(svgText);
            
            console.log(`✅ Załadowano prawdziwy diagram z ${this.nodesData.length} węzłami`);
            
        } catch (error) {
            console.error('❌ Błąd ładowania danych:', error);
            throw error;
        }
    }

    /**
     * Wstaw SVG do DOM i przygotuj do interakcji
     */
    insertSVG(svgText) {
        // Usuń placeholder
        const placeholder = document.getElementById('svg-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        // Wstaw SVG
        this.svgContainer.innerHTML = svgText;
        
        // Znajdź element SVG
        this.svgElement = this.svgContainer.querySelector('svg');
        
        if (!this.svgElement) {
            throw new Error('Nie znaleziono elementu SVG w załadowanych danych');
        }
        
        // Dodaj ID dla svg-pan-zoom
        this.svgElement.id = 'main-svg';
        
        console.log('🎨 SVG został wstawiony do DOM');
    }

    /**
     * Konfiguracja nasłuchiwania zdarzeń
     */
    setupEventListeners() {
        // Zamykanie panelu
        const closeButton = document.getElementById('close-panel');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closePanel());
        }

        // Kliknięcie w backdrop zamyka panel
        if (this.panelBackdrop) {
            this.panelBackdrop.addEventListener('click', () => this.closePanel());
        }

        // Nawigacja klawiaturą
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Przyciski zoom
        this.setupZoomControls();

        // Obsługa zmiany rozmiaru okna
        window.addEventListener('resize', () => this.handleResize());

        // Gesty dotykowe na mobile
        this.setupTouchGestures();

        console.log('🎧 Event listenery skonfigurowane');
    }

    /**
     * Konfiguracja kontrolek zoom
     */
    setupZoomControls() {
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const resetZoomBtn = document.getElementById('reset-zoom');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (this.panZoom) this.panZoom.zoomIn();
            });
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (this.panZoom) this.panZoom.zoomOut();
            });
        }
        
        if (resetZoomBtn) {
            resetZoomBtn.addEventListener('click', () => {
                if (this.panZoom) {
                    this.panZoom.fit();
                    this.panZoom.center();
                }
            });
        }
    }

    /**
     * Konfiguracja pan i zoom z svg-pan-zoom
     */
    setupPanZoom() {
        if (typeof svgPanZoom === 'undefined') {
            console.error('❌ Biblioteka svg-pan-zoom nie została załadowana');
            return;
        }

        if (!this.svgElement) {
            console.error('❌ Element SVG nie istnieje');
            return;
        }

        try {
            this.panZoom = svgPanZoom('#main-svg', {
                zoomEnabled: true,
                controlIconsEnabled: false,
                fit: true,
                center: true,
                minZoom: 0.1,
                maxZoom: 10,
                zoomScaleSensitivity: 0.3,
                dblClickZoomEnabled: true,
                mouseWheelZoomEnabled: true,
                preventMouseEventsDefault: false,
                beforeZoom: () => {
                    // Logika przed zoomem
                },
                onZoom: (level) => {
                    // console.log('🔍 Poziom zoom:', level.toFixed(2));
                }
            });
            
            console.log('🔍 Pan & Zoom skonfigurowane dla prawdziwego diagramu');
        } catch (error) {
            console.error('❌ Błąd konfiguracji pan-zoom:', error);
        }
    }

    /**
     * Konfiguracja interakcji z węzłami
     */
    setupNodeInteractions() {
        const nodeElements = document.querySelectorAll('.node-element');
        
        if (nodeElements.length === 0) {
            console.warn('⚠️ Nie znaleziono elementów węzłów w prawdziwym diagramie');
            return;
        }
        
        nodeElements.forEach((node, index) => {
            // Hover efekty
            node.addEventListener('mouseenter', (e) => this.handleNodeHover(e, true));
            node.addEventListener('mouseleave', (e) => this.handleNodeHover(e, false));
            
            // Obsługa kliknięć
            node.addEventListener('click', (e) => this.handleNodeClick(e));
            
            // Obsługa klawiatury
            node.setAttribute('tabindex', '0');
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleNodeClick(e);
                }
            });

            // Obsługa dotyku na mobile
            node.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleNodeClick(e);
            });
        });
        
        console.log(`🎯 Skonfigurowano interakcje dla ${nodeElements.length} węzłów z prawdziwego diagramu`);
    }

    /**
     * Obsługa hover na węzłach
     */
    handleNodeHover(event, isHover) {
        const node = event.target.closest('.node-element');
        if (!node || node.classList.contains('node-active')) return;
        
        if (isHover) {
            node.style.cursor = 'pointer';
        } else {
            node.style.cursor = 'default';
        }
    }

    /**
     * Obsługa kliknięcia węzła
     */
    handleNodeClick(event) {
        event.stopPropagation();
        
        const node = event.target.closest('.node-element');
        if (!node) return;

        const nodeId = node.getAttribute('data-node-id');
        if (!nodeId) {
            console.warn('⚠️ Węzeł nie ma ID:', node);
            return;
        }

        console.log('🎯 Kliknięto węzeł z prawdziwego diagramu:', nodeId);
        
        this.selectNode(nodeId, node);
        this.showPanel(nodeId);
    }

    /**
     * Wybór i podświetlenie węzła
     */
    selectNode(nodeId, nodeElement) {
        // Usuń poprzednie podświetlenie
        if (this.currentActiveNode) {
            this.currentActiveNode.classList.remove('node-active');
        }

        // Dodaj podświetlenie do nowego węzła
        nodeElement.classList.add('node-active');
        this.currentActiveNode = nodeElement;

        console.log('✨ Aktywny węzeł z prawdziwego diagramu:', nodeId);
    }

    /**
     * Pokaż panel z danymi węzła
     */
    showPanel(nodeId) {
        const nodeData = this.getNodeData(nodeId);
        
        if (!nodeData) {
            console.error('❌ Nie znaleziono danych dla węzła:', nodeId);
            // Pokaż podstawowe info
            this.populatePanel({
                id: nodeId,
                title: `Węzeł ${nodeId}`,
                description: 'Dane dla tego węzła nie są dostępne w aktualnej wersji aplikacji.',
                attachments: [],
                links: []
            });
        } else {
            this.populatePanel(nodeData);
        }

        this.openPanel();
    }

    /**
     * Pobierz dane węzła po ID
     */
    getNodeData(nodeId) {
        return this.nodesData.find(node => node.id === nodeId);
    }

    /**
     * Wypełnij panel danymi węzła
     */
    populatePanel(nodeData) {
        // Aktualizuj tytuł
        const titleElement = document.getElementById('panel-title');
        if (titleElement) {
            titleElement.textContent = nodeData.title || `Węzeł ${nodeData.id}`;
        }

        // Aktualizuj opis
        const descriptionElement = document.getElementById('panel-description');
        if (descriptionElement) {
            descriptionElement.textContent = nodeData.description || 'Brak opisu dla tego węzła.';
        }

        // Aktualizuj załączniki
        const attachmentsElement = document.getElementById('panel-attachments');
        if (attachmentsElement) {
            this.populateAttachments(attachmentsElement, nodeData.attachments);
        }

        // Aktualizuj linki
        const linksElement = document.getElementById('panel-links');
        if (linksElement) {
            this.populateLinks(linksElement, nodeData.links);
        }
    }

    /**
     * Wypełnij listę załączników
     */
    populateAttachments(container, attachments) {
        container.innerHTML = '';
        
        if (!attachments || attachments.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; flex-shrink: 0;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Brak załączników
            `;
            container.appendChild(emptyItem);
            return;
        }

        attachments.forEach(attachment => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; flex-shrink: 0;">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                <span>${attachment}</span>
            `;
            container.appendChild(listItem);
        });
    }

    /**
     * Wypełnij listę linków
     */
    populateLinks(container, links) {
        container.innerHTML = '';
        
        if (!links || links.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; flex-shrink: 0;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Brak powiązanych linków
            `;
            container.appendChild(emptyItem);
            return;
        }

        links.forEach(link => {
            const listItem = document.createElement('li');
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            linkElement.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; flex-shrink: 0;">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>${this.formatUrl(link)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: auto; flex-shrink: 0;">
                    <path d="M7 17L17 7"></path>
                    <path d="M7 7h10v10"></path>
                </svg>
            `;
            listItem.appendChild(linkElement);
            container.appendChild(listItem);
        });
    }

    /**
     * Formatowanie URL do wyświetlenia
     */
    formatUrl(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '');
            const pathname = urlObj.pathname === '/' ? '' : urlObj.pathname;
            return hostname + pathname;
        } catch {
            return url.length > 40 ? url.substring(0, 40) + '...' : url;
        }
    }

    /**
     * Otwórz panel boczny
     */
    openPanel() {
        if (this.isPanelOpen) return;

        this.isPanelOpen = true;
        this.sidePanel.classList.add('side-panel--open');
        this.panelBackdrop.classList.add('panel-backdrop--visible');
        
        // Zarządzanie focusem
        setTimeout(() => {
            const closeButton = document.getElementById('close-panel');
            if (closeButton) {
                closeButton.focus();
            }
        }, 300);

        // Zapobiegnij scroll na mobile
        if (this.isMobile) {
            document.body.style.overflow = 'hidden';
        }

        console.log('📱 Panel otwarty');
    }

    /**
     * Zamknij panel boczny
     */
    closePanel() {
        if (!this.isPanelOpen) return;

        this.isPanelOpen = false;
        this.sidePanel.classList.remove('side-panel--open');
        this.panelBackdrop.classList.remove('panel-backdrop--visible');

        // Usuń podświetlenie węzła
        if (this.currentActiveNode) {
            this.currentActiveNode.classList.remove('node-active');
            this.currentActiveNode = null;
        }

        // Przywróć scroll
        if (this.isMobile) {
            document.body.style.overflow = '';
        }

        console.log('📱 Panel zamknięty');
    }

    /**
     * Obsługa gestów dotykowych na mobile
     */
    setupTouchGestures() {
        if (!this.sidePanel) return;

        this.sidePanel.addEventListener('touchstart', (e) => {
            if (!this.isMobile) return;
            this.touchStartY = e.touches[0].clientY;
            this.isDragging = true;
        });

        this.sidePanel.addEventListener('touchmove', (e) => {
            if (!this.isMobile || !this.isDragging) return;
            this.touchCurrentY = e.touches[0].clientY;
            const deltaY = this.touchCurrentY - this.touchStartY;
            
            if (deltaY > 0) {
                e.preventDefault();
                const translateY = Math.min(deltaY, 150);
                this.sidePanel.style.transform = `translateY(${translateY}px)`;
                
                // Zmniejsz opacity backdrop proporcjonalnie
                const opacity = Math.max(0.5 - (deltaY / 300), 0);
                this.panelBackdrop.style.opacity = opacity;
            }
        });

        this.sidePanel.addEventListener('touchend', () => {
            if (!this.isMobile || !this.isDragging) return;
            this.isDragging = false;
            
            const deltaY = this.touchCurrentY - this.touchStartY;
            if (deltaY > 100) {
                this.closePanel();
            }
            
            // Reset stylów
            this.sidePanel.style.transform = '';
            this.panelBackdrop.style.opacity = '';
        });
    }

    /**
     * Obsługa nawigacji klawiaturą
     */
    handleKeyboard(event) {
        if (event.key === 'Escape' && this.isPanelOpen) {
            this.closePanel();
        }
    }

    /**
     * Obsługa zmiany rozmiaru okna
     */
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            // Odśwież pan-zoom przy zmianie orientacji
            if (this.panZoom) {
                setTimeout(() => {
                    this.panZoom.fit();
                    this.panZoom.center();
                }, 100);
            }
            
            // Zamknij panel przy zmianie na desktop jeśli był otwarty
            if (!this.isMobile && this.isPanelOpen) {
                this.closePanel();
            }
        }
    }

    /**
     * Pokaż wskaźnik ładowania
     */
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.remove('hidden');
        }
    }

    /**
     * Ukryj wskaźnik ładowania
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hidden');
        }
    }

    /**
     * Pokaż komunikat o błędzie
     */
    showError(message) {
        console.error('❌', message);
        this.hideLoading();
        
        // Pokaż błąd użytkownikowi
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%, -50%);
                background: var(--color-surface);
                border: 2px solid var(--color-error);
                border-radius: var(--radius-lg);
                padding: var(--space-24);
                max-width: 500px;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                text-align: center;
            ">
                <h3 style="color: var(--color-error); margin-bottom: var(--space-16);">Błąd ładowania</h3>
                <p style="margin-bottom: var(--space-16);">${message}</p>
                <button onclick="window.location.reload()" class="btn btn--primary">
                    Odśwież stronę
                </button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                               INICJALIZACJA APLIKACJI
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * Inicjalizacja gdy DOM jest gotowy
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Uruchamianie Interaktywnego Diagramu z PRAWDZIWYMI danymi...');
    
    // Sprawdź czy svg-pan-zoom zostało załadowane
    if (typeof svgPanZoom === 'undefined') {
        console.error('❌ Biblioteka svg-pan-zoom nie została załadowana');
        alert('Wystąpił błąd podczas ładowania biblioteki zoom. Sprawdź połączenie internetowe i odśwież stronę.');
        return;
    }

    // Inicjalizuj aplikację
    try {
        window.diagramApp = new InteractiveDiagram();
        console.log('🎉 Aplikacja z prawdziwymi danymi gotowa!');
    } catch (error) {
        console.error('❌ Błąd krytyczny podczas inicjalizacji:', error);
        alert('Wystąpił błąd krytyczny. Odśwież stronę i spróbuj ponownie.');
    }
});

// Export dla potencjalnego użycia zewnętrznego
window.InteractiveDiagram = InteractiveDiagram;

console.log('📋 Skrypt prawdziwego diagramu załadowany, oczekiwanie na DOM...');