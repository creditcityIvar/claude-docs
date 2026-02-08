# 클로드 MCP

## MCP가 무엇인가요?

"Claude를 **Figma, Notion, Slack 같은 외부 서비스와 연결**해주는 도구"

MCP(Model Context Protocol)는 Claude가 외부 서비스에 직접 접근할 수 있게 해주는 연결 방식입니다.

**비유: 스마트폰의 앱 설치**

- 스마트폰 자체로는 전화와 문자만 가능
- 앱을 설치하면 배달 주문, 은행 업무, 택시 호출 등 가능
- MCP 서버를 연결하면 Claude도 Figma, Notion, Slack 등 외부 서비스를 직접 사용 가능

**용어 정리:**

- **MCP 서버**: Claude에 연결하는 외부 서비스 프로그램. 스마트폰의 "앱"에 해당

## 왜 필요한가요?

Claude Code는 기본적으로 파일 읽기/수정, 명령어 실행, 웹 검색만 가능합니다.
MCP 없이는 외부 서비스에 접근할 수 없습니다.

| MCP 없이                       | MCP 연결 후                                      |
| ------------------------------ | ------------------------------------------------ |
| Notion 문서를 볼 수 없음      | Notion에서 기획 문서를 가져올 수 있음            |
| Figma 디자인을 볼 수 없음     | Figma 디자인을 확인하고 코드에 반영할 수 있음    |
| Slack 메시지를 볼 수 없음     | Slack에서 대화 내용을 가져올 수 있음             |

## MCP로 할 수 있는 것들

MCP 서버를 연결하면 Claude에게 이런 요청을 할 수 있습니다.

| 요청 예시                                                              | 필요한 MCP 서버 |
| ---------------------------------------------------------------------- | --------------- |
| "Notion에 있는 기획 문서를 읽고 기능을 구현해줘"                       | Notion          |
| "Figma 디자인을 보고 화면을 그대로 만들어줘"                           | Figma           |
| "Slack에서 디자이너가 공유한 피드백을 정리해줘"                        | Slack           |
| "Notion 기획서와 Figma 디자인을 비교해서 빠진 부분을 알려줘"           | Notion + Figma  |
| "Slack에 올라온 Figma 디자인을 반영해서 화면을 수정해줘"               | Slack + Figma   |

## MCP 서버 설치하기

MCP 서버를 연결하는 방법은 세 가지입니다.

### 방법 1: 원격 HTTP 서버 (추천)

클라우드 기반 서비스에 연결할 때 사용합니다. 가장 일반적인 방법입니다.

```bash
# 기본 형식
claude mcp add --transport http <이름> <주소>

# 실제 예시: Notion 연결
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

### 방법 2: 원격 SSE 서버

HTTP 서버를 지원하지 않는 서비스에 사용합니다.

```bash
# 기본 형식
claude mcp add --transport sse <이름> <주소>
```

### 방법 3: 로컬 stdio 서버

내 컴퓨터에서 직접 실행되는 서버입니다.

```bash
# 기본 형식
claude mcp add --transport stdio <이름> -- <실행할 명령어>
```

**용어 정리:**

- **HTTP/SSE**: 인터넷으로 외부 서버에 접속하는 방식
- **stdio**: 내 컴퓨터에서 직접 프로그램을 실행하는 방식

## MCP 서버 관리하기

설치한 MCP 서버를 관리하는 명령어입니다.

```bash
# 연결된 서버 목록 보기
claude mcp list

# 특정 서버 상세 정보 보기
claude mcp get notion

# 서버 제거
claude mcp remove notion

# Claude Code 안에서 서버 상태 확인
/mcp
```

## MCP 설치 범위 (Scope)

MCP 서버를 어디에 저장하느냐에 따라 사용 범위가 달라집니다.

| 범위                    | 설명                              | 언제 사용하나요?            | 팀과 공유? |
| ----------------------- | --------------------------------- | --------------------------- | ---------- |
| **local** (기본값)      | 이 프로젝트에서 나만 사용         | 개인 작업, 실험용 서버      | 아니오     |
| **project**             | 이 프로젝트에서 팀 전체가 사용    | 팀 공용 서버                | 예         |
| **user**                | 모든 프로젝트에서 나만 사용       | 자주 쓰는 개인 도구         | 아니오     |

```bash
# local (기본값 - 생략 가능)
claude mcp add --transport http notion https://mcp.notion.com/mcp

# project (팀 공유)
claude mcp add --transport http notion --scope project https://mcp.notion.com/mcp

