import { getpullRequestDiff, postReviewComment } from "@/actions/github";
import { retriveContext } from "@/actions/rag";
import client from "@/lib/db";
import { generateText } from "@/lib/open-router";
import { PrReviewMessage } from "@/types";
// import { google } from "@ai-sdk/google";

export const handlePrReviewTOGithub = async (message: PrReviewMessage) => {
  const { owner, repo, prNumber, userId } = message;

  console.log(`[pr-review] Processing PR #${prNumber} for ${owner}/${repo}`);

  try {
    const account = await client.account.findFirst({
      where: { userId, providerId: "github" },
    });

    if (!account?.accessToken) {
      throw new Error(`No GitHub access token found for user ${userId}`);
    }

    const token = account.accessToken;

    const { title, diff, description } = await getpullRequestDiff(
      token,
      owner,
      repo,
      prNumber,
    );

    const context = await retriveContext(
      `${title}\n${description}`,
      `${owner}/${repo}`,
    );

    const prompt = `You are an expert code reviewer. Analyze the following pull request and provide a detailed, constructive code review.

PR Title: ${title}
PR Description: ${description || "No description provided"}

Context from Codebase:
${context.join("\n\n")}

Code Changes:
\`\`\`diff
${diff}
\`\`\`

Please provide:
1. **Walkthrough**: A file-by-file explanation of the changes.
2. **Sequence Diagram**: A Mermaid JS sequence diagram visualizing the flow of the changes (if applicable). Use \`\`\`mermaid ... \`\`\` block. **IMPORTANT**: Ensure the Mermaid syntax is valid. Do not use special characters (like quotes, braces, parentheses) inside Note text or labels as it breaks rendering. Keep the diagram simple.
3. **Summary**: Brief overview.
4. **Strengths**: What's done well.
5. **Issues**: Bugs, security concerns, code smells.
6. **Suggestions**: Specific code improvements.
7. **Poem**: A short, creative poem summarizing the changes at the very end.

Format your response in markdown.`;

    // const { text: review } = await generateText({
    //   model: google("gemini-2.5-flash"),
    //   prompt,
    // });

    const review = await generateText(prompt);

    await postReviewComment(token, owner, repo, prNumber, review);

    const repository = await client.repository.findFirst({
      where: { owner, name: repo },
    });

    if (repository) {
      await client.review.create({
        data: {
          repositoryId: repository.id,
          prNumber,
          prTitle: title,
          prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
          review,
          status: "completed",
        },
      });
    }

    console.log(`[pr-review] Review posted for PR #${prNumber}`);
  } catch (error) {
    console.error(`[pr-review] Failed to process PR #${prNumber}:`, error);

    try {
      const repository = await client.repository.findFirst({
        where: { owner, name: repo },
      });

      if (repository) {
        await client.review.create({
          data: {
            repositoryId: repository.id,
            prNumber,
            prTitle: "Failed to generate review",
            prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
            review: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            status: "failed",
          },
        });
      }
    } catch (dbError) {
      console.error("[pr-review] Failed to log error in database:", dbError);
    }

    throw error;
  }
};
