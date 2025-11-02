#!/bin/bash

echo "🚀 GitHub + Vercel 자동 배포 스크립트"
echo "=================================="
echo ""

# GitHub 저장소 생성 페이지 열기
echo "1️⃣ GitHub 저장소 생성 페이지를 엽니다..."
open "https://github.com/new"

sleep 2

# Vercel 배포 페이지 열기
echo "2️⃣ Vercel 배포 페이지를 엽니다..."
open "https://vercel.com/new"

sleep 2

# 프로젝트 폴더 열기
echo "3️⃣ 프로젝트 폴더를 엽니다..."
open .

echo ""
echo "✅ 모든 페이지가 열렸습니다!"
echo ""
echo "📋 다음 단계를 따라해주세요:"
echo ""
echo "GitHub 저장소 생성:"
echo "1. Repository name: ai-english-learning 입력"
echo "2. Public 선택"
echo "3. Create repository 클릭"
echo "4. 'uploading an existing file' 클릭"
echo "5. github-upload.zip 파일 드래그 앤 드롭"
echo "6. Commit changes 클릭"
echo ""
echo "Vercel 배포:"
echo "1. Continue with GitHub 클릭"
echo "2. Add New → Project 클릭"
echo "3. Import Git Repository 클릭"
echo "4. ai-english-learning 저장소 선택"
echo "5. Import 클릭"
echo "6. Environment Variables에서:"
echo "   - Key: OPENAI_API_KEY"
echo "   - Value: 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"
echo "7. Deploy 클릭"
echo ""
echo "🎉 완료되면 공개 링크가 생성됩니다!"


