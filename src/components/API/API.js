const KEY = '28193181-1d0a0826250053d79f38b5461';

export class API {
  async fetchImgs(query, page) {
    const response = await fetch(
      `https://pixabay.com/api/?q=${query}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=12
`
    );
    if (!response.ok) {
      throw new Error(`could not fetch , ${response.status}`);
    }
    return response.json();
  }
}
