#!/usr/bin/env node

const argv = require('./argv')

const { build } = require('./install-deps')

build(argv)
