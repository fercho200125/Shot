import { MAX_QUANTITY } from '../lib/cart';
import { MinusIcon, PlusIcon } from './Icons';
import './QuantityStepper.css';

interface Props {
  value: number;
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'md' | 'lg';
}

export function QuantityStepper({ value, label, onIncrement, onDecrement, size = 'md' }: Props) {
  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={`Cantidad de ${label}`}>
      <button type="button" onClick={onDecrement} disabled={value <= 1} aria-label={`Quitar una unidad de ${label}`}>
        <MinusIcon size={18} />
      </button>
      <output aria-live="polite" aria-label={`${value} ${value === 1 ? 'unidad' : 'unidades'}`}>
        {value}
      </output>
      <button type="button" onClick={onIncrement} disabled={value >= MAX_QUANTITY} aria-label={`Añadir una unidad de ${label}`}>
        <PlusIcon size={18} />
      </button>
    </div>
  );
}
