import 'dotenv/config'; // eslint-disable-line import/no-extraneous-dependencies
import { notify } from 'node-slack-notify';

const { SLACK_WEBHOOK_URL } = process.env;

export default msg => notify({
  webhookUrl: SLACK_WEBHOOK_URL,
  data: {
    username: 'Immoscraper',
    icon_emoji: ':house_with_garden:',
    text: msg.text,
    attachments: [msg.attachment],
  },
});
