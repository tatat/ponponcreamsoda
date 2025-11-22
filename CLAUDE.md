@AGENTS.md

## Claude Code Workarounds

### Screenshot Tool Issue

**IMPORTANT**: When taking screenshots using MCP tools (Playwright or Chrome DevTools), always use JPEG format instead of PNG due to a known issue with PNG format causing errors.

```typescript
// Use this:
mcp__playwright__browser_take_screenshot({ type: 'jpeg' })
mcp__chrome - devtools__take_screenshot({ format: 'jpeg' })

// Instead of:
mcp__playwright__browser_take_screenshot({ type: 'png' }) // Will error
mcp__chrome - devtools__take_screenshot({ format: 'png' }) // Will error
```
