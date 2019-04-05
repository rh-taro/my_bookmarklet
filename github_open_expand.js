javascript:(() => {
  openExpandUp();
  openExpandDown();
  openExpandAll();

  function openExpandUp() {
    const list = document.querySelectorAll('a[title="Expand Up"]');
    firedClick(list);
  }

  function openExpandDown() {
    const list = document.querySelectorAll('a[title="Expand Down"]');
    firedClick(list);
  }

  function openExpandAll() {
    const list = document.querySelectorAll('a[title="Expand All"]');
    firedClick(list);
  }
  function firedClick(list) {
    list.forEach(el => el.click());
  }
})()
