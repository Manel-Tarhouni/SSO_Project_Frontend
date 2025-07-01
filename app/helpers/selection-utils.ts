export function getUnassignedItems<T extends { id: string }>(
  allItems: T[],
  assignedItems: T[]
): T[] {
  return allItems.filter(
    (item) => !assignedItems.some((a) => a.id === item.id)
  );
}

export function groupItemsByKey<T>(
  items: T[],
  getKey: (item: T) => string
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = getKey(item) || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function toggleSelection(selectedIds: string[], id: string): string[] {
  return selectedIds.includes(id)
    ? selectedIds.filter((x) => x !== id)
    : [...selectedIds, id];
}
