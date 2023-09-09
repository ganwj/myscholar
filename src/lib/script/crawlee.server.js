import { PlaywrightCrawler } from 'crawlee';
import { router } from './router.server.js';

const crawler = new PlaywrightCrawler({
	requestHandler: router
});

(async () => {
	await crawler.run(['https://unienrol.com/universities']);
})();
