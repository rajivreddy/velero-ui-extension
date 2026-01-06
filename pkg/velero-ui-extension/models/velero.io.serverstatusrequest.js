import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroServerStatusRequest extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get serverVersion() {
    return this.status?.serverVersion;
  }

  get processedTimestamp() {
    return this.status?.processedTimestamp;
  }

  get plugins() {
    return this.status?.plugins || [];
  }
}
