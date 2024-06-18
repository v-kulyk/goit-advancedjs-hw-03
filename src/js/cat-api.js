import axios from 'axios';

export function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds').then((response) => response.data)
}

export function fetchCatByBreed(breedId) {
  return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`).then((response) => response.data)
}
