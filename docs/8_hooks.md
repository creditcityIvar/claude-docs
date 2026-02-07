# 클로드 Hooks

## Hooks가 무엇인가요?

특정 순간에 트리거 되어 자동으로 실행되는 작업.  
마치 결제를 완료하면 자동으로 슬랙이나 카카오톡 알림이 나가는 것처럼 등록된 조건이 발생하면 **무조건** 실행됩니다.

## Hooks의 작동 방식

### 주요 이벤트

Claude Code에는 14개의 이벤트가 있습니다. 그 중 가장 많이 사용하는 것들입니다.

| 이벤트             | 언제 실행되나요?              | 활용 예시               |
| ------------------ | ----------------------------- | ----------------------- |
| `SessionStart`     | 대화를 시작하거나 재개할 때   | 프로젝트 정보 자동 로드 |
| `UserPromptSubmit` | 당신이 요청을 보낼 때         | 요청 내용 검증          |
| `PreToolUse`       | Claude가 도구를 사용하기 직전 | 위험한 명령 차단        |
| `PostToolUse`      | Claude가 도구를 사용한 직후   | 파일 수정 후 서식 검사  |
| `Notification`     | Claude가 알림을 보낼 때       | 데스크톱 알림           |
| `Stop`             | Claude가 응답을 마칠 때       | 작업 완료 여부 확인     |
| `SessionEnd`       | 대화가 끝날 때                | 임시 파일 정리          |

그 외에도 `PostToolUseFailure`(도구 실패 후), `SubagentStart`/`SubagentStop`(서브에이전트 시작/종료), `PreCompact`(컨텍스트 압축 전) 등이 있습니다.

### Hook이 실행되는 흐름

아래는 "파일 수정 후 자동으로 서식 검사"가 실행되는 흐름입니다.

```
1. Claude가 파일 수정(Edit) 도구를 사용함
2. PostToolUse 이벤트가 발생함
3. 매처 확인: "Edit" 도구인가? → 맞음
4. 등록된 Hook 실행: 서식 검사 명령어 실행
5. 결과 반환: 서식이 자동으로 정리됨
```

## Hooks 설정하기

### 방법 1: `/hooks` 메뉴 사용

Claude Code에서 `/hooks`를 입력하면 대화형 메뉴가 열립니다.
가장 쉽고 안전한 방법입니다.

1. Claude Code에서 `/hooks` 입력
2. 이벤트 선택 (예: `Notification`)
3. 매처 설정 (예: `*` - 모든 경우에 실행)
4. **+ Add new hook...** 선택 후 실행할 명령어 입력
5. 저장 위치 선택 (User settings 또는 Project settings)
6. **Esc**로 돌아가서 테스트

### 방법 2: 설정 파일 직접 편집

JSON 형식의 설정 파일에 Hook을 직접 작성할 수도 있습니다.
설정 파일 구조는 아래 실제 사용 예시에서 보여드립니다.

**용어 정리:**

- **JSON**: 데이터를 구조화해서 저장하는 형식. 중괄호 `{}`와 쌍따옴표 `""`를 사용
- **설정 파일 (settings.json)**: Claude Code의 동작 규칙을 적어두는 파일

### Hook 저장 위치

Hook을 어디에 저장하느냐에 따라 적용 범위가 달라집니다.

| 위치                          | 범위          | 팀과 공유 가능? |
| ----------------------------- | ------------- | --------------- |
| `~/.claude/settings.json`     | 모든 프로젝트 | 아니오          |
| `.claude/settings.json`       | 이 프로젝트만 | 예 (Git으로)    |
| `.claude/settings.local.json` | 이 프로젝트만 | 아니오          |

**팁:**

- 알림처럼 개인적인 Hook → 개인 설정(`~/.claude/settings.json`)
- 서식 검사처럼 프로젝트 규칙 → 프로젝트 설정(`.claude/settings.json`)

## 매처 (Matcher)

매처는 "이 Hook을 언제 실행할지" 필터링하는 조건입니다.

**비유: 메일 필터**

- 메일에서 "보낸 사람이 팀장일 때만 알림"처럼 조건을 거는 것
- Hook에서는 "Edit 도구를 사용할 때만 실행"처럼 조건을 거는 것

매처를 설정하지 않거나 `*`로 설정하면 해당 이벤트의 **모든 경우**에 실행됩니다.

### 이벤트별 매처 대상

