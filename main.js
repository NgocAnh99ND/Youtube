let player;
let isFullscreen = 0;
let isHidden = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {});
}

function seekForward() {
    console.log("seekForward")
    const seconds = parseFloat(document.getElementById("seekSeconds").value) || 0.2;
    console.log("LOG2")
    const currentTime = player.getCurrentTime();
    console.log("LOG3", currentTime)
    player.seekTo(currentTime + seconds, true);
}

function seekBackward() {
    console.log("seekBackward")
    const seconds = parseFloat(document.getElementById("seekSeconds").value) || 0.2;
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0, currentTime - seconds), true);
}

function enterFullscreen() {
    isFullscreen = 1;
    const wrapper = document.getElementById("playerWrapper");
    wrapper.classList.add("fullscreen");
    document.getElementById("rightButtons").style.display = "flex";
    document.getElementById("btnEnter").style.display = "none";
    document.getElementById("btnExit").style.display = "flex";
    document.getElementById("showSearchBtn").style.display = "block";

    // Ẩn searchBar và cập nhật trạng thái
    const searchBar = document.getElementById("searchBar");
    searchBar.style.display = "none";
    isHidden = 1;
}

function exitFullscreen2() {
    isFullscreen = 0;
    const wrapper = document.getElementById("playerWrapper");
    wrapper.classList.remove("fullscreen");
    document.getElementById("rightButtons").style.display = "flex";
    document.getElementById("btnEnter").style.display = "flex";
    document.getElementById("btnExit").style.display = "none";
    document.getElementById("showSearchBtn").style.display = "none";

    // Luôn hiển lại searchBar khi thoát fullscreen
    const searchBar = document.getElementById("searchBar");
    searchBar.style.display = "flex";
    isHidden = 0;
}

function loadVideoFromLink() {
    const input = document.getElementById("linkInput");
    const link = input.value.trim();
    if (!link) return;

    // Lưu link vào localStorage
    let history = JSON.parse(localStorage.getItem("youtubeLinks") || "[]");
    if (!history.includes(link)) {
        history.unshift(link); // Thêm đầu danh sách
        if (history.length > 20) history = history.slice(0, 20); // Giới hạn 20 link
        localStorage.setItem("youtubeLinks", JSON.stringify(history));
    }

    // Phát video
    const videoId = extractVideoId(link);
    if (videoId) {
        const player = document.getElementById("player");
        player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=1&cc_load_policy=1&rel=0`;
    }
}

function extractVideoId(link) {
    const reg = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^\s&#?/]+)/;
    const match = link.match(reg);
    return match ? match[1] : null;
}

document.getElementById("linkInput").addEventListener("focus", () => {
    const suggestionsDiv = document.getElementById("suggestions");
    const history = JSON.parse(localStorage.getItem("youtubeLinks") || "[]");

    if (history.length > 0) {
        suggestionsDiv.innerHTML = "";
        history.forEach(link => {
            const item = document.createElement("div");
            item.textContent = link;
            item.style.padding = "6px";
            item.style.cursor = "pointer";
            item.addEventListener("click", () => {
                document.getElementById("linkInput").value = link;
                suggestionsDiv.style.display = "none";
            });
            suggestionsDiv.appendChild(item);
        });
        suggestionsDiv.style.display = "block";
    }
});

// Ẩn suggestion khi click ra ngoài
document.addEventListener("click", (e) => {
    const suggestionsDiv = document.getElementById("suggestions");
    const input = document.getElementById("linkInput");
    if (!suggestionsDiv.contains(e.target) && e.target !== input) {
        suggestionsDiv.style.display = "none";
    }
});

function increaseSeek() {
    const input = document.getElementById("seekSeconds");
    const step = parseFloat(document.getElementById("customValue").value) || 1;
    const value = parseFloat(input.value) || 0;
    input.value = (value + step).toFixed(1);
}

function decreaseSeek() {
    const input = document.getElementById("seekSeconds");
    const step = parseFloat(document.getElementById("customValue").value) || 1;
    const value = parseFloat(input.value) || 0;
    input.value = Math.max(0, value - step).toFixed(1);
}

function addTouchSupport(id, handler) {
    const btn = document.getElementById(id);
    if (btn) {
        btn.addEventListener('touchstart', e => {
            e.preventDefault();
            handler();
        });
    }
}

function addTouchSupportClass(className, handlerMap) {
    const buttons = document.getElementsByClassName(className);
    Array.from(buttons).forEach(btn => {
        const text = btn.textContent.trim();
        if (handlerMap[text]) {
            btn.addEventListener('touchstart', e => {
                e.preventDefault();
                handlerMap[text]();
            });
        }
    });
}

function loadSvg(targetId, filePath) {
    fetch(filePath)
        .then(res => res.text())
        .then(svg => {
            document.getElementById(targetId).innerHTML = svg;
        })
        .catch(err => console.error(`Lỗi tải ${filePath}:`, err));
}

// For Mobile
let historyLinks = JSON.parse(localStorage.getItem("linkHistory")) || [];
let suggestionsBox;

window.addEventListener("DOMContentLoaded", () => {
    // Gán phím Enter vào ô tìm kiếm
    document.getElementById("linkInput").addEventListener("keydown", e => {
        if (e.key === "Enter") loadVideoFromLink();
    });

    // Gán click chuột
    document.getElementById("increaseSeekBtn").addEventListener("click", increaseSeek);
    document.getElementById("decreaseSeekBtn").addEventListener("click", decreaseSeek);

    // Gán chạm mobile
    addTouchSupport("increaseSeekBtn", increaseSeek);
    addTouchSupport("decreaseSeekBtn", decreaseSeek);
    addTouchSupport("btnEnter", enterFullscreen);
    addTouchSupport("btnExit", exitFullscreen2);

    addTouchSupportClass("fs-btn", {
        '⏪': seekBackward,
        '⏩': seekForward
    });
});

function toggleSearchBar() {
    const searchBar = document.getElementById("searchBar");

    if (isHidden === 0) {
        searchBar.style.display = "flex";
        isHidden = 1;
    } else {
        searchBar.style.display = "none";
        isHidden = 0;
    }
}

function pasteFromClipboard() {
    navigator.clipboard.readText()
        .then(text => {
            document.getElementById("linkInput").value = text;
        })
        .catch(err => {
            console.error("Không thể dán từ clipboard:", err);
            alert("Trình duyệt không cho phép truy cập clipboard.\nHãy dùng Ctrl+V thủ công.");
        });
}

function clearInput() {
    document.getElementById('linkInput').value = '';
  }


