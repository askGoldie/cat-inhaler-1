<script>
  export let doseType; // 'morning' or 'evening'
  export let completed = false;
  export let timestamp = null;
  export let onToggle;

  const doseLabel = doseType === 'morning' ? 'Morning Dose' : 'Evening Dose';

  function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function handleClick() {
    onToggle(doseType);
  }
</script>

<div
  class="dose-item touch-target"
  class:completed
  role="button"
  tabindex="0"
  on:click={handleClick}
  on:keypress={(e) => e.key === 'Enter' && handleClick()}
>
  <div class="dose-info">
    <div class="dose-label">{doseLabel}</div>
    <div class="dose-status" class:completed-time={completed}>
      {completed ? `Completed at ${formatTime(timestamp)}` : 'Not completed'}
    </div>
  </div>
  <div class="checkbox" class:checked={completed}>
    {#if completed}
      <span class="checkmark">✓</span>
    {/if}
  </div>
</div>

<style>
  .dose-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border: 2px solid var(--border-light);
    border-radius: 8px;
    margin-bottom: 12px;
    background: var(--bg-main);
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }

  .dose-item:hover {
    border-color: var(--brand-cinnamon);
    box-shadow: 0 2px 8px rgba(186, 91, 63, 0.1);
  }

  .dose-item:active {
    transform: scale(0.99);
  }

  .dose-item.completed {
    background: var(--success-bg);
    border-color: var(--success-border);
  }

  .dose-info {
    flex: 1;
  }

  .dose-label {
    font-weight: bold;
    font-size: 16px;
    color: var(--text-main);
    margin-bottom: 4px;
  }

  .dose-status {
    color: var(--text-muted);
    font-size: 14px;
  }

  .dose-status.completed-time {
    color: var(--success-text);
    font-weight: 500;
  }

  .checkbox {
    width: 44px;
    height: 44px;
    border: 3px solid var(--brand-blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .checkbox.checked {
    background: var(--success-border);
    border-color: var(--success-border);
  }

  .checkmark {
    color: white;
    font-size: 24px;
    font-weight: bold;
  }

  /* Tablet and up */
  @media (min-width: 768px) {
    .dose-item {
      padding: 20px;
    }

    .dose-label {
      font-size: 18px;
    }

    .checkbox {
      width: 48px;
      height: 48px;
    }
  }
</style>
