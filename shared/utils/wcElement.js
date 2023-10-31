import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import axios from 'axios';
import stylesFontScss from './fonts.min.scss';

export default class WcElement extends ScopedElementsMixin(LitElement) {
  static get styles() {
    return [];
  }

  constructor(fonts = []) {
    super();
    this._wcData = {
      baseUrl: '',
      id: '',
      idType: '',
      businessUnit: '',
      countryCode: '',
      platform: '',
    };
    this.eventCustom = null;
    this.isLoading = false;
    this.isLoadingFonts = false;
    this.environment = process.env.NODE_ENV; // Capture environment ['development | production']

    if (fonts.length > 0) {
      const WebFont = require('webfontloader');
      WebFont.load({
        custom: {
          families: fonts,
          urls: ['https://atomic.tigocloud.net/sandbox/css/main-v1.2.3.min.css'],
        },
        loading: () => {
          this.isLoadingFonts = true;
        },
        active: () => {
          const elem = document.querySelector('head link[href="https://atomic.tigocloud.net/sandbox/css/main-v1.2.3.min.css"]');
          if (elem != null) {
            elem.remove();

            let custom_style = document.querySelector('head style[id="fonts-wc"]');

            if (custom_style == null) {
              custom_style = document.createElement('style');
              custom_style.textContent = stylesFontScss;
              custom_style.id = 'fonts-wc';
              document.querySelector('head').appendChild(custom_style);
            }
          }
          this.isLoadingFonts = false;
        },
      });
    }

    this.configureAxios();
  }

  set wcData(value) {
    if (typeof value !== 'undefined') {
      this._wcData = value;
      this.init();
    }
  }

  get wcData() {
    return this._wcData;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name == 'refresh-wc' && oldValue != newValue) {
      this.init();
    }
  }

  async configureAxios() {
    axios.interceptors.request.use(
      (config) => {
        let token = localStorage.getItem('IdToken');
        if (token == void 0 || token == null || token == '') {
          token = localStorage.getItem('id_token');
        }

        config.headers['Authorization'] = 'Bearer ' + token;
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        // if (response.status === 401 && response.message === 'Expired token' && !originalRequest._retry) {
        if (response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          this.refreshToken();
          const tokenOld = localStorage.getItem('IdToken');
          return this.waitForToken(500, tokenOld, originalRequest);
        } else if (response?.data != null && response?.data?.message != null) {
          this.message(response?.data?.message, 'error');

          this.sendInfoToSegment('Message Displayed', {
            message: response?.data?.message,
            event_type: 'error',
          });

          this.statusLoading(false);
          this.isLoading = false;
          return Promise.reject(error);
        } else {
          this.statusLoading(false);
          this.isLoading = false;
          return Promise.reject(error);
        }
      }
    );
  }

  async waitForToken(milliseconds, tokenOld, originalRequest) {
    await this.delay(milliseconds);
    const token = localStorage.getItem('IdToken');

    if (token && token != '' && token != tokenOld) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          resolve(axios(originalRequest));
        }, milliseconds);
      });
    } else {
      return this.waitForToken(milliseconds, tokenOld, originalRequest);
    }
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // metodo inicial del wc
  init() {}

  emmitEvent(eventType, data, eventId = eventType, otherEvent = '') {
    const event = otherEvent == 'eventCustom' ? otherEvent : eventType;
    const type = otherEvent == 'eventCustom' ? eventId : eventType;
    const id = otherEvent == 'eventCustom' ? eventType : eventId;
    // console.log('eventType :>> ', event);
    const _eventCustom = new CustomEvent(event, {
      bubbles: true,
      composed: true,
      detail: { eventType: type, data: data, eventId: id },
    });
    // console.log('_eventCustom :>> ', _eventCustom);
    this.dispatchEvent(_eventCustom);
  }

  redirectExpress(eventType, url, eventId, event) {
    this.emmitEvent(eventId, { url }, eventType, event);
  }

  sendInfoToSegment(name, properties, eventType = 'track') {
    this.emmitEvent('wcSegment', { name, properties, eventType });
  }

  sendMedallia(params = { }) {
    this.emmitEvent('wcSendMedallia', params);
  }

  message(message, type) {
    this.emmitEvent('wcMessage', { message, type });
  }
  
  statusLoading(status) {
    this.emmitEvent('wcLoading', { status });
  }

  redirect(url, redirectType, data = {}) {
    if (!data.hasOwnProperty('force_update')) {
      data.force_update = false;
    }
    this.emmitEvent('wcRedirect', { url, redirectType, data });
  }

  refreshToken() {
    this.emmitEvent('wcRefreshToken', {});
  }

  renderLoading(statusLoading) {
    if (statusLoading && this.wcData.platform != 'web_micuenta') {
      return html`
        <div class="loading-oneapp">
          <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.76 57.76">
            <path
              d="M28.88,0C12.96,0,0,12.96,0,28.88H0s5,0,5,0h0C5,15.71,15.71,5,28.88,5s23.88,10.71,23.88,23.88-10.71,23.88-23.88,23.88h0v5h0c15.92,0,28.88-12.96,28.88-28.88S44.81,0,28.88,0Z"
              fill="#00C8FF"
            />
          </svg>
        </div>
      `;
    }
  }
}
