// https://ytyng.github.io/bookmarklet-script-compress/ で変換する
(() => {
  let monthApply = document.getElementById('month_apply')
  if (monthApply.dataset.modified) return;
  monthApply.dataset.modified = true;

  document.querySelectorAll('td > div > a[href^="/works/"]').forEach(el => {
    let dayId = el.parentElement.id.replace('work_edit_', '');
    let day = el.parentElement.parentElement.getElementsByClassName('date')[0].innerText.trim();

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `automate_target_${dayId}`;
    input.dataset.dayId = dayId;
    input.dataset.day = day;
    el.parentElement.appendChild(input);

    /* クリックの範囲を広げてカーソルをわかりやすくする */
    el.parentElement.parentElement.parentElement.onclick = ((e) => {
      if (e.srcElement.tagName === 'INPUT') return;
      if (e.srcElement.tagName === 'A') return;
      document.getElementById(input.id).checked = !document.getElementById(input.id).checked;
    });
    el.parentElement.parentElement.parentElement.style = 'cursor: pointer;';
    input.style = 'cursor: pointer;';

    el.remove();
  });

  submitAction = (event) => {
    event.target.classList.add('btnDisabled');
    block_with_message();
    Promise.all([...document.querySelectorAll('input[id^="automate_target_"]:checked')].map(el => {
      const body = new FormData();  
      body.append('parent_id', parent_id = new URL(document.querySelector('a[href^="/works/month_application"]').href).searchParams.get('pid'));
      body.append('d', document.getElementById('select').value);
      body.append('work[day]', `${document.getElementById('select').value}-${el.dataset.day}`);
      body.append('authenticity_token', document.getElementsByName('authenticity_token')[0].value);
      body.append('_method', 'patch');
      body.append('utf8', '✓');
      body.append('work[segment_id]', '1');
      body.append('prev_segment_id', '1');
      body.append('work[next_day_start]', '');
      body.append('work[next_day_end]', '');
      body.append('work[next_day_break_1_start]', '0');
      body.append('work[next_day_break_1_end]', '0');
      body.append('work[break_1_auto]', 'true');
      body.append('work[break_2_start_at_str]', '');
      body.append('work[next_day_break_2_start]', '0');
      body.append('work[break_2_end_at_str]', '',);
      body.append('work[next_day_break_2_end]', '0');
      body.append('work[notes]', '');
      body.append('work[status]', 1);
      body.append('removed_ids', '');
      body.append('work[break_2_auto]', 'false');
      body.append('kango_time_paid_holiday_time_zones[1][time_at]', '');
      body.append('kango_time_paid_holiday_time_zones[1][time_length]', '0');
      body.append('kango_time_paid_holiday_time_zones[0][time_length]', '0');
      body.append('holiday', 'false'); 

      body.append(event.target.dataset.key, event.target.dataset.value);

      body.append('work[start_at_str]', '10:30');
      body.append('work[end_at_str]', '19:30');
      body.append('work[break_1_start_at_str]', '14:30');
      body.append('work[break_1_end_at_str]', '15:30');    

      const method = 'POST';
      const credentials = 'include';

      return fetch(`https://p.ieyasu.co/works/${el.dataset.dayId}`, { method, body, credentials, redirect: 'manual' });
    })).then(() => {
      location.reload();
    });
  };

  div_regist = Object.assign(document.createElement('div'), { className: 'btn btnSubmit', innerText: '一括登録', onclick: submitAction });
  Object.assign(div_regist.dataset, { key: 'commit', value: '登録する' });

  div_regist_apply = Object.assign(document.createElement('div'), { className: 'btn btnSubmit', innerText: '一括登録&申請', onclick: submitAction });
  Object.assign(div_regist_apply.dataset, { key: 'add_application', value: '申請する' });

  monthApply.append(div_regist, div_regist_apply);
})();

