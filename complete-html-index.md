# index.html - Complete Interactive Flowchart Application

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interaktywny Schemat Procesu Muzycznego</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
</head>
<body>
    <div class="app">
        <!-- Header -->
        <header class="app__header">
            <h1>Interaktywny Proces Publikacji Muzycznej</h1>
            <div class="app__controls">
                <button id="zoom-in" class="btn btn--sm">Powiększ</button>
                <button id="zoom-out" class="btn btn--sm">Pomniejsz</button>
                <button id="reset-zoom" class="btn btn--sm">Reset</button>
            </div>
        </header>

        <!-- Main diagram container -->
        <main class="app__main">
            <div id="svg-container" class="diagram-container">
                <!-- Embedded SVG from the generated diagram -->
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                     viewBox="0 0 1169 827" width="1169" height="827" id="main-svg">
                    <defs>
                        <style>
                            .node-element { cursor: pointer; transition: opacity 0.2s ease; }
                            .node-element:hover { opacity: 0.9; }
                            .node-active { stroke: #007bff; stroke-width: 2; stroke-opacity: 0.7; }
                        </style>
                    </defs>
                    <g id="main-diagram">
                        <!-- All nodes will be embedded here from the XML processing -->
                        <!-- Node 001: Manager -->
                        <rect class="node-element" data-node-id="node_001" x="722" y="32" width="80" height="30" 
                              fill="#ffffff" stroke="#000000" stroke-width="1"/>
                        <text x="762" y="47" text-anchor="middle" dominant-baseline="middle" 
                              font-family="Arial, sans-serif" font-size="12" fill="#000000"
                              pointer-events="none">Manager</text>

                        <!-- Node 002: Master -->
                        <rect class="node-element" data-node-id="node_002" x="263" y="32" width="80" height="30" 
                              fill="#ffffff" stroke="#000000" stroke-width="1"/>
                        <text x="303" y="47" text-anchor="middle" dominant-baseline="middle" 
                              font-family="Arial, sans-serif" font-size="12" fill="#000000"
                              pointer-events="none">master</text>

                        <!-- Node 003: Artysta -->
                        <rect class="node-element" data-node-id="node_003" x="263" y="102" width="80" height="30" 
                              fill="#ffffff" stroke="#000000" stroke-width="1"/>
                        <text x="303" y="117" text-anchor="middle" dominant-baseline="middle" 
                              font-family="Arial, sans-serif" font-size="12" fill="#000000"
                              pointer-events="none">Artysta</text>

                        <!-- Additional nodes would be generated from the XML processing -->
                        <!-- This is a simplified example showing the structure -->
                    </g>
                </svg>
            </div>
        </main>

        <!-- Side Panel -->
        <aside id="side-panel" class="side-panel">
            <div class="side-panel__header">
                <h2 id="panel-title" class="side-panel__title">Tytuł węzła</h2>
                <button id="close-panel" class="side-panel__close" aria-label="Zamknij panel">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="side-panel__content">
                <div class="side-panel__section">
                    <h3>Opis</h3>
                    <p id="panel-description">Opis węzła będzie tutaj wyświetlony...</p>
                </div>
                
                <div class="side-panel__section">
                    <h3>Załączniki</h3>
                    <ul id="panel-attachments" class="attachments-list">
                        <!-- Attachments will be populated by JavaScript -->
                    </ul>
                </div>
                
                <div class="side-panel__section">
                    <h3>Linki</h3>
                    <ul id="panel-links" class="links-list">
                        <!-- Links will be populated by JavaScript -->
                    </ul>
                </div>
            </div>
        </aside>

        <!-- Backdrop for mobile -->
        <div id="backdrop" class="backdrop"></div>
    </div>

    <!-- Load the main application script -->
    <script src="app.js"></script>
</body>
</html>
```

This HTML file provides:

1. **Complete structure** with semantic HTML5 elements
2. **Embedded SVG** with proper node structure and IDs
3. **Side panel** with sections for title, description, attachments, and links
4. **Mobile-responsive** backdrop and layout
5. **Zoom controls** in the header
6. **External dependencies** loaded from CDN (svg-pan-zoom)
7. **Polish language** UI text and attributes
8. **Accessibility features** with proper ARIA labels
9. **Modular structure** that works with the generated CSS and JavaScript files

The SVG content would be replaced with the complete generated diagram from your XML file processing, maintaining all visual elements exactly as designed while adding the interactive layer.