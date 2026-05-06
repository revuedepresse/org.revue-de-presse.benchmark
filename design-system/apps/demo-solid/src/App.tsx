import Button from '@design-system/components/Button';
import spriteUrl from '@icons/sprite.svg?url';

export default function App() {
  return (
    <main style={{ padding: '24px', background: 'var(--color-taupe-grey)', 'min-height': '100vh' }}>
      <object data={spriteUrl} type="image/svg+xml" style={{ display: 'none' }} />
      <h2>Solid</h2>
      <Button variant="primary" label="Ven. 2 avr. 2021" icon="pick-day" />
    </main>
  );
}
