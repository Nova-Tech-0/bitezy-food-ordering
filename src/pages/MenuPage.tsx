import { type Food } from '../data';
import { FoodCard } from '../components/FoodCard';
type Props = { foods: Food[]; favorites: number[]; cart: Record<number,number>; onAdd:(food:Food)=>void; onChange:(id:number,amount:number)=>void; onFavorite:(id:number)=>void; search:string; setSearch:(value:string)=>void };
export function MenuPage({foods,favorites,cart,onAdd,onChange,onFavorite,search,setSearch}:Props) {
 const list=foods.filter(f=>(f.name+' '+f.category+' '+f.description).toLowerCase().includes(search.toLowerCase()));
 return <div className="page-stack"><div className="page-heading"><div><span className="section-overline">OUR MENU</span><h1>Explore the <em>menu.</em></h1><p>Find something delicious for today.</p></div></div><label className="menu-search"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search meals and cuisines"/></label><div className="meal-grid">{list.map(food=><FoodCard key={food.id} food={food} favorite={favorites.includes(food.id)} quantity={cart[food.id]||0} onAdd={onAdd} onChange={onChange} onFavorite={onFavorite}/>)}</div>{!list.length&&<p>No meals found. Try another search.</p>}</div>;
}