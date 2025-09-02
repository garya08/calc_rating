// ------------- КОНСТАНТЫ ------------- 
const red = '#ff4a4a',
      main_clr = '#00822b';

const maxLength = 4,
      K = 5, // коэффициент влияния клиентских отзывов
      regEx = /\D/g,
      goodRating = 4.5;


const textArea = document.getElementById('paste-target');
const btnClear = document.querySelector('.btn--clear');
const btnResult = document.querySelector('#btn_result');
const resultEl = document.querySelector('#result');
let DataJSON;

// Парсинг данных для вставки
textArea.addEventListener('paste', (e) => {
  e.preventDefault(); // Отменяем дефолтное поведение вставки
  let data = (e.clipboardData || window.clipboardData).getData('text');

  
  let tableData = data.split(/\r\n|\n|\r/).map(row => row.split('\t'));
  
  DataJSON = tableData.map(row => {
      return {
          "sum": Number(row[0]),
          "auto_rev": Number(row[1]),
          "client_rev": Number(row[2])
        };
    });
    
    e.target.value = JSON.stringify(DataJSON,null,2);
    console.log(DataJSON);
    btnResult.removeAttribute('disabled');
});

// очистка страницы
btnClear.addEventListener('click', () => {
    btnResult.setAttribute('disabled', true);
    resultEl.value = '';
    textArea.value = '';
    textArea.focus();
});

// вычисление рейтинга
btnResult.addEventListener('click', () => {
    const autoSumRev = DataJSON.reduce(
        function(sum, currentAccount) {
            return sum + currentAccount.sum*currentAccount.auto_rev
        }, 0
    )
    const clientSumRev = DataJSON.reduce(
        function(sum, currentAccount) {
            return sum + currentAccount.sum*currentAccount.client_rev*5
        }, 0
    )
    const autoSum = DataJSON.reduce(
        function(sum, currentAccount) {
            return sum + currentAccount.sum
        }, 0
    )
    const clientSum = DataJSON.reduce(
        function(sum, currentAccount) {
            return currentAccount.client_rev != 0 ? sum + currentAccount.sum : sum + 0
        }, 0
    )

    let result = (autoSumRev+clientSumRev)/(autoSum+5*clientSum);
    // console.log(result);
    resultEl.value = result > 5 ? parseFloat('5').toFixed(2) : result.toFixed(2);
    resultEl.style.color = result > goodRating ? main_clr : red;

    btnResult.setAttribute('disabled', true);
});

