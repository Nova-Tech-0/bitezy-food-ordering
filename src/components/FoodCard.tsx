import { Heart, Plus, Minus, Star, Clock3, ArrowUpRight } from 'lucide-react';
import { money, type Food } from '../data';

type Props = { food: Food; quantity?: number; favorite?: boolean; onAdd: (food: Food) => void; onChange?: (id: number, amount: number) => void; onFavorite?: (id: number) => void };
export function FoodCard({ food, quantity = 0, favorite = false, onAdd, onChange, onFavorite }: Props) {
  return <article className="meal-card">
    <a className="meal-image" href="#/menu" aria-label={'Explore ' + food.name}><img src={food.image} alt={food.name} loading="lazy"/><span className="meal-badge">{food.tag}</span><span className="meal-time"><Clock3 size={13}/>{food.time}</span></a>
    {onFavorite && <button className={'meal-favorite ' + (favorite ? 'selected' : '')} onClick={() => onFavorite(food.id)} aria-label={favorite ? 'Remove from favourites' : 'Add to favourites'}><Heart size={17} fill={favorite ? 'currentColor' : 'none'}/></button>}
    <div className="meal-card-body"><div className="meal-meta"><span>{food.category}</span><span className="meal-rating"><Star size={13} fill="currentColor"/>{food.rating}</span></div><h3>{food.name}</h3><p>{food.description}</p><div className="meal-card-bottom"><div><strong>{money(food.price)}</strong><small>{food.restaurant}</small></div>{quantity > 0 && onChange ? <div className="quantity-control"><button onClick={() => onChange(food.id, -1)} aria-label="Remove one"><Minus size={13}/></button><b>{quantity}</b><button onClick={() => onChange(food.id, 1)} aria-label="Add one"><Plus size={13}/></button></div> : <button className="meal-add" onClick={() => onAdd(food)} aria-label={'Add ' + food.name + ' to bag'}><Plus size={18}/></button>}</div></div>
  </article>;
}