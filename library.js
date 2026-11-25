(() => {
  const theme = document.getElementById("theme");
  const storageKey = "clipper-lesson-theme";
  function setTheme(name) {
    document.documentElement.dataset.theme = name;
    const next = name === "light" ? "深色" : "浅色";
    theme.textContent = next;
    theme.setAttribute("aria-label", "切换" + next + "主题");
  }
  try {
    setTheme(localStorage.getItem(storageKey) === "light" ? "light" : "dark");
  } catch {
    setTheme("dark");
  }
  theme.hidden = false;
  theme.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem(storageKey, next); } catch {}
  });

  function showTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    const parent = target.closest("details");
    if (parent && !parent.open) {
      parent.open = true;
      requestAnimationFrame(() => target.scrollIntoView());
    }
  }
  window.addEventListener("hashchange", showTarget);
  showTarget();

  const search = document.getElementById("resource-search");
  if (!search) return;

  const form = search.form;
  const result = document.getElementById("result-status");
  const empty = document.getElementById("empty");
  const records = [...document.querySelectorAll("[data-record]")].map((element) => ({
    element,
    text: element.textContent.normalize("NFKC").toLowerCase()
  }));
  const groups = [...document.querySelectorAll("[data-group]")];
  function filter() {
    const keywords = search.value.normalize("NFKC").toLowerCase().trim().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const { element, text } of records) {
      element.hidden = !keywords.every((word) => text.includes(word));
      if (!element.hidden) count++;
    }
    for (const group of groups) {
      group.hidden = !group.querySelector("[data-record]:not([hidden])");
    }
    for (const link of document.querySelectorAll("[data-jump]")) {
      link.hidden = document.getElementById(link.dataset.jump).hidden;
    }
    result.textContent = keywords.length ? "找到 " + count + " 项资料" : "可搜索正文、课件和图解";
    empty.hidden = count > 0;
  }
  form.addEventListener("submit", (event) => event.preventDefault());
  search.addEventListener("input", filter);
  form.hidden = false;
  filter();
})();
