import { Heart } from 'lucide-react';
import { type Food } from '../data';
import { FoodCard } from '../components/FoodCard';
type Props = { foods:Food[]; favorites:number[]; cart:Record<number,number>; onAdd:(food:Food)=>void; onChange:(id:number,amount:number)=>void; onFavorite:(id:number)=>void; search:string; setSearch:(value:string)=>void };
export function FavoritesPage({foods,favorites,cart,onAdd,onChange,onFavorite,search,setSearch}:Props) {
 const shown=foods.filter(food=>(food.name+' '+food.category+' '+food.description).toLowerCase().includes(search.toLowerCase()));
 return <div className="page-stack"><div className="page-heading"><div><span className="section-overline">SAVED FOR LATER</span><h1>Your <em>favourites.</em></h1><p>The dishes you want to come back to.</p></div><div className="menu-count"><strong>{favorites.length}</strong><span>saved meals</span></div></div>{shown.length?<div className="meal-grid">{shown.map(food=><FoodCard key={food.id} food={food} favorite={favorites.includes(food.id)} quantity={cart[food.id]||0} onAdd={onAdd} onChange={onChange} onFavorite={onFavorite}/>)}</div>:<div className="empty-state"><span className="empty-heart"><Heart size={28}/></span><h3>No favourites yet</h3><p>Tap the heart on any meal to save it here.</p><a className="button-primary" href="#/menu">Explore the menu</a></div>}</div>;
}