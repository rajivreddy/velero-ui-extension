import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroVolumeSnapshotLocation extends SteveModel {
  get provider() {
    return this.spec?.provider;
  }

  get credential() {
    return this.spec?.credential?.name;
  }

  get config() {
    return this.spec?.config || {};
  }
}
