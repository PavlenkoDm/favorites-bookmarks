
const BASE_URL = 'https://api.nytimes.com/svc';
const API_KEY = 'uGHJWsajhmnJg2AMcnCD9YXkamMpVOHo';

const fetchPopularArticles = async () => {
    try {

        const response = await fetch(`${BASE_URL}/mostpopular/v2/viewed/1.json?api-key=${API_KEY}`);
        const news = await response.json();
        return news.results[0];
    } catch (error) {console.log(error)}
}
//==============================================================================================
const refs = {
    newsGallery: document.querySelector('.newsgallery')
}


fetchPopularArticles().then(data => {
    
    const image = data.media[0]["media-metadata"][2].url;

    const toString = {
        category: data.section,
        date: data.published_date,
        link: data.url,
        description: data.abstract,
        imageURL: image,
    }

    const buttonFavoritesJson = JSON.stringify(toString);
       
    return refs.newsGallery.innerHTML = `<ul>
             <li class="cards__item">
                 <div class="cards__image-wrapper">
                    <img src="${image}" class="cards__image" />
                     <p class="cards__category">${data.section}</p>
                     <button class="cards__button" data-id="${data.url}" data-favorite='${buttonFavoritesJson}'>Add to favorites</button>
                 </div>
                 <div class="cards__details">
                     <h2 class="cards__title">
                         ${data.title}
                     </h2>
                     <p class="cards__abstract">
                         ${data.abstract}
                     </p>
                     <div class="cards__row">
                         <p class="cards__date">${data.published_date}</p>

                         <a href="${data.url}" class="cards__link">Read more</a>
                     </div>
                 </div>
             </li>
         </ul>`;
});





//================================= Моя логика ============================================================

const FAVORITES_KEY = "FAVORITES";
const favorites = [];

refs.newsGallery.addEventListener('click', onAddRemoveLocaleStorageData);




//=========== Функция-обработчик Клика на кнопку добавить/убрать в/из Фавориты ==============================================

function onAddRemoveLocaleStorageData(event) {
    if (!event.target.classList.contains("cards__button")) return; // проверка туда ли тырнули

    const parsedCardData = makeParseJson(event.target.dataset.favorite); // получаем объект данных с карточки
    const dataFromLocaleStorage = onGetLocaleStorageData(FAVORITES_KEY); // получаем массив объектов из Локального Хранилища

    if (event.target.classList.contains("js-favorites")) {// проверка содержит ли кнопка класс-метку что новость добавлена

        event.target.textContent = "Add to favorites"; // изменение текстового контента кнопки

        event.target.classList.remove("js-favorites"); // убираем класс-метку что карточка добавлена в Фавориты

        if (!dataFromLocaleStorage) { // проверка на null из пустого Локального Хранилища 
            console.log("News isn't in favorites");
            return;
        };

        const index = dataFromLocaleStorage.find((card, index) => { // получаем индекс нужной карточки
            if (card.link === parsedCardData.link) {
                return index;
            }
        });

        dataFromLocaleStorage.splice(index, 1)

        if (dataFromLocaleStorage.length === 0) {
            localStorage.clear();
            return;
        }

        onSetLocaleStorageData(FAVORITES_KEY, dataFromLocaleStorage);

        return;        
    }

    event.target.textContent = "Remove from favorites"; // изменение текстового контента кнопки

    event.target.classList.add("js-favorites"); // добавляем класс-метку что карточка добавлена в Фавориты

    if (dataFromLocaleStorage) { 
        const findPresenceResult = dataFromLocaleStorage.some(card => card.link === parsedCardData.link); // получаем булевое значение есть ли новость в избранном

        if (findPresenceResult) { // Делаем проверку новости на присутствие в Локальном Хранилище
            console.log("It's allredy in Favorites");
            return;
        }

        favorites = [...dataFromLocaleStorage]; // распыляем в массив Фавориты данные из массива полученные из Локального хранилища
    }

    favorites.push(parsedCardData); // добавляем объект с данными карточки новости в массив Фавориты

    onSetLocaleStorageData(FAVORITES_KEY, favorites); // сетаем в локальное хранилище

}






//========== Функция для Получения Данных из Locale Storage =======================================
function onGetLocaleStorageData(key) {
    try {

        return JSON.parse(localStorage.getItem(key)); // получаем массив объектов из Локального Хранилища

    } catch (error) {
        console.log(error);
    }
}


//========== Функция парсинга данных из JSON файла =================================================
function makeParseJson(stringData) {
    try {
        return JSON.parse(stringData);
    } catch (error) {
        console.log(error);
    }
}


//========== Функкция Добавления Данных в Locale Storage ========================================
function onSetLocaleStorageData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}


















// refs.newsGallery.innerHTML = `<ul>
//             <li class="cards__item">
//                 <div class="cards__image-wrapper">
//                     <img src="${newsCardObject.media[0].media-metadata[2].url}" class="cards__image" />
//                     <p class="cards__category">${newsCardObject.section}</p>
//                     <button class="cards__button" data-id="${newsCardObject.url}" data-favorite="favorite">Add to favorite</button>
//                 </div>
//                 <div class="cards__details">
//                     <h2 class="cards__title">
//                         ${newsCardObject.title}
//                     </h2>
//                     <p class="cards__abstract">
//                         ${newsCardObject.abstract}
//                     </p>
//                     <div class="cards__row">
//                         <p class="cards__date">${newsCardObject.published_date}</p>
//
//                         <a href="${newsCardObject.url}" class="cards__link">Read more</a>
//                     </div>
//                 </div>
//             </li>
//         </ul>`;