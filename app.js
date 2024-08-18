// ------------- КОНСТАНТЫ ------------- 
const maxLength = 4,
      K = 5, // коэффициент влияния клиентских отзывов
      regEx = /\D/g;


// ------------- ОСНОВНЫЕ ЭЛЕМЕНТЫ СТРАНИЦЫ -------------  
// Кол-во оценок Клиентов и Сервиса, Средний чек, поле результата, список элементов оценок клиентов и сервиса
const avgInputEl = document.querySelector('#avg'),
      serviceCountEl = document.querySelector('#count_auto'),
      clientCountEl = document.querySelector('#count_client'),
      resultEl = document.querySelector('#result'),   // input результата
      serviceReviewsEl = document.querySelectorAll('.service_review'),  // список input автоматические оценки
      clientReviewsEl = document.querySelectorAll('.client_review');  // список input оценки клиентов

      
// ------------- СОБЫТИЯ СТРАНИЦЫ ------------- 
// валидация ввода чисел во всех полях input на странице
document.querySelectorAll('input').forEach((item) => {
    item.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(regEx, '');
        // ограничение длинны вводимых чисел
        if (e.target.value.length > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
        }
    })
    // после изменения значения в input проверка если начинается с 0 => 0125, то обрезаем этот ноль
    item.addEventListener('change', (e)=> {
        if (e.target.value.length > 1) {
            // e.target.value = e.target.value.startsWith('0') ? e.target.value.slice(1) : e.target.value
            e.target.value = +e.target.value;  // использовали унарный плюс, который преобразовывает строку в число 
        } 
    })
});



// ------------- ФУНКЦИИ ------------- 
// функция отключения input если главное поле количества не заполнено или равно 0
const toggleInputs = (countInput, inputsList) => 
    countInput.addEventListener('input', (e)=> {
                
        for(let item of inputsList) {
            if (e.target.value === '0' || e.target.value.length == 0) {
                item.setAttribute('disabled', true);
                item.value = 0;
            } else {
                item.removeAttribute('disabled');
                item.value = ''
            }
        }
    })
//функция для подсчета суммы всех полей input
const summarize = function(list) {
    let sum = 0;
    for(let item of list) {
        sum += Number(item.value);
    }
    return sum;
}
// функция для отслеживания ошибки превышения общего количества
const wrongInputs = (inputsList, countInput) => inputsList.forEach((item) => {
    item.addEventListener('input', (e)=> {
        if(summarize(inputsList) > Number(countInput.value)) {
            e.target.parentNode.classList.add('wrong');
            e.target.classList.add('wrong');
        } else {
            e.target.parentNode.classList.remove('wrong');
            e.target.classList.remove('wrong');
        }
        if (e.target.value == 0 || e.target.value == '') {
            e.target.parentNode.classList.remove('wrong')
            e.target.classList.remove('wrong')
        }
    })
})
// функция перемножения количества оценок и баллов за оценку
const calcReviews = (inputList) => {
    let sum = 0;
    inputList.forEach((item) => {
        if(item.value) sum += parseInt(item.value) * parseInt(item.dataset.value);
    })
    return sum;
}
// вычисление рейтинга
document.querySelector('#btn_result').addEventListener('click', () => {
    let service = calcReviews(serviceReviewsEl) * parseInt(avgInputEl.value);
    let client = K * calcReviews(clientReviewsEl) * parseInt(avgInputEl.value);

    let up =  service + client;
    let down = parseInt(avgInputEl.value) * (parseInt(serviceCountEl.value) + K * parseInt(clientCountEl.value));
    
    let answer = up/down;
    resultEl.value = answer > 5 ? parseFloat('5').toFixed(2) : answer.toFixed(2);
})



// ------------- ВЫЗОВ НЕОБХОДИМЫХ ФУНКЦИЙ ------------- 
toggleInputs(serviceCountEl, serviceReviewsEl)
toggleInputs(clientCountEl, clientReviewsEl)

wrongInputs(serviceReviewsEl, serviceCountEl);
wrongInputs(clientReviewsEl, clientCountEl);




