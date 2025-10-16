"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const CropImage = dynamic(() => import('@/components/CropImage'), { ssr: false });
import { Product } from '@/data/products';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import { fetchProducts, addProduct, deleteProduct } from '@/lib/productsApi';
import { fetchSales, acceptSale, cancelSale, deleteSale, Sale, SaleItem } from '@/lib/salesApi';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function AdminPage() {
	const [user, setUser] = useState<User | null>(null);
	const [activeSection, setActiveSection] = useState<'menu' | 'manage' | 'add-sale' | 'sales-log'>('menu');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [authError, setAuthError] = useState<string | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	// Hooks para la sección 'Agregar venta' (deben estar al inicio)
	// Usamos strings para los campos del formulario para dejar los inputs vacíos por defecto
	const [saleProduct, setSaleProduct] = useState<{ name: string; cantidad: string; precio: string; codigo: string; costo: string }>({ name: '', cantidad: '', precio: '', codigo: '', costo: '' });
	const [saleItems, setSaleItems] = useState<Array<{ name: string; cantidad: number; precio: number; codigo: string; costo: number }>>([]);
	const [errorSale, setErrorSale] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	// ...existing code...
	// ...existing code...
	// ...existing code...
		// Cargar usuario y productos
		useEffect(() => {
			const getUser = async () => {
				const { data } = await supabase.auth.getUser();
				setUser(data.user);
				setCurrentUid(data.user?.id ?? null);
			};
			getUser();
		}, []);

		useEffect(() => {
			if (!user) return;
			setLoading(true);
			fetchProducts()
				.then(setProducts)
				.finally(() => setLoading(false));
		}, [user]);
			// Tipo para el formulario del admin que incluye campos administrativos
			type AdminProductForm = Partial<Product> & { codigo?: string; costo?: number };
			const [form, setForm] = useState<AdminProductForm>({});
			const [preview, setPreview] = useState<string | null>(null);
			const [fileInputKey, setFileInputKey] = useState(0);
			const [rawImage, setRawImage] = useState<string | null>(null);
			const [showCrop, setShowCrop] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [highlightedId, setHighlightedId] = useState<string | null>(null);
	const listRef = React.useRef<HTMLUListElement | null>(null);
	const [sales, setSales] = useState<Sale[]>([]);
	const [mainAdminUid] = useState('ca55854a-72eb-4144-81c7-6ce1eac75f5a');
	const [currentUid, setCurrentUid] = useState<string | null>(null);

	// Sales handlers (declared at top-level to respect hooks rules)
	const loadSales = React.useCallback(async () => {
	  setLoading(true);
	  try {
	    const s = await fetchSales();
	    setSales(s);
	  } catch (err) {
	    console.error(err);
	  } finally {
	    setLoading(false);
	  }
	}, []);

	useEffect(() => {
	  if (!user) return;
	  loadSales();
	}, [user, loadSales]);

	const handleAcceptSale = async (id: string) => {
		setLoading(true);
		try {
			await acceptSale(id);
			await loadSales();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelSale = async (id: string) => {
		setLoading(true);
		try {
			await cancelSale(id);
			await loadSales();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteSale = async (id: string) => {
		if (currentUid !== mainAdminUid) return;
		setLoading(true);
		try {
			await deleteSale(id);
			await loadSales();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return (
					<section className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow bg-white dark:bg-neutral-900 my-8">
					<h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Panel de administración</h2>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
					/>
					<input
						type="password"
						placeholder="Contraseña"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="w-full border rounded px-3 py-2 mb-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
					/>
					<button
						onClick={async () => {
							setAuthError(null);
							const { error } = await supabase.auth.signInWithPassword({ email, password });
							if (error) setAuthError(error.message);
							else {
								const { data } = await supabase.auth.getUser();
								setUser(data.user);
							}
						}}
						className="w-full bg-black text-white py-2 rounded font-medium hover:bg-neutral-800"
					>Entrar</button>
				{authError && <p className="text-xs text-red-500 mt-2">{authError}</p>}
			</section>
		);
	}

	// Helper to render the existing "gestionar productos" panel. We keep the same markup
	const renderManageProducts = () => (
	<section className="max-w-2xl mx-auto mt-12 bg-white dark:bg-neutral-900 my-8 rounded-2xl p-8">
			<div className="flex justify-end mb-4">
				<button onClick={handleLogout} className="text-sm text-secondary hover:underline">Cerrar sesión</button>
			</div>
			<h2 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-100">Administrar productos</h2>
			<div className="mb-8 p-6 border rounded-2xl shadow bg-white dark:bg-neutral-800">
				{error && <div className="text-red-500 mb-2">{error}</div>}
				<h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Agregar nuevo producto</h3>

				<input
					name="name"
					placeholder="Nombre"
					value={form.name || ''}
					onChange={handleInput}
					className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
				/>
				<textarea
					name="description"
					placeholder="Descripción"
					value={form.description || ''}
					onChange={handleInput}
					className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
				/>
				<input
					name="price"
					type="number"
					placeholder="Precio"
					value={form.price || ''}
					onChange={handleInput}
					min={0}
					step="0.01"
					onKeyDown={handleNumberKeyDown}
					onPaste={handleNumberPaste}
					className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
				/>
				{/* Campo obligatorio: Código*/}
				<input
					name="codigo"
					type="text"
					placeholder="Código"
					value={form.codigo || ''}
					onChange={handleInput}
					className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
				/>
				{/* Campo obligatorio: Costo interno */}
				<input
					name="costo"
					type="number"
					placeholder="Costo interno"
					value={form.costo ?? ''}
					onChange={handleInput}
					min={0}
					step="0.01"
					className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
				/>
				<select
					name="category"
					value={form.category || ''}
					onChange={handleInput}
					className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
				>
				<option value="">Selecciona categoría</option>
				<option value="herraje">Herraje</option>
				<option value="pega">Pega</option>
				<option value="puerta">Puerta</option>
				<option value="tablero">Tablero</option>
			</select>
							<input
							key={fileInputKey}
							type="file"
							accept="image/*"
							onChange={handleImage}
							className="hidden"
							id="file-upload"
							disabled={showCrop}
						/>
							<label htmlFor="file-upload" className="inline-block mb-2 px-4 py-2 bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100 rounded cursor-pointer font-medium shadow hover:bg-neutral-200 dark:hover:bg-neutral-600 transition">
								Elegir archivo
							</label>
						{showCrop && rawImage && (
							<CropImage
								image={rawImage}
								aspect={5/3}
								onCropComplete={handleCropComplete}
								onCancel={handleCropCancel}
							/>
						)}
						{preview && !showCrop && (
							<Image
								src={preview}
								alt="Vista previa"
								width={128}
								height={96}
								className="w-32 h-24 object-cover rounded mb-2"
							/>
						)}
				<button onClick={handleAdd} className="w-full bg-black text-white py-2 rounded font-medium mt-2 hover:bg-neutral-800" disabled={loading}>
					{loading ? 'Guardando...' : 'Agregar producto'}
				</button>
			</div>
			<div>
				{/* Search for existing products */}
				<div className="mb-4 w-full">
					<SearchBar value={search} onChange={setSearch} onSelect={(p) => {
						setHighlightedId(p.id);
						setTimeout(() => setHighlightedId(null), 3000);
						const el = document.getElementById(`prod-${p.id}`);
						if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
					}} />
				</div>
				<h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Productos existentes</h3>
				{loading && <div className="text-neutral-700 dark:text-neutral-300 mb-2">Cargando...</div>}
					<ul ref={listRef} className="divide-y divide-gray-100 dark:divide-neutral-800">
						{products.map((prod) => (
							<li id={`prod-${prod.id}`} key={prod.id} className={`flex items-center gap-4 py-4 ${highlightedId === prod.id ? 'bg-yellow-50' : ''}`}>
							<Image
								src={prod.image}
								alt={prod.name}
								width={80}
								height={64}
								className="w-20 h-16 object-cover rounded"
							/>
									<div className="flex-1">
									<div className="font-semibold text-neutral-900 dark:text-neutral-100">{prod.name}</div>
									<div className="text-neutral-700 dark:text-neutral-300 text-sm">{prod.category}</div>
								</div>
							<button onClick={() => handleDelete(prod.id)} className="ml-2 text-red-500 hover:underline" disabled={loading}>Eliminar</button>
						</li>
					))}
					</ul>
			</div>
		</section>
	);

	// Render the main menu with three big buttons
	const renderMenu = () => (
	<section className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow bg-white dark:bg-neutral-900 my-8 text-center">
			<div className="flex justify-end mb-4">
				<button onClick={handleLogout} className="text-sm text-secondary hover:underline">Cerrar sesión</button>
			</div>
			<h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Panel de administración</h2>
			<p className="text-sm text-neutral-700 dark:text-neutral-300 mb-6">Selecciona una opción:</p>
			<div className="space-y-4">
			<button onClick={() => setActiveSection('manage')} className="w-full py-3 bg-black text-white rounded font-medium hover:bg-neutral-800">Gestionar productos</button>
			<button onClick={() => setActiveSection('add-sale')} className="w-full py-3 bg-black text-white rounded font-medium hover:bg-neutral-800">Agregar venta</button>
			<button onClick={() => setActiveSection('sales-log')} className="w-full py-3 bg-black text-white rounded font-medium hover:bg-neutral-800">Registro de ventas</button>
			</div>
		</section>
	);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			// For numeric fields, parse and clamp to >= 0
			if (name === 'price' || name === 'costo') {
				if (value === '') {
					setForm(f => ({ ...f, [name]: undefined }));
					return;
				}
				const parsed = Number(value);
				const safe = Number.isNaN(parsed) ? undefined : Math.max(0, parsed);
				setForm(f => ({ ...f, [name]: safe }));
				return;
			}

			setForm(f => ({ ...f, [name]: value }));
		};

	// Prevent + and - characters on numeric fields (price specifically)
	const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === '+' || e.key === '-') {
			e.preventDefault();
		}
	};

	const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const text = e.clipboardData.getData('text');
		if (/[+\-]/.test(text)) {
			e.preventDefault();
			const clean = text.replace(/[+\-]/g, '');
			const el = e.target as HTMLInputElement;
			const start = el.selectionStart ?? 0;
			const end = el.selectionEnd ?? 0;
			const newVal = el.value.slice(0, start) + clean + el.value.slice(end);
			// update form value (clamped in handleInput will normalize)
			setForm(f => ({ ...f, [el.name]: newVal }));
		}
	};

			const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = ev => {
						setRawImage(ev.target?.result as string);
						setShowCrop(true);
					};
					reader.readAsDataURL(file);
					setForm(f => ({ ...f, image: file.name }));
				}
			};

			const handleCropComplete = (croppedImg: string) => {
				setPreview(croppedImg);
				setShowCrop(false);
				setRawImage(null);
			};
			const handleCropCancel = () => {
				setShowCrop(false);
				setRawImage(null);
				setPreview(null);
				setFileInputKey(k => k + 1);
			};

					const handleAdd = async () => {
						setError(null);
						// Validación: nombre, precio, categoría, imagen, código y costo son obligatorios
						if (!form.name || !form.price || !form.category || !preview || !form.codigo || !form.costo) {
							setError('Por favor completa todos los campos obligatorios: nombre, precio, categoría, código, costo e imagen.');
							return;
						}
						setLoading(true);
						try {
							const newProduct = await addProduct({
								name: form.name,
								description: form.description || '',
								price: Number(form.price),
								codigo: form.codigo,
								costo: Number(form.costo),
							
								image: preview,
								category: form.category,
								user_id: user.id,
							});
							setProducts(ps => [...ps, newProduct]);
							setForm({});
							setPreview(null);
							setFileInputKey(k => k + 1); // Reset file input
						} catch (err) {
							setError((err as Error).message || JSON.stringify(err));
						} finally {
							setLoading(false);
						}
					};
