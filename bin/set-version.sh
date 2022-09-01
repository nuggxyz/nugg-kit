#!/bin/bash

export VERSION=$(grep '\"version\"' ./package.json | sed 's/.*\"version\": \"\\(.*\\)\".*/\\1/')
