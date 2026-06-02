# 🤖 Secretary

A blazing fast, serverless Telegram bot running on Cloudflare Workers. 

## 🚀 1-Click Deploy

You can deploy your own instance of Secretary to Cloudflare in minutes without touching a terminal.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_USERNAME/secretary)

### Setup Instructions

1. **Click the Deploy Button** above. It will prompt you to authorize GitHub and Cloudflare, and automatically fork this repository.
2. **Add your Secrets**: Navigate to your newly forked repository on GitHub and go to **Settings > Secrets and variables > Actions**.
3. Add the following **New repository secrets**:
   * `CLOUDFLARE_API_TOKEN`: Generate this from your Cloudflare Dashboard (My Profile -> API Tokens -> Use the "Edit Cloudflare Workers" template).
   * `CLOUDFLARE_ACCOUNT_ID`: Find this on your Cloudflare Dashboard under the "Workers & Pages" overview (right sidebar).
   * `BOT_TOKEN`: Your Telegram Bot token from [@BotFather](https://t.me/BotFather).
4. **Deploy**: Go to the **Actions** tab in your GitHub repository, select "Deploy to Cloudflare Workers" on the left, and click **Run workflow**.

### 🔗 Connect the Webhook

Once Cloudflare provides you with your `workers.dev` URL, tell Telegram to send messages to it by pasting this in your browser:

`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<YOUR_WORKER_URL>`

You're done! 🎉