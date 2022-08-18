/* eslint-disable no-console */

import 'dotenv/config'; // eslint-disable-line import/no-extraneous-dependencies
import { WebClient, LogLevel } from '@slack/web-api';

const { SLACK_TOKEN, SLACK_CHANNEL_ID } = process.env;

const client = new WebClient(SLACK_TOKEN, { logLevel: LogLevel.DEBUG });

export default async ({ title, immo }) => {
  console.log('notify:', immo.link);
  try {
    const result = await client.chat.postMessage({
      channel: SLACK_CHANNEL_ID,
      text: `${title}, ${immo.title} - ${immo.info} ${immo.price ?? '(waarschijnlijk reeds verkocht)'}
${immo.link}`,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
    console.error(error.data);
  }
};
