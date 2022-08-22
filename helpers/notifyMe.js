/* eslint-disable no-console */

import 'dotenv/config'; // eslint-disable-line import/no-extraneous-dependencies
import { WebClient } from '@slack/web-api';

const { SLACK_TOKEN, SLACK_CHANNEL_ID } = process.env;

const client = new WebClient(SLACK_TOKEN);

export default async ({ title, immo }) => {
  console.log('notify:', immo.link);
  try {
    const result = await client.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: `${title} - ${immo.title} - ${immo.info} - ${immo.price ?? '(waarschijnlijk reeds verkocht)'}
${immo.link}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${immo.link}|${title} - ${immo.title}>`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: `${immo.title} - ${immo.info}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: `${immo.price ?? '(waarschijnlijk reeds verkocht)'}`,
          },
        },
        { type: 'divider' },
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: title,
          },
          image_url: immo.image_url,
          alt_text: immo.title,
        },
      ],
    });
    console.log(result);
  } catch (error) {
    console.error(error);
    console.error(error.data);
  }
};
