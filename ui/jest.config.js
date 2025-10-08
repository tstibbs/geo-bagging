import {modulePrefixAliases, moduleAliases} from './project.config.js'

const makeJestPaths = ([module, alias]) => [module, alias.replace(/^\.\//, '<rootDir>/')]

let alias1 = Object.entries(moduleAliases).map(makeJestPaths)
let alias2 = Object.entries(modulePrefixAliases)
	.map(makeJestPaths)
	.map(([module, alias]) => [`${module}/(.*)$`, `${alias}/$1`])

export default {
	moduleNameMapper: Object.fromEntries([...alias1, ...alias2]),
	testEnvironment: 'jsdom'
}
