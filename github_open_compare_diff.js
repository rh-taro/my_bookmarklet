javascript:(() => {
  if (!isActiveCompare()) setEvent();

  /* ------------------------ 以下関数群 ------------------------ */
  function isActiveCompare() {
    return document.querySelector('html').dataset.isActiveCompare === 'true';
  }
  function setEvent() {
    document.querySelector('html').addEventListener('click', main);
    document.querySelector('html').dataset.isActiveCompare = true
  }
  function removeEvent() {
    document.querySelector('html').removeEventListener('click', main);
    document.querySelector('html').dataset.isActiveCompare = false
  }
  function main(event) {
    event.preventDefault();
    const el = event.target;

    /* コミットのリンクの場合 */
    if (isCommitLink(el)) {
      /* 選択状態にしたり外したり */
      if (el.dataset.isDiffSelected === 'true') {
        unselectCommit(el)
      } else {
        selectCommit(el);
      }

      const selectedNode = getSelectedNode();
      if (selectedNode.length === 2) {
        /* 新規タブ開く */
        if (isActiveCompare()) window.open(buildCompareUrl(selectedNode[0], selectedNode[1]));

        /* リセット */
        removeEvent();
        selectedNode.forEach(unselectCommit)
      }
    }
    /* 遷移を止めるため */
    return false;
  }
  function getSelectedNode() {
    return document.querySelectorAll('a[data-is-diff-selected="true"]');
  }
  function selectCommit(el) {
    el.dataset.isDiffSelected = true;
    el.style['background-color'] = '#404040';
  }
  function unselectCommit(el) {
    el.dataset.isDiffSelected = false;
    el.style['background-color'] = '';
  }
  function isCommitLink(el) {
    return el.classList.contains('commit-id')
  }
  function buildCompareUrl(startCommitEl, endCommitEl) {
    const repositoryUrl = document.querySelector('.repohead-details-container > h1 > strong > a').href;
    return `${repositoryUrl}/compare/${startCommitEl.innerText}...${endCommitEl.innerText}`;
  }
})()