| 이벤트                                   | 매처가 필터링하는 대상 | 매처 예시                      |
| ---------------------------------------- | ---------------------- | ------------------------------ |
| `PreToolUse`, `PostToolUse` 등 도구 관련 | 도구 이름              | `Bash`, `Edit\|Write`          |
| `SessionStart`                           | 시작 방식              | `startup`, `resume`, `compact` |
| `Notification`                           | 알림 종류              | `permission_prompt`            |
| `SessionEnd`                             | 종료 사유              | `clear`, `logout`              |

**`Edit|Write` 매처 설명:**

`|`는 "또는"을 의미합니다.
`Edit|Write`는 "Edit 도구 또는 Write 도구를 사용할 때"라는 뜻입니다.

`UserPromptSubmit`과 `Stop`은 매처를 지원하지 않습니다. 항상 모든 경우에 실행됩니다.

## Hook의 세 가지 유형

Hook에는 세 가지 유형이 있습니다. 상황에 맞는 유형을 선택하세요.

### 1. 명령어 (command)

가장 기본적인 유형입니다. 정해진 명령어를 자동으로 실행합니다.

```json
{
  "type": "command",
  "command": "실행할 명령어"
}
```

**적합한 상황:** 서식 검사, 알림 보내기, 파일 차단 등 규칙이 명확한 작업

### 2. 프롬프트 (prompt)

Claude 모델에게 "이거 괜찮아?"라고 판단을 맡깁니다.
모델이 "괜찮다(ok: true)" 또는 "안 된다(ok: false)"로 답합니다.

```json
{
  "type": "prompt",
  "prompt": "모든 요청 사항이 완료되었는지 확인하세요."
}
```

**적합한 상황:** "작업이 완료되었는가?"처럼 판단이 필요한 검증

### 3. 에이전트 (agent)

서브에이전트가 파일을 직접 확인한 뒤 판단합니다.
프롬프트 유형보다 더 꼼꼼하게 검증할 수 있습니다.

```json
{
  "type": "agent",
  "prompt": "테스트를 실행하고 모두 통과하는지 확인하세요.",
  "timeout": 120
}
```

**적합한 상황:** 파일 내용 확인, 테스트 실행 등 실제 검증이 필요한 경우

### 유형 비교

| 유형    | 비유                           | 적합한 상황                | 기본 제한 시간 |
| ------- | ------------------------------ | -------------------------- | -------------- |
| command | 자동 실행되는 매크로           | 서식 검사, 알림, 파일 차단 | 10분           |
| prompt  | 검토자에게 "이거 괜찮아?" 묻기 | 작업 완료 여부 판단        | 30초           |
| agent   | 조수가 직접 확인하고 판단      | 테스트 실행 후 결과 확인   | 60초           |

## 실제 사용 예시

### 예시 1: 슬랙 알림 받기

**상황:** Claude가 문서 생성이나 데이터 분석을 마쳤을 때 담당자에게 바로 알리고 싶은 경우

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"Claude Code에서 응답을 기다리고 있습니다\"}' https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
          }
        ]
      }
    ]
  }
}
```

### 예시 2: 파일 수정 후 자동 서식 정리

**상황:** Claude가 파일을 수정할 때마다 들여쓰기, 줄바꿈 등 서식이 제각각인 경우

**설정 (`.claude/settings.json`):**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

**이 설정이 하는 일:**

1. Claude가 파일을 수정(Edit)하거나 생성(Write)하면
2. `PostToolUse` 이벤트가 발생하고
3. 매처 `Edit|Write`에 해당하므로 Hook이 실행됨
4. 수정된 파일 경로를 추출해서 Prettier(서식 정리 도구)로 자동 정리

**용어 정리:**

- **Prettier**: 코드와 문서의 서식(들여쓰기, 줄바꿈 등)을 자동으로 통일해주는 도구
- **jq**: JSON 데이터에서 특정 값을 뽑아내는 도구

**효과:** 파일 서식이 항상 일정하게 유지됩니다. 팀 전체가 같은 서식 규칙을 사용할 수 있습니다.

### 예시 3: 중요 파일 수정 차단

**상황:** `.env` 파일(비밀번호), `package-lock.json`(설치 기록) 등 건드리면 안 되는 파일을 보호하고 싶은 경우

**1단계: 차단 스크립트 작성**

`.claude/hooks/protect-files.sh` 파일을 만듭니다.

```bash
#!/bin/bash
# 보호할 파일 목록을 확인하고, 해당 파일이면 차단합니다

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "차단됨: $FILE_PATH 은(는) 보호된 파일입니다 ('$pattern')" >&2
    exit 2
  fi
