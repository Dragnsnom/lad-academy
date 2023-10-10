const Hapi = require('@hapi/hapi');
const axios = require('axios');
const cheerio = require('cheerio');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');

const server = Hapi.server({ port: 3000, host: 'localhost' });

server.route({
  method: 'POST',
  path: '/analyze',
  handler: async (request, h) => {
    try {
      const { urls } = request.payload;

      const results = await Promise.all(
        urls.map(async (url) => {
          const response = await axios.get(url);
          const $ = cheerio.load(response.data);

          // Извлечение текста с веб-страницы и очистка от HTML и стилей
          const sanitizedText = sanitizeHtml($('body').html(), {
            allowedTags: [],
            allowedAttributes: {},
          });

          // Извлечение только буквенных символов и разбиение на слова
          const words = sanitizedText.match(/[a-zA-Zа-яА-ЯёЁ]+/g);

          // Считаем частоту слов и сортируем их
          const wordCount = {};
          words.forEach((word) => {
            if (word.length > 4) {
              wordCount[word] = (wordCount[word] || 0) + 1;
            }
          });

          const sortedWords = Object.keys(wordCount).sort(
            (a, b) => wordCount[b] - wordCount[a]
          );

          // Получаем три наиболее часто встречающихся слова длиннее 4 символов
          const topWords = sortedWords.slice(0, 3);

          return { url, topWords };
        })
      );

      // Создаем PDF-документ с результатами
      const pdfDoc = new PDFDocument();
      pdfDoc.font('task 1\\arial.ttf');
      const pdfStream = fs.createWriteStream('results.pdf');

      pdfDoc.pipe(pdfStream);
      pdfDoc.fontSize(14).text('Анализ текста на сайтах\n\n', { align: 'center' });

      results.forEach(({ url, topWords }) => {
        pdfDoc.text(url + '\n\n', { underline: true });
        pdfDoc.text(topWords.join(' | '));
        pdfDoc.moveDown();
      });

      pdfDoc.end();

      return h.response('PDF с результатами создан успешно').code(200);
    } catch (error) {
      console.error(error);
      return h.response('Произошла ошибка').code(500);
    }
  },
});

const startServer = async () => {
  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
