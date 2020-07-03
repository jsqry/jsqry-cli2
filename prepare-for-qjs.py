#!/usr/bin/env python3

s = open('modules/node_modules/jsqry/jsqry.js', 'r', encoding='UTF-8').read()
splitPart = '})(this, function (undefined) {'
parts = s.split(splitPart)
s = 'export default (function (root, factory) { return factory()\n' + splitPart + parts[1]
open('jsqry.js', 'w', encoding='UTF-8').write(s)
print('SUCCESS')
