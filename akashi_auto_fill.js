javascript:(() => {
  // すでに出勤or退勤しているものを上書きする
  const isOverwrite = true;
  let targetDateList = getTargetDateList();

  if (targetDateList.length !== 0) {
    // モーダル開く
    document.querySelector(`a[href="/working_records/new?date=${targetDateList[0]}"]`).click();

    // 監視のためのobserver グローバルにするためにあえてvar
    // モーダルが開いたことを検知して処理を始める
    var observer = new MutationObserver(() => openModalCallback(targetDateList));
    observer.observe(document.getElementById("mask-default"), { attributes: true, attributeFilter: ["class"] });
  }

  function getTargetDateList() {
    // 休日じゃない日付一覧取得
    let targetDateList = [];
    let year = new Date().getFullYear();
    document.querySelectorAll('tr[id^="working_report"]').forEach((el) => {
      // 休日じゃない And 入力欄がある
      let inputNodeList = el.querySelectorAll('input[type="text"][name^="form[working_records_attributes]["]');
      if (!el.textContent.match(/休日/) && inputNodeList.length === 2) {
        // 上書きするかしないかで変わる
        if (isOverwrite || (inputNodeList[0].value === '' && inputNodeList[1].value === '')) {
          let monthDay = el.querySelector('td[rowspan="2"]').textContent.trim();
          let date = new Date(`${year}/${monthDay}`);
          let month = ('0' + (date.getMonth() + 1)).slice(-2);
          let day = ('0' + date.getDate()).slice(-2);
          targetDateList.push(`${year}-${month}-${day}`);
        }
      }
    });
    return targetDateList;
  }

  function openModalCallback(targetDateList) {
    // 監視を終了する
    observer.disconnect();
    // すでにある日付を消す
    document.querySelector('button.js-remove-date-button').click();

    // 稼働日の日付追加
    targetDateList.forEach((ymd) => {
      document.querySelector('input[name="apply_date_value"]').value = ymd;
      document.querySelector('button.c-add-button').click();
    });

    // 労働時間/休憩時間の入力
    document.querySelector('#form_working_record_attributes_result_start_time_text').value = '10:00';
    document.querySelector('#form_working_record_attributes_result_end_time_text').value = '19:00';
    document.querySelector('#form_working_record_attributes_break_time_results_attributes_0_result_break_time_start_time_text').value = '12:00';
    document.querySelector('#form_working_record_attributes_break_time_results_attributes_0_result_break_time_end_time_text').value = '13:00';

    // 確定
    document.querySelector('input[type="submit"]').click();
  }
})()

