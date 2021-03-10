import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
// packages
import axios from 'axios';
// antd components
import { Pagination } from 'antd';

//components
import Doggo from './Doggo';

DoggoList.propTypes = {
  breed: PropTypes.string,
  subBreed: PropTypes.string,
  favorite: PropTypes.bool,
  selected: PropTypes.array,
};

export default function DoggoList({ breed, subBreed, favorite, selected }) {
  const [doggos, setDoggos] = useState([]);
  const [favoriteDoggos, setFavoriteDoggos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFavoritePage, setCurrentFavoritePage] = useState(1);
  const [doggosPerPage] = useState(12);

  useEffect(() => {
    // initial page getting doggos
    breed === 'random' &&
      selected.length === 0 &&
      axios
        .get(`https://dog.ceo/api/breeds/image/random/50`)
        .then((res) => {
          setDoggos(res.data.message);
        })
        .catch(function (error) {
          console.log(error);
        });

    //Using promises to get selected doggos
    if (breed === 'random' && selected.length) {
      setDoggos([]);

      let requests = selected.map((element) =>
        fetch(`https://dog.ceo/api/breed/${element}/images`),
      );
      Promise.all(requests)
        .then((responses) => {
          // all responses are resolved successfully
          for (let response of responses) {
            console.log(`${response.url}: ${response.status}`); // shows 200 for every url
          }
          return responses;
        })
        // map array of responses into an array of response.json() to read their content
        .then((responses) => Promise.all(responses.map((r) => r.json())))
        // adding the doggos I got to the state
        .then((res) =>
          res.forEach((res) => setDoggos((prevState) => [...res.message, ...prevState])),
        );
    }

    // getting doggos by breed
    breed !== 'random' &&
      subBreed === '' &&
      axios
        .get(`https://dog.ceo/api/breed/${breed}/images`)
        .then((res) => {
          setDoggos(res.data.message);
        })
        .catch(function (error) {
          console.log(error);
        });
    // getting doggos by subbreed
    breed !== 'random' &&
      subBreed !== '' &&
      axios
        .get(`https://dog.ceo/api/breed/${breed}/${subBreed}/images`)
        .then((res) => {
          setDoggos(res.data.message);
        })
        .catch(function (error) {
          console.log(error);
        });
  }, [breed, subBreed, selected]);

  //randomizing doggos to show randomly intersperse pictures of the matching breeds.
  const randomizedDoggos = doggos;
  randomizedDoggos.sort(() => Math.random() - 0.5);

  // Get current doggos
  const indexOfLastDoggo = currentPage * doggosPerPage;
  const indexOfFirstDoggo = indexOfLastDoggo - doggosPerPage;
  const currentDoggos = randomizedDoggos.slice(indexOfFirstDoggo, indexOfLastDoggo);

  // Get current favorite doggos
  const indexOfLastFavoriteDoggo = currentFavoritePage * doggosPerPage;
  const indexOfFirstFavoriteDoggo = indexOfLastFavoriteDoggo - doggosPerPage;
  const currentFavoriteDoggos = favoriteDoggos.slice(
    indexOfFirstFavoriteDoggo,
    indexOfLastFavoriteDoggo,
  );

  return (
    <>
      <div className="doggo-list__container">
        {!favorite &&
          doggos &&
          currentDoggos.map((doggo, index) => {
            // getting breed & sub breed names from img url
            let tempBreed = doggo.split('/', 5)[4].split('-');

            return (
              <Doggo
                doggo={doggo}
                breed={tempBreed[0]}
                subBreed={tempBreed[1] ? tempBreed[1] : ''}
                key={index}
                favorite={favorite}
                favoriteDoggos={favoriteDoggos}
                setFavoriteDoggos={setFavoriteDoggos}
              ></Doggo>
            );
          })}

        {favorite &&
          currentFavoriteDoggos.map((doggo, idx) => {
            return (
              <Doggo
                doggo={doggo.doggo}
                breed={doggo.breed}
                subBreed={doggo.subBreed}
                favorite={favorite}
                key={idx}
              />
            );
          })}
      </div>
      <div className="pagination__container">
        {!favorite && (
          <Pagination
            defaultCurrent={1}
            pageSize={doggosPerPage}
            pageSizeOptions={[12]}
            onChange={(page) => setCurrentPage(page)}
            total={doggos.length}
          />
        )}
        {favorite && (
          <Pagination
            defaultCurrent={1}
            pageSize={doggosPerPage}
            pageSizeOptions={[12]}
            onChange={(page) => setCurrentFavoritePage(page)}
            total={favoriteDoggos.length}
          />
        )}
      </div>
    </>
  );
}
