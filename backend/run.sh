#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)
uvicorn src.main:app --reload