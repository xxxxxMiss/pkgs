#!/usr/bin/env node

const argv = require('./lib/argv')

const { build } = require('./lib/install-deps')

build(argv)
