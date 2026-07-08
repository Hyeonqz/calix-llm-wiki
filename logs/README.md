# Session Logs

Claude Code 세션 종료 시점마다 자동 덤프되는 대화 로그.

- 파일 형식: `YYYY-MM-DD-{sessionId:0:8}.md`
- 생성 주체: 글로벌 Stop 훅 (`~/.claude/hooks/wiki-session-log.sh`)
- 렌더링: **Nextra 밖**이라 사이트에는 노출되지 않음
- 추적: **git 무시** (`.gitignore`의 `logs/*.md`). 로컬에만 남으며 커밋되지 않음 (이 README만 추적)

## 어떻게 동작하나

- Stop 훅이 매 턴 끝에 발동
- `cwd`가 `/Users/jinhyeongyu/wiki` 하위일 때만 동작 (다른 프로젝트에서는 무시)
- 해당 세션의 JSONL 트랜스크립트를 읽어 읽기 좋은 마크다운으로 변환
- 동시에 Claude에게 "이번 턴의 내용을 `/wiki` 또는 `/til`로 저장할지 물어봐라" 리마인더 주입

## 주의

- **민감 정보**: 키/토큰/개인 정보를 붙여넣은 세션은 커밋 전 검토
- **중복**: 같은 세션은 매 턴마다 덮어쓰여 항상 최신 전체 대화가 저장됨
- **크기**: 매우 긴 세션은 로그 파일이 커질 수 있음
