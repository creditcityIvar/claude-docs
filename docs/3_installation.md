# 클로드 코드 설치 가이드

## 준비물: 클로드 계정 가입

- [ ] 클로드 계정 (아래 중 하나)
  - Claude Pro, Max, Teams, Enterprise 구독
  - 또는 Claude Console 계정
    클로드 계정이 없다면? -> [claude.com](https://claude.com/pricing)에서 가입할 수 있습니다.

---

## 1단계: Git 설치하기

### Git이란?

코드 변경 이력을 관리하는 도구입니다.
클로드 코드는 Git을 사용해 파일 변경사항을 추적하고 저장합니다.

### Mac 사용자

1. [git-scm.com/download/mac](https://git-scm.com/download/mac) 방문
2. 설치 파일 다운로드
3. 다운로드한 파일 실행하고 안내 따라 설치

### Windows 사용자

1. [git-scm.com/download/win](https://git-scm.com/download/win) 방문
2. 설치 파일 다운로드 (Click here to download) 버튼 클릭
3. 다운로드한 파일 실행
4. 설치 화면에서 모든 기본 설정 그대로 두고 "Next" 클릭
5. 설치 완료

## 2단계: 터미널 열기

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

### Git 설치 확인

터미널/PowerShell에서 아래 명령어 입력:

```bash
git --version
```

버전 정보가 표시되면 성공입니다 (예: `git version 2.39.0`)

### Git 초기 설정

Git을 처음 사용한다면 이름과 이메일을 설정해야 합니다:

```bash
git config --global user.name "홍길동"
git config --global user.email "your-email@example.com"
```

---

## 3단계: 클로드 코드 설치하기

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

## 4단계: 설치 확인하기

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

## 5단계: 클로드 코드 로그인하기

### 첫 실행

1. **터미널에서 클로드 코드 실행**

   ```bash
      claude
   ```

2. **처음 실행하면 모드 선택 화면이 나타납니다**

3. **원하는 모드를 선택합니다**

4. **로그인 옵션 보여줄 겁니다. -> 1번 선택 (그냥 엔터)**

5. **다시 터미널로 돌아와서 로그인 성공 문구 확인**

---
