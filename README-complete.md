# README.md - Instrukcje Instalacji i Użytkowania

## 📋 Interaktywny Schemat Procesu Muzycznego

Aplikacja webowa do eksploracji interaktywnego schematu procesu publikacji muzycznej z ~83 węzłami zawierającymi szczegółowe informacje o każdym etapie.

## 🚀 Instrukcje Uruchomienia Lokalnego

### Wymagania
- Nowoczesna przeglądarka (Chrome, Firefox, Safari - ostatnie 2 wersje)
- Python 3.x (do uruchomienia lokalnego serwera)

### Kroki instalacji:

1. **Pobierz pliki projektu**
   ```bash
   # Pobierz wszystkie 5 plików do jednego folderu:
   # - index.html
   # - style.css  
   # - app.js
   # - nodes-data.json
   # - README.md
   ```

2. **Uruchom lokalny serwer**
   ```bash
   # W folderze z plikami uruchom:
   python -m http.server 8000
   
   # Lub dla Python 2.x:
   python -m SimpleHTTPServer 8000
   ```

3. **Otwórz aplikację**
   - Przejdź do: `http://localhost:8000`
   - Aplikacja powinna załadować się automatycznie

## ✏️ Jak Edytować Dane Węzłów

### Struktura danych w `nodes-data.json`:

```json
{
  "nodes": [
    {
      "id": "node_001",
      "title": "Nazwa węzła",          // ← EDYTUJ TUTAJ
      "description": "Opis węzła",    // ← EDYTUJ TUTAJ  
      "attachments": [                 // ← EDYTUJ TUTAJ
        "plik1.pdf",
        "plik2.xlsx"
      ],
      "links": [                       // ← EDYTUJ TUTAJ
        "https://example.com"
      ]
    }
  ]
}
```

### Kroki edycji:

1. **Otwórz plik `nodes-data.json`** w edytorze tekstu
2. **Znajdź węzeł** po ID (np. `node_001`)
3. **Zmień zawartość** pól:
   - `title`: Nazwa wyświetlana w panelu
   - `description`: Szczegółowy opis węzła
   - `attachments`: Lista nazw plików
   - `links`: Lista URL-i do zasobów
4. **Zapisz plik** i odśwież stronę

### Identyfikacja ID węzłów:

Aby sprawdzić ID węzła:
1. Kliknij prawym przyciskiem na węzeł w diagramie
2. Wybierz "Zbadaj element" (Inspect)
3. Znajdź atrybut `data-node-id` w kodzie HTML

## 🌐 Wdrożenie na GitHub Pages

### Krok po kroku:

1. **Utwórz repozytorium GitHub**
   ```bash
   # Utwórz nowe repo na GitHub o nazwie np: "music-process-flowchart"
   ```

2. **Wgraj pliki**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Interactive music flowchart"
   git branch -M main  
   git remote add origin https://github.com/TWOJA-NAZWA/music-process-flowchart.git
   git push -u origin main
   ```

3. **Włącz GitHub Pages**
   - Przejdź do: Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
   - Kliknij Save

4. **Dostęp do aplikacji**
   - URL: `https://TWOJA-NAZWA.github.io/music-process-flowchart`
   - Może potrwać 5-10 minut zanim będzie dostępna

## 📁 Struktura Projektu

```
music-process-flowchart/
├── index.html          # Główny plik HTML z osadzonym SVG
├── style.css           # Wszystkie style CSS (BEM, responsive)
├── app.js              # Logika JavaScript (vanilla JS)
├── nodes-data.json     # Dane węzłów do edycji
└── README.md           # Ten plik z instrukcjami
```

### Opis plików:

- **`index.html`**: Struktura HTML z osadzonym diagramem SVG
- **`style.css`**: Style CSS z systemem kolorów i responsive design
- **`app.js`**: Cała funkcjonalność JavaScript (zoom, panel, interakcje)
- **`nodes-data.json`**: Dane wszystkich węzłów - główny plik do edycji
- **`README.md`**: Instrukcje użytkowania i instalacji

## 🔄 Jak Zaktualizować Diagram

Jeśli zmienisz oryginalny plik DrawIO:

### Metoda 1: Ręczna aktualizacja SVG
1. Wyeksportuj nowy plik SVG z DrawIO
2. Skopiuj zawartość `<g>` z nowego SVG
3. Zastąp zawartość `<g id="main-diagram">` w `index.html`
4. Upewnij się, że wszystkie węzły mają:
   - `class="node-element"`
   - `data-node-id="node_XXX"`

### Metoda 2: Regeneracja (zaawansowane)
1. Wyeksportuj nowy XML z DrawIO
2. Uruchom skrypt Python do przetwarzania XML
3. Wygeneruj nowy SVG i zaktualizuj pliki

## 🎯 Funkcjonalności

### ✅ Zaimplementowane:
- [x] Wyświetlanie diagramu SVG z zachowaniem oryginalnego wyglądu
- [x] Interaktywne węzły z efektami hover
- [x] Panel boczny z informacjami o węzłach
- [x] Zoom i przesuwanie (svg-pan-zoom)
- [x] Responsive design (desktop/tablet/mobile)
- [x] Obsługa offline po pierwszym załadowaniu
- [x] Animacje CSS (300ms ease)
- [x] Dane w formacie JSON do łatwej edycji

### 🚀 Możliwe rozszerzenia (v2):
- [ ] Wyszukiwanie węzłów
- [ ] Historia nawigacji
- [ ] Eksport do PDF
- [ ] Tryb pełnoekranowy
- [ ] Motywy kolorystyczne
- [ ] Integracja z external API
- [ ] Analityka interakcji użytkowników

## 🐛 Rozwiązywanie Problemów

### Problem: Aplikacja nie ładuje się
- Sprawdź, czy wszystkie 5 plików są w tym samym folderze
- Uruchom przez serwer HTTP (nie otwieraj bezpośrednio pliku HTML)

### Problem: Węzły nie są klikalne
- Sprawdź czy węzły mają `class="node-element"`
- Sprawdź czy mają atrybut `data-node-id`
- Otwórz konsolę deweloperską (F12) i sprawdź błędy

### Problem: Panel nie wyświetla danych
- Sprawdź format `nodes-data.json` (poprawny JSON)
- Sprawdź czy ID węzła istnieje w pliku JSON
- Sprawdź konsolę deweloperską pod kątem błędów

### Problem: Zoom nie działa
- Sprawdź czy biblioteka svg-pan-zoom ładuje się z CDN
- Sprawdź połączenie internetowe przy pierwszym uruchomieniu

## 📞 Wsparcie

W przypadku problemów:
1. Sprawdź konsolę deweloperską (F12)
2. Sprawdź czy wszystkie pliki są dostępne
3. Sprawdź format JSON w walidatorze online
4. Przetestuj w innej przeglądarce

## 📝 Licencja

Projekt do użytku wewnętrznego. Wszystkie prawa zastrzeżone.