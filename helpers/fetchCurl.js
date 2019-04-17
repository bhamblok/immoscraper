import { exec } from 'child_process';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

export default (site, timeout = 0) => new Promise((resolve) => {
  console.log(`> fetching ${site.name} ...`);
  const curl = site.withCookie && site.curl_with_cookie ? site.curl_with_cookie : site.curl;
  exec(curl, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
    if (err) {
      console.log(err);
    }
    // console.log(stderr);
    setTimeout(() => resolve(new JSDOM(stdout)), timeout);
  });
});
