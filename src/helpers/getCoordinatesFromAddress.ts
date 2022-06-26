import { Client, PlaceType2 } from '@googlemaps/google-maps-services-js';
import { IOrder } from '../models/order';

const client = new Client({});

export const getCoordinatesFromAddress = (address: IOrder['address']) => new Promise<IOrder['address']>((resolve, reject) => {
  client.geocode({
    params: {
      key: process.env.GOOGLE_API_KEY!,
      address: `${address.code}, ${address.street}, ${address.house}, ${address.city}`,
    },
  })
    .then(({ data }) => {
      const coordinates = data.results[0]?.geometry?.location ?? {};
      resolve({
        ...address,
        street: data.results[0]?.address_components.find(({ types }) => types.includes(PlaceType2.route))?.short_name ?? address.street,
        code: data.results[0]?.address_components.find(({ types }) => types.includes(PlaceType2.postal_code))?.short_name ?? address.code,
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
    })
    .catch((err) => {
      reject(err);
    });
});
