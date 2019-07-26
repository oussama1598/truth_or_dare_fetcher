import request from 'request-promise';
import Dare from '../models/Dare';
import Truth from '../models/Truth';

const TRUTH_URI = 'https://truthordare-game.com/api/truth/';
const DARE_URI = 'https://truthordare-game.com/api/dare/';

export async function getTruth(category) {
  const result = await request(`${TRUTH_URI}${category}`, {
    json: true
  });

  return new Truth(result.id, result.text, category);
}

export async function getDare(category) {
  const result = await request(`${DARE_URI}${category}`, {
    json: true
  });

  return new Dare(result.id, result.text, category);
}
