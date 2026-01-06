import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroBackupStorageLocation extends SteveModel {
  get state() {
    return this.status?.phase || 'Unknown';
  }

  get stateColor() {
    const phase = this.status?.phase;

    switch (phase) {
    case 'Available':
      return 'text-success';
    case 'Unavailable':
      return 'text-error';
    default:
      return 'text-muted';
    }
  }

  get stateDisplay() {
    return this.status?.phase || 'Unknown';
  }

  get provider() {
    return this.spec?.provider || '-';
  }

  get providerDisplay() {
    const provider = this.spec?.provider;

    const providers = {
      aws:   'AWS S3',
      azure: 'Azure Blob Storage',
      gcp:   'Google Cloud Storage',
    };

    return providers[provider] || provider || 'Unknown';
  }

  get bucket() {
    return this.spec?.objectStorage?.bucket || '-';
  }

  get prefix() {
    return this.spec?.objectStorage?.prefix || '-';
  }

  get isDefault() {
    return !!this.spec?.default;
  }

  get accessMode() {
    return this.spec?.accessMode || 'ReadWrite';
  }

  get accessModeDisplay() {
    return this.accessMode === 'ReadOnly' ? 'Read Only' : 'Read/Write';
  }

  get region() {
    return this.spec?.config?.region || '-';
  }

  get lastSyncedTime() {
    return this.status?.lastSyncedTime || '-';
  }

  get lastValidationTime() {
    return this.status?.lastValidationTime || '-';
  }

  get accessError() {
    return this.status?.message || '';
  }

  get _availableActions() {
    const out = super._availableActions;

    // Add "Set as Default" action
    if (!this.isDefault) {
      out.unshift({
        action:  'setAsDefault',
        enabled: true,
        icon:    'icon icon-fw icon-checkmark',
        label:   'Set as Default',
      });
    }

    return out;
  }

  async setAsDefault() {
    this.spec = this.spec || {};
    this.spec.default = true;

    await this.save();

    this.$dispatch('growl/success', {
      title:   'Default Storage Location',
      message: `${this.metadata?.name} is now the default backup storage location`,
    }, { root: true });
  }
}
