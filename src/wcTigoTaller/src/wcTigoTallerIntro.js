import { html } from 'lit';
import axios from 'axios';
import WcElement from 'utils/wcElement';
import stylesScss from './wcTigoTaller.scss';

class WcTigoTaller extends WcElement {
  static get properties() {
    return {
      isLoading: { type: Boolean },
      data: { type: Object },
      error: { type: String },
      'refresh-wc': { type: Number },
    };
  }

  static get styles() {
    return [stylesScss];
  }

  constructor() {
    super(['icoTigoUne', 'robotoregular', 'robotomedium']);
    this.isLoading = false;
    this.data = {};
  }
  
  init() {
    this.getDataApi();
  }

  getDataApi() {
    this.statusLoading(true);
    this.isLoading = true;

    const apiUrl = `${this.wcData.urlBase}/api?_format=json`;

    console.log('apiUrl :>> ', apiUrl);
    axios.get(apiUrl).then((response) => {
      this.data = response.data.results[0];      
      console.log('response :>> ', this.data);
      this.statusLoading(false);
      this.isLoading = false;
      this.error = null;
    }).catch((error) => {
      this.error = error;
      this.statusLoading(false);
      this.isLoading = false;
    });
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://atomic.tigocloud.net/sandbox/css/main-v1.2.3.min.css" />
      <div class="ml-general-interest">
        ${this.renderLoading(this.isLoading)}
        <div class="at-containershadow-primary ${this.isLoading ? 'hidden' : 'show'}">
          <div class="content-img">
            <img
              src="${this.data?.picture?.large}"
              alt="Landscape"
              class="at-landscape-image"
              width="100%"
            />
          </div>
          <div class="content-info">
            <h5 class="at-font-h5">${this.data?.name?.first} ${this.data?.name?.last}</h5>
            <p class="at-font-p">
              ${this.data?.location?.timezone?.description}
            </p>
            <div class="content-button">
              <button class="at-button-tertiary" @click="${(e) => this.goAction(e)}">Ir al centro de ayuda</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  goAction() {
    window.open('https://www.tigo.com.co/', '_blank');
  }
}

// Definición de tag html.
window.customElements.get('tigo-taller') ||
  window.customElements.define('tigo-taller', WcTigoTaller);
