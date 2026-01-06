<script>
export default {
  name: 'VeleroDataUploadDetail',
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
      <p><strong>Started:</strong> {{ value.status?.startTimestamp }}</p>
      <p><strong>Completed:</strong> {{ value.status?.completionTimestamp }}</p>
      <p><strong>Progress:</strong> {{ value.status?.progress?.bytesDone }} / {{ value.status?.progress?.totalBytes }}</p>
      <p><strong>Snapshot ID:</strong> {{ value.status?.snapshotID }}</p>
    </div>
    <div class="detail-section">
      <h3>Spec</h3>
      <p><strong>Source PVC:</strong> {{ value.spec?.sourceNamespace }}/{{ value.spec?.sourcePVC }}</p>
      <p><strong>Backup Storage Location:</strong> {{ value.spec?.backupStorageLocation }}</p>
      <p><strong>Data Mover:</strong> {{ value.spec?.dataMover }}</p>
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
