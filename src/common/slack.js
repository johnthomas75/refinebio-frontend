/**
 * This file contains helper methods that post to the CCDL slack channel
 */

// btoa(webhook_url)
const SLACK_HOOK_URL =
  'aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDYyR1g1UlFVL0JCUzUyVDc5OC9UWnZZSGkzcnFyY29aSWYyaFlCVDZVdTA=';

// get IP
const getIP = async () => {
  let ip = 'N/A';

  await fetch('https://api.ipify?format=json')
    .then(resp => resp.json())
    .then(json => json.ip)
    .then(fetchedIP => {
      ip = fetchedIP;
    })
    .catch(() => {}); // allow fetch to fail

  return ip;
};

/**
 * Send data to slack, configured in CCDL channel
 * @param {object} params Slack webhooks params
 */
export async function postToSlack(params) {
  return fetch(atob(SLACK_HOOK_URL), {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function submitSearchDataRequest(query, values) {
  await postToSlack({
    attachments: [
      {
        fallback: `Missing data for search term '${query}'`,
        color: '#2eb886',
        title: `Missing data for search term '${query}'`,
        title_link: `https://www.refine.bio/search?q=${query}`,
        fields: [
          {
            title: 'Accession Codes',
            value: values.accession_codes,
            short: true,
          },
          {
            title: 'Pediatric Cancer Research',
            value: values.pediatric_cancer,
            short: true,
          },
          {
            title: 'Primary Approach',
            value: values.approach,
            short: true,
          },
          {
            title: 'Email',
            value: `${values.email}${
              values.email_updates ? ' _(wants updates)_' : ''
            }`,
            short: false,
          },
          ...(values.comments
            ? [
                {
                  title: 'Additional Notes',
                  value: values.comments,
                  short: false,
                },
              ]
            : []),
        ],
        footer: `Refine.bio | ${await getIP} | ${navigator.userAgent}`,
        footer_icon: 'https://s3.amazonaws.com/refinebio-email/logo-2x.png',
        ts: Date.now() / 1000, // unix time
      },
    ],
  });
}

export async function submitExperimentDataRequest(accessionCode, values) {
  await postToSlack({
    attachments: [
      {
        fallback: `${accessionCode} Experiment Requested`,
        color: '#2eb886',
        title: `${accessionCode} Experiment Requested`,
        title_link: `https://www.refine.bio/experiments/${accessionCode}`,
        fields: [
          {
            title: 'Pediatric Cancer Research',
            value: values.pediatric_cancer,
            short: true,
          },
          {
            title: 'Primary Approach',
            value: values.approach,
            short: true,
          },
          {
            title: 'Email',
            value: `${values.email}${
              values.email_updates ? ' _(wants updates)_' : ''
            }`,
            short: false,
          },
          ...(values.comments
            ? [
                {
                  title: 'Additional Notes',
                  value: values.comments,
                  short: false,
                },
              ]
            : []),
        ],
        footer: `Refine.bio | ${await getIP()} | ${navigator.userAgent}`,
        footer_icon: 'https://s3.amazonaws.com/refinebio-email/logo-2x.png',
        ts: Date.now() / 1000, // unix time
      },
    ],
  });
}
