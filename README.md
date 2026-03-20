# AI 이력서 스크리닝 시스템 Pro - Vercel 배포 가이드

## 🚀 Vercel 배포 단계별 가이드

### 1단계: Vercel 회원가입

1. https://vercel.com 접속
2. **"Sign Up"** 클릭
3. GitHub, GitLab, Bitbucket 중 하나로 가입 (GitHub 추천)
4. 또는 Email로 가입

### 2단계: 프로젝트 업로드

#### 방법 A: 웹 인터페이스 사용 (추천)

1. Vercel 대시보드에서 **"Add New" → "Project"** 클릭
2. **"Import Third-Party Git Repository"** 건너뛰고
3. 화면 하단 **"Or, deploy without Git"** 클릭
4. 이 폴더 전체를 ZIP으로 압축
5. ZIP 파일을 드래그앤드롭 또는 선택
6. **"Deploy"** 클릭

#### 방법 B: Vercel CLI 사용

```bash
# Vercel CLI 설치 (최초 1회만)
npm install -g vercel

# 이 폴더에서 실행
cd vercel-resume-screener
vercel

# 질문에 답변:
# - Set up and deploy? Y
# - Which scope? (본인 계정 선택)
# - Link to existing project? N
# - What's your project's name? resume-screener (또는 원하는 이름)
# - In which directory is your code located? ./
# - Want to modify these settings? N

# 배포 완료! URL이 표시됩니다
```

### 3단계: 환경변수 설정 (중요!)

배포 후 **반드시** Claude API 키를 설정해야 합니다:

1. Vercel 프로젝트 페이지에서 **"Settings"** 탭 클릭
2. 왼쪽 메뉴에서 **"Environment Variables"** 클릭
3. 새 환경변수 추가:
   - **Name**: `CLAUDE_API_KEY`
   - **Value**: `sk-ant-api03-xxxxx...` (발급받은 Claude API 키)
   - **Environment**: Production, Preview, Development 모두 체크
4. **"Save"** 클릭
5. 상단의 **"Deployments"** 탭으로 이동
6. 가장 최근 배포 옆의 **...** 메뉴 클릭 → **"Redeploy"** 선택
   (환경변수 적용을 위해 재배포 필요)

### 4단계: 접속 및 테스트

1. 배포 완료 후 제공된 URL로 접속 (예: `https://resume-screener-xxx.vercel.app`)
2. 팀 선택 → 직무 설명 입력 → 이력서 입력
3. "스크리닝 시작" 클릭하여 작동 확인

### 5단계: 팀원들과 공유

- 생성된 URL을 팀장들에게 공유
- 각자 브라우저에서 접속하여 사용
- 데이터는 각 브라우저에 로컬 저장됨

## 🔧 커스텀 도메인 설정 (선택)

회사 도메인을 사용하고 싶다면:

1. Vercel 프로젝트 → **"Settings"** → **"Domains"**
2. 도메인 추가 (예: `screening.company.com`)
3. DNS 설정 안내에 따라 설정

## 📊 사용량 모니터링

1. Vercel 대시보드 → **"Analytics"**
2. 방문자 수, 응답 시간 등 확인
3. Claude API 사용량은 https://console.anthropic.com에서 확인

## ⚙️ 업데이트 방법

파일을 수정한 후:

```bash
# CLI 사용 시
vercel --prod

# 또는 Vercel 대시보드에서 새 ZIP 업로드
```

## 🚨 문제 해결

### "Internal Server Error"
→ 환경변수 `CLAUDE_API_KEY`가 설정되었는지 확인
→ Redeploy 실행

### API 호출 실패
→ Claude API 키가 유효한지 확인
→ Console.anthropic.com에서 크레딧 잔액 확인

### 느린 응답 속도
→ 정상입니다 (Claude API 호출 시간 10-20초)
→ Vercel Serverless Function은 무료 플랜도 충분히 빠름

## 💰 비용

- **Vercel**: 무료 (Hobby Plan)
  - 월 100GB 대역폭
  - 100GB-hrs Serverless Function 실행 시간
  - 일반적인 사용량으로 충분함

- **Claude API**: 사용량 기반
  - 이력서 1개당 약 $0.01-0.03
  - Vercel은 무료, Claude API만 비용 발생

## 📞 도움이 필요하면

- Vercel 문서: https://vercel.com/docs
- Claude API 문서: https://docs.anthropic.com
