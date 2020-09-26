import {strictEqual} from 'assert'

//check it exposes a function, that's all we can do without proper unit tests
import dist from '../dist/main.js'
strictEqual(typeof dist.handler, 'function')

//just check it imports, relatively little value in testing it properly
import '../deploy/deploy-stack.mjs'
