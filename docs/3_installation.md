# 클로드 코드 설치 가이드

## ✅ 준비물 확인

- [ ] 클로드 계정 (아래 중 하나)
  - Claude Pro, Max, Teams, Enterprise 구독
  - 또는 Claude Console 계정

클로드 계정이 없다면? -> [claude.com](https://claude.com/pricing)에서 가입할 수 있습니다.

---

## 1단계: 터미널 열기

### 터미널(Terminal)이란?

컴퓨터에게 명령을 글자로 입력하는 프로그램입니다.
마우스 클릭 대신 키보드로 명령을 내립니다.

### Mac 사용자

1. **Spotlight 검색 열기**

   - 키보드에서 `Command(⌘) + 스페이스바` 누르기

2. **터미널 검색**
   - "터미널" 또는 "Terminal" 입력
   - Enter 키 누르기

### Windows 사용자

1. **시작 메뉴 열기**

   - 키보드에서 `Windows 키` 누르기

2. **PowerShell 검색**
   - "PowerShell" 입력
   - **"관리자 권한으로 실행"** 클릭

---

## 2단계: 클로드 코드 설치하기

### Mac 사용자

**아래 명령어를 입력**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows 사용자 (PowerShell)

**아래 명령어를 입력**

```powershell
irm https://claude.ai/install.ps1 | iex
```

## 3단계: 설치 확인하기

설치가 제대로 되었는지 확인해봅시다.

1. **터미널/PowerShell/명령 프롬프트를 닫습니다**

2. **다시 엽니다** (1단계 참고)

3. **아래 명령어를 입력하세요**

   ```bash
   claude --version
   ```

4. **버전 정보가 표시되면 성공입니다**
   - 예: `claude version 1.0.0`

---

## 4단계: 클로드 코드 로그인하기

### 첫 실행

1. **터미널에서 클로드 코드 실행**

   ```bash
   claude
   ```

2. **처음 실행하면 로그인 화면이 나타납니다**

3. **로그인 명령어 입력**

   ```bash
   /login
   ```

4. **화면의 안내를 따라 진행합니다**
   - 로그인 방법을 선택하라는 메시지가 나옵니다
   - 방향키(↑↓)로 선택하고 Enter 키를 누릅니다

**[스크린샷 필요: 로그인 방법 선택 화면]**

### 로그인 방법 선택

**옵션 1: Claude Pro/Max/Teams/Enterprise (권장)**

1. **"Claude Pro/Max/Teams/Enterprise" 선택**
2. **브라우저가 자동으로 열립니다**
3. **claude.com에 로그인합니다**
4. **"Claude Code 연결 허용" 버튼 클릭**
5. **터미널로 돌아오면 로그인 완료**

**옵션 2: Claude Console**

1. **"Claude Console" 선택**
2. **API 키를 입력하라는 메시지가 나옵니다**
3. **Console에서 발급받은 API 키 붙여넣기**
4. **Enter 키 누르기**

> **API 키가 없다면?** > [console.anthropic.com](https://console.anthropic.com/)에서 발급받을 수 있습니다.

---
