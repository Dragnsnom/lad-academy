const axios = require('axios');

const urlsToAnalyze = [
  'https://github.com/', 
  'https://lad-academy.ru/zadanie-dlya-backend-stazhirovki?gcmes=44610234674&gcmlg=11839887',
];

const postData = {
  urls: urlsToAnalyze,
};

axios.post('http://localhost:3000/analyze', postData)
  .then((response) => {
    console.log('Ответ от сервера:', response.data);
  })
  .catch((error) => {
    console.error('Произошла ошибка:', error);
  });