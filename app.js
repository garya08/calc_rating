const maxLength = 4;
const K = 5; // коэффициент влияния клиентских отзывов
const regEx = /\D/g;

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


const avg = document.querySelector('#avg'),
      count_auto = document.querySelector('#count_auto'),
      count_client = document.querySelector('#count_client');

const result = document.querySelector('#result');   // input результата

const autoList = document.querySelectorAll('.service_review');  // список input автоматические оценки
const clientList = document.querySelectorAll('.client_review');  // список input оценки клиентов


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
    
toggleInputs(count_auto, autoList)
toggleInputs(count_client, clientList)

//функция для подсчета суммы всех полей input
const summarize = function(list) {
    let sum = 0;
    for(let item of list) {
        sum += Number(item.value);
    }
    return sum;
}
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

wrongInputs(autoList, count_auto);
wrongInputs(clientList, count_client);

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
    let service = calcReviews(autoList) * parseInt(avg.value);
    let client = K * calcReviews(clientList) * parseInt(avg.value);

    let up =  service + client;
    let down = parseInt(avg.value) * (parseInt(count_auto.value) + K * parseInt(count_client.value));
    
    let answer = up/down;
    result.value = answer > 5 ? parseFloat('5').toFixed(2) : answer.toFixed(2);
})

