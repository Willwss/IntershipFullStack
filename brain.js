// Importar as dependências necessárias
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors')

// Inicializar o express
const app = express(); 

app.use(cors())

app.get('/api/scrape', async (req, res) => {
    const { keyword } = req.query;
    const url = `https://www.amazon.com.br/s?k=${keyword}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const products = [];

        $('.sg-col-inner').each((_, element) => {
            const title = $(element).find('#search > div.s-desktop-width-max.s-desktop-content.s-wide-grid-style-t1.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2').text();
            const rating = $(element).find('.a-row a-size-small').text();
            const reviews = $(element).find('.a-size-base').text();
            const image = $(element).find('.s-image').attr('src');

            products.push({ title, rating, reviews, image });
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao raspar os dados' });
    }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
