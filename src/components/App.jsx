import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { API } from './API/API';

import SearchBar from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Button } from './Button/Button';

import { useIsMount } from './hooks/useIsMount';

const imgAPI = new API();
const portalContainer = document.querySelector('#portal');

export const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [largeImg, setLargeImg] = useState('');
  const [description, setDescription] = useState('');
  const isMount = useIsMount();

  const onSubmit = useCallback(e => {
    e.preventDefault();
    setQuery(e.target.elements.input.value);
    setPage(1);
    setImages([]);

    e.target.reset();
  }, []);

  const onClickOpenModal = (url, description) => {
    setIsLoading(true);
    setLargeImg(url);
    setDescription(description);
    setIsOpenModal(true);

    window.addEventListener('keydown', onCloseModalByEsc);
    setIsLoading(false);
  };

  const onCloseModalByEsc = e => {
    if (e.key === 'Escape') {
      setIsOpenModal(false);
    }
    window.removeEventListener('keydown', onCloseModalByEsc);
  };

  const onClickCloseModal = e => {
    if (e.currentTarget === e.target) {
      setIsOpenModal(false);
    }
  };

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const getImages = useCallback(async () => {
    try {
      const { hits } = await imgAPI.fetchImgs(query, page);
      setImages(prevState => [...prevState, ...hits]);
    } catch (error) {
      console.log(error);
    }
  }, [query, page]);

  useEffect(() => {
    if (isMount) {
      return;
    } else {
      setIsLoading(true);
      getImages();
      setIsLoading(false);
    }
  }, [getImages, isMount, page, query]);

  return (
    <>
      <SearchBar onSubmit={onSubmit} />
      <ImageGallery images={images} onModalOpen={onClickOpenModal} />
      {images.length !== 0 && (
        <Button onLoadMore={onLoadMore} btnText="Load more..." />
      )}
      {isOpenModal &&
        createPortal(
          <Modal
            onClickCloseModal={onClickCloseModal}
            img={largeImg}
            descr={description}
          />,
          portalContainer
        )}
      {isLoading && createPortal(<Loader />, portalContainer)}
    </>
  );
};
