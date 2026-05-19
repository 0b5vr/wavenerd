export function HeaderItemUnknown({ name }: { name: string }) {
  return (
    <div
      className="text-sm font-mono text-error"
      data-stalker={`Unknown header item: ${name}. Check the settings to make sure it's a valid item.`}
    >
      {name}
    </div>
  );
}
