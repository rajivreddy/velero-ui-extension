<script>
export default {
  name: 'VeleroDownloadRequestDetail',
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
      <p><strong>Download URL:</strong> {{ value.status?.downloadURL || 'Not available' }}</p>
      <p><strong>Expiration:</strong> {{ value.status?.expiration }}</p>
    </div>
    <div class="detail-section">
      <h3>Spec</h3>
      <p><strong>Target Kind:</strong> {{ value.spec?.target?.kind }}</p>
      <p><strong>Target Name:</strong> {{ value.spec?.target?.name }}</p>
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
