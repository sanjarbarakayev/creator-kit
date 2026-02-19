# Code Quality Checklist

Before marking work complete:
- [ ] Code is readable and well-named
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines, Vue components <400 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling (try/catch with user-friendly messages)
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] Immutable patterns used (spread, no mutation)
- [ ] Input validated at system boundaries (Zod for API routes)
- [ ] Many small files over few large files
