// =================== ✅ البحث ===================
const searchPageURL = "https://malik-kemet.blogspot.com/p/search.html";
const input = document.getElementById("searchInput");
const form = document.querySelector(".search-box-form");
const historyDropdown = document.getElementById("searchHistoryDropdown");

let searches = JSON.parse(localStorage.getItem('searches')) || [];

// تحديث الدروب داون
function updateDropdown() {
  historyDropdown.innerHTML = '';
  let toShow = searches.slice(0, 5);
  if (toShow.length === 0) {
    historyDropdown.style.display = 'none';
    return;
  }

  toShow.forEach(term => {
    let item = document.createElement('div');

    let text = document.createElement('span');
    text.textContent = term;
    text.addEventListener('click', () => {
      input.value = term;
      historyDropdown.style.display = 'none';
    });

    let del = document.createElement('span');
    del.textContent = '×';
    del.classList.add('delete-btn');
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      searches = searches.filter(t => t !== term);
      localStorage.setItem('searches', JSON.stringify(searches));
      updateDropdown();
    });

    item.appendChild(text);
    item.appendChild(del);
    historyDropdown.appendChild(item);
  });

  historyDropdown.style.display = 'block';
}

// البحث + تخزين السجل
function startSearch() {
  if (!input) return;
  const query = input.value.trim();
  if (query) {
    // تحديث السجل
    searches = searches.filter(t => t !== query);
    searches.unshift(query);
    if (searches.length > 10) searches = searches.slice(0, 10);
    localStorage.setItem('searches', JSON.stringify(searches));

    // الانتقال لصفحة البحث
    window.location.href = `${searchPageURL}?q=${encodeURIComponent(query)}`;
  }
}

// ربط مع الفورم
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    startSearch();
  });
}

// إظهار الدروب داون عند التركيز
if (input) {
  input.addEventListener('focus', updateDropdown);
}

// إغلاق عند الضغط برا
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    historyDropdown.style.display = 'none';
  }
});

// =================== ✅ تدوير الـ placeholder ===================
if (input) {
  const placeholders = [
  "ملك كيمت ابحث هنا",
  "تحيا مصر",
  "تحيا قناة السويس",
  "خرائط متحركة",
  "معلومات غريبة",
  "مقاطع مضحكة",
  "نكات مضحكة",
  "تصاميم ملك كيمت",  
  "خرائط ملك كيمت"
];

  function getRandomPlaceholder() {
    const randomIndex = Math.floor(Math.random() * placeholders.length);
    return placeholders[randomIndex];
  }

  function rotatePlaceholder() {
    if (placeholders.length > 0) {
      input.setAttribute("placeholder", getRandomPlaceholder());
    }
  }

  rotatePlaceholder(); // أول تشغيل
  setInterval(rotatePlaceholder, 25000); // كل 25 ثانية
}

// =================== ✅ Dark Mode Toggle ===================
var htmlEl = document.documentElement,
    darkBtn = document.getElementById("dark-toggler"),
    iconUse = darkBtn ? darkBtn.querySelector("use") : null;

function switchIcon(theme){
  if(!iconUse) return;
  if(theme === "dark"){
    iconUse.setAttribute("xlink:href","#i-sun");
    iconUse.setAttribute("href","#i-sun");
  } else {
    iconUse.setAttribute("xlink:href","#i-moon");
    iconUse.setAttribute("href","#i-moon");
  }
}

function applyTheme(theme, persist){
  if(theme === "dark"){
    htmlEl.classList.add("dark-mode");
    htmlEl.setAttribute("data-theme","dark");
  } else {
    htmlEl.classList.remove("dark-mode");
    htmlEl.setAttribute("data-theme","light");
  }
  switchIcon(theme);
  if(persist) {
    try { localStorage.setItem("theme", theme); } catch(e){}
  }
}

var savedTheme;
try { savedTheme = localStorage.getItem("theme"); } catch(e){ savedTheme = null; }
if(!savedTheme){
  savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
applyTheme(savedTheme,false);

if(darkBtn){
  darkBtn.addEventListener("click",function(e){
    e.preventDefault();
    var isDark = htmlEl.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark", true);
  });
}

// =================== ✅ Back To Top ===================
var backTop = document.getElementById("back-to-top");
window.addEventListener("scroll",function(){
  if(!backTop) return;
  if(this.pageYOffset >= 1000){
    backTop.classList.remove("d-none");
  } else {
    backTop.classList.add("d-none");
  }
},false);

// =================== ✅ Remove ?m=0 / ?m=1 from URL ===================
function rmurl(e,t){
  var r=new RegExp(/\?m=0|&m=0|\?m=1|&m=1/g);
  if(r.test(e)){
    e = e.replace(r,"");
    if(t) window.history.replaceState({},document.title,e);
  }
  return e;
}
const currentUrl = rmurl(location.toString(),!0);
