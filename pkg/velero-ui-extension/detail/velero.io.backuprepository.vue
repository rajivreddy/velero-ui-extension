<script>
export default {
  name: 'VeleroBackupRepositoryDetail',
  props: {
    value: {
      type:     Object,
      required: true,
    },
  },
};
</script>

<template>
  <div class="velero-detail">
    <h1>{{ value.metadata?.name }}</h1>
    <div class="detail-section">
      <h3>Status</h3>
      <p><strong>Phase:</strong> {{ value.status?.phase || 'Unknown' }}</p>
      <p><strong>Last Maintenance:</strong> {{ value.status?.lastMaintenanceTime }}</p>
    </div>
    <div class="detail-section">
      <h3>Spec</h3>
      <p><strong>Volume Namespace:</strong> {{ value.spec?.volumeNamespace }}</p>
      <p><strong>Backup Storage Location:</strong> {{ value.spec?.backupStorageLocation }}</p>
      <p><strong>Repository Type:</strong> {{ value.spec?.repositoryType }}</p>
      <p><strong>Maintenance Frequency:</strong> {{ value.spec?.maintenanceFrequency }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.velero-detail {
  padding: 20px;

  .detail-section {
    margin-bottom: 20px;

    h3 {
      border-bottom: 1px solid var(--border);
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
  }
}
</style>
