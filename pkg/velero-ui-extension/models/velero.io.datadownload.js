import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroDataDownload extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get targetVolume() {
    return `${ this.spec?.targetVolume?.namespace }/${ this.spec?.targetVolume?.pvc }`;
  }

  get backupStorageLocation() {
    return this.spec?.backupStorageLocation;
  }

  get snapshotID() {
    return this.spec?.snapshotID;
  }

  get progress() {
    const done = this.status?.progress?.bytesDone || 0;
    const total = this.status?.progress?.totalBytes || 0;

    return total > 0 ? `${ Math.round((done / total) * 100) }%` : '0%';
  }
}
