import { Component } from 'react';
import { createPortal } from 'react-dom';
import { API } from './API/API';

import { SearchBar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Button } from './Button/Button';

const imgAPI = new API();
const portalContainer = document.querySelector('#portal');

export class App extends Component {
  state = {
    images: [],
    page: 1,
    query: '',
    isLoading: false,
    isOpenModal: false,
    largeImg: '',
    description: '',
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      query: e.target.elements.input.value,
      page: 1,
      images: [],
    });
    e.target.reset();
  };

  onClickOpenModal = (url, description) => {
    this.setState({
      largeImg: url,
      description,
      isOpenModal: true,
      isLoading: true,
    });
    window.addEventListener('keydown', this.onCloseModalByEsc);
    this.setState({ isLoading: false });
  };

  onCloseModalByEsc = e => {
    if (e.key === 'Escape') {
      this.setState({ isOpenModal: false });
    }
    window.removeEventListener('keydown', this.onCloseModal);
  };

  onClickCloseModal = e => {
    if (e.currentTarget === e.target) {
      this.setState({ isOpenModal: false });
    }
  };

  onLoadMore = async () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;
    const { query } = this.state;
    if (prevState.page !== page) {
      this.setState({ isLoading: true });
      try {
        const { hits } = await imgAPI.fetchImgs(query, page);
        this.setState({ images: [...prevState.images, ...hits] });
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
    if (prevState.query !== query) {
      this.setState({ isLoading: true });
      try {
        const { hits } = await imgAPI.fetchImgs(query, page);
        this.setState({ images: hits });
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  render() {
    return (
      <>
        <SearchBar onSubmit={this.onSubmit} />
        <ImageGallery
          images={this.state.images}
          onModalOpen={this.onClickOpenModal}
        />
        {this.state.images.length !== 0 && (
          <Button onLoadMore={this.onLoadMore} btnText="Load more..." />
        )}
        {this.state.isOpenModal &&
          createPortal(
            <Modal
              onClickCloseModal={this.onClickCloseModal}
              img={this.state.largeImg}
              descr={this.state.description}
            />,
            portalContainer
          )}
        {this.state.isLoading && createPortal(<Loader />, portalContainer)}
      </>
    );
  }
}
