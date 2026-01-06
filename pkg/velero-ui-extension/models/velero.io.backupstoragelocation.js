import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroBackupStorageLocation extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get provider() {
    return this.spec?.provider;
  }

  get bucket() {
    return this.spec?.objectStorage?.bucket;
  }

  get prefix() {
    return this.spec?.objectStorage?.prefix;
  }

  get isDefault() {
    return this.spec?.default || false;
  }

  get accessMode() {
    return this.spec?.accessMode;
  }

  get lastSyncedTime() {
    return this.status?.lastSyncedTime;
  }

  get lastValidationTime() {
    return this.status?.lastValidationTime;
  }
}
