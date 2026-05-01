/***********************
 * دوال استخراج البيانات
 ***************************/
function getPostCategories(post) {
  return (post.category && post.category.length > 0)
    ? post.category.map(catObj => catObj.term)
    : ["غير مصنف"];
}

function getPostUrl(post) {
  return post.link.find(link => link.rel === "alternate")?.href;
}

function getPostTitle(post) {
  // نعتمد فقط على عنوان المنشور القياسي
  return post.title?.$t || "بدون عنوان";
}

/***********************
 * 🖼️ الصورة
 ***********************/
function getPostImage(post, size = 320) {
  const defaultImage = `https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiw3Xk4eBejSCeD4h27TyIPBD5ATY_QqvrmrmZ7h81doaIV8hn0T0Ov6imf9QvnT0AOHEs6WGqaJPdIQI94O7ZYBwfIAT0VZPxIAhQpzaRerCO5uIdrI1_7_Md6Lp-RSD2wVmng0WSSvwnelnYrUbNIf3vJRSsihSjyBu002FHCBwfXJr8Dy0e4wQCuUUPB/w640-h640/unnamed.jpg`;
  const content = post.content?.$t || "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);

  if (!imgMatch) return defaultImage;

  let imgUrl = imgMatch[1];

  if (/blogger\.googleusercontent\.com/.test(imgUrl)) {
    if (/\/s\d+/.test(imgUrl)) {
      imgUrl = imgUrl.replace(/\/s\d+/, `/s${size}`);
    } else if (/\/w\d+-h\d+/.test(imgUrl)) {
      imgUrl = imgUrl.replace(/\/w\d+-h\d+/, `/w${size}-h${size}`);
    } else {
      imgUrl = imgUrl.replace(/\/([^/]+)$/, `/s${size}/$1`);
    }
  }
  return imgUrl;
}

/***********************
 * 🧩 بناء بطاقة المنشور
 ***********************/
function generatePostHTML(post, lazy = false) {
  const url = getPostUrl(post);
  if (!url) return "";

  const title = getPostTitle(post);
  const image = getPostImage(post);
  const categories = getPostCategories(post).join(",");
  
  const imgTag = lazy
    ? `<img class="post-image lazy-img" src="https://via.placeholder.com/320x320/f0f0f0/333333.png?text=Loading" data-src="${image}" alt="${title}" width="320" height="320" loading="lazy">`
    : `<img class="post-image" src="${image}" alt="${title}" width="320" height="320" loading="lazy">`;

  return `
    <div class="post-card" data-categories="${categories}" data-post-url="${url}">
      <a href="${url}" target="_blank" class="post-link">
        <div class="image-container">
          ${imgTag}
        </div>
        <div class="post-content">
          <h3 class="post-title">${title}</h3>
          <div class="post-categories-list">
            <span>${categories.split(',').join(' | ')}</span>
          </div>
        </div>
      </a>
    </div>
  `;
}

/***********************
 * Lazy Loading للصور
 ***********************/
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll("img.lazy-img[data-src]");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.classList.remove("lazy-img");
          obs.unobserve(img);
        }
      });
    },
    { rootMargin: "100px" }
  );

  lazyImages.forEach(img => observer.observe(img));
}
