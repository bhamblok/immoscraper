import { notify } from 'node-slack-notify';

export default msg => notify({
  webhookUrl: 'https://hooks.slack.com/services/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',
  data: {
    username: 'Immoscraper',
    icon_emoji: ':house_with_garden:',
    text: msg.text,
    attachments: [msg.attachment],
  },
});
