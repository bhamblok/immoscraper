import fetch from 'node-fetch';

export default async (site) => {
  console.log(`> fetching ${site.name} ...`);
  try {
    const data = await fetch(site.url).then(res => res.json());
    if (data) {
      const result = data.response.map((res) => {
        const {
          id,
          zip,
          price,
          street: { street_Nl: streetName },
          streetnb,
          title: { title_Nl: titleText },
          municipality: { municipality_Nl: city },
          mainURL,
        } = res;
        if (![2000, 2018, 2600].includes(zip)) {
          return null;
        }
        const msg = {
          text: 'Nieuw pand op Notaris.be',
          attachment: {
            title: `${titleText}`,
            title_link: `https://immo.notaris.be/immoplatform-public_v1/property_details/#/${id}?context=search`,
            text: `€${price} - ${streetName} ${streetnb}, ${zip} ${city}`,
            image_url: `https://immo.notaris.be${mainURL[0]}`,
          },
        };
        return { id, msg };
      }).filter(Boolean);
      return result;
    }
    return (new Error(`NO DATA from ${site.name}`));
  } catch (error) {
    return error;
  }
};