done

exit 0
```

**이 스크립트가 하는 일:**

- Claude가 수정하려는 파일 이름을 확인
- `.env`, `package-lock.json`, `.git/` 중 하나에 해당하면 차단
- 해당하지 않으면 수정 허용

**2단계: 설정 등록 (`.claude/settings.json`)**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

**효과:** Claude가 보호된 파일을 수정하려고 하면 자동으로 차단되고, Claude에게 차단 이유가 전달됩니다.

## Hook의 고급 기능

### 백그라운드 실행

오래 걸리는 작업은 Hook을 백그라운드에서 실행할 수 있습니다.
Claude가 Hook 완료를 기다리지 않고 다음 작업을 이어갑니다.

`"async": true` 옵션을 주면 백그라운드에서 실행합니다.

```json
{
  "type": "command",
  "command": "장시간-작업.sh",
  "async": true
}
```

### 컨텍스트 압축 후 정보 재주입

Claude의 컨텍스트가 가득 차면 자동으로 대화를 요약(압축)합니다.
이때 중요한 정보가 빠질 수 있습니다.
`SessionStart` 이벤트의 `compact` 매처를 사용하면, 압축 후 필요한 정보를 다시 넣어줄 수 있습니다.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo '주의: npm 대신 Bun을 사용하세요. 커밋 전 bun test를 실행하세요.'"
          }
        ]
      }
    ]
  }
}
```

### Skills와 서브에이전트에서 Hook 사용

Skill이나 서브에이전트의 설정(frontmatter)에도 Hook을 추가할 수 있습니다.
해당 Skill이나 서브에이전트가 활성화된 동안에만 Hook이 작동합니다.

```yaml
---
name: secure-operations
description: 보안 검사를 포함한 작업 수행
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/security-check.sh"
---
```

### 모든 Hook 비활성화

Hook을 삭제하지 않고 일시적으로 모두 끌 수 있습니다.

- `/hooks` 메뉴 하단의 비활성화 토글 사용
- 또는 설정 파일에 `"disableAllHooks": true` 추가

## Skills, 서브에이전트, Hooks 비교

| 비교 항목     | Skills                 | 서브에이전트              | Hooks                    |
| ------------- | ---------------------- | ------------------------- | ------------------------ |
| **비유**      | 작업 매뉴얼            | 전문 담당자               | 자동화 규칙              |
| **실행 방식** | Claude가 판단해서 사용 | Claude가 위임             | 이벤트 발생 시 자동 실행 |
| **주요 용도** | 반복 작업 형식 통일    | 대량 작업 처리, 병렬 조사 | 자동화, 안전장치, 알림   |
| **확실성**    | Claude가 선택 (선택적) | Claude가 선택 (선택적)    | 항상 실행 (확정적)       |
| **작업 공간** | 메인 대화에서 실행     | 독립된 공간에서 실행      | Claude 외부에서 실행     |

**핵심 차이:**

- Skills와 서브에이전트는 Claude가 **판단해서** 사용합니다. 사용하지 않을 수도 있습니다.
- Hooks는 조건이 맞으면 **무조건** 실행됩니다. Claude의 판단과 무관합니다.

## 실무 활용 팁

### 간단한 것부터 시작하세요

처음에는 알림 Hook 하나만 설정해보세요.
Hook이 어떻게 작동하는지 이해한 뒤 서식 검사, 파일 보호 등을 추가하세요.

### `/hooks` 메뉴를 활용하세요

설정 파일을 직접 수정하는 것보다 `/hooks` 메뉴가 더 안전하고 편리합니다.
현재 등록된 Hook을 확인하고 수정하거나 삭제할 수 있습니다.

### 팀과 공유하세요

서식 검사, 파일 보호 같은 프로젝트 규칙은 `.claude/settings.json`에 저장하세요.
Git으로 공유하면 팀원 모두에게 같은 규칙이 적용됩니다.

### 문제 해결

Hook이 예상대로 작동하지 않을 때:

- **Ctrl+O**를 눌러 상세 로그를 확인하세요
- `/hooks` 메뉴에서 Hook이 올바른 이벤트에 등록되어 있는지 확인하세요
- 스크립트 파일이 실행 권한이 있는지 확인하세요 (`chmod +x 파일이름.sh`)
- 설정 파일을 직접 수정한 경우, `/hooks` 메뉴에서 다시 확인하거나 세션을 재시작하세요
