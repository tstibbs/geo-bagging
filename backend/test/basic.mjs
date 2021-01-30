import {strictEqual} from 'assert'
import {validateWithExit} from '@tstibbs/cloud-core-utils'

import dist from '../dist/main.js'

//just check it imports, relatively little value in testing it properly
import '../deploy/deploy-stack.mjs'

//check it exposes a function, that's all we can do without proper unit tests
strictEqual(typeof dist.handler, 'function')

//validate cf script
validateWithExit('deploy/template.yml')
