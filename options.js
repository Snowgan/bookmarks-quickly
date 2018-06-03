const tokenInput = document.getElementById('token');
const repoInput = document.getElementById('repo');
const savedFlag = document.getElementById('saved');
const unsavedFlag = document.getElementById('unsaved');
const savedRepoFlag = document.getElementById('saved-repo');
const unsavedRepoFlag = document.getElementById('unsaved-repo');
const saveBtn = document.getElementById('save');

function setHide(status) {
  if (status === 'saved') {
    savedFlag.style.display = 'inline';
    unsavedFlag.style.display = 'none';
  } else if (status === 'unsaved') {
    savedFlag.style.display = 'none';
    unsavedFlag.style.display = 'inline';
  }
}

function setRepoHide(status) {
  if (status === 'saved') {
    savedRepoFlag.style.display = 'inline';
    unsavedRepoFlag.style.display = 'none';
  } else if (status === 'unsaved') {
    savedRepoFlag.style.display = 'none';
    unsavedRepoFlag.style.display = 'inline';
  }
}

function initialToken() {
  chrome.storage.sync.get(['bmToken', 'bmRepo'], function (value) {
    if (value.bmToken) {
      tokenInput.value = value.bmToken;
    }
    if (value.bmRepo) {
      repoInput.value = value.bmRepo;
    }
  });
}

function save() {
  const val = {
    bmToken: tokenInput.value,
    bmRepo: repoInput.value,
  }
  if (val.bmToken.trim() === '' || val.bmRepo.trim() === '') return;
  chrome.storage.sync.set(val, function () {
    setHide('saved');
    setRepoHide('saved');
  })
}

function debounce(func, wait) {
  let timer;
  return function () {
    const self = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(self, args);
    }, wait);
  }
}

const checkToken = debounce(function (evt) {
  const curToken = evt.target.value;
  chrome.storage.sync.get('bmToken', function (value) {
    if (value.bmToken !== curToken) {
      setHide('unsaved');
    } else {
      setHide('saved');
    }
  });
}, 250)

const checkRepo = debounce(function (evt) {
  const curRepo = evt.target.value;
  chrome.storage.sync.get('bmRepo', function (value) {
    if (value.bmRepo !== curRepo) {
      setRepoHide('unsaved');
    } else {
      setRepoHide('saved');
    }
  });
}, 250)

tokenInput.addEventListener('input', checkToken);
saveBtn.addEventListener('click', save)

initialToken();