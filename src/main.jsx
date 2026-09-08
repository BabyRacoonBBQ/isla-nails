import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowLeft, ArrowRight, Menu, Minus, Plus, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import './styles.css';

const products = [
  { id: 'lagoon', name: 'Lagoon Veil', note: 'Translucent aqua · shell inlay', price: 46, tone: 'aqua', description: 'A sheer lagoon wash layered with hand-cut mother-of-pearl and a barely-there champagne edge.' },
  { id: 'conch', name: 'Conch Blush', note: 'Coral glaze · pearl tide', price: 44, tone: 'coral', description: 'Warm conch pink with a liquid-glass finish and a soft pearlescent tide line.' },
  { id: 'moon', name: 'Moon Shell', note: 'Ivory pearl · sculpted shell', price: 52, tone: 'pearl', description: 'Sculpted shell ridges, opaline highlights and a fine gold seam, finished by hand.' },
  { id: 'reef', name: 'Reef No. 07', note: 'Sea glass · coral fragments', price: 49, tone: 'reef', description: 'Sea-glass green punctuated with miniature coral fragments in an asymmetric composition.' },
  { id: 'night', name: 'After the Tide', note: 'Deep ocean · moonlit chrome', price: 48, tone: 'night', description: 'A deep-ocean glaze with a cool moonlit reflection that changes as the hand moves.' },
];

function Logo() {
  return <a className="logo" href="#top" aria-label="ISLA home"><span>ISLA</span><small>NAIL OBJECTS</small></a>;
}

function NailSet({ tone }) {
  return (
    <div className={`nail-set ${tone}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((n) => <i key={n}><b /></i>)}
    </div>
  );
}

function App() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bag, setBag] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const trackRef = useRef(null);
  const drag = useRef({ down: false, x: 0, left: 0 });

  const focusProduct = (index) => {
    const next = (index + products.length) % products.length;
    setActive(next);
    trackRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number(visible.target.dataset.index));
    }, { root: track, threshold: [0.55, 0.75] });
    [...track.children].forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected, menuOpen]);

  const current = products[active];

  return (
    <>
      <a className="skip-link" href="#collection">Skip to collection</a>
      <main>
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-media" role="img" aria-label="Island-inspired pearl and lagoon manicure campaign">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-placeholder"><NailSet tone="hero-nails" /></div>
          </div>
          <header className="nav">
            <button className="nav-action menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={18} strokeWidth={1.25} /><span>Menu</span></button>
            <Logo />
            <div className="nav-tools">
              <button className="nav-action desktop-only" aria-label="Search"><Search size={17} strokeWidth={1.25} /></button>
              <button className="nav-action desktop-only" aria-label="Account"><UserRound size={17} strokeWidth={1.25} /></button>
              <button className="nav-action bag-button" aria-label={`Shopping bag, ${bag} items`}><ShoppingBag size={17} strokeWidth={1.25} />{bag > 0 && <span className="bag-count">{bag}</span>}</button>
            </div>
          </header>
          <div className="hero-copy">
            <p>THE TIDAL COLLECTION · 01</p>
            <h1 id="hero-title">Light, held by water.</h1>
            <a href="#collection">Discover the collection</a>
          </div>
          <a href="#collection" className="scroll-cue" aria-label="Scroll to shop"><span>Shop the tide</span><ArrowDown size={17} strokeWidth={1.25} /></a>
        </section>

        <section id="collection" className="collection" aria-labelledby="collection-title">
          <div className="collection-heading">
            <p>THE TIDAL COLLECTION</p>
            <h2 id="collection-title">Five small worlds,<br />made by hand.</h2>
          </div>

          <div className="product-stage">
            <div className="product-info" aria-live="polite">
              <span>{String(active + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</span>
              <h3>{current.name}</h3>
              <p>{current.note}</p>
              <strong>${current.price}.00</strong>
              <button onClick={() => { setSelected(current); setQuantity(1); }}>View details</button>
            </div>

            <div
              className="product-track"
              ref={trackRef}
              onPointerDown={(e) => { drag.current = { down: true, x: e.clientX, left: e.currentTarget.scrollLeft }; e.currentTarget.setPointerCapture(e.pointerId); }}
              onPointerMove={(e) => { if (drag.current.down) e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x); }}
              onPointerUp={() => { drag.current.down = false; }}
              onPointerCancel={() => { drag.current.down = false; }}
              aria-label="Tidal nail collection carousel"
            >
              {products.map((product, index) => (
                <button className={`product-card ${active === index ? 'active' : ''}`} key={product.id} data-index={index} onClick={() => { if (active === index) { setSelected(product); setQuantity(1); } else focusProduct(index); }} aria-label={`${product.name}, $${product.price}`}>
                  <span className="product-art"><NailSet tone={product.tone} /></span>
                  <span className="mobile-product-label"><b>{product.name}</b><small>${product.price}.00</small></span>
                </button>
              ))}
            </div>

            <div className="carousel-controls">
              <button onClick={() => focusProduct(active - 1)} aria-label="Previous product"><ArrowLeft size={19} strokeWidth={1.25} /></button>
              <div><i style={{ width: `${((active + 1) / products.length) * 100}%` }} /></div>
              <button onClick={() => focusProduct(active + 1)} aria-label="Next product"><ArrowRight size={19} strokeWidth={1.25} /></button>
            </div>
          </div>
        </section>

        <section className="craft">
          <p>THE ISLA METHOD</p>
          <h2>Wearable keepsakes<br />from an imagined shore.</h2>
          <div className="craft-grid"><span>01<br /><b>Hand-layered gel</b></span><span>02<br /><b>Reusable fit</b></span><span>03<br /><b>Made in small editions</b></span></div>
        </section>
      </main>

      {menuOpen && <div className="menu-panel" role="dialog" aria-modal="true" aria-label="Main menu"><button className="close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} strokeWidth={1.25} /></button><Logo /><nav><a href="#collection" onClick={() => setMenuOpen(false)}>Shop the collection</a><a href="#craft" onClick={() => setMenuOpen(false)}>Our craft</a><a href="#journal" onClick={() => setMenuOpen(false)}>Island journal</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></nav><small>Small objects. Long summers.</small></div>}

      {selected && <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><aside className="product-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><button className="close" onClick={() => setSelected(null)} aria-label="Close product details"><X size={22} strokeWidth={1.25} /></button><div className="drawer-art"><NailSet tone={selected.tone} /></div><div className="drawer-content"><p>{selected.note}</p><h2 id="drawer-title">{selected.name}</h2><strong>${selected.price}.00</strong><p className="description">{selected.description}</p><div className="size-selector"><span>SIZE</span><button className="selected">S</button><button>M</button><button>L</button><a href="#size-guide">Size guide</a></div><div className="purchase-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div><button className="add-button" onClick={() => { setBag(bag + quantity); setSelected(null); }}>Add to bag · ${(selected.price * quantity).toFixed(2)}</button></div><small>Complimentary worldwide shipping · Reusable application kit included</small></div></aside></div>}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
