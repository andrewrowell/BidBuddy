// JustBid Enhanced - options page logic
"use strict";

const STORE_KEY = "friends";
const AUTO_OPEN_KEY = "autoOpen";
const rowsEl = document.getElementById("rows");
const statusEl = document.getElementById("status");
const autoOpenEl = document.getElementById("autoOpen");

function makeRow(id = "", name = "") {
  const tr = document.createElement("tr");

  const tdId = document.createElement("td");
  const inputId = document.createElement("input");
  inputId.type = "text";
  inputId.className = "id";
  inputId.placeholder = "12**9*";
  inputId.value = id;
  tdId.appendChild(inputId);

  const tdName = document.createElement("td");
  const inputName = document.createElement("input");
  inputName.type = "text";
  inputName.placeholder = "Alex";
  inputName.value = name;
  tdName.appendChild(inputName);

  const tdRemove = document.createElement("td");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "remove";
  btn.title = "Remove";
  btn.textContent = "×"; // ×
  btn.addEventListener("click", () => tr.remove());
  tdRemove.appendChild(btn);

  tr.appendChild(tdId);
  tr.appendChild(tdName);
  tr.appendChild(tdRemove);
  return tr;
}

function render(list) {
  rowsEl.innerHTML = "";
  if (!list.length) {
    rowsEl.appendChild(makeRow());
    return;
  }
  list.forEach((f) => rowsEl.appendChild(makeRow(f.id || "", f.name || "")));
}

function collect() {
  const out = [];
  rowsEl.querySelectorAll("tr").forEach((tr) => {
    const inputs = tr.querySelectorAll("input");
    const id = inputs[0].value.trim();
    const name = inputs[1].value.trim();
    if (id && name) out.push({ id, name });
  });
  return out;
}

function flash() {
  statusEl.classList.add("show");
  setTimeout(() => statusEl.classList.remove("show"), 1400);
}

function load() {
  JBEStorage.get([STORE_KEY, AUTO_OPEN_KEY]).then((res) => {
    const list = (res && res[STORE_KEY]) || [];
    render(Array.isArray(list) ? list : []);
    autoOpenEl.checked = !res || res[AUTO_OPEN_KEY] !== false; // default on
  });
}

function save() {
  const list = collect();
  JBEStorage.set({ [STORE_KEY]: list, [AUTO_OPEN_KEY]: autoOpenEl.checked }).then(
    () => {
      render(list.length ? list : []);
      flash();
    }
  );
}

document.getElementById("add").addEventListener("click", () => {
  rowsEl.appendChild(makeRow());
});
document.getElementById("save").addEventListener("click", save);

load();
