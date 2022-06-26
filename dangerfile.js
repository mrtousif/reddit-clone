import { message, warn, markdown, danger } from "danger";

const modifiedMD = danger.git.modified_files.join("- ");

message("Changed Files in this PR: \n - " + modifiedMD);

const bigPRThreshold = 600;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR (' + ++errorCount + ')');
  markdown('> (' + errorCount + ') : Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.');
}