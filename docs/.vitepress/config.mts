import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Claude Code',
  description: 'Claude Code 개념과 활용법',
  lang: 'ko-KR',
  base: '/claude-docs/',

  themeConfig: {
    nav: [
      { text: '홈', link: '/' },
      { text: '시작하기', link: '/1_basics_concept' }
    ],

    sidebar: [
      {
        text: '클로드 코드 가이드',
        items: [
          { text: '1. 기본 개념', link: '/1_basics_concept' },
          { text: '2. 세션 개념', link: '/2_session_concept' },
          { text: '3. 설치 가이드', link: '/3_installation' },
          { text: '4. 기본 사용법', link: '/4_basic_usage' },
          { text: '5. CLAUDE.md 룰 설정', link: '/5_CLAUDE.md_rules' },
          { text: '6. Skills', link: '/6_skills' },
          { text: '7. Subagent', link: '/7_subagent' },
          { text: '8. Hooks', link: '/8_hooks' },
          { text: '9. MCP', link: '/9_mcp' },
          { text: '10. Agent Teams', link: '/10_agent_teams' }
        ]
      }
    ],

    outline: {
      label: '목차'
    },

    docFooter: {
      prev: '이전',
      next: '다음'
    },

    darkModeSwitchLabel: '테마',
    sidebarMenuLabel: '메뉴',
    returnToTopLabel: '맨 위로',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '검색',
            buttonAriaLabel: '검색'
          },
          modal: {
            noResultsText: '결과를 찾을 수 없습니다',
            resetButtonTitle: '초기화',
            footer: {
              selectText: '선택',
              navigateText: '이동',
              closeText: '닫기'
            }
          }
        }
      }
    }
  }
})
