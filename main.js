function getRouteSegments(hash) {
  return hash.replace('#/', '').split('/');
}

function handleStateChange([type, permalink]) {
  if (type === 'events') {
    if (permalink) {
      return openModal(permalink);
    }
  }

  if (!type && document.querySelector('.modal')) {
    return closeModal();
  }

  if (!permalink) {
    window.location.hash = '#/';
  }
}

function openModal(permalink) {
  document.getElementById('modal-container').innerHTML = document.getElementById(
    permalink,
  ).innerText;
  document.querySelector('.modal').addEventListener('click', handleCloseModal);
  document.body.className = 'modal-open';
}

function handleCloseModal(e) {
  if (e.currentTarget === e.target) {
    closeModal();
  }
}

function closeModal() {
  document.querySelector('.modal').removeEventListener('click', handleCloseModal);
  document.querySelector('.modal').remove();
  document.body.className = '';
  window.location.hash = '#/';
}

(() => {
  const [type, permalink] = getRouteSegments(window.location.hash);

  handleStateChange([type, permalink]);

  window.addEventListener('hashchange', (e) => {
    handleStateChange(getRouteSegments(e.target.location.hash));
  });
})();
