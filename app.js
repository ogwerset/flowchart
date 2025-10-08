/**
 * FlowChart Pro - Premium Interactive Flowchart Application
 * Professional process diagram with advanced interactions
 * Version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════════════════════
//                           EDITABLE DATA CONFIGURATION
//                          MODIFY THESE SETTINGS AS NEEDED
// ═══════════════════════════════════════════════════════════════════════════════════

const FLOWCHART_CONFIG = {
    // Application metadata
    app: {
        name: "FlowChart Pro",
        version: "1.0.0",
        description: "Professional Interactive Process Flowchart Application",
        lastModified: "2025-01-08"
    },

    // Node data - EDIT THIS TO CHANGE PANEL CONTENT
    nodes: [
        {
            id: "node_001",
            title: "Manager",
            description: "Osoba odpowiedzialna za zarządzanie projektem muzycznym, koordynację zespołu i nadzór nad całym procesem produkcji. Manager planuje budżet, harmonogram i nadzoruje realizację wszystkich etapów projektu.",
            attachments: [
                "umowa_managerska.pdf",
                "harmonogram_projektu.xlsx", 
                "budżet_projektu.xlsx",
                "kontakty_zespolu.xlsx"
            ],
            links: [
                "https://musicmanagement.com/best-practices",
                "https://projecttools.com/music-industry"
            ]
        },
        {
            id: "node_002", 
            title: "Master",
            description: "Końcowa, zmasterowana wersja nagrania gotowa do dystrybucji na wszystkich platformach streamingowych. Master zawiera wszystkie finalne poprawki techniczne i artystyczne.",
            attachments: [
                "master_final_24bit.wav",
                "master_streaming_16bit.wav",
                "technical_specifications.pdf",
                "quality_checklist.pdf"
            ],
            links: [
                "https://mastering-standards.com/streaming",
                "https://audioengineering.com/mastering-guide"
            ]
        },
        {
            id: "node_003",
            title: "Artysta",
            description: "Główny twórca i wykonawca projektu muzycznego. Odpowiedzialny za treść artystyczną, wykonanie, wizerunek i finalne decyzje kreatywne dotyczące całego projektu.",
            attachments: [
                "biografia_artysty.pdf",
                "umowa_artystyczna.pdf", 
                "rider_techniczny.pdf",
                "portfolio_muzyczne.zip"
            ],
            links: [
                "https://artist-portfolio.com",
                "https://social-media-kit.com",
                "https://streaming-profiles.com"
            ]
        },
        {
            id: "node_004",
            title: "Project Manager",
            description: "Koordynator wszystkich aspektów projektu muzycznego - od planowania początkowego przez realizację po finalizację i dystrybucję. Odpowiada za terminowe wykonanie zadań przez wszystkie departamenty.",
            attachments: [
                "plan_projektu_gantt.pdf",
                "timeline_milestones.xlsx",
                "contacts_database.xlsx",
                "risk_management.pdf"
            ],
            links: [
                "https://project-management-tools.com",
                "https://musicindustry-pm.com"
            ]
        },
        {
            id: "node_005",
            title: "Zdjęcia",
            description: "Profesjonalna sesja fotograficzna do celów promocyjnych - zdjęcia artysty, materiały do okładki, content na social media i wszystkie potrzebne materiały wizualne do kampanii marketingowej.",
            attachments: [
                "brief_fotograficzny.pdf",
                "przykładowe_zdjęcia_RAW.zip",
                "wymagania_techniczne.pdf",
                "moodboard_sesji.pdf"
            ],
            links: [
                "https://photography-guidelines.com",
                "https://music-photography.com"
            ]
        }
    ],

    // UI Configuration
    settings: {
        theme: "light", // "light" or "dark"
        showMinimap: true,
        animationSpeed: "normal", // "slow", "normal", "fast"
        panelWidth: 420,
        minimapSize: { width: 240, height: 180 }
    },

    // Animation settings
    animations: {
        panelSlide: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        nodeHover: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        themeTransition: "0.25s ease"
    },

    // Zoom configuration
    zoom: {
        min: 0.3,
        max: 4.0,
        step: 0.2,
        wheelSensitivity: 0.3
    }
};

// ═══════════════════════════════════════════════════════════════════════════════════
//                               MAIN APPLICATION CLASS
// ═══════════════════════════════════════════════════════════════════════════════════

class FlowChartPro {
    constructor() {
        // Core properties
        this.panZoom = null;
        this.currentActiveNode = null;
        this.isPanelOpen = false;
        this.isMobile = window.innerWidth <= 768;
        this.currentTheme = this.loadTheme();
        
        // DOM elements
        this.svgElement = null;
        this.sidePanel = null;
        this.panelBackdrop = null;
        this.minimap = null;
        this.minimapSvg = null;
        this.viewportIndicator = null;
        
        // State management
        this.state = {
            isMinimapVisible: FLOWCHART_CONFIG.settings.showMinimap,
            currentZoom: 1,
            nodeCount: FLOWCHART_CONFIG.nodes.length
        };

        // Initialize application
        this.init();
    }

    /**
     * Initialize the complete application
     */
    async init() {
        try {
            this.showLoading();
            
            // Setup phases
            await this.setupDOM();
            this.applyTheme(this.currentTheme);
            this.setupEventListeners();
            this.setupPanZoom();
            this.setupNodeInteractions();
            this.setupMinimap();
            this.updateStatusBar();
            
            this.hideLoading();
            this.logSuccess('FlowChart Pro initialized successfully');
            
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError('Failed to initialize FlowChart Pro. Please refresh the page.');
        }
    }

    /**
     * Setup DOM references and validate structure
     */
    async setupDOM() {
        const elements = {
            svgElement: 'main-svg',
            sidePanel: 'side-panel',
            panelBackdrop: 'panel-backdrop',
            minimap: 'minimap',
            minimapSvg: 'minimap-svg',
            viewportIndicator: 'viewport-indicator'
        };

        for (const [prop, id] of Object.entries(elements)) {
            this[prop] = document.getElementById(id);
            if (!this[prop]) {
                throw new Error(`Required element not found: ${id}`);
            }
        }

        // Validate SVG structure
        if (!this.svgElement.querySelector('#nodes-group')) {
            throw new Error('SVG structure invalid: missing nodes-group');
        }
    }

    /**
     * Setup comprehensive event listeners
     */
    setupEventListeners() {
        // Panel controls
        this.setupPanelControls();
        
        // Theme and UI controls
        this.setupUIControls();
        
        // Zoom controls
        this.setupZoomControls();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window events
        this.setupWindowEvents();
        
        // Touch gestures for mobile
        this.setupTouchGestures();
    }

    /**
     * Setup panel-specific controls
     */
    setupPanelControls() {
        const closeButton = document.getElementById('close-panel');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closePanel());
        }

        if (this.panelBackdrop) {
            this.panelBackdrop.addEventListener('click', () => this.closePanel());
        }
    }

    /**
     * Setup UI controls (theme, minimap, etc.)
     */
    setupUIControls() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Minimap toggle - FIXED
        const minimapToggle = document.getElementById('toggle-minimap');
        if (minimapToggle) {
            minimapToggle.addEventListener('click', () => this.toggleMinimap());
        }

        // Minimap close - FIXED
        const minimapClose = document.getElementById('close-minimap');
        if (minimapClose) {
            minimapClose.addEventListener('click', () => this.toggleMinimap());
        }
    }

    /**
     * Setup zoom controls with keyboard shortcuts
     */
    setupZoomControls() {
        const controls = [
            { id: 'zoom-in', action: () => this.zoomIn() },
            { id: 'zoom-out', action: () => this.zoomOut() },
            { id: 'reset-zoom', action: () => this.resetZoom() }
        ];

        controls.forEach(({ id, action }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', action);
            }
        });
    }

    /**
     * Setup keyboard navigation and shortcuts
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Handle panel close
            if (e.key === 'Escape' && this.isPanelOpen) {
                e.preventDefault();
                this.closePanel();
                return;
            }

            // Handle zoom shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '=':
                    case '+':
                        e.preventDefault();
                        this.zoomIn();
                        break;
                    case '-':
                        e.preventDefault();
                        this.zoomOut();
                        break;
                    case '0':
                        e.preventDefault();
                        this.resetZoom();
                        break;
                }
            }

            // Theme toggle shortcut
            if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * Setup window events (resize, etc.)
     */
    setupWindowEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 150);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.panZoom) {
                this.panZoom.resize();
            }
        });
    }

    /**
     * Setup pan-zoom functionality with advanced configuration
     */
    setupPanZoom() {
        if (typeof svgPanZoom === 'undefined') {
            throw new Error('svg-pan-zoom library not loaded');
        }

        this.panZoom = svgPanZoom('#main-svg', {
            zoomEnabled: true,
            controlIconsEnabled: false,
            fit: true,
            center: true,
            minZoom: FLOWCHART_CONFIG.zoom.min,
            maxZoom: FLOWCHART_CONFIG.zoom.max,
            zoomScaleSensitivity: FLOWCHART_CONFIG.zoom.wheelSensitivity,
            dblClickZoomEnabled: false,
            mouseWheelZoomEnabled: true,
            preventMouseEventsDefault: true,
            beforeZoom: (oldScale, newScale) => {
                this.state.currentZoom = newScale;
                return true;
            },
            onZoom: (scale) => {
                this.updateStatusBar();
                this.updateMinimapViewport();
            },
            onPan: () => {
                this.updateMinimapViewport();
            }
        });

        this.logSuccess('Pan-zoom initialized');
    }

    /**
     * Setup premium node interactions
     */
    setupNodeInteractions() {
        const nodeElements = document.querySelectorAll('.node-element');
        
        nodeElements.forEach(node => {
            // Enhanced hover effects
            node.addEventListener('mouseenter', (e) => this.handleNodeHover(e, true));
            node.addEventListener('mouseleave', (e) => this.handleNodeHover(e, false));
            
            // Click with premium feedback
            node.addEventListener('click', (e) => this.handleNodeClick(e));
            
            // Touch events for mobile
            node.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            node.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            
            // Keyboard accessibility
            node.setAttribute('tabindex', '0');
            node.setAttribute('role', 'button');
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleNodeClick(e);
                }
            });
        });
        
        this.logSuccess(`Node interactions configured for ${nodeElements.length} nodes`);
    }

    /**
     * Enhanced node hover handling
     */
    handleNodeHover(event, isEntering) {
        const node = event.target.closest('.node-element');
        if (!node || node.classList.contains('node-active')) return;

        if (isEntering) {
            node.style.cursor = 'pointer';
            // Add premium hover effect is handled by CSS
        }
    }

    /**
     * Premium node click handling with animations
     */
    handleNodeClick(event) {
        event.stopPropagation();
        const node = event.target.closest('.node-element');
        
        if (!node) return;

        const nodeId = node.getAttribute('data-node-id');
        if (!nodeId) {
            this.logWarning('Node missing data-node-id attribute', node);
            return;
        }

        // Add click feedback animation
        this.addClickFeedback(node);
        
        // Select node and show panel
        this.selectNode(nodeId, node);
        this.showPanel(nodeId);
        
        this.logInfo(`Node selected: ${nodeId}`);
    }

    /**
     * Add premium click feedback animation
     */
    addClickFeedback(node) {
        node.style.transform = 'scale(0.95)';
        setTimeout(() => {
            node.style.transform = '';
        }, 100);
    }

    /**
     * Select and highlight node with premium styling
     */
    selectNode(nodeId, nodeElement) {
        // Remove previous selection
        if (this.currentActiveNode) {
            this.currentActiveNode.classList.remove('node-active');
        }

        // Add premium selection styling
        nodeElement.classList.add('node-active');
        this.currentActiveNode = nodeElement;
    }

    /**
     * Show side panel with smooth animations
     */
    showPanel(nodeId) {
        const nodeData = this.getNodeData(nodeId);
        
        if (!nodeData) {
            this.logError(`Node data not found: ${nodeId}`);
            return;
        }

        this.populatePanel(nodeData);
        this.openPanel();
    }

    /**
     * Get node data from configuration
     */
    getNodeData(nodeId) {
        return FLOWCHART_CONFIG.nodes.find(node => node.id === nodeId);
    }

    /**
     * Populate panel with rich content
     */
    populatePanel(nodeData) {
        // Update title with icon
        const titleElement = document.getElementById('panel-title');
        if (titleElement) {
            titleElement.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
                ${nodeData.title}
            `;
        }

        // Update description
        const descriptionElement = document.getElementById('panel-description');
        if (descriptionElement) {
            descriptionElement.textContent = nodeData.description;
        }

        // Update attachments with premium styling
        const attachmentsElement = document.getElementById('panel-attachments');
        if (attachmentsElement) {
            this.populateAttachments(attachmentsElement, nodeData.attachments);
        }

        // Update links with rich previews
        const linksElement = document.getElementById('panel-links');
        if (linksElement) {
            this.populateLinks(linksElement, nodeData.links);
        }
    }

    /**
     * Populate attachments with file type icons
     */
    populateAttachments(container, attachments) {
        container.innerHTML = '';
        
        if (!attachments || attachments.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Brak załączników
            `;
            container.appendChild(emptyItem);
            return;
        }

        attachments.forEach((attachment, index) => {
            const listItem = document.createElement('li');
            const fileIcon = this.getFileIcon(attachment);
            
            listItem.innerHTML = `
                ${fileIcon}
                <span>${attachment}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: auto; opacity: 0.5;">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
            `;
            
            // Add staggered animation
            listItem.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(listItem);
        });
    }

    /**
     * Get appropriate file icon based on extension
     */
    getFileIcon(filename) {
        const ext = filename.split('.').pop()?.toLowerCase();
        const iconMap = {
            pdf: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>`,
            xlsx: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                     <polyline points="14,2 14,8 20,8"/>
                     <line x1="8" y1="13" x2="16" y2="13"/>
                     <line x1="8" y1="17" x2="16" y2="17"/>
                   </svg>`,
            wav: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>`
        };
        
        return iconMap[ext] || iconMap.pdf;
    }

    /**
     * Populate links with rich previews
     */
    populateLinks(container, links) {
        container.innerHTML = '';
        
        if (!links || links.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Brak linków
            `;
            container.appendChild(emptyItem);
            return;
        }

        links.forEach((link, index) => {
            const listItem = document.createElement('li');
            const linkElement = document.createElement('a');
            linkElement.href = link;
            linkElement.target = '_blank';
            linkElement.rel = 'noopener noreferrer';
            linkElement.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span>${this.formatUrl(link)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: auto; opacity: 0.6;">
                    <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
            `;
            
            listItem.appendChild(linkElement);
            listItem.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(listItem);
        });
    }

    /**
     * Format URL for display
     */
    formatUrl(url) {
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname !== '/' ? urlObj.pathname : '';
            return urlObj.hostname + path;
        } catch {
            return url.length > 40 ? url.substring(0, 40) + '...' : url;
        }
    }

    /**
     * Open panel with premium animations
     */
    openPanel() {
        if (this.isPanelOpen) return;

        this.isPanelOpen = true;
        this.sidePanel.classList.add('side-panel--open');
        this.panelBackdrop.classList.add('panel-backdrop--visible');
        
        // Focus management for accessibility
        setTimeout(() => {
            const closeButton = document.getElementById('close-panel');
            if (closeButton) closeButton.focus();
        }, 300);

        // Prevent body scroll on mobile
        if (this.isMobile) {
            document.body.style.overflow = 'hidden';
        }

        this.logInfo('Side panel opened');
    }

    /**
     * Close panel with cleanup
     */
    closePanel() {
        if (!this.isPanelOpen) return;

        this.isPanelOpen = false;
        this.sidePanel.classList.remove('side-panel--open');
        this.panelBackdrop.classList.remove('panel-backdrop--visible');

        // Remove node selection
        if (this.currentActiveNode) {
            this.currentActiveNode.classList.remove('node-active');
            this.currentActiveNode = null;
        }

        // Restore body scroll
        if (this.isMobile) {
            document.body.style.overflow = '';
        }

        this.logInfo('Side panel closed');
    }

    /**
     * Setup advanced minimap functionality
     */
    setupMinimap() {
        if (!this.minimap || !this.minimapSvg) return;

        // Make minimap clickable for navigation
        this.minimapSvg.addEventListener('click', (e) => {
            this.handleMinimapClick(e);
        });

        // Update initial viewport
        this.updateMinimapViewport();
        
        // Set initial visibility based on state
        this.updateMinimapVisibility();

        this.logSuccess('Minimap initialized');
    }

    /**
     * Update minimap visibility based on state
     */
    updateMinimapVisibility() {
        if (this.state.isMinimapVisible) {
            this.minimap.classList.remove('hidden');
        } else {
            this.minimap.classList.add('hidden');
        }
    }

    /**
     * Handle minimap click for navigation
     */
    handleMinimapClick(e) {
        if (!this.panZoom) return;

        const rect = this.minimapSvg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert minimap coordinates to main SVG coordinates
        const svgPoint = this.minimapSvg.createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;
        
        const ctm = this.minimapSvg.getScreenCTM().inverse();
        const transformedPoint = svgPoint.matrixTransform(ctm);
        
        // Pan to clicked location
        this.panZoom.pan({
            x: -transformedPoint.x * this.state.currentZoom + window.innerWidth / 2,
            y: -transformedPoint.y * this.state.currentZoom + window.innerHeight / 2
        });

        this.logInfo(`Navigated to: ${transformedPoint.x}, ${transformedPoint.y}`);
    }

    /**
     * Update minimap viewport indicator
     */
    updateMinimapViewport() {
        if (!this.viewportIndicator || !this.panZoom) return;

        const pan = this.panZoom.getPan();
        const zoom = this.panZoom.getZoom();
        const sizes = this.panZoom.getSizes();
        
        // Calculate viewport rectangle
        const viewportWidth = sizes.width / zoom;
        const viewportHeight = sizes.height / zoom;
        const viewportX = -pan.x / zoom;
        const viewportY = -pan.y / zoom;
        
        // Update viewport indicator
        this.viewportIndicator.setAttribute('x', viewportX);
        this.viewportIndicator.setAttribute('y', viewportY);
        this.viewportIndicator.setAttribute('width', viewportWidth);
        this.viewportIndicator.setAttribute('height', viewportHeight);
    }

    /**
     * Toggle minimap visibility - FIXED
     */
    toggleMinimap() {
        this.state.isMinimapVisible = !this.state.isMinimapVisible;
        this.updateMinimapVisibility();
        this.logInfo(`Minimap ${this.state.isMinimapVisible ? 'shown' : 'hidden'}`);
    }

    /**
     * Theme management
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
        this.logInfo(`Theme changed to: ${newTheme}`);
    }

    /**
     * Apply theme with smooth transitions
     */
    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        // Update theme toggle icon
        const lightIcon = document.querySelector('.theme-icon--light');
        const darkIcon = document.querySelector('.theme-icon--dark');
        
        if (theme === 'dark') {
            lightIcon?.classList.add('hidden');
            darkIcon?.classList.remove('hidden');
        } else {
            lightIcon?.classList.remove('hidden');
            darkIcon?.classList.add('hidden');
        }
    }

    /**
     * Load theme from localStorage
     */
    loadTheme() {
        const saved = localStorage.getItem('flowchart-theme');
        if (saved && ['light', 'dark'].includes(saved)) {
            return saved;
        }
        
        // Default to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Save theme to localStorage
     */
    saveTheme(theme) {
        try {
            localStorage.setItem('flowchart-theme', theme);
        } catch (e) {
            this.logWarning('Could not save theme preference', e);
        }
    }

    /**
     * Setup touch gestures for mobile
     */
    setupTouchGestures() {
        if (!this.sidePanel) return;

        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        this.sidePanel.addEventListener('touchstart', (e) => {
            if (!this.isMobile || !this.isPanelOpen) return;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        this.sidePanel.addEventListener('touchmove', (e) => {
            if (!this.isMobile || !isDragging) return;
            currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;
            
            if (deltaY > 0) {
                const transform = Math.min(deltaY * 0.5, 100);
                this.sidePanel.style.transform = `translateY(${transform}px)`;
            }
        }, { passive: true });

        this.sidePanel.addEventListener('touchend', () => {
            if (!this.isMobile || !isDragging) return;
            isDragging = false;
            
            const deltaY = currentY - startY;
            if (deltaY > 80) {
                this.closePanel();
            }
            
            this.sidePanel.style.transform = '';
        }, { passive: true });
    }

    /**
     * Handle touch events for nodes
     */
    handleTouchStart(e) {
        if (!this.isMobile) return;
        e.preventDefault();
        
        const node = e.target.closest('.node-element');
        if (node) {
            node.style.transform = 'scale(0.95)';
        }
    }

    handleTouchEnd(e) {
        if (!this.isMobile) return;
        
        const node = e.target.closest('.node-element');
        if (node) {
            setTimeout(() => {
                node.style.transform = '';
            }, 100);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (this.panZoom) {
            this.panZoom.resize();
            this.panZoom.fit();
            this.panZoom.center();
        }
        
        if (wasMobile !== this.isMobile) {
            this.logInfo(`Layout changed to: ${this.isMobile ? 'mobile' : 'desktop'}`);
        }
    }

    /**
     * Zoom controls
     */
    zoomIn() {
        if (this.panZoom) {
            this.panZoom.zoomIn();
            this.logInfo('Zoomed in');
        }
    }

    zoomOut() {
        if (this.panZoom) {
            this.panZoom.zoomOut();
            this.logInfo('Zoomed out');
        }
    }

    resetZoom() {
        if (this.panZoom) {
            this.panZoom.fit();
            this.panZoom.center();
            this.logInfo('Zoom reset');
        }
    }

    /**
     * Update status bar information
     */
    updateStatusBar() {
        const zoomLevel = document.getElementById('zoom-level');
        const nodesCount = document.getElementById('nodes-count');
        
        if (zoomLevel && this.panZoom) {
            const zoom = Math.round(this.panZoom.getZoom() * 100);
            zoomLevel.textContent = `Zoom: ${zoom}%`;
        }
        
        if (nodesCount) {
            nodesCount.textContent = `Węzły: ${this.state.nodeCount}`;
        }
    }

    /**
     * Loading state management
     */
    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.add('hidden');
    }

    /**
     * Error handling
     */
    showError(message) {
        console.error('[FlowChart Pro Error]:', message);
        // Could implement toast notifications here
        alert(`FlowChart Pro Error: ${message}`);
    }

    /**
     * Logging utilities
     */
    logSuccess(message) {
        console.log(`%c[FlowChart Pro] ✓ ${message}`, 'color: #10b981; font-weight: bold;');
    }

    logInfo(message) {
        console.log(`%c[FlowChart Pro] ℹ ${message}`, 'color: #3b82f6;');
    }

    logWarning(message, data = null) {
        console.warn(`[FlowChart Pro] ⚠ ${message}`, data);
    }

    logError(message, error = null) {
        console.error(`[FlowChart Pro] ✗ ${message}`, error);
    }

    /**
     * Public API for external access
     */
    getState() {
        return {
            ...this.state,
            theme: this.currentTheme,
            isPanelOpen: this.isPanelOpen,
            activeNode: this.currentActiveNode?.getAttribute('data-node-id')
        };
    }

    exportConfiguration() {
        return {
            ...FLOWCHART_CONFIG,
            state: this.getState()
        };
    }
}

/**
 * Initialize FlowChart Pro when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verify dependencies
    if (typeof svgPanZoom === 'undefined') {
        console.error('[FlowChart Pro] svg-pan-zoom library not loaded');
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; font-family: system-ui;">
                <h1 style="color: #ef4444; margin-bottom: 16px;">⚠ FlowChart Pro Error</h1>
                <p>Required dependency missing. Please refresh the page.</p>
            </div>
        `;
        return;
    }

    // Initialize application
    window.flowChartPro = new FlowChartPro();
    
    // Add to global scope for debugging
    window.FLOWCHART_CONFIG = FLOWCHART_CONFIG;
    
    console.log('%cFlowChart Pro v1.0.0 Ready 🚀', 'color: #10b981; font-size: 16px; font-weight: bold;');
});

/**
 * Export for module usage
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FlowChartPro, FLOWCHART_CONFIG };
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                           CONFIGURATION INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════════════════════════

/*
HOW TO CUSTOMIZE YOUR FLOWCHART:

1. ADDING NEW NODES:
   - Add to FLOWCHART_CONFIG.nodes array
   - Set unique ID, title, description, attachments, links
   - Add corresponding SVG element in HTML with matching data-node-id

2. CHANGING THEME:
   - Modify FLOWCHART_CONFIG.settings.theme ("light" or "dark")
   - Or use the theme toggle button in the UI

3. CUSTOMIZING ANIMATIONS:
   - Adjust FLOWCHART_CONFIG.animations values
   - Modify CSS custom properties for more control

4. ZOOM SETTINGS:
   - Change FLOWCHART_CONFIG.zoom min/max/step values

5. PANEL SETTINGS:
   - Adjust FLOWCHART_CONFIG.settings.panelWidth
   - Modify minimap size in settings

EXAMPLE NODE STRUCTURE:
{
    id: "node_006",
    title: "New Process",
    description: "Detailed description of the new process step",
    attachments: ["document.pdf", "spreadsheet.xlsx"],
    links: ["https://example.com/info", "https://docs.example.com"]
}

DEBUG MODE:
- Open browser console for detailed logs
- Use window.flowChartPro.getState() to inspect current state
- Use window.flowChartPro.exportConfiguration() to export settings

KEYBOARD SHORTCUTS:
- Ctrl/Cmd + Plus: Zoom In
- Ctrl/Cmd + Minus: Zoom Out  
- Ctrl/Cmd + 0: Reset Zoom
- Ctrl/Cmd + T: Toggle Theme
- Escape: Close Panel
*/