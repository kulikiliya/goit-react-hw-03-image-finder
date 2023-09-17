import React, { Component } from 'react';
import { Header } from './header/Header';
import { PictureList } from './picturesList/PictureList';
import { AddMoreButton } from './addMoreButton/AddMoreButton';
import { getProducts } from './helpers/pixabayAPI';
import Modal from './modal/Modal';
import { FidgetSpinner } from 'react-loader-spinner';
import { Wrapper, Loader } from './Pictures.styled';

export class Pictures extends Component {
  state = {
    hits: [],
    per_page: 4,
    initial: 12,
    step: 8,
    page: 1,
    q: '',
    isOpen: false,
    currentImg: null,
    currentTitle: null,
    loading: false,
  };

  changeQuerry = name => {
    const { initial } = this.state;
    this.setState({ q: name, per_page: initial });
    console.log(this.state.q);
  };

  onLoadMore = () => {
    this.setState(prev => ({ per_page: prev.per_page + this.state.step }));
    console.log('Hi');
  };

  handleOpenModal = (img, title) => {
    this.setState(prev => ({
      isOpen: !prev.isOpen,
      currentImg: img,
      currentTitle: title,
    }));
  };

  fetchData = async (per_page, page, q) => {
    const { hits } = await getProducts({ per_page, page, q });
    console.log(hits);
    this.setState({ hits });
  };

  async componentDidUpdate(_, prevState) {
    const { per_page, page, q } = this.state;

    if (prevState.q !== q || prevState.per_page !== per_page) {
      this.setState({ loading: true });
      try {
        await this.fetchData(per_page, page, q);
      } catch (error) {
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { hits, isOpen, currentImg, currentTitle, loading } = this.state;
    return (
      <Wrapper>
        <Header newQuerry={this.changeQuerry} />
        <main>
          <PictureList data={hits} handleOpenModal={this.handleOpenModal} />
          {loading && (
            <Loader>
              <FidgetSpinner
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
                ballColors={['#ff0000', '#00ff00', '#0000ff']}
                backgroundColor="#F4442E"
              />
            </Loader>
          )}
          {hits.length !== 0 ? (
            <AddMoreButton loadMore={this.onLoadMore} />
          ) : null}
          {isOpen && (
            <Modal
              title={currentTitle}
              close={this.handleOpenModal}
              isOpen={isOpen}
            >
              <img src={currentImg} alt={currentTitle} />
            </Modal>
          )}
        </main>
      </Wrapper>
    );
  }
}
