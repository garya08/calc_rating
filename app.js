// ------------- КОНСТАНТЫ ------------- 
const red = '#ff4a4a',
      main_clr = '#00822b';

const maxLength = 4,
      K = 5, // коэффициент влияния клиентских отзывов
      regEx = /\D/g,
      goodRating = 4.5;

// ------------- ОСНОВНЫЕ ЭЛЕМЕНТЫ СТРАНИЦЫ -------------  
// Кол-во оценок Клиентов и Сервиса, Средний чек, поле результата, список элементов оценок клиентов и сервиса
const inputs = document.querySelectorAll('input'),
      avgInputEl = document.querySelector('#avg'),
      serviceCountEl = document.querySelector('#serviceCount'),
      clientCountEl = document.querySelector('#clientCount'),
      resultEl = document.querySelector('#result'),   // input результата
      btnResult = document.querySelector('#btn_result'),
      btnClear = document.querySelector('.btn--clear'),
      serviceReviewsList = document.querySelectorAll('.service_review'),  // список input автоматические оценки
      clientReviewsList = document.querySelectorAll('.client_review');  // список input оценки клиентов


// ------------- СОБЫТИЯ СТРАНИЦЫ ------------- 
// валидация ввода чисел во всех полях input на странице
inputs.forEach((item) => {
    item.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(regEx, '');
        // ограничение длинны вводимых чисел
        if (e.target.value.length > maxLength) {
            e.target.value = e.target.value.substring(0, maxLength);
        }
        
        // Проверка - клиент распределил все количество отзывов или нет
        if(checkSumWrong(serviceReviewsList) == serviceCountEl.value && checkSumWrong(clientReviewsList) == clientCountEl.value) {
            btnResult.removeAttribute('disabled')       // разблокировать кнопку Calculate
        } else {
            btnResult.setAttribute('disabled', true)    // заблокировать кнопку Calculate
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
// проверка на заполнение главных полей ввода => блокирование кнопки
// window.addEventListener('input', () => {
//     let full = true;
//     document.querySelectorAll('.params').forEach((item) => {
//         if(!item.value.length) full = false;
//     })
//     if(full) btnResult.removeAttribute('disabled')
//     else btnResult.setAttribute('disabled', true)
// })
// вычисление рейтинга
btnResult.addEventListener('click', () => {
    let service = calcReviews(serviceReviewsList) * parseInt(avgInputEl.value);
    let client = K * calcReviews(clientReviewsList) * parseInt(avgInputEl.value);

    let up =  service + client;
    let down = parseInt(avgInputEl.value) * (parseInt(serviceCountEl.value) + K * parseInt(clientCountEl.value));
    
    let answer = up/down;
    
    resultEl.value = answer > 5 ? parseFloat('5').toFixed(2) : answer.toFixed(2);
    resultEl.style.color = answer > goodRating ? main_clr : red;
})
// очистка страницы
btnClear.addEventListener('click', () => {
    for (const element of inputs) {
        element.value = '';
    }
    btnResult.setAttribute('disabled', true);
    serviceReviewsList.forEach((item) => item.setAttribute('disabled', true));
    clientReviewsList.forEach((item) => item.setAttribute('disabled', true));
    document.querySelectorAll('.wrong').forEach((item) => item.classList.remove('wrong'));
    document.querySelectorAll('.done').forEach((item) => item.classList.remove('done'));
})


// ------------- ФУНКЦИИ ------------- 
// функция отключения input если главное поле количества не заполнено или равно 0
const toggleInputs = (countInput, inputsList) => 
    countInput.addEventListener('input', (e)=> {
                
        for(let item of inputsList) {
            if (+e.target.value === 0) {
                item.setAttribute('disabled', true);
                item.value = 0;
            } else {
                item.removeAttribute('disabled');
                item.value = '';
            }
        }
    })
// функция состояний полей ввода
const checkInputs = (list, count) => list.forEach((input) => {
    input.addEventListener('input', (e) => {
        let checkSum = checkSumWrong(list);
        let commonSum = count.value;
        if(checkSum > 0 && checkSum <= commonSum) {
            list.forEach((item) => item.parentNode.classList.remove('wrong'));      // удаление класса wrong у всех
            list.forEach((item) => item.parentNode.classList.remove('done'));      // удаление класса done у всех
            chooseAttribute(list, false);
            if(checkSum == commonSum) {
                list.forEach((item) => {
                    item.parentNode.classList.add('done'); 
                    if(!item.value) item.setAttribute('disabled', true)
                })
            }
        } else if(!checkSum <= 0) {
            e.target.parentNode.classList.add('wrong');
            chooseAttribute(list, true);
            list.forEach((item) => item.parentNode.classList.remove('done'));      // удаление класса done у всех
        }
    })
})

// ====== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======
//функция для подсчета суммы всех полей input
const checkSumWrong = function(list) {
    let sum = 0;
    for(let item of list) {
        sum += Number(item.value);
    }
    return sum;
}
// функция перемножения количества оценок и баллов за оценку
const calcReviews = (inputList) => {
    let sum = 0;
    inputList.forEach((item) => {
        if(item.value) sum += parseInt(item.value) * parseInt(item.dataset.value);
    })
    return sum;
}
// функция для включения/отключения пустых или равных 0 полей input
const chooseAttribute = (list, status) => {
    if(status){
        list.forEach((item) => {
            if(+item.value === 0) item.setAttribute('disabled', true)
        })
    } else {
        list.forEach((item) => {
            if(+item.value === 0) item.removeAttribute('disabled')
        })
    }
}



// ------------- ВЫЗОВ НЕОБХОДИМЫХ ФУНКЦИЙ ------------- 
toggleInputs(serviceCountEl, serviceReviewsList)
toggleInputs(clientCountEl, clientReviewsList)

checkInputs(serviceReviewsList, serviceCountEl);
checkInputs(clientReviewsList, clientCountEl);


