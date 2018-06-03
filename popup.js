const descInput = document.getElementById('desc');
const saveBtn = document.getElementById('submit');
const loading = document.getElementById('loading');
const resultDom = document.getElementById('result');

function saveBm() {
  resultDom.innerText = '';
  chrome.storage.sync.get(['bmToken', 'bmRepo'], function (value) {
    if (value.bmToken === '' || value.bmRepo === '') {
      resultDom.innerText = 'Please set github token and repository path!';
      return;
    }
    loading.style.visibility = 'visible';
    const url = `https://api.github.com/repos/${value.bmRepo}/contents/README.md`;
    fetch(url, {
      headers: {
        Authorization: `token ${value.bmToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const sha = data.sha;
      const origin = atob(data.content);
      let content = '<br>';
      if (descInput.value.trim() !== '') {
        content += `${descInput.value.trim()}<br>`;
      }
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
          content += `${tabs[0].url}<br>`;
          postData = {
            path: 'README.md',
            message: 'Add new bookmark.',
            sha,
            content: `${btoa(origin + content)}`
          }
          fetch(url, {
            body: JSON.stringify(postData),
            headers: {
              Authorization: `token ${value.bmToken}`,
              'content-type': 'application/json'
            },
            method: 'PUT'
          })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            resultDom.innerText = 'Successfully saved!';
            loading.style.visibility = 'hidden';
          })
          .catch(error => {
            resultDom.innerText = 'Failed to save bookmark!';
            loading.style.visibility = 'hidden';
          })
      });
    })
    .catch(error => {
      resultDom.innerText = 'Failed to access github!';
      loading.style.visibility = 'hidden';
    })
  });
}

saveBtn.addEventListener('click', saveBm);