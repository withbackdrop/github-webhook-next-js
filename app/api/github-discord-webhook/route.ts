import { headers } from 'next/headers';
import { MessageBuilder, Webhook } from 'discord-webhook-node';

async function sendGithubCommitPushed(payload: any) {
  const hook = new Webhook(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL_CHANNEL_GENERAL);
  hook.setUsername("Webhook Username");

  const embed = new MessageBuilder()
      .setTitle(`Wahoo! someone just made a new push!`)
      .setAuthor('Notification Service')
      .addField('Commit message', payload.commits[0].message, false)
      .setTimestamp();
  await hook.send(embed);
}

export async function POST(request) {
  const headersList = headers();

  const eventName = headersList.get("x-github-event");
  const payload = await request.json();

  try {
    if (eventName === 'push') {
      await sendGithubCommitPushed(payload);
    }
  } catch (error) {
    return new Response('Something went wrong', {
      status: 500,
    });
  }

  return new Response('Event processed', {
    status: 200,
  });
}