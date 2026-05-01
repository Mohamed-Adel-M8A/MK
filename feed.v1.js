let allPosts = [];
let mkFeed = [];
let displayedPosts = new Set();
let displayPointer = 0;

let currentStartIndex = 1;
const allPostsLimit = 50;
const batchSize = 10;

const mkpostsElement = document.getElementById("mk-posts");
const loadMoreButton = document.getElementById("load-more");
const loaderElement = document.getElementById("loader");
/***********************
 * جلب وترتيب المنشورات
 ***********************/
function computemkFeed(posts) {
  return posts.sort(
    (a, b) => new Date(b.published.$t) - new Date(a.published.$t)
  );
}

/***********************
 * جلب كل البوستات
 ***********************/
function fetchAllPosts() {
  loaderElement.style.display = "block";
  loadMoreButton.style.display = "none";

  const url = `https://malik-kemet.blogspot.com/feeds/posts/default?alt=json&start-index=${currentStartIndex}&max-results=${allPostsLimit}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const posts = data.feed.entry || [];
      
      allPosts = allPosts.concat(posts);
      
      mkFeed = computemkFeed(allPosts);
      displayPointer = 0;
      displayBatch();
      
      currentStartIndex += allPostsLimit;
    })
    .catch(error => {
        console.error("Fetch Error:", error);
    })
    .finally(() => {
      loaderElement.style.display = "none";
    });
}

/***********************
 * عرض المنشورات (دفعات)
 ***********************/
function displayBatch() {
  const batch = [];
  let count = 0;

  while (count < batchSize && displayPointer < mkFeed.length) {
    const post = mkFeed[displayPointer];
    const url = getPostUrl(post);

    if (url && !displayedPosts.has(url)) {
      displayedPosts.add(url);
      batch.push(generatePostHTML(post, displayPointer >= batchSize));
      count++;
    }
    displayPointer++;
  }

  if (batch.length > 0) {
    mkpostsElement.insertAdjacentHTML("beforeend", batch.join(""));
    sessionStorage.setItem("displayedPosts", JSON.stringify([...displayedPosts]));
    lazyLoadImages(); // مهم للصور
  }
}

/***********************
 * زر تحميل المزيد
 ***********************/
function loadMorePosts() {
  fetchAllPosts();
}

if (loadMoreButton) {
  loadMoreButton.addEventListener("click", loadMorePosts);
}

/***********************
 * Auto Load عند Scroll
 ***********************/
window.addEventListener("scroll", function () {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
    if (displayPointer < mkFeed.length) {
      displayBatch();
    } else {
      if (loadMoreButton) loadMoreButton.style.display = "block";
    }
  }
});

/***********************
 * بدء التحميل عند فتح الصفحة
 ***********************/
window.onload = function () {
  displayedPosts = new Set();
  sessionStorage.setItem("displayedPosts", JSON.stringify([]));
  fetchAllPosts();
};
