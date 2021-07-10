#!/bin/bash

echo "*** CREATING DATABASE ***"

psql -U postgres -c 'create database poker;'

echo "*** DATABASE CREATED! ***"