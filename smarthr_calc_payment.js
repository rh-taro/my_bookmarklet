(() => {
  year = prompt('計算したい年度を入力', new Date().getFullYear());
  Promise.all([...document.querySelectorAll(`ul[id="target-${year}"] li a`)].map((link) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest;
      xhr.open("GET", link.href, true)
      xhr.responseType = "document"
      xhr.send()
      xhr.onerror = reject;
      xhr.onload = () => {
        if (200 !== xhr.status) {
          reject();
        } else {
          // 明細のtableをobjectに変換する
          table_to_object = (table_name) => {
            object = {};
            table = [...xhr.response.querySelectorAll('table')].filter(el => el.querySelector('th').innerText.trim() === table_name)[0]
            table.querySelectorAll('tr').forEach((el) => {
              split = el.innerText.trim().split("\n");
              if (split.length === 2 && split[0] !== '' && split[1] !== '') {
                object[split[0]] = parseInt(split[1].replace(/,/g, ''), 10)
              }
            });
            return object;
          };

          payslip = { title: xhr.response.getElementsByClassName('payslipTitle')[0].innerText.trim(), payment: {}, deduction: {} };

          // 支給と控除をオブジェクトに詰める
          payslip['payment'] = table_to_object('支給')
          payslip['deduction'] = table_to_object('控除')

          resolve(payslip);
        }
      };
    });
  })).then((year_payslips) => {
    totalPayment = 0;
    socialInsurance = 0;

    // 総支給額計算
    year_payslips.forEach((payslip) => {
      Object.keys(payslip['payment']).forEach((key) => {
        if (key !== '立替経費') {
          totalPayment += payslip['payment'][key];
        }
      });
    });

    // 社会保険料計算
    year_payslips.forEach((payslip) => {
      Object.keys(payslip['deduction']).forEach((key) => {
        if (['健康保険料', '厚生年金保険料', '雇用保険料'].includes(key)) {
          socialInsurance += payslip['deduction'][key];
        }
      });
    });

    message = `総支給額: ${totalPayment}\n社会保険料: ${socialInsurance}\n\n明細json:\n${JSON.stringify(year_payslips)}`;

    let textarea = document.getElementById('autoCalcResult')
    if (!textarea) {
      textarea = document.createElement('textarea');
      textarea.classList.add('col-md-6', 'col-md-offset-3');
      textarea.id = 'autoCalcResult'
      document.querySelector('.container').prepend(textarea);
    }
    textarea.rows = 15
    textarea.readOnly = true
    textarea.innerHTML = message;
  });
})();