// Botón para cerrar sesión
const handleLogout = async () => {
	await supabase.auth.signOut();
	setUser(null);
};

			const handleDelete = async (id: string) => {
				setLoading(true);
				try {
					await deleteProduct(id);
					setProducts(ps => ps.filter(p => p.id !== id));
				} finally {
					setLoading(false);
				}
			};

		// ...existing code...

		// Show menu or the manage products panel depending on selection
		if (activeSection === 'menu') return renderMenu();
		if (activeSection === 'manage') return renderManageProducts();

		if (activeSection === 'add-sale') {

			const handleSaleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
				const { name, value } = e.target;
				// Guardamos como string para que el input pueda estar vacío y el usuario borre sin que aparezca 0
				setSaleProduct(p => ({ ...p, [name]: value }));
			};

			const handleAddSaleItem = () => {
				if (!saleProduct.name || !saleProduct.cantidad || !saleProduct.precio || !saleProduct.codigo || !saleProduct.costo) {
					setErrorSale('Completa todos los campos para agregar el producto.');
					return;
				}
				// Convertir a números y validar
				const cantidad = parseInt(saleProduct.cantidad, 10);
				const precio = parseFloat(saleProduct.precio);
				const costo = parseFloat(saleProduct.costo);
				if (Number.isNaN(cantidad) || Number.isNaN(precio) || Number.isNaN(costo)) {
					setErrorSale('Cantidad, precio y costo deben ser números válidos.');
					return;
				}
				setSaleItems(items => [...items, { name: saleProduct.name, cantidad, precio, codigo: saleProduct.codigo, costo }]);
				setSaleProduct({ name: '', cantidad: '', precio: '', codigo: '', costo: '' });
				setErrorSale(null);
			};

			const handleRemoveSaleItem = (idx: number) => {
				setSaleItems(items => items.filter((_, i) => i !== idx));
			};

			const handleSaveSale = async () => {
				if (saleItems.length === 0) {
					setErrorSale('Agrega al menos un producto.');
					return;
				}
				setSaving(true);
				try {
					// Calcula subtotal y total
					const subtotal = saleItems.reduce((sum, it) => sum + it.precio * it.cantidad, 0);
					const total = subtotal;
					// Prepara items para la venta
					const items = saleItems.map(it => ({
						id: Math.random().toString(36).slice(2),
						name: it.name,
						price: it.precio,
						codigo: it.codigo,
						costo: it.costo,
						quantity: it.cantidad
					}));
					// Llama a la API para guardar la venta
					const res = await fetch('/api/sales', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ items, subtotal, total })
					});
					if (!res.ok) {
						const body = await res.json().catch(() => ({}));
						setErrorSale(body.error || 'Error al guardar la venta');
					} else {
						setSaleItems([]);
						setErrorSale(null);
						alert('Venta guardada correctamente');
					}
				} catch (err) {
					const e = err as unknown;
					const raw = typeof e === 'object' && e !== null && 'message' in e ? (e as { message?: unknown }).message : e;
					const messageStr = typeof raw === 'string' ? raw : String(raw ?? '');
					setErrorSale(messageStr || 'Error al guardar la venta');
				} finally {
					setSaving(false);
				}
			};

			return (
				<section className="max-w-xl mx-auto mt-16 p-8 border rounded-2xl shadow bg-white dark:bg-neutral-900 my-8">
					<div className="flex justify-end mb-4">
						<button onClick={handleLogout} className="text-sm text-secondary hover:underline">Cerrar sesión</button>
					</div>
					<h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Agregar venta</h2>
					<div className="mb-6">
						<h3 className="font-semibold mb-2">Agregar producto</h3>
						<div className="grid grid-cols-2 gap-4 mb-2">
							<div>
								<label className="block text-xs text-neutral-600 mb-1">Nombre del producto</label>
								<input name="name" aria-label="Nombre del producto" value={saleProduct.name} onChange={handleSaleInput} placeholder="" className="w-full border rounded px-3 py-2" />
							</div>
							<div>
								<label className="block text-xs text-neutral-600 mb-1">Cantidad</label>
								<input name="cantidad" type="number" min={1} aria-label="Cantidad" value={saleProduct.cantidad} onChange={handleSaleInput} placeholder="" className="w-full border rounded px-3 py-2" />
							</div>
							<div>
								<label className="block text-xs text-neutral-600 mb-1">Precio unitario</label>
								<input name="precio" type="number" min={0} step="0.01" aria-label="Precio unitario" value={saleProduct.precio} onChange={handleSaleInput} placeholder="" className="w-full border rounded px-3 py-2" />
							</div>
							<div>
								<label className="block text-xs text-neutral-600 mb-1">Código</label>
								<input name="codigo" aria-label="Código del producto" value={saleProduct.codigo} onChange={handleSaleInput} placeholder="" className="w-full border rounded px-3 py-2" />
							</div>
							<div>
								<label className="block text-xs text-neutral-600 mb-1">Costo interno</label>
								<input name="costo" type="number" min={0} step="0.01" aria-label="Costo interno" value={saleProduct.costo} onChange={handleSaleInput} placeholder="" className="w-full border rounded px-3 py-2" />
							</div>
						</div>
						<button onClick={handleAddSaleItem} className="px-4 py-2 bg-black text-white rounded font-medium hover:bg-neutral-800">Agregar</button>
						{errorSale && <div className="text-red-500 mt-2">{errorSale}</div>}
					</div>
					<div className="mb-6">
						<h3 className="font-semibold mb-2">Productos agregados</h3>
								{saleItems.length === 0 ? (
							<div className="text-neutral-700">No hay productos agregados.</div>
						) : (
							<ul className="divide-y divide-gray-100">
										{saleItems.map((it, idx) => (
									<li key={idx} className="flex items-center gap-4 py-2">
										<span className="font-medium" title={it.name} style={{maxWidth: '220px', overflowX: 'auto', display: 'inline-block', whiteSpace: 'nowrap'}}>{it.name}</span>
										<span style={{minWidth: '80px'}}>Cantidad: {it.cantidad}</span>
										<span>Precio unitario: ${it.precio.toFixed(2)}</span>
										<span style={{maxWidth: '120px', overflowX: 'auto', display: 'inline-block', whiteSpace: 'nowrap'}}>Código: {it.codigo}</span>
										<span>Costo: ${it.costo.toFixed(2)}</span>
										<button onClick={() => handleRemoveSaleItem(idx)} className="text-red-500 hover:underline">Eliminar</button>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="flex justify-between items-center">
						<button onClick={() => setActiveSection('menu')} className="px-4 py-2 bg-neutral-100 rounded dark:text-black">Volver al menú</button>
						<button onClick={handleSaveSale} className="px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700" disabled={saving}>Finalizar venta</button>
					</div>
				</section>
			);
		}

		if (activeSection === 'sales-log') {
			return (
				<section className="max-w-3xl mx-auto mt-12 p-6 bg-white dark:bg-neutral-900 rounded-2xl">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Registro de ventas</h2>
						<button onClick={() => setActiveSection('menu')} className="text-sm text-secondary hover:underline">Volver al menú</button>
					</div>
					{loading && <div className="mb-4 text-neutral-700">Cargando...</div>}
					{sales.length === 0 ? (
						<div className="text-neutral-700">No hay ventas registradas.</div>
					) : (
						<ul className="space-y-4">
							{sales.map((s) => (
								<li key={s.id} className="border rounded p-4">
									<div className="flex justify-between items-start">
										<div>
											{/* Eliminamos el código de supabase, solo mostramos estado y fecha */}
											<div className="text-sm text-neutral-700">Estado: <span className="font-medium">{s.status}</span></div>
											<div className="text-sm text-neutral-700">Creada: {new Date(s.created_at).toLocaleString()}</div>
										</div>
										<div className="space-x-2">
											{s.status === 'pending' && (
												<>
													<button onClick={() => handleAcceptSale(s.id)} className="px-3 py-1 bg-green-600 text-white rounded">Aceptar</button>
													<button onClick={() => handleCancelSale(s.id)} className="px-3 py-1 bg-yellow-400 text-black rounded">Cancelar</button>
												</>
											)}
											{s.status === 'accepted' && currentUid === mainAdminUid && (
												<button onClick={() => handleDeleteSale(s.id)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
												)}
										</div>
									</div>
									<div className="mt-3">
														<ul className="text-sm">
															{s.items.map((it: SaleItem, idx: number) => (
																	<li key={idx} className="grid grid-cols-6 gap-2 py-1 border-b last:border-b-0">
																		<span className="font-medium" title={it.name} style={{maxWidth: '220px', overflowX: 'auto', display: 'inline-block', whiteSpace: 'nowrap'}}>Nombre: {it.name}</span>
																		<span style={{minWidth: '80px'}}>Cantidad: {it.quantity}</span>
																		<span>Precio unitario: ${it.price.toFixed(2)}</span>
																		<span style={{maxWidth: '120px', overflowX: 'auto', display: 'inline-block', whiteSpace: 'nowrap'}}>
																			Código: {it.codigo ?? '-'}
																		</span>
																		<span>Costo unitario: {typeof it.costo === 'number' ? `$${it.costo.toFixed(2)}` : '-'}</span>
																		<button onClick={() => handleDeleteSale(s.id)} className="text-red-500 hover:underline">Eliminar</button>
																	</li>
																))}
														</ul>
														{/* Mostrar total y utilidad total */}
														<div className="mt-2 text-right">
															<div className="font-semibold">Total: ${s.total.toFixed(2)}</div>
															<div className="font-semibold text-green-700">Utilidad total: ${
																(s.total - s.items.reduce((sum, it) => sum + ((typeof it.costo === 'number' ? it.costo : 0) * it.quantity), 0)).toFixed(2)
															}</div>
														</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</section>
			);
		}
}