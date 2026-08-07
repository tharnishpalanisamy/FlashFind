# ⚡ FlashFind

FlashFind is a modern, lightning-fast search homepage that combines web search, smart autocomplete, voice search, search history, and customizable website shortcuts into a clean and minimal interface.

🌐 **Live Demo:** https://flash-find.vercel.app/

---

## ✨ Features

- 🔍 Instant search suggestions using a Trie data structure
- 🎤 Voice search powered by the Web Speech API
- 🧠 Smart typo correction using the Levenshtein Distance algorithm
- 🕒 Search history with quick access and delete functionality
- ⭐ Custom website shortcuts
- ✏️ Edit, remove, and reorder shortcuts using drag & drop
- 🌐 Automatic favicon fetching for shortcuts
- 📱 Responsive design for desktop and mobile
- 🔔 Beautiful toast notifications
- ⚡ Fast and lightweight with no backend required

---

## 🛠️ Built With

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Bootstrap 5
- SortableJS
- Toastr.js
- Boxicons
- Font Awesome

---

## 📸 Preview

> Add screenshots or GIFs here

```
/assets/screenshots/home.png
/assets/screenshots/suggestion.png
```

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/yourusername/flashfind.git
```

Navigate into the project

```bash
cd flashfind
```

Open `index.html` using Live Server or any local web server.

---

## 📂 Project Structure

```
FlashFind/
│
├── assets/
├── css/
├── js/
│   ├── data.js
│   ├── trie.js
│   ├── utilities.js
│   └── script.js
│
├── index.html
└── README.md
```

---

## 🧠 How It Works

### Trie Search

FlashFind stores searchable keywords inside a Trie for extremely fast prefix-based suggestions while typing.

### Typo Correction

If no exact suggestions are found, FlashFind compares the input with previous suggestions using the Levenshtein Distance algorithm to display a "Did you mean?" recommendation.

### Website Shortcuts

Create up to **10 custom shortcuts** to your favorite websites.

Features include:

- Add
- Edit
- Delete
- Drag & Drop Reordering
- Automatic favicon detection

All shortcuts are stored locally using **Local Storage**.

### Search History

Recent searches are automatically saved and shown whenever the search bar is focused.

---

## 💾 Local Storage

FlashFind stores data entirely in your browser.

| Key | Purpose |
|------|----------|
| `history` | Search history |
| `shortcuts` | User shortcuts |
| `data` | Searchable words |

---

## 🌍 Search Support

FlashFind supports direct searches for popular websites.

Example:

```
youtube cats
```

opens

```
https://youtube.com/results?search_query=cats
```

instead of Google Search.

---

## 📱 Responsive

Designed to work smoothly across

- Desktop
- Tablet
- Mobile

---

## 🚀 Future Improvements

- Dark Mode
- Custom Themes
- Import / Export Settings
- Keyboard Shortcuts
- Bookmark Sync
- Weather Widget
- AI Search Assistant

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the project and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Tharnish Palanisamy**

If you enjoyed this project, consider giving it a ⭐ on GitHub!