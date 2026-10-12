import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bike, ChefHat, Clock3, Heart, MapPin, Menu as MenuIcon, Search, ShoppingBag, Utensils, X } from 'lucide-react';
import { categories, foods, money, restaurants, type Food, type Order } from './data';
import { FoodCard } from './components/FoodCard';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartPage } from './pages/CartPage';

type Cart = Record<number, number>;
const readSaved = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
};
const routes = [
  { path: '/home', label: 'Home', icon: Utensils },
  { path: '/menu', label: 'Explore menu', icon: Search },
  { path: '/restaurants', label: 'Restaurants', icon: ChefHat },
  { path: '/favorites', label: 'Favourites', icon: Heart },
  { path: '/orders', label: 'My orders', icon: Clock3 },
];

function App() {
  const [route, setRoute] = useState(window.location.hash.replace('#', '') || '/home');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Cart>(() => readSaved('bitezy-cart', {}));
  const [favorites, setFavorites] = useState<number[]>(() => readSaved('bitezy-favorites', []));
  const [orders, setOrders] = useState<Order[]>(() => readSaved('bitezy-orders', []));
  const [address, setAddress] = useState(() => readSaved('bitezy-address', 'Lekki Phase 1, Lagos'));
  const [addressEditing, setAddressEditing] = useState(false);
  const [addressDraft, setAddressDraft] = useState(address);
  const [toast, setToast] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const syncRoute = () => { setRoute(window.location.hash.replace('#', '') || '/home'); setMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);
  useEffect(() => { localStorage.setItem('bitezy-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('bitezy-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('bitezy-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('bitezy-address', JSON.stringify(address)); }, [address]);

  const cartItems = useMemo(() => foods.filter(food => cart[food.id]).map(food => ({ ...food, quantity: cart[food.id] })), [cart]);
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal ? (subtotal >= 15000 ? 0 : 800) : 0;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(current => current === message ? '' : current), 2400);
  }
  function add(food: Food) {
    setCart(old => ({ ...old, [food.id]: (old[food.id] || 0) + 1 }));
    notify(food.name + ' added to your bag');
  }
  function change(id: number, amount: number) {
    setCart(old => { const next = { ...old, [id]: (old[id] || 0) + amount }; if (next[id] <= 0) delete next[id]; return next; });
  }
  function toggleFavorite(id: number) {
    setFavorites(old => {
      const next = old.includes(id) ? old.filter(item => item !== id) : [...old, id];
      notify(next.includes(id) ? 'Saved to favourites' : 'Removed from favourites');
      return next;
    });
  }
  function placeOrder(name: string, phone: string, note: string) {
    if (!cartItems.length || !name.trim() || !phone.trim() || !address.trim()) return false;
    const order: Order = { id: 'BZ-' + String(Date.now()).slice(-7), createdAt: new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }), status: 'Preparing', customer: name.trim(), phone: phone.trim(), address, note: note.trim(), items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })), total: subtotal + delivery };
    setOrders(old => [order, ...old]);
    setCart({});
    window.location.hash = '/orders';
    notify('Your demo order is confirmed');
    return true;
  }

  const activeRoute = routes.some(item => item.path === route) || route === '/cart' ? route : '/home';
  const filteredFoods = foods.filter(food => (food.name + ' ' + food.category + ' ' + food.description).toLowerCase().includes(search.toLowerCase()));
  const commonProps = { foods: filteredFoods, favorites, cart, onAdd: add, onChange: change, onFavorite: toggleFavorite, search, setSearch };

  return (
    <div className="bitezy-app">
      <aside className={'sidebar ' + (mobileMenu ? 'sidebar-open' : '')}>
        <a className="brand" href="#/home"><span className="brand-mark"><Utensils size={21}/></span><span>bitezy<span className="brand-dot">.</span></span></a>
        <div className="sidebar-caption">DISCOVER</div>
        <nav className="side-nav" aria-label="Main navigation">
          {routes.map(item => { const Icon = item.icon; return <a key={item.path} href={'#' + item.path} className={activeRoute === item.path ? 'nav-link active' : 'nav-link'}><Icon size={18}/><span>{item.label}</span>{item.path === '/favorites' && favorites.length > 0 && <b className="nav-count">{favorites.length}</b>}{item.path === '/orders' && orders.length > 0 && <b className="nav-count">{orders.length}</b>}</a>; })}
        </nav>
        <div className="sidebar-spacer"/>
        <div className="sidebar-promo"><div className="promo-illustration"><Bike size={25}/></div><strong>Hungry?</strong><p>Your next favourite meal is waiting.</p><a href="#/menu">Order something <ArrowRight size={14}/></a></div>
        <div className="sidebar-profile"><div className="profile-avatar">B</div><div><strong>Bitezy Guest</strong><small>Food lover account</small></div><span className="online-dot"/></div>
      </aside>
      {mobileMenu && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)}/>}
      <div className="main-column">
        <header className="app-header">
          <button className="mobile-menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu ? <X size={21}/> : <MenuIcon size={21}/>}</button>
          <div className="header-location"><span className="location-pin"><MapPin size={17}/></span><div><small>Delivering to</small><button onClick={() => {setAddressDraft(address);setAddressEditing(true);}}>{address || 'Set your address'} <span>⌄</span></button></div></div>
          <div className="global-search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') window.location.hash = '/menu'; }} placeholder="Search dishes, cuisines..." aria-label="Search dishes and cuisines"/><kbd>Enter</kbd></div>
          <a href="#/cart" className="header-cart"><ShoppingBag size={18}/><span>My bag</span><b>{count}</b></a>
        </header>
        <main className="page-content">
          {activeRoute === '/home' && <HomePage foods={foods} restaurants={restaurants} onAdd={add} onFavorite={toggleFavorite} favorites={favorites}/>}
          {activeRoute === '/menu' && <MenuPage {...commonProps}/>}
          {activeRoute === '/restaurants' && <RestaurantsPage restaurants={restaurants}/>}
          {activeRoute === '/favorites' && <FavoritesPage foods={foods.filter(food => favorites.includes(food.id))} favorites={favorites} cart={cart} onAdd={add} onChange={change} onFavorite={toggleFavorite} search={search} setSearch={setSearch}/>}
          {activeRoute === '/orders' && <OrdersPage orders={orders}/>}
          {activeRoute === '/cart' && <CartPage cartItems={cartItems} subtotal={subtotal} delivery={delivery} address={address} onChange={change} onAddress={() => {setAddressDraft(address);setAddressEditing(true);}} onOrder={placeOrder}/>}
          {!['/home','/menu','/restaurants','/favorites','/orders','/cart'].includes(activeRoute) && <HomePage foods={foods} restaurants={restaurants} onAdd={add} onFavorite={toggleFavorite} favorites={favorites}/>}
        </main>
        <footer className="app-footer"><a className="footer-brand" href="#/home">bitezy<span>.</span></a><span>Good food. Good people. Good days.</span><span>© 2026 Bitezy Kitchen</span><a href="#/restaurants">Partner restaurants</a></footer>
      </div>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{routes.filter(item => ['/home','/menu','/favorites','/orders'].includes(item.path)).map(item => {const Icon=item.icon;return <a key={item.path} href={'#'+item.path} className={activeRoute===item.path?'mobile-nav-link active':'mobile-nav-link'}><Icon size={19}/><span>{item.path==='/favorites'?'Saved':item.label==='Explore menu'?'Explore':item.label}</span></a>;})}<a href="#/cart" className={activeRoute==='/cart'?'mobile-nav-link active':'mobile-nav-link'}><ShoppingBag size={19}/><span>Bag {count>0?'('+count+')':''}</span></a></nav>
      {addressEditing && <div className="dialog-backdrop" onClick={e => {if(e.target===e.currentTarget)setAddressEditing(false);}}><form className="address-dialog" onSubmit={e => {e.preventDefault();setAddress(addressDraft.trim());setAddressEditing(false);notify('Delivery address updated');}}><button type="button" className="dialog-close" onClick={() => setAddressEditing(false)} aria-label="Close"><X size={18}/></button><div className="dialog-icon"><MapPin size={22}/></div><span className="eyebrow">DELIVERY DETAILS</span><h2>Where should we deliver?</h2><p>Enter your neighbourhood or full delivery address.</p><label htmlFor="delivery-address">Delivery address</label><input id="delivery-address" value={addressDraft} onChange={e=>setAddressDraft(e.target.value)} required placeholder="e.g. Lekki Phase 1, Lagos"/><button className="button-primary" type="submit">Save address <ArrowRight size={16}/></button></form></div>}
      {toast && <div className="toast-message"><span>✓</span>{toast}</div>}
    </div>
  );
}

export default App;