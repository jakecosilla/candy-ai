#!/bin/bash
git init
git add .
git commit -m "Initial commit for Candy AI platform"
git branch -M main
git remote add origin https://github.com/jakecosilla/candy-ai.git || git remote set-url origin https://github.com/jakecosilla/candy-ai.git
git push -u origin main
