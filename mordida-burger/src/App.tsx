import { useCallback, useState } from 'react';
import { About } from './components/About';
import { CartDrawer } from './components/CartDrawer';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { Navbar, SECTIONS } from './components/Navbar';
import { ProductSheet } from './components/ProductSheet';
import { Toast, type ToastData } from './components/Toast';
import type { Product } from './data/menu';
import { useActiveSection } from './hooks/useActiveSection';

const SECTION_IDS = SECTIONS.map((s) => s.id);

export default function App() {
  const active = useActiveSection(SECTION_IDS);
  const [productId, setProductId] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const openCart = useCallback(() => {
    setToast(null);
    setCartOpen(true);
  }, []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeProduct = useCallback(() => setProductId(null), []);
  const dismissToast = useCallback(() => setToast(null), []);
  const onAdded = useCallback((product: Product, quantity: number) => {
    setToast({ id: Date.now(), text: `Agregado: ${quantity > 1 ? `${quantity} × ` : ''}${product.name}` });
  }, []);
  const browseMenu = useCallback(() => {
    setCartOpen(false);
    document.getElementById('menu')?.scrollIntoView();
  }, []);

  return (
    <>
      <a className="skip-link" href="#menu">
        Saltar al menú
      </a>
      <Navbar active={active} onOpenCart={openCart} />
      <main>
        <Hero />
        <MenuSection onOpenProduct={setProductId} onAdded={onAdded} />
        <About />
        <Contact onOpenCart={openCart} />
      </main>
      <Footer />
      <ProductSheet productId={productId} onClose={closeProduct} onAdded={onAdded} />
      <CartDrawer open={cartOpen} onClose={closeCart} onBrowse={browseMenu} />
      <Toast toast={toast} onDismiss={dismissToast} onAction={openCart} />
    </>
  );
}
