// import { onGetLocaleStorageData, makeParseJson, onSetLocaleStorageData, FAVORITES_KEY } from "./index"; // импорт сервисных функций

const FAVORITES_KEY = "FAVORITES"

const refs = { // получаем ссылку на галерею новостей в избранном
    favoritesList: document.querySelector(".news-list")
}

refs.favoritesList.addEventListener("click", onRemoveFromFavorites); // вешаем слушатель событий на галерею новостей


onOpenFavorites(FAVORITES_KEY); // запуск функции для рендера страницы




//=============== Функция при открытии страныцы "Фавориты" ==================================
function onOpenFavorites(key) {
    const dataFromLocaleStorage = onGetLocaleStorageData(key); // получаем данные из избранных в Локальном Хранилище

    if (!dataFromLocaleStorage || dataFromLocaleStorage.length === 0) { // проверка на null или пустой массив
        console.log("Опаньки, а ничего нет");
        return;
    }

    onCreateMurkup(dataFromLocaleStorage);

}


//============= Функция-обработчик удаления из Избранных ==============================
function onRemoveFromFavorites(event) {
    if (!event.target.classList.contains("cards__button")) return; // проверка туда ли тырнули

    const card = event.target.closest(".cards__item");
    const cardIDLink = event.target.dataset.id; // получаем ID карточки в виде линка на первоисточник

    const dataFromLocaleStorage = onGetLocaleStorageData(FAVORITES_KEY); // получаем массив из Локального хранилища

    if (!dataFromLocaleStorage) { // проверка на null из пустого Локального Хранилища 
        console.log("News isn't in favorites");
        return;
    };

    const index = dataFromLocaleStorage.find((card, index) => { // получаем индекс нужной карточки
        if (card.link === cardIDLink) {
            return index;
        }
    });

    dataFromLocaleStorage.splice(index, 1) // удаляем карточку по индексу

    if (dataFromLocaleStorage.length === 0) { // проверяем пустой массив или нет
        localStorage.clear();
        onRemoveElement(card);
        return;
    }

    onSetLocaleStorageData(FAVORITES_KEY, dataFromLocaleStorage); // сетаем в локальное хранилище модифицированный массив

    onRemoveElement(card);        
}



//============= Функция для рендера страницы ===========================================
function onCreateMurkup(arrayOfObjects) { 

    const favoritesMurkup = arrayOfObjects.map(newsObject => { // перебираем массив из Локального хранилища и создаем разметку для карточки
        const { title, category, date, link, description, imageURL } = newsObject;
         
        return `<li class="cards__item">
                    <div class="cards__image-wrapper">
                        <img src="${imageURL}" class="cards__image" />
                        <p class="cards__category">${category}</p>
                        <button class="cards__button js-favorites" data-id="${link}" data-favorite="#">Remove from favorites</button>
                    </div>
                    <div class="cards__details">
                        <h2 class="cards__title">
                            ${title}
                        </h2>
                        <p class="cards__abstract">
                            ${description}
                        </p>
                        <div class="cards__row">
                            <p class="cards__date">${date}</p>
            
                            <a href="${link}" class="cards__link">Read more</a>
                        </div>
                    </div>
                </li>`;
    }).join(" ");

    return refs.favoritesList.innerHTML = favoritesMurkup;
}


//============= Функция удаления элементов из ДОМ ======================================
function onRemoveElement(element) {
    element.remove();
}





//==================== Сервис Функции ===========================================
function onGetLocaleStorageData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)); // получаем массив объектов из Локального Хранилища
    } catch (error) {
        console.log(error);
    }
}

function makeParseJson(stringData) {
    try {
        return JSON.parse(stringData);
    } catch (error) {
        console.log(error);
    }
}

function onSetLocaleStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}

