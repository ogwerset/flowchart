# Interactive Workflow Diagram

A fully interactive web-based workflow diagram with node editing capabilities.

## Features

✅ **Complete Visual Preservation** - All nodes, text, emojis, colors, and arrows are preserved exactly as in your original diagram

✅ **Full Zoom & Pan** - Use mouse wheel to zoom, drag to pan around the diagram

✅ **Clickable Nodes** - Click on any node to edit its data

✅ **Editable Node Data**:
- Node name
- Description
- Attached links (with working URLs)
- Attached files (file names/paths)

✅ **Data Persistence** - All changes are saved automatically to your browser's localStorage

✅ **Shareable** - Easy to share with coworkers

## How to Use

### Opening the Viewer

1. Open `interactive-workflow.html` in any modern web browser (Chrome, Firefox, Safari, Edge)
2. The diagram will load automatically

### Navigation

- **Zoom In/Out**: Use the zoom buttons or mouse wheel
- **Pan**: Click and drag anywhere on the diagram
- **Reset View**: Click "Reset View" to return to the default zoom level

### Editing Nodes

1. Click on any node (shape, box, circle, etc.) in the diagram
2. A sidebar will open on the right with editable fields
3. Edit the following:
   - **Node Name**: Give the node a custom name
   - **Description**: Add detailed notes about this step
   - **Links**: Add URLs to relevant resources (docs, tickets, etc.)
   - **Files**: Add file names or paths to related documents
4. Click "Save Changes" to save your edits
5. Click "Cancel" or press `Esc` to close without saving

### Keyboard Shortcuts

- `+` or `=` - Zoom in
- `-` - Zoom out
- `0` - Reset zoom
- `Esc` - Close sidebar

## Sharing with Coworkers

### Option 1: Simple File Sharing

1. Zip the entire `flowchart` folder (including both the HTML file and the `flowchart-newexport` subfolder)
2. Share the zip file via email, Slack, Google Drive, etc.
3. Recipients can extract and open `interactive-workflow.html`

**Important**: Make sure to include the entire folder structure, not just the HTML file!

### Option 2: Web Server

Host on a simple web server:

```bash
# Using Python 3
cd /Users/ogwerset/Downloads/flowchart
python3 -m http.server 8000
```

Then share: `http://localhost:8000/interactive-workflow.html`

For external access, you can use services like:
- GitHub Pages
- Netlify Drop
- Vercel
- Your company's internal web server

### Option 3: Cloud Storage

1. Upload the entire `flowchart` folder to cloud storage (Google Drive, Dropbox, OneDrive)
2. Share the folder with view access
3. Recipients can download and open locally

## File Structure

```
flowchart/
├── interactive-workflow.html       (Main file - open this)
├── flowchart-newexport/
│   ├── flowchart-processed.svg    (Processed diagram - required)
│   └── ...other files...
└── README.md                      (This file)
```

## Data Storage

All node data is stored in your browser's localStorage:
- Data persists between sessions
- Data is tied to your browser and computer
- To export data, use your browser's developer tools (Application → localStorage)
- Each user will have their own separate data storage

## Troubleshooting

### Diagram doesn't load
- Make sure you're opening `interactive-workflow.html` from the `flowchart` folder
- Check that the `flowchart-newexport` subfolder exists
- Try using a different browser

### Zoom/Pan doesn't work
- Make sure JavaScript is enabled in your browser
- Check browser console for errors (F12)
- Try refreshing the page

### Nodes aren't clickable
- Some decorative elements (like emojis and checkmarks) aren't clickable - try clicking on the actual shape/box
- Make sure the page has finished loading

### Changes aren't saving
- Check that localStorage is enabled in your browser
- Make sure you're clicking "Save Changes" after editing
- Try a different browser if issues persist

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires a modern browser with ES6 support.

## Technical Details

- Built with vanilla JavaScript (no build process required)
- Uses svg-pan-zoom library for zoom/pan functionality
- Data stored in localStorage (browser-based)
- No server required - runs entirely in the browser
- All original SVG styling preserved (colors, gradients, emojis)

## Credits

Created using draw.io/diagrams.net diagram
Interactive viewer built with Claude Code
