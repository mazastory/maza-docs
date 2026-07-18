ARCHIVE POLICY

Purpose
- Provide a conservative policy for archived/unused files moved into `archived/unused/` to avoid accidental deletion of potentially important code.

Retention
- Keep archived files for 30 days by default. After 30 days, files may be deleted permanently unless flagged for retention.

Restore Process
1. To restore a file: move the file from `archived/unused/` back to its original path and run `npm run build` and tests.
2. Open a PR with the restore and request review from the code owner.

Approval
- Any permanent deletion must be approved by a repository owner or the original author.

Notes
- Archived files should include an `ARCHIVE` header with reason and date. Examples already present in `maza-studio/archived/unused/`.
- Consider adding an automated cleanup job in CI/CD to list archived files older than 30 days and open a PR for deletion.