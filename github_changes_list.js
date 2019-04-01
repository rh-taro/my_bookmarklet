javascript:(() => {
  if (isDisplay()) {
    cleanModify();
    return false;
  }
  showFileListBox();
  originStyleModify();

  let x;
  let y;
  const el = document.getElementById("fileListHtml");
  el.addEventListener("mousedown", mdown, false);
  window.addEventListener("hashchange", function() {
    document.querySelectorAll('input[type="checkbox"].fileListCheckBox').forEach((el) => {
      if (el.checked) {
        document.getElementById(`diff-${el.dataset.idx}`).classList.remove('Details--on');
        document.getElementById(`diff-${el.dataset.idx}`).classList.add('open');
      } else {
        document.getElementById(`diff-${el.dataset.idx}`).classList.add('Details--on');
        document.getElementById(`diff-${el.dataset.idx}`).classList.remove('open');
      }
    })
  });

  /* ここから先はリストを作るための関数群 */
  function isDisplay() {
    return !!getListEl();
  }
  function getListEl() {
    return document.getElementById('fileListHtml');
  }
  function cleanModify() {
    const listEl = getListEl();
    listEl.parentNode.removeChild(listEl);

    let wrapEl = document.querySelector('.container.new-discussion-timeline.experiment-repo-nav');
    if (wrapEl) wrapEl.style = '';
    /* commit compare用 */
    wrapEl = document.getElementById('files_bucket').parentNode;
    if (wrapEl) wrapEl.style = '';
  }
  function originStyleModify() {
    let wrapEl = document.querySelector('.container.new-discussion-timeline.experiment-repo-nav');
    if (wrapEl) wrapEl.style = 'margin-left: 1%';
    /* commit compare用 */
    wrapEl = document.getElementById('files_bucket').parentNode;
    if (wrapEl) wrapEl.style = 'margin-left: 1%';
  }
  function showFileListBox() {
    let fileListHtml = "";
    let idx = 0;
    document.querySelectorAll('.file-info > a').forEach((el) => {
      let isChecked = true;
      if (document.getElementById(`diff-${idx}`).classList.contains('Details--on')) isChecked = false;
      const fileName = el.innerText;
      fileListHtml += `<input type="checkbox"` + (isChecked ? ' checked ' : ' ') + `class="fileListCheckBox" data-idx="${idx}"> <a data-idx="${idx}" class="fileAnchor" href="${el.href}" style="color: #ffffff; text-decoration: none;"><div style="display: inline-block;padding: 0.7rem 0;">${fileName}</div></a><br>`
      idx++;
    });

    const div = document.createElement('div');
    div.style = 'white-space: nowrap; line-height: 0;right: 0; padding: 25px;cursor: move; max-height: 80vh;overflow: auto;position: fixed; top: 100px; background-color: #252525;z-index:1000;';
    div.innerHTML = fileListHtml;
    div.id = 'fileListHtml';
    document.querySelector('.footer').appendChild(div);

    /* width指定しないと横に伸びちゃう */
    div.style.width = `${div.clientWidth}px`

    document.querySelectorAll('.fileListCheckBox').forEach((el) => {
      el.addEventListener('click', onClickCheck);
    });

    document.querySelectorAll('.fileAnchor').forEach((el) => {
      el.addEventListener('click', onClickFileAnchor);
      el.addEventListener('mouseover', (e) => {
        e.target.style['background-color'] = '#555555';
      });
      el.addEventListener('mouseout', (e) => {
        e.target.style['background-color'] = '';
      });
    });
  }
  function onClickCheck(e) {
    const idx = e.target.dataset.idx;
    if (e.target.checked) {
      document.getElementById(`diff-${idx}`).classList.remove('Details--on');
      document.getElementById(`diff-${idx}`).classList.add('open');
    } else {
      document.getElementById(`diff-${idx}`).classList.add('Details--on');
      document.getElementById(`diff-${idx}`).classList.remove('open');
    }
  }
  function onClickFileAnchor(e) {
    const prevEl = document.getElementById('nowAnchor');
    const idx = e.target.dataset.idx;
    if (prevEl) {
      prevEl.id = '';
      prevEl.style.color = '#ffffff';
    }
    e.target.id = 'nowAnchor';
    e.target.style.color = 'red';
  }

  /* ここから先はDnDの関数群 */
  function mdown(event) {
    if (event.target.id !== 'fileListHtml') return false;

    x = event.pageX - this.offsetLeft;
    y = event.pageY - this.offsetTop;

    document.body.addEventListener("mousemove", mmove, false);
  }
  function mmove(event) {
    const el = document.getElementById("fileListHtml");

    el.style.top = event.pageY - y + "px";
    el.style.left = event.pageX - x + "px";

    el.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
  }
  function mup(event) {
    const el = document.getElementById("fileListHtml");

    document.body.removeEventListener("mousemove", mmove, false);
    el.removeEventListener("mouseup", mup, false);
  }
})()
