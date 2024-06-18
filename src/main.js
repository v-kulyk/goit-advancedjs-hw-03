import SlimSelect from 'slim-select'
import './css/slimselect.css'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

import axios from 'axios';
axios.defaults.headers.common["x-api-key"] = "live_KmCtF6WiNAjqWD48uYPqxTaLUvzguU2QWWwCRcK8WjXghJwk7RZztcpWANiKEhxQ";
import { fetchBreeds, fetchCatByBreed } from './js/cat-api.js';

// Під час завантаження сторінки має виконуватися HTTP-запит за колекцією порід.
// Для цього необхідно виконати GET-запит на ресурс https://api.thecatapi.com/v1/breeds, що повертає масив об'єктів.
// У разі успішного запиту, необхідно наповнити select.breed-select опціями так, щоб value опції містило id породи,
// а в інтерфейсі користувачеві відображалася назва породи.
// Напиши функцію fetchBreeds(), яка виконує HTTP-запит і повертає проміс із масивом порід - результатом запиту. Винеси її у файл cat-api.js та зроби іменований експорт.
const refs = {
  select: document.querySelector('.breed-select'),
  info: document.querySelector('.cat-info'),
}

fetchBreeds()
  .then((data) => {
    refs.info.innerHTML = ''
    //fill in select dropdown
    const select = new SlimSelect({
      select: '.breed-select',
      data: data.map(breed => ({
        text: breed.name,
        value: breed.id
      })),
      events: {
        afterChange: (info) => {
          const infoContainer = document.querySelector('.cat-info')
          infoContainer.innerHTML = ''
          const loader = document.createElement('span')
          loader.classList.add('loader')
          infoContainer.append(loader)

          fetchCatByBreed(info[0].value)
            .then((data) => {
              infoContainer.innerHTML = ''
              const img = document.createElement('img')
              img.src = data[0].url
              infoContainer.innerHTML = ''
              infoContainer.append(img)

              //назва породи, опис і темперамент.
              const h2 = document.createElement('h2')
              h2.textContent = data[0].breeds[0].name
              infoContainer.append(h2)

              const p = document.createElement('p')
              p.textContent = data[0].breeds[0].temperament
              p.classList.add('italic', 'text-sm')
              infoContainer.append(p)

              const p2 = document.createElement('p')
              p2.textContent = data[0].breeds[0].description
              infoContainer.append(p2)
            })
            .catch(() => {
              refs.info.innerHTML = ''
              iziToast.error({
                title: 'Error',
                message: 'Oops! Something went wrong',
                position: 'topCenter'
              })
            })
        }
      }
    });

  })
  .catch((error) => {
    refs.info.innerHTML = ''

    iziToast.error({
      title: 'Error',
      message: 'Oops! Something went wrong',
      position: 'topCenter'
    })
  })