# user (모든 프로젝트에서 사용)
claude mcp add --transport http figma --scope user https://mcp.figma.com/mcp
```

**project 범위**로 설치하면 프로젝트 루트에 `.mcp.json` 파일이 생성됩니다.
이 파일을 Git에 올리면 팀원 모두 같은 MCP 서버를 사용할 수 있습니다.

### 우선순위

같은 이름의 서버가 여러 범위에 있으면 아래 순서로 우선 적용됩니다.

**local > project > user**

개인 설정이 팀 설정보다, 팀 설정이 전역 설정보다 우선합니다.

## 인증 (로그인)

많은 MCP 서버는 로그인이 필요합니다. Claude Code는 OAuth 2.0 인증을 지원합니다.

**설정 방법:**

1. MCP 서버를 추가합니다

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

2. Claude Code에서 `/mcp` 명령어를 입력합니다
3. 브라우저가 열리면 해당 서비스에 로그인합니다
4. 인증 완료 후 Claude가 해당 서비스를 사용할 수 있습니다

인증 토큰은 안전하게 저장되며 자동으로 갱신됩니다.

**용어 정리:**

- **OAuth 2.0**: 비밀번호를 직접 주지 않고 안전하게 로그인하는 방식. "카카오로 로그인"과 같은 원리
- **인증 토큰**: 로그인 상태를 유지하는 디지털 출입증

## 실제 사용 예시

### 예시 1: Notion 기획 문서로 기능 구현

```bash
# 1. Notion MCP 서버 추가
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 2. Claude Code에서 인증
> /mcp
# Notion에서 "Authenticate" 선택

# 3. Claude에게 요청
> "Notion에 있는 '회원가입 기획서'를 읽고 구현해줘"
> "Notion 기획 문서에서 변경된 요구사항을 반영해줘"
> "작업 결과를 Notion 문서에 정리해줘"
```

### 예시 2: Figma 디자인을 코드로 구현

```bash
# 1. Figma MCP 서버 추가
claude mcp add --transport http figma https://mcp.figma.com/mcp

# 2. 인증
> /mcp

# 3. Claude에게 요청
> "Figma의 로그인 페이지 디자인을 보고 그대로 만들어줘"
> "Figma에서 사용된 색상 코드와 폰트를 정리해줘"
```

### 예시 3: Slack 메시지 활용

```bash
# 1. Slack MCP 서버 추가
claude mcp add --transport http slack https://slack.mcp.run/sse

# 2. 인증
> /mcp

# 3. Claude에게 요청
> "Slack #design 채널에서 최근 피드백을 정리해줘"
> "Slack에서 기획팀이 공유한 요구사항을 요약해줘"
```

### 예시 4: Notion + Figma + Slack 함께 사용

```bash
# 세 서비스를 모두 연결한 상태에서
> "Slack에 올라온 Figma 디자인을 보고, Notion 기획서대로 화면을 만들어줘"
> "Notion 기획서와 Figma 디자인을 비교해서 빠진 화면을 Slack에 알려줘"
```

## MCP 리소스 참조

MCP 서버가 제공하는 데이터를 `@` 기호로 직접 참조할 수 있습니다.
파일을 `@`로 참조하는 것과 같은 방식입니다.

```
> @notion:page://회원가입-기획서 를 읽고 구현해줘
> @figma:file://로그인-페이지 디자인을 코드로 만들어줘
> @slack:channel://design 채널의 최근 피드백을 정리해줘
```

## Tool Search

MCP 서버를 많이 연결하면 도구 정의가 컨텍스트를 많이 차지할 수 있습니다.
Tool Search는 이 문제를 해결합니다.

**작동 방식:**

1. 모든 MCP 도구를 미리 불러오지 않음
2. Claude가 필요할 때 검색해서 필요한 도구만 불러옴
3. 컨텍스트의 10% 이상을 차지하면 자동으로 활성화

**비유: 도서관 검색**

- Tool Search 없이: 모든 책을 책상 위에 쌓아놓음 → 책상이 꽉 참
- Tool Search 사용: 필요한 책만 검색해서 가져옴 → 책상이 깨끗함

## 다른 기능과의 비교

| 비교 항목     | MCP                        | Skills                          | Hooks                    |
| ------------- | -------------------------- | ------------------------------- | ------------------------ |
| **비유**      | 외부 서비스 연결 앱        | 작업 매뉴얼                     | 자동화 규칙              |
| **역할**      | 외부 서비스와 연결         | Claude에게 지식과 절차를 제공   | 이벤트 발생 시 자동 실행 |
| **예시**      | Notion, Figma, Slack 연동  | 코드 리뷰 체크리스트, 배포 절차 | 파일 수정 후 서식 검사   |

**핵심 차이:**

- **MCP**: Claude에게 **외부 서비스에 접근하는 능력**을 줌
- **Skills**: Claude에게 **그 능력을 잘 사용하는 방법**을 알려줌
- **Hooks**: 특정 이벤트에 **자동으로 반응**하는 규칙

**예시:** MCP로 Notion에 연결하고, Skill로 "우리 팀 기획 문서 형식"을 알려주면 Claude가 기획 문서를 더 정확하게 읽고 반영합니다.

## 실무 활용 팁

### 필요한 서버만 연결하세요

MCP 서버를 많이 연결하면 컨텍스트를 많이 차지합니다.
`/mcp` 명령어로 서버별 토큰 사용량을 확인하고, 사용하지 않는 서버는 해제하세요.

### 팀과 공유하세요

팀 전체가 사용하는 서버는 `--scope project`로 설치하세요.
`.mcp.json` 파일을 Git에 올리면 팀원 모두 같은 서버를 사용할 수 있습니다.

### 연결이 끊어질 수 있습니다

MCP 서버는 세션 중간에 연결이 끊어질 수 있습니다.
Claude가 갑자기 외부 서비스를 사용하지 못한다면 `/mcp`로 연결 상태를 확인하세요.
