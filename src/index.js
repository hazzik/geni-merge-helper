const results = document.querySelector('.results, #surname_people_list');
const profilesToMerge = [];

document.querySelectorAll('tr.list_row:not([data-profile-id])').forEach(tr => {
  const [_, profile_id] = /list_row_(\w+)/.exec(tr.id);
  tr.setAttribute('data-profile-id', profile_id);
  const td = tr.querySelector('td.name');
  td.innerHTML = `<p class="strong mbn"><a href="https://www.geni.com/profile/index/${profile_id}">${td.innerHTML}</a></p>`;
});

document.querySelectorAll('tr[data-profile-id]').forEach(tr => {
  const id = tr.getAttribute('data-profile-id');
  const span = tr.querySelector('.name_cell .strong, strong');
  var cb = createMergeCheckbox(id);
  span.insertBefore(cb, span.firstChild);
  span.querySelectorAll('a[onclick]').forEach(a => {
    a.removeAttribute('onclick');
    a.setAttribute('href', `https://www.geni.com/profile/index/${id}`);
  })
});

function createMetgeButton() {
  const mergeButton = document.createElement('a');
  mergeButton.text = "Merge";
  mergeButton.setAttribute('class', 'super blue button large');
  mergeButton.setAttribute('disabled', 'disabled');
  mergeButton.addEventListener('click', () => {
    const [head, ...tail] = profilesToMerge;
    const url = `https://www.geni.com/merge/compare/${head}?to=${tail.join('%2C')}`;
    window.open(url);
  });
  return mergeButton;
}

function createMergeCheckbox(id) {
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('class', 'merge_profile_cbx');
  checkbox.setAttribute('data-profile-id', id);
  checkbox.addEventListener('click', toggleMergeButton);
  return checkbox;
}

const mergeButton = createMetgeButton();

function toggleMergeButton() {
  const id = this.getAttribute('data-profile-id');
  if (this.checked) {
    profilesToMerge.push(id);
  } else {
    profilesToMerge.splice(profilesToMerge.indexOf(id), 1);
  }
  if (profilesToMerge.length > 1){
    mergeButton.removeAttribute('disabled');
  } else {
    mergeButton.setAttribute('disabled', 'disabled');
  }
}

results.insertBefore(mergeButton, results.firstChild);