let player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {});
}

function seekForward() {
    const seconds = parseFloat(document.getElementById("seekSeconds").value) || 0.2;
    const currentTime = player.getCurrentTime();
    player.seekTo(currentTime + seconds, true);
}

function seekBackward() {
    const seconds = parseFloat(document.getElementById("seekSeconds").value) || 0.2;
    const currentTime = player.getCurrentTime();
    player.seekTo(Math.max(0, currentTime - seconds), true);
}

function enterFullscreen() {
    const wrapper = document.getElementById("playerWrapper");
    wrapper.classList.add("fullscreen");
    document.getElementById("rightButtons").style.display = "flex";
    document.getElementById("btnEnter").style.display = "none";
    document.getElementById("btnExit").style.display = "inline-block";
}

function exitFullscreen2() {
    const wrapper = document.getElementById("playerWrapper");
    wrapper.classList.remove("fullscreen");
    document.getElementById("rightButtons").style.display = "flex";
    document.getElementById("btnEnter").style.display = "inline-block";
    document.getElementById("btnExit").style.display = "none";
}

function extractVideoId(url) {
    const match = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
    return match ? match[1] : null;
}

function loadVideoFromLink() {
    const url = document.getElementById("linkInput").value.trim();
    const videoId = extractVideoId(url);
    if (videoId) {
        player.loadVideoById(videoId);
    } else {
        alert("Link không hợp lệ.");
    }
}

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

window.addEventListener("DOMContentLoaded", () => {

    // Load file svg into index.html
    loadSvg("icon-fast-forward", "icons/fast-forward.svg");
    loadSvg("icon-rewind", "icons/rewind.svg");
    loadSvg("icon-chevron-up", "icons/chevrons-up.svg");
    loadSvg("icon-chevron-down", "icons/chevrons-down.svg");
    loadSvg("icon-maximize", "icons/maximize.svg");
    loadSvg("icon-minimize", "icons/minimize.svg");

    
    // Execute for activations on mobile
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
