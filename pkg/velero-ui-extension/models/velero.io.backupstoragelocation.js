import SteveModel from '@shell/plugins/steve/steve-class';

export default class VeleroBackupStorageLocation extends SteveModel {
  get canUpdate() {
    return true;
  }

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
      message: `${ this.metadata?.name } is now the default backup storage location`,
    }, { root: true });
  }

  cleanupBeforeSave() {
    // Valid config keys for each provider
    const validConfigKeys = {
      aws: [
        'region', 's3Url', 'publicUrl', 'kmsKeyId', 'customerKeyEncryptionFile',
        'customerKeyEncryptionSecret', 's3ForcePathStyle', 'signatureVersion',
        'credentialsFile', 'profile', 'serverSideEncryption', 'insecureSkipTLSVerify',
        'enableSharedConfig', 'tagging', 'checksumAlgorithm',
      ],
      azure: [
        'resourceGroup', 'storageAccount', 'storageAccountKeyEnvVar',
        'subscriptionId', 'blockSizeInBytes', 'activeDirectoryAuthorityURI',
      ],
      gcp: [
        'project', 'serviceAccount',
      ],
    };

    // Clean up config object - only keep valid keys for the provider with non-empty values
    if (this.spec?.config) {
      const provider = this.spec.provider || 'aws';
      const allowedKeys = validConfigKeys[provider] || [];
      const cleanConfig = {};

      for (const [key, value] of Object.entries(this.spec.config)) {
        // Only keep keys that are valid for this provider
        if (!allowedKeys.includes(key)) {
          continue;
        }
        // Skip empty, null, undefined values
        if (value === undefined || value === null || value === '') {
          continue;
        }
        // Convert boolean values to strings (Velero expects string values in config)
        if (typeof value === 'boolean') {
          cleanConfig[key] = String(value);
        } else if (typeof value === 'number') {
          cleanConfig[key] = String(value);
        } else {
          cleanConfig[key] = value;
        }
      }
      this.spec.config = cleanConfig;
    }

    // Remove empty caCert - Velero expects byte type, so empty string is invalid
    if (this.spec?.objectStorage?.caCert === '') {
      delete this.spec.objectStorage.caCert;
    }

    // Remove empty credential if name is not set
    if (this.spec?.credential && !this.spec.credential.name) {
      delete this.spec.credential;
    }

    // Remove empty optional fields
    if (this.spec?.backupSyncPeriod === '') {
      delete this.spec.backupSyncPeriod;
    }
    if (this.spec?.validationFrequency === '') {
      delete this.spec.validationFrequency;
    }

    // Remove empty prefix
    if (this.spec?.objectStorage?.prefix === '') {
      delete this.spec.objectStorage.prefix;
    }
  }

  async save() {
    this.cleanupBeforeSave();

    return await super.save(...arguments);
  }
}
