import { createPlaywrightRouter, Request } from 'crawlee';
import https from 'https';

export const router = createPlaywrightRouter();

router.addHandler('scholarship_detail', async ({ request, page }) => {
	const scholarshipDetails = await page.$eval(
		'div.scholarship-detail',
		(scholarship, userData) => {
			const name = scholarship.querySelector('h1');
			const feePrefix = scholarship.querySelector('div.details-awards span:nth-child(1)');
			const fee = scholarship.querySelector('div.details-awards span:nth-child(2)');
			const course = scholarship.querySelector('div.row.no-gutters.mt-2:nth-child(2) div.col span');
			const field = scholarship.querySelector('div.row.no-gutters.mt-2:nth-child(3) div.col span');
			const criteria = scholarship.querySelectorAll(
				'div.col-xl-8.col-lg-7.col-md-8.mt-3.f-small.f-md-default li, div.col-xl-8.col-lg-7.col-md-8.mt-3.f-small.f-md-default p'
			);
			const highlights = scholarship.querySelectorAll(
				'section.section-awards>div.col-12.mt-4:nth-child(2) li, section.section-awards>div.col-12.mt-4:nth-child(2) p'
			);
			const awards = scholarship.querySelectorAll(
				'section.section-awards>div.col-12.mt-4:nth-child(4) li, section.section-awards>div.col-12.mt-4:nth-child(4) p'
			);
			let details;
			let application;
			const amountMatchingArray = [];
			if (scholarship.querySelector('div.awards-prize-container') !== null) {
				details = scholarship.querySelector(
					'section.section-awards>div.col-12.mt-4:nth-child(7) p'
				);
				application = scholarship.querySelectorAll(
					'section.section-awards>div.col-12.mt-4:nth-child(9) li, section.section-awards>div.col-12.mt-4:nth-child(9) p'
				);
				const tables = scholarship.querySelectorAll('div.owl-item:not(.cloned)');
				const items = [];
				for (const table of tables) {
					const rows = table.querySelectorAll('div.prize-list div.row>div.col');

					for (let i = 0; i < rows.length; i += 2) {
						const resultRow = rows[i];
						const amountRow = rows[i + 1];

						const item = {
							result: resultRow
								.querySelector('div.col:not(.col-xl-auto) span')
								?.textContent?.trim(),
							amount: amountRow.querySelector('div.col.col-xl-auto span')?.textContent?.trim()
						};

						items.push(item);
					}
					const amountMatching = {
						title: table.querySelector('div.col-12.col-md-8.p-2>span')?.textContent?.trim(),
						items: JSON.stringify(items),
						remarks: table.querySelector('div.row.mt-2 span')?.textContent?.trim()
					};
					amountMatchingArray.push(amountMatching);
				}
			} else {
				details = scholarship.querySelector(
					'section.section-awards>div.col-12.mt-4:nth-child(6) p'
				);
				application = scholarship.querySelectorAll(
					'section.section-awards>div.col-12.mt-4:nth-child(8) li, section.section-awards>div.col-12.mt-4:nth-child(8) p'
				);
			}
			// @ts-ignore
			const toText = (element) => element && element.innerText.trim();

			return {
				name: toText(name),
				waiver: toText(feePrefix) + ' ' + toText(fee),
				course_level: toText(course),
				field_of_study: toText(field),
				criteria: Array.from(criteria).map((criterion) => toText(criterion)),
				highlights: Array.from(highlights).map((highlight) => toText(highlight)),
				awards: Array.from(awards).map((award) => toText(award)),
				amount_matching: amountMatchingArray,
				details: toText(details),
				application: Array.from(application).map((detail) => toText(detail)),
				...userData
			};
		},
		request.userData
	);
	console.log(scholarshipDetails);
});

router.addHandler('scholarship_overview', async ({ page, crawler }) => {
	const country = await page.$eval('#nav-Location>div>div:nth-child(1) button span', (element) => {
		return element.textContent?.trim() ?? '';
	});

	const institution = await page.$eval(
		'#nav-Location>div>div:nth-child(3) li.active label',
		(element) => {
			return element.textContent?.trim() ?? '';
		}
	);

	const scholarships = await page.$$eval('a.scholarship-item', (scholarships) => {
		const data = [];
		for (const scholarship of scholarships) {
			const type = scholarship.querySelectorAll('.results-badge span');
			const coverage = scholarship.querySelectorAll('.benefits-list span');
			const interview = scholarship.querySelector('.extra-info-top');
			const instantApprove = scholarship.querySelector('.extra-info-bottom');
			// @ts-ignore
			const toText = (element) => element && element.innerText.trim();
			const item = {
				institution: '',
				country: '',
				type: Array.from(type).map((type) => toText(type)),
				coverage: Array.from(coverage).map((benefit) => toText(benefit)),
				interview: interview === null ? 'yes' : 'no',
				instant_approval: instantApprove === null ? 'no' : 'yes',
				url: scholarship.getAttribute('href')
			};
			data.push(item);
		}
		return data;
	});

	for (const scholarship of scholarships) {
		scholarship.institution = institution;
		scholarship.country = country;
	}

	const requests = scholarships.map(
		(scholarship) =>
			new Request({
				// @ts-ignore
				url: scholarship.url,
				label: 'scholarship_detail',
				userData: scholarship
			})
	);

	await crawler.addRequests(requests);
});

router.addDefaultHandler(async ({ page, crawler }) => {
	const url = await page.$$eval('div.text-right a.university-item-links.p-2', (links) => {
		return links.map((link) => link.getAttribute('href'));
	});

	const images = await page.$$eval('.uni-item-logo img', (images) => {
		images.map((image) => {
			https.get(image.href);
		});
	});

	const requests = url.map(
		(link) =>
			new Request({
				// @ts-ignore
				url: link,
				label: 'scholarship_overview'
			})
	);

	await crawler.addRequests(requests);
});
