import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroPodVolumeBackup extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get pod() {
    return `${ this.spec?.pod?.namespace }/${ this.spec?.pod?.name }`;
  }

  get volume() {
    return this.spec?.volume;
  }

  get node() {
    return this.spec?.node;
  }

  get backupStorageLocation() {
    return this.spec?.backupStorageLocation;
  }

  get progress() {
    const done = this.status?.progress?.bytesDone || 0;
    const total = this.status?.progress?.totalBytes || 0;

    return total > 0 ? `${ Math.round((done / total) * 100) }%` : '0%';
  }
}
