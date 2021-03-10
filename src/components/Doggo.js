import React from 'react';
import { PropTypes } from 'prop-types';
// antd components
import { Card, notification } from 'antd';

const { Meta } = Card;

//notification setup
const openNotification = (placement) => {
  notification.info({
    message: `Dog Saved`,
    description: 'The Selected Dog has been successfully added to your saved dogs',
    placement,
    duration: 2,
  });
};

Doggo.propTypes = {
  doggo: PropTypes.string,
  breed: PropTypes.string,
  subBreed: PropTypes.string,
  favorite: PropTypes.bool,
  favoriteDoggos: PropTypes.array,
  setFavoriteDoggos: PropTypes.func,
};

export default function Doggo({
  doggo,
  breed,
  subBreed,
  favorite,
  favoriteDoggos,
  setFavoriteDoggos,
}) {
  const subBreedText = subBreed === '' ? 'none' : subBreed;
  const title = `Breed : ${breed}`;
  const description = `Sub Breed : ${subBreedText}`;

  return (
    <>
      {/* render dogs when favorites is toggled off */}
      {!favorite && (
        <Card
          className="doggo__card"
          hoverable
          onClick={() => {
            setFavoriteDoggos([
              ...favoriteDoggos,
              { doggo: doggo, breed: breed, subBreed: subBreed },
            ]);
            openNotification('topRight');
          }}
          style={{ width: 240, heigh: 400, marginBottom: 15 }}
          cover={
            <img
              style={{ Width: '100%', height: '20vh', objecFit: 'cover' }}
              alt={breed}
              src={doggo}
            />
          }
        >
          <Meta className="doggo__card__text-container" title={title} description={description} />
        </Card>
      )}

      {/* render dogs when favorites is toggled off */}
      {favorite && (
        <Card
          className="doggo__card"
          style={{ width: 240, heigh: 400, marginBottom: 15 }}
          cover={
            <img
              style={{ Width: '100%', height: '20vh', objecFit: 'cover' }}
              alt={breed}
              src={doggo}
            />
          }
        >
          <Meta className="doggo__card__text-container" title={title} description={description} />
        </Card>
      )}
    </>
  );
}
