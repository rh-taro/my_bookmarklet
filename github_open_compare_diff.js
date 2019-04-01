javascript:(() => {
  document.querySelector('html').onclick = (e) => {
    /* コミットのリンクの場合 */
    if (e.target.classList.contains('commit-id')) {
      /* 選択状態にしたり外したり */
      if (e.target.dataset.isDiffSelected === 'true') {
        e.target.style['background-color'] = '';
        e.target.dataset.isDiffSelected = false;
      } else {
        e.target.dataset.isDiffSelected = true;
        e.target.style['background-color'] = '#404040';
      }

      const selectedNode = document.querySelectorAll('a[data-is-diff-selected="true"]');
      if (selectedNode.length === 2) {
        selectedNode.forEach((el) => {
          el.style['background-color'] = '';
          el.dataset.isDiffSelected = false;
        });
        /* 色変えたやつとかdataをリセットして新規タブ開く */
        let repositoryUrl = document.querySelector('.repohead-details-container > h1 > strong > a').href;
        document.querySelector('html').onclick = null;
        window.open(`${repositoryUrl}/compare/${selectedNode[0].innerText}...${selectedNode[1].innerText}`);
      }

      /* 遷移を止めるため */
      return false;
    }
  }
})()
