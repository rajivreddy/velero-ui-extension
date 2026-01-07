import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroVolumeSnapshotLocation extends SteveModel {
  get canUpdate() {
    return true;
  }

  get canCustomEdit() {
    return true;
  }

  get provider() {
    return this.spec?.provider || '-';
  }

  get providerDisplay() {
    const provider = this.spec?.provider;

    const providers = {
      aws:       'AWS EBS',
      azure:     'Azure Disk',
      gcp:       'Google Compute Engine',
      vsphere:   'vSphere',
      csi:       'CSI',
      openstack: 'OpenStack Cinder',
    };

    return providers[provider] || provider || 'Unknown';
  }

  get region() {
    return this.spec?.config?.region || '-';
  }

  get hasCredential() {
    return !!this.spec?.credential?.name;
  }

  get configSummary() {
    const config = this.spec?.config || {};
    const entries = Object.entries(config).filter(([k, v]) => v);

    if (entries.length === 0) {
      return 'Default';
    }

    return entries.map(([k, v]) => `${k}=${v}`).join(', ');
  }
}
