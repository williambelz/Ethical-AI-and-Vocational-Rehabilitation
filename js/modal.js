document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('contactBtn');
  const modal = document.getElementById('contactModal');
  const overlay = document.getElementById('modalOverlay');
  const close = document.getElementById('closeModal');
  if (!btn || !modal || !overlay || !close) return;
  function openModal() {
    overlay.hidden = false;
    modal.hidden = false;
    close.focus();
  }
  function closeModal() {
    overlay.hidden = true;
    modal.hidden = true;
    btn.focus();
  }
  btn.addEventListener('click', openModal);
  close.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
});
