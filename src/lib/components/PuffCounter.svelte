<script>
  export let puffCount = 120;
  export let onRefill;

  let showRefillModal = false;
  let refillAmount = 120;

  $: isLow = puffCount <= 20;

  function handleRefillClick() {
    showRefillModal = true;
  }

  function handleCancel() {
    showRefillModal = false;
    refillAmount = 120;
  }

  function handleConfirm() {
    onRefill(refillAmount);
    showRefillModal = false;
    refillAmount = 120;
  }
</script>

<div class="puff-counter" class:low={isLow}>
  <div class="puff-number" class:low-warning={isLow}>{puffCount}</div>
  <div class="puff-label">puffs remaining</div>

  {#if isLow}
    <div class="low-warning-box">
      ⚠️ Inhaler effectiveness may be reduced<br />
      Order replacement soon
    </div>
  {/if}

  <div class="refill-section">
    <div class="refill-label">Refill Inhaler</div>
    <input
      type="number"
      class="refill-input"
      bind:value={refillAmount}
      min="1"
      max="200"
    />
    <button class="btn-small btn-refill" class:warning={isLow} on:click={handleRefillClick}>
      Refill
    </button>
  </div>
</div>

{#if showRefillModal}
  <div class="modal-overlay" on:click={handleCancel}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-title">Confirm Inhaler Refill</div>
      <div class="modal-message">
        Are you sure you want to reset the puff counter? This action cannot be undone.
      </div>
      <div class="modal-highlight">
        Current: {puffCount} puffs<br />
        New: {refillAmount} puffs
      </div>
      <div class="modal-message">
        Make sure you've actually started using a new inhaler before confirming.
      </div>
      <div class="modal-buttons">
        <button class="modal-button cancel" on:click={handleCancel}>Cancel</button>
        <button class="modal-button confirm" on:click={handleConfirm}>Confirm Refill</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .puff-counter {
    text-align: center;
    padding: 32px 0;
  }

  .puff-number {
    font-size: 72px;
    font-weight: bold;
    line-height: 1;
    color: var(--brand-cinnamon);
    transition: color 0.3s ease;
  }

  .puff-number.low-warning {
    color: var(--warning-border);
  }

  .puff-label {
    color: var(--text-muted);
    margin-top: 8px;
    font-size: 16px;
  }

  .puff-counter.low .puff-label {
    color: var(--warning-text);
    font-weight: bold;
  }

  .low-warning-box {
    background: var(--warning-bg);
    border: 2px solid var(--warning-border);
    border-radius: 6px;
    padding: 12px;
    margin-top: 16px;
    text-align: center;
    color: var(--warning-text);
    font-weight: bold;
    font-size: 14px;
    line-height: 1.4;
  }

  .refill-section {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 2px dashed var(--border-light);
    flex-wrap: wrap;
  }

  .refill-label {
    font-weight: bold;
    color: var(--text-main);
    font-size: 14px;
  }

  .refill-input {
    width: 80px;
    padding: 8px;
    border: 2px solid var(--border-light);
    border-radius: 6px;
    font-size: 16px;
    text-align: center;
  }

  .btn-refill {
    background: var(--bg-subtle);
    border: 2px solid var(--border-light);
    padding: 8px 24px;
    font-size: 14px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-refill:hover {
    background: var(--brand-cinnamon);
    color: white;
    border-color: var(--brand-cinnamon);
  }

  .btn-refill.warning {
    background: #ffc107;
    border-color: var(--warning-border);
  }

  .btn-refill.warning:hover {
    background: var(--warning-border);
    color: white;
  }

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal {
    background: var(--bg-main);
    border: 4px solid var(--brand-cinnamon);
    border-radius: 12px;
    padding: 32px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    text-align: center;
    color: var(--brand-cinnamon);
  }

  .modal-message {
    font-size: 16px;
    margin-bottom: 24px;
    text-align: center;
    line-height: 1.5;
    color: var(--text-main);
  }

  .modal-highlight {
    background: var(--warning-bg);
    border: 2px solid var(--warning-border);
    border-radius: 6px;
    padding: 16px;
    margin: 16px 0;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: var(--warning-text);
    line-height: 1.5;
  }

  .modal-buttons {
    display: flex;
    gap: 12px;
  }

  .modal-button {
    flex: 1;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    border: 3px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .modal-button.cancel {
    background: var(--bg-subtle);
    border-color: var(--border-light);
    color: var(--text-main);
  }

  .modal-button.cancel:hover {
    background: #e0e0e0;
  }

  .modal-button.confirm {
    background: var(--success-border);
    color: white;
    border-color: var(--success-border);
  }

  .modal-button.confirm:hover {
    background: #218838;
  }

  .modal-button:active {
    transform: scale(0.98);
  }

  /* Tablet and up */
  @media (min-width: 768px) {
    .puff-number {
      font-size: 96px;
    }

    .refill-section {
      flex-wrap: nowrap;
    }
  }
</style>
