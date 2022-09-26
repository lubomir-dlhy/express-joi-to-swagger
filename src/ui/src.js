import { forEach, filter, trim, every } from 'lodash'

import { SwaggerUIBundle, SwaggerUIStandalonePreset } from 'swagger-ui-dist'
import 'swagger-ui-dist/swagger-ui.css'

import spec from './data.json'

const AdvancedFilterPlugin = (system) => ({
	fn: {
		opsFilter: (taggedOps, phrase) => {
			const normPhrases = trim(phrase)
				.toLowerCase()
				.split(' ')
				.filter((v) => !!v)
				.map((v) => trim(v))
			const normalTaggedOps = JSON.parse(JSON.stringify(taggedOps))
			forEach(normalTaggedOps, (tagObj, key) => {
				const operations = filter(tagObj.operations, (operation) => {
					const hasEvery = every(normPhrases, (normPhrase) => {
						// search on path
						const path = operation.path.toLowerCase().indexOf(normPhrase) !== -1
						// search on tags
						const tags = operation.operation.tags.filter((tag) => tag.toLowerCase().indexOf(normPhrase) !== -1)

						if (!path && tags.length <= 0) {
							return false
						}
						return true
					})
					return hasEvery
				})
				if (operations.length === 0) {
					delete normalTaggedOps[key]
				} else {
					normalTaggedOps[key].operations = operations
				}
			})
			return system.Im.fromJS(normalTaggedOps)
		}
	}
})

SwaggerUIBundle({
	spec,
	dom_id: '#swagger',
	filter: true,
	deepLinking: true,
	// layout: 'StandaloneLayout', // NOTE: turn on for topbar
	operationsSorter: 'alpha',
	onComplete: () => {
		// NOTE: workaround for expand schema after page is loaded just first level https://github.com/swagger-api/swagger-ui/issues/6494
		document.querySelectorAll('#swagger button.model-box-control[aria-expanded="false"]').forEach((btn) => btn.click())
	},
	plugins: [AdvancedFilterPlugin, SwaggerUIBundle.plugins.DownloadUrl],
	presets: [
		SwaggerUIBundle.presets.apis
		// SwaggerUIStandalonePreset // // NOTE: turn on for topbar
	]
	// urls: [
	// 	{ name: 'local', url: '/data.json' },
	// 	{ name: 'local1', url: '/data.json' }
	// ],
	// 'urls.primaryName': 'local' // default spec
})
