let codes = [];
let index = 0;

// Load CSV
function loadCSV() {
  Papa.parse("friend-codes.csv", {
    download: true,
    complete: (result) => {
      codes = result.data
        .map((row) => row[0])
        .filter((val) => val && /^\d{12}$/.test(val));

      // Load saved index from cookie
      const saved = Cookies.get("lastIndex");
      if (saved && !isNaN(saved)) {
        const idx = parseInt(saved, 10);
        if (idx >= 0 && idx < codes.length) index = idx;
      }

      render();
    },
    error: (err) => {
      console.error("Failed to load CSV:", err);
      document.getElementById("number").textContent = "Error loading CSV";
    }
  });
}

// Render QR code, number, and counter
function render() {
  if (codes.length === 0) return;
  const code = codes[index];
  QRCode.toCanvas(document.getElementById("qrcode"), code, { width: 256 }, (err) => {
    if (err) console.error(err);
  });
  document.getElementById("number").textContent = code;
  document.getElementById("counter").textContent = `${index + 1} / ${codes.length}`;
  Cookies.set("lastIndex", index);
}

// Navigation functions
function goNext() {
  if (index < codes.length - 1) {
    index++;
    render();
  }
}

function goPrev() {
  if (index > 0) {
    index--;
    render();
  }
}

// Click left/right
document.body.addEventListener("click", (e) => {
  const middle = window.innerWidth / 2;
  if (e.clientX < middle) goPrev();
  else goNext();
});

// Manual row input
const rowInput = document.getElementById("rowInput");
rowInput.addEventListener("change", () => {
  const val = parseInt(rowInput.value, 10);
  if (!isNaN(val) && val >= 1 && val <= codes.length) {
    index = val - 1;
    render();
  } else {
    alert("Row out of range");
  }
});

// Initialize
loadCSV();
