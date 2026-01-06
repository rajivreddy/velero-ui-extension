import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroDownloadRequest extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get downloadURL() {
    return this.status?.downloadURL;
  }

  get expiration() {
    return this.status?.expiration;
  }

  get targetKind() {
    return this.spec?.target?.kind;
  }

  get targetName() {
    return this.spec?.target?.name;
  }
}
