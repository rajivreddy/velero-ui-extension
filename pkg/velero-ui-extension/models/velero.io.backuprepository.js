import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroBackupRepository extends SteveModel {
  get phase() {
    return this.status?.phase || 'Unknown';
  }

  get volumeNamespace() {
    return this.spec?.volumeNamespace;
  }

  get backupStorageLocation() {
    return this.spec?.backupStorageLocation;
  }

  get repositoryType() {
    return this.spec?.repositoryType;
  }

  get maintenanceFrequency() {
    return this.spec?.maintenanceFrequency;
  }

  get lastMaintenanceTime() {
    return this.status?.lastMaintenanceTime;
  }
}
