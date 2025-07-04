const apiKey = "AIzaSyAR2DtSCtxQClNdXFVGjUjIzLujUQL3iaI";

window.onload = () => {
    const keyword = localStorage.getItem("searchKeyword");
    if (!keyword) return;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=10&key=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("resultsContainer");
            container.innerHTML = ""; // clear cũ
            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnail = item.snippet.thumbnails.medium.url;

                const videoEl = document.createElement("div");
                videoEl.className = "video-item";
                videoEl.innerHTML = `
         
            <img src="${thumbnail}" alt="${title}">
            <p>${title}</p>
        
        `;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                videoEl.onclick = () => {
                    // Lưu URL vào localStorage trước khi quay lại
                    localStorage.setItem("selectedVideoUrl", videoUrl);
                    window.location.href = "index.html"; // Quay lại trang chính
                };
                container.appendChild(videoEl);
            });
        })
        .catch(error => {
            console.error("Lỗi khi gọi API YouTube:", error);
        });
};

function backToMainScreen() {
    window.location.href = "index.html"; // Quay lại trang chính
}

function clearInputFromKey() {
    document.getElementById('searchInput').value = '';
}

function search() {
    const keyword = document.getElementById("searchInput").value.trim();
    if (!keyword) return;

    localStorage.setItem("searchKeyword", keyword);

    window.location.href = "result.html";
}