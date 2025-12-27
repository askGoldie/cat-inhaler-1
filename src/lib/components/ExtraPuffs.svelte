<script>
  export let extraPuffs = [];
  export let onAdd;
  export let onDelete;

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.toISOString().split('T')[0] === now.toISOString().split('T')[0];

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (isToday) {
      return `Today at ${timeStr}`;
    } else {
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return `${dateStr} at ${timeStr}`;
    }
  }

  function handleAdd() {
    onAdd();
  }

  function handleDelete(puffId) {
    onDelete(puffId);
  }
</script>

<div class="extra-puffs">
  <button class="btn btn-primary" on:click={handleAdd}>
    + Log Extra Puff
  </button>

  {#if extraPuffs.length === 0}
    <div class="extra-puffs-empty">No extra puffs logged</div>
  {:else}
    <div class="puff-log">
      {#each extraPuffs as puff (puff.id)}
        <div class="puff-log-item">
          <div class="puff-time">{formatTimestamp(puff.timestamp)}</div>
          <button
            class="delete-button btn-small"
            on:click={() => handleDelete(puff.id)}
            aria-label="Delete extra puff"
          >
            Delete
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .extra-puffs {
    margin-top: 0;
  }

  .extra-puffs-empty {
    text-align: center;
    color: var(--text-muted);
    padding: 32px 24px;
    font-style: italic;
    font-size: 14px;
  }

  .puff-log {
    margin-top: 16px;
  }

  .puff-log-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 2px solid var(--border-light);
    border-radius: 6px;
    margin-bottom: 8px;
    background: #fff9e6;
    transition: all 0.2s ease;
  }

  .puff-log-item:hover {
    border-color: var(--brand-cinnamon);
    box-shadow: 0 2px 8px rgba(186, 91, 63, 0.1);
  }

  .puff-time {
    font-size: 14px;
    color: var(--text-main);
    font-weight: 500;
  }

  .delete-button {
    background: var(--error-bg);
    border: 2px solid var(--error-border);
    padding: 6px 12px;
    font-size: 12px;
    color: var(--error-text);
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .delete-button:hover {
    background: var(--error-border);
    color: white;
  }

  .delete-button:active {
    transform: scale(0.95);
  }

  /* Tablet and up */
  @media (min-width: 768px) {
    .puff-log-item {
      padding: 14px 16px;
    }

    .puff-time {
      font-size: 15px;
    }

    .delete-button {
      padding: 8px 16px;
      font-size: 13px;
    }
  }
</style>
